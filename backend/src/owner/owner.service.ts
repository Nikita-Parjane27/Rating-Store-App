import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

import { db } from '../database/db.js';
import { ratings, stores, users } from '../database/schema.js';

@Injectable()
export class OwnerService {
  async getDashboard(ownerId: number) {
    const ownerStores = await db
      .select({
        id: stores.id,
        name: stores.name,
        email: stores.email,
        address: stores.address,
        averageRating: sql<number>`
          COALESCE(AVG(${ratings.rating}), 0)
        `,
      })
      .from(stores)
      .leftJoin(ratings, eq(stores.id, ratings.storeId))
      .where(eq(stores.ownerId, ownerId))
      .groupBy(stores.id);

    const storesWithRatings = [];

    for (const store of ownerStores) {
      const ratedUsers = await db
        .select({
          userId: users.id,
          name: users.name,
          email: users.email,
          rating: ratings.rating,
        })
        .from(ratings)
        .innerJoin(users, eq(users.id, ratings.userId))
        .where(eq(ratings.storeId, store.id));

      storesWithRatings.push({
        ...store,
        averageRating: Number(Number(store.averageRating).toFixed(2)),
        ratedUsers,
      });
    }

    return storesWithRatings;
  }
}