import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('12345', 10);
  await prisma.admin.update({
    where: { id: 1 },
    data: { password: hashedPassword },
  });
  console.log('Password updated');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());