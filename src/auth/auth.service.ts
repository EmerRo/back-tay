import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, email, password, roleId } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar si el rol existe
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new ConflictException('El rol especificado no existe');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId,
    });

    const savedUser = await this.userRepository.save(user);

    // Generar JWT
    const payload = {
      userId: savedUser.id,
      email: savedUser.email,
      role: role.name,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: role.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario con rol
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  async validateUser(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId, isActive: true },
      relations: ['role'],
    });
  }

  async getAllUsers() {
    const users = await this.userRepository.find({
      relations: ['role'],
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }));
  }
}
