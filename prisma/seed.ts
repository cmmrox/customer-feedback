import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up existing data
  await prisma.feedbackReason.deleteMany();
  await prisma.feedbackStaff.deleteMany();
  await prisma.dissatisfactionReason.deleteMany();
  await prisma.category.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create staff members
  const staff = await Promise.all([
    prisma.staff.create({
      data: {
        name: 'A G Gihan Samudrani',
        position: 'Customer Service Specialist',
        imageUrl: '/images/staff/gihan-samudrani.jpg',
        contactInfo: 'gihan.samudrani@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Devendra Kbilan',
        position: 'Sales Representative',
        imageUrl: '/images/staff/devendra-kbilan.jpg',
        contactInfo: 'devendra.kbilan@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'V Krishan',
        position: 'Store Associate',
        imageUrl: '/images/staff/v-krishan.jpg',
        contactInfo: 'v.krishan@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'S Dulisha',
        position: 'Customer Support Agent',
        imageUrl: '/images/staff/s-dulisha.jpg',
        contactInfo: 's.dulisha@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'M Dilakshika',
        position: 'Retail Assistant',
        imageUrl: '/images/staff/m-dilakshika.jpg',
        contactInfo: 'm.dilakshika@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'M devika',
        position: 'Sales Coordinator',
        imageUrl: '/images/staff/m-devika.jpg',
        contactInfo: 'm.devika@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Pathmini Susantha Munasinghe',
        position: 'Customer Relations Manager',
        imageUrl: '/images/staff/pathmini-munasinghe.jpg',
        contactInfo: 'pathmini.munasinghe@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Rajamini',
        position: 'Service Desk Representative',
        imageUrl: '/images/staff/rajamini.jpg',
        contactInfo: 'rajamini@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'C Swetha Gimhani Gonseka',
        position: 'Customer Experience Specialist',
        imageUrl: '/images/staff/swetha-gonseka.jpg',
        contactInfo: 'swetha.gonseka@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Hansi Sadamini Bagya',
        position: 'Client Services Representative',
        imageUrl: '/images/staff/hansi-bagya.jpg',
        contactInfo: 'hansi.bagya@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Prasanna Weelu Kumara',
        position: 'Customer Support Specialist',
        imageUrl: '/images/staff/prasanna-kumara.jpg',
        contactInfo: 'prasanna.kumara@example.com',
      },
    }),
  ]);

  console.log(`Created ${staff.length} staff members`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Service Issues',
        description: 'Issues related to customer service quality',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Product Issues',
        description: 'Issues related to product availability and quality',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Price Issues',
        description: 'Issues related to pricing and value',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create dissatisfaction reasons
  const reasons = await Promise.all([
    prisma.dissatisfactionReason.create({
      data: {
        description: 'Long waiting time',
        categoryId: categories[0].id,
      },
    }),
    prisma.dissatisfactionReason.create({
      data: {
        description: 'Unfriendly staff',
        categoryId: categories[0].id,
      },
    }),
    prisma.dissatisfactionReason.create({
      data: {
        description: 'Product not available',
        categoryId: categories[1].id,
      },
    }),
    prisma.dissatisfactionReason.create({
      data: {
        description: 'High prices',
        categoryId: categories[2].id,
      },
    }),
    prisma.dissatisfactionReason.create({
      data: {
        description: 'Poor quality products',
        categoryId: categories[1].id,
      },
    }),
  ]);

  console.log(`Created ${reasons.length} dissatisfaction reasons`);


  // System configurations
  const configs = await Promise.all([
    prisma.systemConfig.create({
      data: {
        key: 'sessionTimeoutSeconds',
        value: '10',
      },
    }),
    prisma.systemConfig.create({
      data: {
        key: 'companyName',
        value: 'ACME Retail',
      },
    }),
    prisma.systemConfig.create({
      data: {
        key: 'feedbackThankYouMessage',
        value: 'Thank you for your feedback! We appreciate your time.',
      },
    }),
  ]);

  console.log(`Created ${configs.length} system configurations`);

  console.log('Database seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 