import { PrismaClient } from '@prisma/client';

/**
 * Idempotent crew upsert for existing databases (e.g. a deployed VPS where
 * running the full seed would wipe content edits). Safe to run repeatedly:
 *   pnpm --filter api prisma:add-crew
 */
const db = new PrismaClient();

const crew = [
  {
    slug: 'mobassir',
    name: 'Mobashshir Al Islam',
    role: 'Digital Creator & Video Editor',
    bio: 'Mobassir runs the visual side of Metaxia — brand films, product walkthroughs, and the social cuts that make shipped work travel.',
    photoUrl: '/projects/mobassir.png',
    order: 3,
  },
  {
    slug: 'sadat',
    name: 'Nazmus Sadat',
    role: 'Software Engineer',
    bio: 'Sadat builds alongside the founders across the stack — features, fixes, and the tests that keep weekly releases boring.',
    photoUrl: '/projects/sadat.png',
    order: 4,
  },
  {
    slug: 'marketing-lead',
    name: 'Announcing soon',
    role: 'Marketing & Growth Lead',
    bio: 'The newest member of the crew — leading marketing and growth. Full introduction coming soon.',
    photoUrl: null,
    order: 5,
  },
];

async function main() {
  for (const member of crew) {
    await db.teamMember.upsert({
      where: { slug: member.slug },
      update: {
        name: member.name,
        role: member.role,
        bio: member.bio,
        photoUrl: member.photoUrl,
        order: member.order,
      },
      create: member,
    });
  }
  console.log(`Crew in place: ${crew.length} members upserted.`);
}

main().finally(() => db.$disconnect());
