import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RatingsService } from './ratings.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';
import { Roles } from '../auth/decorators/roles/roles.decorator.js';
import { RatingDto } from './dto/rating.dto/rating.dto.js';

@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('NORMAL_USER')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post(':storeId')
  submitRating(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() dto: RatingDto,
    @Req() req: any,
  ) {
    return this.ratingsService.submitRating(
      req.user.sub,
      storeId,
      dto,
    );
  }
}