/**
 * Authentication wrapper that conditionally uses Google OAuth or Replit Auth
 * - Uses Google OAuth if GOOGLE_CLIENT_ID is set (production on Rocky Linux)
 * - Uses Replit Auth otherwise (testing on Replit)
 */

import type { Express } from "express";

// Determine which auth system to use based on environment
const useGoogleAuth = !!process.env.GOOGLE_CLIENT_ID;

// Import the appropriate auth module
export async function setupAuth(app: Express): Promise<void> {
  if (useGoogleAuth) {
    const { setupAuth: setup } = await import("./googleAuth");
    console.log("🔐 Using Google OAuth authentication");
    return setup(app);
  } else {
    const { setupAuth: setup } = await import("./replitAuth");
    console.log("🔐 Using Replit Auth authentication (testing mode)");
    return setup(app);
  }
}

export function isAuthenticated(req: any, res: any, next: any) {
  // For Google Auth, check req.isAuthenticated()
  // For Replit Auth, check req.user
  if (useGoogleAuth) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }
  } else {
    if (req.user) {
      return next();
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
}
