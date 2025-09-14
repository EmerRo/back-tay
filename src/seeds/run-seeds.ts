import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { seedRoles } from './roles.seed';
import { seedAdminUser } from './admin.seed';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Role],
  synchronize: true,
});

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('🔗 Conexión a la base de datos establecida');

    console.log('\n📝 Creando roles...');
    await seedRoles(AppDataSource);

    console.log('\n👤 Creando usuario administrador...');
    await seedAdminUser(AppDataSource);

    console.log('\n✅ Seeding completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

void runSeeds();
