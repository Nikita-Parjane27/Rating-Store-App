import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { and, asc, desc, eq, ilike, sql } from 'drizzle-orm';

import { db } from '../database/db.js';
import { ratings, stores, users } from '../database/schema.js';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto.js';
import { CreateStoreDto } from './dto/create-store.dto/create-store.dto.js';

@Injectable()
export class AdminService {
    async getDashboard() {
        const [userCount] = await db
            .select({ count: sql<number>`count(*)` })
            .from(users);

        const [storeCount] = await db
            .select({ count: sql<number>`count(*)` })
            .from(stores);

        const [ratingCount] = await db
            .select({ count: sql<number>`count(*)` })
            .from(ratings);

        return {
            totalUsers: Number(userCount.count),
            totalStores: Number(storeCount.count),
            totalRatings: Number(ratingCount.count),
        };
    }

    async getStores(
        search?: string,
        sortBy: string = 'name',
        order: string = 'asc',
    ) {
        const sortColumn =
            sortBy === 'email'
                ? stores.email
                : sortBy === 'address'
                    ? stores.address
                    : stores.name;

        const sortOrder = order === 'desc' ? desc(sortColumn) : asc(sortColumn);

        const conditions = search
            ? sql`(
      ${stores.name} ILIKE ${`%${search}%`}
      OR ${stores.email} ILIKE ${`%${search}%`}
      OR ${stores.address} ILIKE ${`%${search}%`}
    )`
            : undefined;

        const result = await db
            .select({
                id: stores.id,
                name: stores.name,
                email: stores.email,
                address: stores.address,
                rating: sql<number>`
          COALESCE(AVG(${ratings.rating}), 0)
        `,
            })
            .from(stores)
            .leftJoin(ratings, eq(stores.id, ratings.storeId))
            .where(conditions)
            .groupBy(stores.id)
            .orderBy(sortOrder);

        return result.map((store) => ({
            ...store,
            rating: Number(Number(store.rating).toFixed(2)),
        }));
    }

    async getUsers(
  search?: string,
  role?: string,
  sortBy: string = 'name',
  order: string = 'asc',
) {
  const sortColumn =
    sortBy === 'email'
      ? users.email
      : sortBy === 'address'
        ? users.address
        : sortBy === 'role'
          ? users.role
          : users.name;

  const sortOrder =
    order === 'desc' ? desc(sortColumn) : asc(sortColumn);

  const conditions = [];

  if (search) {
    conditions.push(
      sql`(
        ${users.name} ILIKE ${`%${search}%`}
        OR ${users.email} ILIKE ${`%${search}%`}
        OR ${users.address} ILIKE ${`%${search}%`}
      )`,
    );
  }

  if (role) {
    conditions.push(eq(users.role, role as any));
  }

  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      address: users.address,
      role: users.role,
    })
    .from(users)
    .where(
      conditions.length
        ? and(...conditions)
        : undefined,
    )
    .orderBy(sortOrder);

  return result;
}

   async getUserById(id: number) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      address: users.address,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!result.length) {
    throw new ConflictException('User not found');
  }

  const user = result[0];

  if (user.role === 'STORE_OWNER') {
    const ownerStores = await db
      .select({
        storeId: stores.id,
        storeName: stores.name,
        rating: sql<number>`
          COALESCE(AVG(${ratings.rating}), 0)
        `,
      })
      .from(stores)
      .leftJoin(
        ratings,
        eq(stores.id, ratings.storeId),
      )
      .where(eq(stores.ownerId, id))
      .groupBy(stores.id, stores.name);

    return {
      ...user,
      stores: ownerStores.map((store) => ({
        ...store,
        rating: Number(Number(store.rating).toFixed(2)),
      })),
    };
  }

  return user;
}

    async createUser(dto: CreateUserDto) {
        const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, dto.email))
            .limit(1);

        if (existing.length) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const result = await db
            .insert(users)
            .values({
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
                address: dto.address,
                role: 'NORMAL_USER',
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                address: users.address,
                role: users.role,
            });

        return result[0];
    }

    async createAdmin(dto: CreateUserDto) {
        const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, dto.email))
            .limit(1);

        if (existing.length) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const result = await db
            .insert(users)
            .values({
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
                address: dto.address,
                role: 'SYSTEM_ADMINISTRATOR',
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                address: users.address,
                role: users.role,
            });

        return result[0];
    }

    async createStoreOwner(dto: CreateUserDto) {
        const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, dto.email))
            .limit(1);

        if (existing.length) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const result = await db
            .insert(users)
            .values({
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
                address: dto.address,
                role: 'STORE_OWNER',
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                address: users.address,
                role: users.role,
            });

        return result[0];
    }

    async createStore(dto: CreateStoreDto) {
        const result = await db
            .insert(stores)
            .values({
                name: dto.name,
                email: dto.email,
                address: dto.address,
                ownerId: dto.ownerId ?? null,
            })
            .returning();

        return result[0];
    }
}