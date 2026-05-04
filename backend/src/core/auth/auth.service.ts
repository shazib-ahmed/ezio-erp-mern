import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(registerDto: RegisterDto) {
    const { 
      businessName, 
      companyEmail, 
      industryId, 
      businessPhone,
      adminName, 
      username,
      adminEmail, 
      phone, 
      password 
    } = registerDto;

    // 1. Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: { 
        OR: [
          { email: adminEmail },
          { username: username },
          { phone: phone }
        ]
      },
    });

    if (existingUser) {
      throw new ConflictException('Admin email, username or phone number already exists');
    }

    // 2. Check if business name or business phone exists
    const existingTenant = await this.prisma.tenant.findFirst({
      where: { 
        OR: [
          { name: businessName },
          { phone: businessPhone }
        ]
      }
    });

    if (existingTenant) {
      throw new ConflictException('Business name or business phone number already exists');
    }

    // 3. Create User first
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: adminName,
        username: username,
        email: adminEmail,
        phone: phone,
        password: hashedPassword,
      }
    });

    // 4. Link to the Global TENANT role
    const tenantRole = await this.prisma.role.findFirst({
      where: { name: 'TENANT' }
    });

    if (!tenantRole) {
      throw new Error('System initialization error: Global TENANT role not found');
    }

    // 5. Fetch Industry Modules to set as defaults for the Tenant
    const industry = await this.prisma.industry.findUnique({
      where: { id: Number(industryId) },
      include: { modules: true }
    });

    if (!industry) {
      throw new Error('Selected industry not found');
    }

    // 6. Create Tenant using User ID as tenantId (Owner ID)
    const tenant = await this.prisma.tenant.create({
      data: {
        name: businessName,
        phone: businessPhone,
        tenantId: user.id, 
        industryId: Number(industryId),
        activeModules: {
          connect: industry.modules.map(m => ({ id: m.id }))
        }
      },
      include: {
        activeModules: {
          include: {
            features: true
          }
        }
      }
    });

    // 7. Link User to Role and Tenant via junction tables
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        roles: {
          create: {
            roleId: tenantRole.id
          }
        },
        tenants: {
          create: {
            tenantId: tenant.id
          }
        }
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      include: {
                        module: true,
                        feature: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        tenants: {
          include: {
            tenant: true
          }
        }
      }
    });

    const roleName = updatedUser.roles[0]?.role.name || 'USER';
    const activeTenantId = updatedUser.tenants[0]?.tenant.id.toString() || '0';
    const tokens = await this.getTokens(updatedUser.id, updatedUser.email, roleName, activeTenantId);
    await this.updateRefreshToken(updatedUser.id, tokens.refreshToken);

    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = updatedUser;

    return {
      user: {
        ...userWithoutSensitiveData,
        permissions: this.flattenPermissions(updatedUser),
        activeModules: tenant.activeModules
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: { 
        OR: [
          { email: email },
          { username: email }, // Allow login via username or email
          { phone: email }    // Allow login via phone as well
        ]
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      include: {
                        module: true,
                        feature: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        tenants: {
          include: {
            tenant: true
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isSuperAdmin = user.roles.some(r => r.role.name === 'SUPER_ADMIN');
    const roleName = isSuperAdmin ? 'SUPER_ADMIN' : (user.roles[0]?.role.name || 'USER');
    
    // Get active tenant with its modules and features
    const activeUserTenant = user.tenants[0];
    const activeTenantId = activeUserTenant?.tenant.id || 0;
    
    let activeModules: any[] = [];
    if (activeUserTenant) {
      const tenantWithModules = await this.prisma.tenant.findUnique({
        where: { id: activeTenantId },
        include: {
          activeModules: {
            include: {
              features: true
            }
          }
        }
      });
      activeModules = tenantWithModules?.activeModules || [];
    }

    const tokens = await this.getTokens(user.id, user.email, roleName, activeTenantId.toString());
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;

    return {
      user: {
        ...userWithoutSensitiveData,
        permissions: this.flattenPermissions(user),
        activeModules: activeModules // Structured data for dynamic UI
      },
      ...tokens,
    };
  }

  private flattenPermissions(user: any): string[] {
    const permissions = new Set<string>();
    
    user.roles.forEach((userRole: any) => {
      userRole.role.permissions.forEach((rp: any) => {
        permissions.add(rp.permission.code);
      });
    });
    
    return Array.from(permissions);
  }

  async logout(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        tenants: { include: { tenant: true } }
      }
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const isSuperAdmin = user.roles.some(r => r.role.name === 'SUPER_ADMIN');
    const roleName = isSuperAdmin ? 'SUPER_ADMIN' : (user.roles[0]?.role.name || 'USER');
    const activeTenantId = user.tenants[0]?.tenant.id.toString() || '0';

    const tokens = await this.getTokens(user.id, user.email, roleName, activeTenantId);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async getTokens(userId: number, email: string, role: string, tenantId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId.toString(), email, role, tenantId },
        {
          secret: process.env.JWT_SECRET || 'super-secret-key',
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId.toString(), email, role, tenantId },
        {
          secret: process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key',
          expiresIn: '365d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(payload: any) {
    return this.prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        },
        tenants: {
          include: {
            tenant: true
          }
        }
      }
    });
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        },
        tenants: {
          include: {
            tenant: {
              include: {
                activeModules: {
                  include: {
                    features: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;
    const activeModules = user.tenants[0]?.tenant.activeModules || [];

    return {
      ...userWithoutSensitiveData,
      permissions: this.flattenPermissions(user),
      activeModules: activeModules
    };
  }

  async switchTenant(userId: number, tenantId: number) {
    // 1. Verify user belongs to this tenant
    const userTenant = await this.prisma.userTenant.findFirst({
      where: { userId, tenantId },
      include: {
        user: {
          include: {
            roles: { include: { role: true } }
          }
        },
        tenant: {
          include: {
            activeModules: {
              include: { features: true }
            }
          }
        }
      }
    });

    if (!userTenant) {
      throw new UnauthorizedException('You do not have access to this tenant');
    }

    const user = userTenant.user;
    const isSuperAdmin = user.roles.some(r => r.role.name === 'SUPER_ADMIN');
    const roleName = isSuperAdmin ? 'SUPER_ADMIN' : (user.roles[0]?.role.name || 'USER');

    // 2. Issue new tokens with the new tenantId
    const tokens = await this.getTokens(userId, user.email, roleName, tenantId.toString());
    await this.updateRefreshToken(userId, tokens.refreshToken);

    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;

    return {
      user: {
        ...userWithoutSensitiveData,
        permissions: this.flattenPermissions(user),
        activeModules: userTenant.tenant.activeModules
      },
      ...tokens
    };
  }
}
