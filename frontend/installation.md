1. Установить Database Client JDBC, Fetch Client, PostgreSQL, Prisma
2. прописать npm install в обеих папках
3. в бэки прописать npm prisma generate
                    npm prisma migrate dev
4. в pgadmin создать пустую бд
5. в обеих папках создать файл .env 
БЭК:
DATABASE_URL="postgresql://postgres:1234@localhost:5432/build?schema=public"
JWT_SECRET=X7k9pM2qRjL5vW8yT6uZ3xC4bN1oP0fQ
ФРОНТ:
NEXT_PUBLIC_BACKEND_API=http://localhost:3001/api

Пароль и название бд изменить на свои




