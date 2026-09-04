import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from '../database/db.js';
import { ratings, stores } from '../database/schema.js';
import { RatingDto } from './dto/rating.dto/rating.dto.js';

@Injectable()
export class RatingsService {
  async submitRating(
    userId: number,
    storeId: number,
    dto: RatingDto,
  ) {
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1);

    if (!store.length) {
      throw new NotFoundException('Store not found');
    }

    const existingRating = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.userId, userId),
          eq(ratings.storeId, storeId),
        ),
      )
      .limit(1);

    if (existingRating.length) {
      const result = await db
        .update(ratings)
        .set({
          rating: dto.rating,
        })
        .where(eq(ratings.id, existingRating[0].id))
        .returning();

      return result[0];
    }

    const result = await db
      .insert(ratings)
      .values({
        userId,
        storeId,
        rating: dto.rating,
      })
      .returning();

    return result[0];
  }
}