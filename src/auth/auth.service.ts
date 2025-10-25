import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    const user = await this.usersService.create(registerDto);
    const payload = { email: user.email, sub: (user as any)._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: (user as any)._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: (user as any)._id.toString() };
    console.log('AuthService - JWT Secret being used:', process.env.JWT_SECRET);
    console.log('AuthService - Signing payload:', payload);
    const token = this.jwtService.sign(payload);
    console.log('AuthService - Generated token:', token);
    return {
      access_token: token,
      user: {
        id: (user as any)._id.toString(),
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateUser(userId: string) {
    console.log('AuthService - Validating user with ID:', userId);
    const user = await this.usersService.findById(userId);
    console.log('AuthService - User found:', user);
    return user;
  }
}
