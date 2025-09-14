import { DataSource } from 'typeorm';
import { Role } from '../entities/role.entity';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    {
      name: 'admin',
      description: 'Administrador del sistema con acceso completo',
    },
    {
      name: 'user',
      description: 'Usuario del equipo con acceso limitado',
    },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({
      where: { name: roleData.name },
    });
    if (!existingRole) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Rol ${roleData.name} creado`);
    } else {
      console.log(`Rol ${roleData.name} ya existe`);
    }
  }
}
