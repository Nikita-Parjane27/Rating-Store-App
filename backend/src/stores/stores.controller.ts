import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StoresService } from './stores.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles/roles.decorator.js';

@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('NORMAL_USER')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  getStores(@Query('search') search: string | undefined, @Req() req: any) {
    return this.storesService.getStores(search, req.user.sub);
  }
}