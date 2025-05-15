import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up existing data
  await prisma.feedbackReason.deleteMany();
  await prisma.feedbackStaff.deleteMany();
  await prisma.rating.deleteMany();
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
        name: 'John Smith',
        position: 'Sales Associate',
        imageUrl: '/images/staff/john-smith.jpg',
        contactInfo: 'john.smith@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Sarah Johnson',
        position: 'Customer Service Representative',
        imageUrl: '/images/staff/sarah-johnson.jpg',
        contactInfo: 'sarah.johnson@example.com',
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Michael Brown',
        position: 'Store Manager',
        imageUrl: '/images/staff/michael-brown.jpg',
        contactInfo: 'michael.brown@example.com',
      },
    }),
  ]);

  console.log(`Created ${staff.length} staff members`);

  // Create emotion ratings
  const ratings = await Promise.all([
    prisma.rating.create({
      data: {
        name: 'HEART',
        icon: '❤️',
      },
    }),
    prisma.rating.create({
      data: {
        name: 'LIKE',
        icon: '👍',
      },
    }),
    prisma.rating.create({
      data: {
        name: 'WOW',
        icon: '🤩',
      },
    }),
    prisma.rating.create({
      data: {
        name: 'ANGRY',
        icon: '😠',
      },
    }),
  ]);

  console.log(`Created ${ratings.length} emotion ratings`);

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

  // Create positive feedback with staff ratings
  const positiveFeedback1 = await prisma.feedback.create({
    data: {
      overallRating: 'GOOD',
      comments: 'Great service!',
    },
  });

  await prisma.feedbackStaff.create({
    data: {
      feedbackId: positiveFeedback1.id,
      staffId: staff[0].id,
      ratingId: ratings[0].id, // HEART
    },
  });

  // Another positive feedback
  const positiveFeedback2 = await prisma.feedback.create({
    data: {
      overallRating: 'GOOD',
      comments: 'Very helpful staff',
    },
  });

  await prisma.feedbackStaff.create({
    data: {
      feedbackId: positiveFeedback2.id,
      staffId: staff[1].id,
      ratingId: ratings[1].id, // LIKE
    },
  });

  // Create negative feedback with dissatisfaction reasons
  const negativeFeedback1 = await prisma.feedback.create({
    data: {
      overallRating: 'NOT_SATISFIED',
      comments: 'Service was too slow',
    },
  });

  await prisma.feedbackReason.create({
    data: {
      feedbackId: negativeFeedback1.id,
      reasonId: reasons[0].id, // Long waiting time
    },
  });

  // Another negative feedback with multiple reasons
  const negativeFeedback2 = await prisma.feedback.create({
    data: {
      overallRating: 'NOT_SATISFIED',
      comments: 'Staff was rude and product was not in stock',
    },
  });

  await Promise.all([
    prisma.feedbackReason.create({
      data: {
        feedbackId: negativeFeedback2.id,
        reasonId: reasons[1].id, // Unfriendly staff
      },
    }),
    prisma.feedbackReason.create({
      data: {
        feedbackId: negativeFeedback2.id,
        reasonId: reasons[2].id, // Product not available
      },
    }),
  ]);

  console.log(`Created 4 feedback entries`);

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