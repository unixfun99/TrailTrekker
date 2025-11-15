import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./googleAuth";
import { insertHikeSchema, users } from "@shared/schema";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req: any, file: any, cb: any) => {
      const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  app.use('/uploads', (await import('express')).static('uploads'));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // With Passport.js, user is directly in req.user
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Hike routes
  app.get("/api/hikes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const hikes = await storage.getUserHikes(userId);
      
      // Get photos and collaborators for each hike
      const hikesWithDetails = await Promise.all(
        hikes.map(async (hike) => {
          const photos = await storage.getHikePhotos(hike.id);
          const collabs = await storage.getHikeCollaborators(hike.id);
          return {
            ...hike,
            photos,
            collaborators: collabs.map(c => ({
              id: c.userId,
              name: `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim() || c.user.email || 'User',
              avatar: c.user.profileImageUrl,
            })),
          };
        })
      );
      
      res.json(hikesWithDetails);
    } catch (error) {
      console.error("Error fetching hikes:", error);
      res.status(500).json({ message: "Failed to fetch hikes" });
    }
  });

  app.get("/api/hikes/shared", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const hikes = await storage.getSharedHikes(userId);
      
      const hikesWithDetails = await Promise.all(
        hikes.map(async (hike) => {
          const photos = await storage.getHikePhotos(hike.id);
          const collabs = await storage.getHikeCollaborators(hike.id);
          return {
            ...hike,
            photos,
            collaborators: collabs.map(c => ({
              id: c.userId,
              name: `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim() || c.user.email || 'User',
              avatar: c.user.profileImageUrl,
            })),
          };
        })
      );
      
      res.json(hikesWithDetails);
    } catch (error) {
      console.error("Error fetching shared hikes:", error);
      res.status(500).json({ message: "Failed to fetch shared hikes" });
    }
  });

  app.get("/api/hikes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const hike = await storage.getHike(req.params.id);
      
      if (!hike) {
        return res.status(404).json({ message: "Hike not found" });
      }

      // Check if user owns or is a collaborator
      const isOwner = hike.userId === userId;
      const isCollab = await storage.isCollaborator(hike.id, userId);
      
      if (!isOwner && !isCollab) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const photos = await storage.getHikePhotos(hike.id);
      const collabs = await storage.getHikeCollaborators(hike.id);
      
      res.json({
        ...hike,
        photos,
        collaborators: collabs.map(c => ({
          id: c.userId,
          name: `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim() || c.user.email || 'User',
          avatar: c.user.profileImageUrl,
        })),
      });
    } catch (error) {
      console.error("Error fetching hike:", error);
      res.status(500).json({ message: "Failed to fetch hike" });
    }
  });

  app.post("/api/hikes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const result = insertHikeSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid hike data", errors: result.error.errors });
      }

      const hike = await storage.createHike({ ...result.data, userId });
      res.json(hike);
    } catch (error) {
      console.error("Error creating hike:", error);
      res.status(500).json({ message: "Failed to create hike" });
    }
  });

  app.patch("/api/hikes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const hike = await storage.updateHike(req.params.id, userId, req.body);
      
      if (!hike) {
        return res.status(404).json({ message: "Hike not found or forbidden" });
      }

      res.json(hike);
    } catch (error) {
      console.error("Error updating hike:", error);
      res.status(500).json({ message: "Failed to update hike" });
    }
  });

  app.delete("/api/hikes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const deleted = await storage.deleteHike(req.params.id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Hike not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting hike:", error);
      res.status(500).json({ message: "Failed to delete hike" });
    }
  });

  // Photo routes
  app.post("/api/hikes/:hikeId/photos", isAuthenticated, upload.single('photo'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const hike = await storage.getHike(req.params.hikeId);
      
      if (!hike) {
        return res.status(404).json({ message: "Hike not found" });
      }

      const isOwner = hike.userId === userId;
      const isCollab = await storage.isCollaborator(hike.id, userId);
      
      if (!isOwner && !isCollab) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const photo = await storage.addPhoto({
        hikeId: req.params.hikeId,
        url: `/uploads/${req.file.filename}`,
      });

      res.json(photo);
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  // Collaborator routes
  app.post("/api/hikes/:hikeId/collaborators", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const hike = await storage.getHike(req.params.hikeId);
      
      if (!hike) {
        return res.status(404).json({ message: "Hike not found" });
      }

      if (hike.userId !== userId) {
        return res.status(403).json({ message: "Only the owner can add collaborators" });
      }

      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find user by email
      const collaboratorUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (!collaboratorUser || collaboratorUser.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const collaborator = await storage.addCollaborator({
        hikeId: req.params.hikeId,
        userId: collaboratorUser[0].id,
      });

      res.json(collaborator);
    } catch (error) {
      console.error("Error adding collaborator:", error);
      res.status(500).json({ message: "Failed to add collaborator" });
    }
  });

  app.delete("/api/hikes/:hikeId/collaborators/:userId", isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.id;
      const hike = await storage.getHike(req.params.hikeId);
      
      if (!hike) {
        return res.status(404).json({ message: "Hike not found" });
      }

      if (hike.userId !== currentUserId) {
        return res.status(403).json({ message: "Only the owner can remove collaborators" });
      }

      const removed = await storage.removeCollaborator(req.params.hikeId, req.params.userId);
      
      if (!removed) {
        return res.status(404).json({ message: "Collaborator not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error removing collaborator:", error);
      res.status(500).json({ message: "Failed to remove collaborator" });
    }
  });

  // User stats
  app.get("/api/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const hikes = await storage.getUserHikes(userId);
      const sharedHikes = await storage.getSharedHikes(userId);
      
      // Calculate stats
      let totalDistance = 0;
      let totalHours = 0;
      
      hikes.forEach(hike => {
        const distance = parseFloat(hike.distance);
        if (!isNaN(distance)) {
          totalDistance += distance;
        }
        
        const duration = hike.duration;
        const hours = duration.includes('h') ? parseFloat(duration.split('h')[0]) : 0;
        const minutes = duration.includes('m') ? parseFloat(duration.split('m')[0].split(' ').pop() || '0') : 0;
        totalHours += hours + (minutes / 60);
      });
      
      res.json({
        totalHikes: hikes.length,
        totalDistance: totalDistance.toFixed(1),
        totalHours: Math.round(totalHours),
        sharedTrails: sharedHikes.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}