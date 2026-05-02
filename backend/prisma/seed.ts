import { PrismaClient, Permission, Role, Industry, Tenant, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed started...');

  // 1. Seed Permissions
  const permissionsData = [
    { name: 'Create User', code: 'USER_CREATE', module: 'ADMIN' },
    { name: 'View User', code: 'USER_VIEW', module: 'ADMIN' },
    { name: 'Edit User', code: 'USER_EDIT', module: 'ADMIN' },
    { name: 'Delete User', code: 'USER_DELETE', module: 'ADMIN' },
    { name: 'Manage Roles', code: 'ROLE_MANAGE', module: 'ADMIN' },
    { name: 'Create Industry', code: 'INDUSTRY_CREATE', module: 'SUPER_ADMIN' },
    { name: 'View Industries', code: 'INDUSTRY_VIEW', module: 'SUPER_ADMIN' },
  ];

  console.log('Seeding permissions...');
  const permissions: Permission[] = [];
  for (const p of permissionsData) {
    const permission = await prisma.permission.upsert({
      where: { code: p.code },
      update: { name: p.name, module: p.module },
      create: p,
    });
    permissions.push(permission);
  }

  // 2. Seed System Roles
  console.log('Seeding system roles...');
  let superAdminRole = await prisma.role.findFirst({
    where: { name: 'SUPER_ADMIN', tenantId: null }
  });

  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        name: 'SUPER_ADMIN',
        description: 'System wide access to all features',
        permissions: {
          connect: permissions.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  // 3. Seed Industries
  const industriesData = [
    { name: 'Technology', description: 'System Administration and IT Services' },
    { name: 'Garments & Textile', description: 'Style, Color, Size Matrix' },
    { name: 'Pharmaceuticals', description: 'Medicine manufacturing and chemical processing' },
    { name: 'Food & Beverage', description: 'Food processing and beverage production' },
    { name: 'Automobile', description: 'Vehicle parts and assembly' },
    { name: 'Electronics Manufacturing', description: 'Gagdet and electronics assembly' },
    { name: 'E-commerce', description: 'Online shops and digital marketplaces' },
    { name: 'Super Shop', description: 'Grocery chains and supermarkets' },
    { name: 'Fashion & Lifestyle', description: 'Apparel outlets and lifestyle showrooms' },
    { name: 'Electronics Retail', description: 'Electronics dealers and showrooms' },
    { name: 'FMCG Distribution', description: 'Fast Moving Consumer Goods distribution' },
    { name: 'Hospital & Clinic', description: 'Patient and Doctor management system' },
    { name: 'Diagnostic Center', description: 'Lab reports and diagnostic management' },
    { name: 'Pharmacy Chain', description: 'Drug generic names and Expiry tracking' },
    { name: 'School & College', description: 'Student IDs, Fee collection, and Exams' },
    { name: 'University', description: 'Higher education academic management' },
    { name: 'Coaching Center', description: 'Skill development and tutoring' },
    { name: 'IT & Software', description: 'Project management and software services' },
    { name: 'Construction & Real Estate', description: 'Plot/Flat mapping and Installment schedules' },
    { name: 'Digital Marketing', description: 'Agency management and client campaigns' },
    { name: 'Consultancy Firm', description: 'Law, Audit, and Advisory firms' },
    { name: 'Hotel & Resort', description: 'Booking and hospitality management' },
    { name: 'Restaurant & Cafe', description: 'POS, Table booking, and KOT management' },
    { name: 'Travel Agency', description: 'Tour and travel booking services' },
    { name: 'Courier Service', description: 'Parcel tracking and delivery management' },
    { name: 'Shipping & Freight', description: 'International shipping and logistics' },
    { name: 'Warehousing', description: 'Storage and supply chain management' },
  ];

  console.log('Seeding industries...');
  const industryMap: Record<string, string> = {};
  for (const ind of industriesData) {
    const created = await prisma.industry.upsert({
      where: { name: ind.name },
      update: { description: ind.description },
      create: ind,
    });
    industryMap[ind.name] = created.id;
  }

  // 4. Create System Tenant
  console.log('Upserting System Tenant...');
  const tenant = await prisma.tenant.upsert({
    where: { companyEmail: 'system@ezio.com' },
    update: {},
    create: {
      name: 'Ezio ERP System',
      companyEmail: 'system@ezio.com',
      address: 'Dhaka, Bangladesh',
      industryId: industryMap['Technology'],
      plan: 'ENTERPRISE',
    },
  });

  // 5. Create Super Admin User and Link as Tenant Owner
  console.log('Seeding Super Admin and setting as Tenant Owner...');
  const hashedPassword = await bcrypt.hash('admin123456', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@ezio.com' },
    update: {
      password: hashedPassword,
      roleId: superAdminRole.id,
      tenantId: tenant.id,
    },
    create: {
      email: 'admin@ezio.com',
      password: hashedPassword,
      roleId: superAdminRole.id,
      tenantId: tenant.id,
    },
  });

  // Now explicitly set the owner of the tenant
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { ownerId: superAdmin.id }
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
