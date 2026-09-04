import { Module } from '@nestjs/common';

import { StoresController } from './stores.controller.js';
import { StoresService } from './stores.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}