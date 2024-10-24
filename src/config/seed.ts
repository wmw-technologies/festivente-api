import Role from '../models/Role.model';

async function seedRoles() {
  try {
    const roles = [
      { name: 'admin', permissions: ['create', 'read', 'update', 'delete'] },
      { name: 'user', permissions: ['read'] },
    ];

    for (const role of roles) {
      const existingRole = await Role.findOne({ name: role.name });
      if (!existingRole) {
        await Role.create(role);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export { seedRoles };
