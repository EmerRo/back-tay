import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

export async function seedAdminUser(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // Buscar el rol de admin
  const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    console.log(
      '❌ No se encontró el rol admin. Ejecuta primero el seed de roles.',
    );
    return;
  }

  // Verificar si ya existe un usuario admin
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@teamtayta.com' },
  });

  if (existingAdmin) {
    console.log('👤 Usuario admin ya existe: admin@teamtayta.com');
    return;
  }

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = userRepository.create({
    firstName: 'Administrador',
    lastName: 'Team Tayta',
    email: 'admin@teamtayta.com',
    password: hashedPassword,
    roleId: adminRole.id,
    isActive: true,
  });

  await userRepository.save(adminUser);

  console.log('✅ Usuario administrador creado:');
  console.log('   📧 Email: admin@teamtayta.com');
  console.log('   🔐 Password: admin123');
  console.log('   👑 Rol: Administrador');
}
