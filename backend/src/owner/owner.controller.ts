import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OwnerService } from './owner.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles/roles.decorator.js';

@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STORE_OWNER')
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @Get('dashboard')
  getDashboard(@Req() req: any) {
    return this.ownerService.getDashboard(req.user.sub);
  }
}