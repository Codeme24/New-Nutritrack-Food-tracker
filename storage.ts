import {
  users,
  foods,
  userGoals,
  foodEntries,
  type User,
  type UpsertUser,
  type Food,
  type InsertFood,
  type UserGoals,
  type InsertUserGoals,
  type FoodEntry,
  type InsertFoodEntry,
  type DailyStats,
  type FoodEntryWithFood,
  type WeeklyProgress,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, gte, lte, like } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Food operations
  searchFoods(query: string): Promise<Food[]>;
  getFoodById(id: number): Promise<Food | undefined>;
  createFood(food: InsertFood): Promise<Food>;
  getCommonFoods(): Promise<Food[]>;
  
  // User goals operations
  getUserGoals(userId: string): Promise<UserGoals | undefined>;
  upsertUserGoals(goals: InsertUserGoals): Promise<UserGoals>;
  
  // Food entries operations
  getFoodEntriesByDate(userId: string, date: string): Promise<FoodEntryWithFood[]>;
  createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  updateFoodEntry(id: number, entry: Partial<InsertFoodEntry>): Promise<FoodEntry>;
  deleteFoodEntry(id: number): Promise<void>;
  
  // Stats operations
  getDailyStats(userId: string, date: string): Promise<DailyStats>;
  getWeeklyProgress(userId: string, startDate: string, endDate: string): Promise<WeeklyProgress[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Food operations
  async searchFoods(query: string): Promise<Food[]> {
    return await db
      .select()
      .from(foods)
      .where(like(foods.name, `%${query}%`))
      .orderBy(desc(foods.isCommon))
      .limit(20);
  }

  async getFoodById(id: number): Promise<Food | undefined> {
    const [food] = await db.select().from(foods).where(eq(foods.id, id));
    return food;
  }

  async createFood(food: InsertFood): Promise<Food> {
    const [newFood] = await db.insert(foods).values(food).returning();
    return newFood;
  }

  async getCommonFoods(): Promise<Food[]> {
    return await db
      .select()
      .from(foods)
      .where(eq(foods.isCommon, true))
      .orderBy(foods.name)
      .limit(10);
  }

  // User goals operations
  async getUserGoals(userId: string): Promise<UserGoals | undefined> {
    const [goals] = await db.select().from(userGoals).where(eq(userGoals.userId, userId));
    return goals;
  }

  async upsertUserGoals(goals: InsertUserGoals): Promise<UserGoals> {
    const [existingGoals] = await db.select().from(userGoals).where(eq(userGoals.userId, goals.userId));
    
    if (existingGoals) {
      const [updatedGoals] = await db
        .update(userGoals)
        .set({ ...goals, updatedAt: new Date() })
        .where(eq(userGoals.userId, goals.userId))
        .returning();
      return updatedGoals;
    } else {
      const [newGoals] = await db.insert(userGoals).values(goals).returning();
      return newGoals;
    }
  }

  // Food entries operations
  async getFoodEntriesByDate(userId: string, date: string): Promise<FoodEntryWithFood[]> {
    return await db
      .select({
        id: foodEntries.id,
        userId: foodEntries.userId,
        foodId: foodEntries.foodId,
        servings: foodEntries.servings,
        mealType: foodEntries.mealType,
        consumedAt: foodEntries.consumedAt,
        entryDate: foodEntries.entryDate,
        createdAt: foodEntries.createdAt,
        food: foods,
      })
      .from(foodEntries)
      .innerJoin(foods, eq(foodEntries.foodId, foods.id))
      .where(
        and(
          eq(foodEntries.userId, userId),
          eq(foodEntries.entryDate, date)
        )
      )
      .orderBy(desc(foodEntries.consumedAt));
  }

  async createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry> {
    const [newEntry] = await db.insert(foodEntries).values(entry).returning();
    return newEntry;
  }

  async updateFoodEntry(id: number, entry: Partial<InsertFoodEntry>): Promise<FoodEntry> {
    const [updatedEntry] = await db
      .update(foodEntries)
      .set(entry)
      .where(eq(foodEntries.id, id))
      .returning();
    return updatedEntry;
  }

  async deleteFoodEntry(id: number): Promise<void> {
    await db.delete(foodEntries).where(eq(foodEntries.id, id));
  }

  // Stats operations
  async getDailyStats(userId: string, date: string): Promise<DailyStats> {
    const entries = await this.getFoodEntriesByDate(userId, date);
    
    const stats = entries.reduce(
      (acc, entry) => {
        const servings = parseFloat(entry.servings);
        acc.calories += parseFloat(entry.food.caloriesPerServing) * servings;
        acc.protein += parseFloat(entry.food.proteinPerServing || "0") * servings;
        acc.carbs += parseFloat(entry.food.carbsPerServing || "0") * servings;
        acc.fat += parseFloat(entry.food.fatPerServing || "0") * servings;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, date }
    );

    return {
      calories: Math.round(stats.calories),
      protein: Math.round(stats.protein),
      carbs: Math.round(stats.carbs),
      fat: Math.round(stats.fat),
      date,
    };
  }

  async getWeeklyProgress(userId: string, startDate: string, endDate: string): Promise<WeeklyProgress[]> {
    const goals = await this.getUserGoals(userId);
    const dailyCalorieGoal = goals?.dailyCalories || 2000;
    
    const result = await db
      .select({
        date: foodEntries.entryDate,
        totalCalories: sql<number>`COALESCE(SUM(CAST(${foodEntries.servings} as DECIMAL) * CAST(${foods.caloriesPerServing} as DECIMAL)), 0)`,
      })
      .from(foodEntries)
      .innerJoin(foods, eq(foodEntries.foodId, foods.id))
      .where(
        and(
          eq(foodEntries.userId, userId),
          gte(foodEntries.entryDate, startDate),
          lte(foodEntries.entryDate, endDate)
        )
      )
      .groupBy(foodEntries.entryDate)
      .orderBy(foodEntries.entryDate);

    return result.map(row => ({
      date: row.date,
      calories: Math.round(row.totalCalories),
      percentage: Math.round((row.totalCalories / dailyCalorieGoal) * 100),
    }));
  }
}

export const storage = new DatabaseStorage();
