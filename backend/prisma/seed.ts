import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed started...');

  // 1. DEFINE DYNAMIC MODULES, FEATURES & PERMISSIONS
  const modulesData = [
    {
      name: 'Authentication',
      code: 'MOD_AUTH',
      icon: 'Lock',
      features: [
        {
          name: 'Users',
          code: 'FEAT_USER',
          permissions: [
            { name: 'View Users', code: 'USER_VIEW' },
            { name: 'Create User', code: 'USER_CREATE' },
            { name: 'Update User', code: 'USER_UPDATE' },
            { name: 'Delete User', code: 'USER_DELETE' },
          ]
        },
        {
          name: 'Roles',
          code: 'FEAT_ROLE',
          permissions: [
            { name: 'Manage Roles', code: 'ROLE_MANAGE' },
          ]
        }
      ]
    },
    {
      name: 'Inventory',
      code: 'MOD_INVENTORY',
      icon: 'Package',
      features: [
        {
          name: 'Products',
          code: 'FEAT_PRODUCT',
          permissions: [
            { name: 'View Products', code: 'PRODUCT_VIEW' },
            { name: 'Create Product', code: 'PRODUCT_CREATE' },
            { name: 'Update Product', code: 'PRODUCT_UPDATE' },
            { name: 'Delete Product', code: 'PRODUCT_DELETE' },
          ]
        },
        {
          name: 'Stock',
          code: 'FEAT_STOCK',
          permissions: [
            { name: 'Adjust Stock', code: 'STOCK_ADJUST' },
          ]
        }
      ]
    },
    {
      name: 'Sales',
      code: 'MOD_SALES',
      icon: 'ShoppingCart',
      features: [
        {
          name: 'Invoices',
          code: 'FEAT_INVOICE',
          permissions: [
            { name: 'View Sales', code: 'SALE_VIEW' },
            { name: 'Create Sale', code: 'SALE_CREATE' },
            { name: 'Delete Sale', code: 'SALE_DELETE' },
          ]
        },
        {
          name: 'Customers',
          code: 'FEAT_CUSTOMER',
          permissions: [
            { name: 'View Customers', code: 'CUSTOMER_VIEW' },
            { name: 'Manage Customers', code: 'CUSTOMER_MANAGE' },
          ]
        }
      ]
    },
    {
      name: 'Finance',
      code: 'MOD_FINANCE',
      icon: 'DollarSign',
      features: [
        {
          name: 'Transactions',
          code: 'FEAT_TRX',
          permissions: [
            { name: 'View Transactions', code: 'TRX_VIEW' },
            { name: 'Create Transaction', code: 'TRX_CREATE' },
          ]
        },
        {
          name: 'Expenses',
          code: 'FEAT_EXPENSE',
          permissions: [
            { name: 'View Expenses', code: 'EXPENSE_VIEW' },
            { name: 'Manage Expenses', code: 'EXPENSE_MANAGE' },
          ]
        },
        {
          name: 'Accounts',
          code: 'FEAT_ACCOUNT',
          permissions: [
            { name: 'View Accounts', code: 'ACCOUNT_VIEW' },
            { name: 'Manage Accounts', code: 'ACCOUNT_MANAGE' },
          ]
        }
      ]
    },
    {
      name: 'System',
      code: 'MOD_SYSTEM',
      icon: 'Settings',
      features: [
        {
          name: 'Settings',
          code: 'FEAT_SETTINGS',
          permissions: [
            { name: 'Manage Settings', code: 'SETTINGS_MANAGE' },
          ]
        },
        {
          name: 'Industries',
          code: 'FEAT_INDUSTRY',
          permissions: [
            { name: 'Manage Industries', code: 'INDUSTRY_MANAGE' },
          ]
        }
      ]
    }
  ];

  console.log('Seeding modules, features and permissions...');
  const allPermissions: any[] = [];
  const createdModules: any[] = [];

  for (const mData of modulesData) {
    const module = await (prisma as any).module.upsert({
      where: { code: mData.code },
      update: { name: mData.name, icon: mData.icon },
      create: { name: mData.name, code: mData.code, icon: mData.icon },
    });
    createdModules.push(module);

    for (const fData of mData.features) {
      const feature = await (prisma as any).feature.upsert({
        where: { code: fData.code },
        update: { name: fData.name, moduleId: module.id },
        create: { name: fData.name, code: fData.code, moduleId: module.id },
      });

      for (const pData of fData.permissions) {
        const permission = await (prisma as any).permission.upsert({
          where: { code: pData.code },
          update: { name: pData.name, moduleId: module.id, featureId: feature.id },
          create: { name: pData.name, code: pData.code, moduleId: module.id, featureId: feature.id },
        });
        allPermissions.push(permission);
      }
    }
  }

  // 2. SEED GLOBAL ROLES
  console.log('Seeding global roles...');
  const superAdminRole = await (prisma as any).role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN' },
  });

  const tenantRole = await (prisma as any).role.upsert({
    where: { name: 'TENANT' },
    update: {},
    create: { name: 'TENANT' },
  });

  // 3. LINK ALL PERMISSIONS TO SUPER_ADMIN
  console.log('Linking all permissions to SUPER_ADMIN...');
  for (const p of allPermissions) {
    await (prisma as any).rolePermission.upsert({
      where: { 
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: p.id
        }
      },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: p.id }
    });
  }

  // 4. SEED INDUSTRIES & LINK MODULES
  console.log('Seeding industries...');
  await (prisma as any).industry.upsert({
    where: { name: 'Technology' },
    update: {
      modules: {
        set: createdModules.map(m => ({ id: m.id }))
      }
    },
    create: { 
      name: 'Technology', 
      description: 'IT and Software',
      modules: {
        connect: createdModules.map(m => ({ id: m.id }))
      }
    }
  });

  // 5. CREATE SUPER ADMIN USER (GLOBAL)
  console.log('Creating Super Admin user...');
  const hashedPassword = await bcrypt.hash('admin123456', 10);
  const superAdmin = await (prisma as any).user.upsert({
    where: { email: 'admin@ezio.com' },
    update: {
      name: 'Super Admin',
      username: 'superadmin',
      phone: '01711111111',
    },
    create: {
      name: 'Super Admin',
      username: 'superadmin',
      email: 'admin@ezio.com',
      phone: '01711111111',
      password: hashedPassword,
    },
  });

  // Link Super Admin Role
  await (prisma as any).userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: superAdminRole.id
      }
    },
    update: {},
    create: { userId: superAdmin.id, roleId: superAdminRole.id }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
