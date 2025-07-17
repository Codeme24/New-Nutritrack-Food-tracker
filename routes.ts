import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertFoodSchema, insertUserGoalsSchema, insertFoodEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Foods API
  app.get('/api/foods/search', isAuthenticated, async (req: any, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const foods = await storage.searchFoods(q);
      res.json(foods);
    } catch (error) {
      console.error("Error searching foods:", error);
      res.status(500).json({ message: "Failed to search foods" });
    }
  });

  app.get('/api/foods/common', isAuthenticated, async (req: any, res) => {
    try {
      const foods = await storage.getCommonFoods();
      res.json(foods);
    } catch (error) {
      console.error("Error fetching common foods:", error);
      res.status(500).json({ message: "Failed to fetch common foods" });
    }
  });

  app.post('/api/foods', isAuthenticated, async (req: any, res) => {
    try {
      const foodData = insertFoodSchema.parse(req.body);
      const food = await storage.createFood(foodData);
      res.status(201).json(food);
    } catch (error) {
      console.error("Error creating food:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid food data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create food" });
    }
  });

  // User goals API
  app.get('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getUserGoals(userId);
      
      if (!goals) {
        // Return default goals if none exist
        return res.json({
          dailyCalories: 2000,
          dailyProtein: 150,
          dailyCarbs: 250,
          dailyFat: 67,
          weightGoal: "maintain",
        });
      }
      
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalsData = insertUserGoalsSchema.parse({
        ...req.body,
        userId,
      });
      
      const goals = await storage.upsertUserGoals(goalsData);
      res.json(goals);
    } catch (error) {
      console.error("Error updating goals:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid goals data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update goals" });
    }
  });

  // Food entries API
  app.get('/api/food-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.query;
      
      if (!date || typeof date !== 'string') {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const entries = await storage.getFoodEntriesByDate(userId, date);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching food entries:", error);
      res.status(500).json({ message: "Failed to fetch food entries" });
    }
  });

  app.post('/api/food-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = insertFoodEntrySchema.parse({
        ...req.body,
        userId,
      });
      
      const entry = await storage.createFoodEntry(entryData);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating food entry:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid entry data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create food entry" });
    }
  });

  app.patch('/api/food-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const entry = await storage.updateFoodEntry(id, updates);
      res.json(entry);
    } catch (error) {
      console.error("Error updating food entry:", error);
      res.status(500).json({ message: "Failed to update food entry" });
    }
  });

  app.delete('/api/food-entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFoodEntry(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting food entry:", error);
      res.status(500).json({ message: "Failed to delete food entry" });
    }
  });

  // Stats API
  app.get('/api/stats/daily', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.query;
      
      if (!date || typeof date !== 'string') {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      
      const stats = await storage.getDailyStats(userId, date);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching daily stats:", error);
      res.status(500).json({ message: "Failed to fetch daily stats" });
    }
  });

  app.get('/api/stats/weekly', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
        return res.status(400).json({ message: "startDate and endDate parameters are required" });
      }
      
      const progress = await storage.getWeeklyProgress(userId, startDate, endDate);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching weekly progress:", error);
      res.status(500).json({ message: "Failed to fetch weekly progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
