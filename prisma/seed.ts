import { PrismaClient, Role, ExperienceRating, EmotionRating } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up existing data
  await prisma.dissatisfactionFeedback.deleteMany();
  await prisma.dissatisfactionReason.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Created admin user:', admin.email);

  // Create staff members
  const staff = await Promise.all([
    prisma.staff.create({
      data: {
        name: 'John Smith',
        position: 'Sales Associate',
        profileImage: '/images/staff/john-smith.jpg',
        contactInfo: 'john.smith@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Sarah Johnson',
        position: 'Customer Service Representative',
        profileImage: '/images/staff/sarah-johnson.jpg',
        contactInfo: 'sarah.johnson@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Michael Brown',
        position: 'Store Manager',
        profileImage: '/images/staff/michael-brown.jpg',
        contactInfo: 'michael.brown@example.com',
      },
    }),
  ]);

  console.log(`Created ${staff.length} staff members`);

  // Create dissatisfaction reasons
  const reasons = await Promise.all([
    prisma.dissatisfactionReason.create({
      data: {
        reason: 'Long waiting time',
      },
    }),
    prisma.dissatisfactionReason.create({
      data: {
        reason: 'Unfriendly staff',
      },
    }),
    prisma.dissatisfactionReason.create({
      data: {
        reason: 'Product not available',
      },
    }),
    prisma.dissatisfactionReason.create({
      data: {
        reason: 'High prices',
      },
    }),
    prisma.dissatisfactionReason.create({
      data: {
        reason: 'Poor quality products',
      },
    }),
  ]);

  console.log(`Created ${reasons.length} dissatisfaction reasons`);

  // Create sample feedback entries
  const feedbacks = await Promise.all([
    // Positive feedback
    prisma.feedback.create({
      data: {
        experienceRating: ExperienceRating.GOOD,
        emotionRating: EmotionRating.HEART,
        staffId: staff[0].id,
      },
    }),
    prisma.feedback.create({
      data: {
        experienceRating: ExperienceRating.GOOD,
        emotionRating: EmotionRating.LIKE,
        staffId: staff[1].id,
      },
    }),
    // Negative feedback
    prisma.feedback.create({
      data: {
        experienceRating: ExperienceRating.NOT_SATISFIED,
        comment: 'Service was too slow',
        dissatisfactionReasons: {
          create: [
            {
              dissatisfactionReasonId: reasons[0].id,
            },
          ],
        },
      },
    }),
    prisma.feedback.create({
      data: {
        experienceRating: ExperienceRating.NOT_SATISFIED,
        comment: 'Staff was rude and product was not in stock',
        dissatisfactionReasons: {
          create: [
            {
              dissatisfactionReasonId: reasons[1].id,
            },
            {
              dissatisfactionReasonId: reasons[2].id,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${feedbacks.length} feedback entries`);

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