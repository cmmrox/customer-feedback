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
        name: 'J.M. Hansi Sandamini Bhagya',
        position: 'Chief Cashier',
        imageUrl: '/images/staff/chief-cashier-j-m-hansi-sandamini-bhagya.jpg',
        contactInfo: 'hansi.bhagya@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Prasanna Walukumara',
        position: 'Sales Assistant',
        imageUrl: '/images/staff/sales-assistant-prasanna-walukumara.jpg',
        contactInfo: 'prasanna.walukumara@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'C. Swetha Gimhani Fonseka',
        position: 'Cashier',
        imageUrl: '/images/staff/cashier-c-swetha-gimhani-fonseka.jpg',
        contactInfo: 'swetha.fonseka@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'V. Kishan',
        position: 'Sales Assistant',
        imageUrl: '/images/staff/sales-assistant-v-kishan.jpg',
        contactInfo: 'v.kishan@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'M.S. Devika',
        position: 'Cashier',
        imageUrl: '/images/staff/cashier-m-s-devika.jpg',
        contactInfo: 'm.devika@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Rengiah Rajamani',
        position: 'Supervisor',
        imageUrl: '/images/staff/supervisor-rengiah-rajamani.jpg',
        contactInfo: 'rengiah.rajamani@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Padmini Susantha Munsinghe',
        position: 'Team Leader',
        imageUrl: '/images/staff/team-leader-padmini-susantha-munsinghe.jpg',
        contactInfo: 'padmini.munsinghe@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'M. Dhilakshika',
        position: 'Team Member',
        imageUrl: '/images/staff/team-member-m-dhilakshika.jpg',
        contactInfo: 'm.dhilakshika@example.com',
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