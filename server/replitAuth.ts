import type { Express } from "express";
import { storage } from "./storage";

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
}

export async function setupAuth(app: Express) {
  // Replit Auth middleware - reads from headers
  app.use(async (req: any, res, next) => {
    const replitUserId = req.headers['x-replit-user-id'];
    const replitUserName = req.headers['x-replit-user-name'];
    const replitUserEmail = req.headers['x-replit-user-email'];
    const replitUserImage = req.headers['x-replit-user-profile-image'];
    
    if (replitUserId) {
      try {
        // Upsert user to database (id is the Replit user ID)
        const user = await storage.upsertUser({
          id: replitUserId as string,
          email: (replitUserEmail as string) || `${replitUserId}@replit.user`,
          firstName: ((replitUserName as string)?.split(' ')[0]) || 'User',
          lastName: ((replitUserName as string)?.split(' ').slice(1).join(' ')) || '',
          profileImageUrl: (replitUserImage as string) || '',
        });
        
        req.user = user;
      } catch (error) {
        console.error('Error upserting user:', error);
      }
    }
    next();
  });

  // Auth routes
  app.get("/api/auth/user", (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });

  app.post("/api/logout", (req, res) => {
    // Replit auth doesn't have logout, just clear user
    res.json({ success: true });
  });
}
