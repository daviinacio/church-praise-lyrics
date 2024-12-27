const { PrismaClient } = require('.prisma/client');
const { hashSync } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Development
  if ((process.env.NODE_ENV || 'development') === 'development') {
    const password = hashSync('12345678', process.env.HASH_SALT || 10);

    // Users
    const users = {}

    users.daviinacio = await prisma.user.upsert({
      where: { email: "daviinacio@daviinacio.com" },
      update: {},
      create: {
        name: "Davi Inácio",
        username: "daviinacio",
        email: "daviinacio@github.com",
        password,
        avatar_url: "https://avatars.githubusercontent.com/u/19656901?v=4",
        sys_admin: true
      }
    })

    console.log(users)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
