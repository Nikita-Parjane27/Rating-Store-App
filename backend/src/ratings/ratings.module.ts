import { Module } from '@nestjs/common';

import { RatingsController } from './ratings.controller.js';
import { RatingsService } from './ratings.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}