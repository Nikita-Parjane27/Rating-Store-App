import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles/roles.decorator.js';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto.js';
import { CreateStoreDto } from './dto/create-store.dto/create-store.dto.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SYSTEM_ADMINISTRATOR')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('stores')
  getStores(
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    return this.adminService.getStores(search, sortBy, order);
  }

  @Get('users')
  getUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: string,
  ) {
    return this.adminService.getUsers(search, role, sortBy, order);
  }

  @Get('users/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getUserById(id);
  }

  @Post('users')
  createUser(@Body() dto: CreateUserDto) {
    return this.adminService.createUser(dto);
  }

  @Post('admins')
  createAdmin(@Body() dto: CreateUserDto) {
    return this.adminService.createAdmin(dto);
  }

  @Post('store-owners')
  createStoreOwner(@Body() dto: CreateUserDto) {
    return this.adminService.createStoreOwner(dto);
  }

  @Post('stores')
  createStore(@Body() dto: CreateStoreDto) {
    return this.adminService.createStore(dto);
  }
}