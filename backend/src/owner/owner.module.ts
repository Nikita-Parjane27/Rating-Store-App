import { Module } from '@nestjs/common';

import { OwnerController } from './owner.controller.js';
import { OwnerService } from './owner.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [OwnerController],
  providers: [OwnerService],
})
export class OwnerModule {}