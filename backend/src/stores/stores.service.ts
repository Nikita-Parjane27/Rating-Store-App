import { Injectable } from '@nestjs/common';
import { and, eq, ilike, or, sql } from 'drizzle-orm';

import { db } from '../database/db.js';
import { ratings, stores } from '../database/schema.js';

@Injectable()
export class StoresService {
  async getStores(search?: string, userId?: number) {
    const searchCondition = search
      ? or(
          ilike(stores.name, `%${search}%`),
          ilike(stores.address, `%${search}%`),
        )
      : undefined;

    const result = await db
      .select({
        id: stores.id,
        name: stores.name,
        address: stores.address,
        email: stores.email,
        overallRating: sql<number>`
          COALESCE(AVG(${ratings.rating}), 0)
        `,
        userRating: userId
          ? sql<number | null>`
              MAX(
                CASE
                  WHEN ${ratings.userId} = ${userId}
                  THEN ${ratings.rating}
                  ELSE NULL
                END
              )
            `
          : sql<number | null>`NULL`,
      })
      .from(stores)
      .leftJoin(ratings, eq(stores.id, ratings.storeId))
      .where(searchCondition)
      .groupBy(stores.id);

    return result.map((store) => ({
      ...store,
      overallRating: Number(Number(store.overallRating).toFixed(2)),
      userRating:
        store.userRating === null ? null : Number(store.userRating),
    }));
  }
}