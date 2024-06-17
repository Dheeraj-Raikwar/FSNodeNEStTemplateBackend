

---------------------------
Prisma migrations commands
---------------------------
1. Genrate migration files from schema
$ prisma migrate dev

2. Apply migrations to db
$ prisma migrate deploy

3. Genarate types from schema
$ prisma generate

4. Seed data
$ prisma db seed

5. Genatate types from schema of DWH
$ prisma generate --schema=./src/prisma-dwh/schema.prisma


--------------------------
Nest module file workflow
--------------------------
1. Export the Service from each module with the 'exports' and 'providers' property
2. Import the module in 'imports' in the module that you want to use