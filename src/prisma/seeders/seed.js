const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function main() {

  const roles = [
    {
      id: '98360e99-7bf8-4b22-bf35-61c4437562db',
      name: 'Admin',
      alias: 'Admin'
    },
    {
      id: '82988eec-4465-4170-9794-c4ae6ebc20c8',
      name: 'User',
      alias: 'User'
    }
  ];

  const permissions = [
    {
      id: '9a045ab2-dbe6-4c73-882d-a7454ee61ae6',
      roleId: '98360e99-7bf8-4b22-bf35-61c4437562db',
      action: { read:true, write:false, accessColumn:[]},
      resources: 'Settings'
    },
    {
      id: '07c025fd-9615-46c9-abbd-9ceec5e27746',
      roleId: '98360e99-7bf8-4b22-bf35-61c4437562db',
      action: { read:true, write:false, accessColumn:[] },
      resources: 'Users'
    }
  ];

  const usersData = [
    {
      id: '21cfb624-ae93-4268-9914-11db0c5305b3',
      firstName:'Admin',
      lastName: 'User',
      email: 'test@example.com',
      password: '$2b$10$w1IVkJGzn72uhlpuDHpgc.7w37uuRy6ca16W9bsmusp9x9Em9oM1.',
    }
  ];

  const usersRoles = [
    {
      userId: '21cfb624-ae93-4268-9914-11db0c5305b3',
      roleId: '98360e99-7bf8-4b22-bf35-61c4437562db'
    }
  ];

  for await (const role of roles) {
    const roleAttrs = role;
    await prisma.roles.upsert({
      where: {
        id: role.id
      },
      create: roleAttrs,
      update: roleAttrs
    });
  }

  for await (const permission of permissions) {
    const permissionAttrs = permission;
    await prisma.permissions.upsert({
      where: {
        id: permission.id
      },
      create: permissionAttrs,
      update: permissionAttrs
    });
  }

  for (const user of usersData) {
    const userAttrs = user;
    await prisma.user.upsert({
      where: {
        id: user.id
      },
      create: userAttrs,
      update: userAttrs
    })
  }

  for (const userRole of usersRoles) {
    const userRoleAttrs = userRole;
    await prisma.userRoles.create({
      data: userRoleAttrs
    });
  }
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    process.exit(1)
  })