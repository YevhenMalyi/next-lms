// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');
const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'Music' },
        { name: 'Literature' },
        { name: 'History' },
      ]
    });
    console.log('Success');
  } catch (err) {
    console.log(err);
  } finally {
    await database.$disconnect();
  }
}

main();