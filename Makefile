build:
	npm install && npx prisma db pull && npx prisma generate --sql && npm run build