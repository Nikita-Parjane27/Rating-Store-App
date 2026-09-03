import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { sql, eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { db } from '../database/db.js';
import { users } from '../database/schema.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly jwtService: JwtService) {}

  async getUsers() {
    return await db.execute(sql`SELECT * FROM users`);
  }

  async signup(signupDto: SignupDto) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, signupDto.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const result = await db
      .insert(users)
      .values({
        name: signupDto.name,
        email: signupDto.email,
        password: hashedPassword,
        address: signupDto.address,
        role: 'NORMAL_USER',
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        address: users.address,
        role: users.role,
      });

    return result[0];
  }

  async login(loginDto: LoginDto) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, loginDto.email))
      .limit(1);

    if (result.length === 0) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = result[0];

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    };
  }
}