import Role from '../models/Role.model';
import Permissions from '../permissions';

async function seedRoles() {
  try {
    const roles = [
      {
        name: 'Admin',
        permissions: [
          Permissions.ADMINISTRATION.ACCESS,
          Permissions.EMPLOYEES.ACCESS,
          Permissions.EVENTS.ACCESS,
          Permissions.RENTALS.ACCESS,
          Permissions.SERVICE.ACCESS,
          Permissions.TRANSPORT.ACCESS,
          Permissions.WAREHOUSE.ACCESS,
          Permissions.WAREHOUSE.ADD,
        ],
      },
      { name: 'Użytkownik', permissions: [] },
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
