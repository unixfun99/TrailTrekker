// Integration: blueprint:javascript_log_in_with_replit
import {
  users,
  hikes,
  photos,
  collaborators,
  type User,
  type UpsertUser,
  type Hike,
  type InsertHike,
  type Photo,
  type InsertPhoto,
  type Collaborator,
  type InsertCollaborator,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Hike operations
  createHike(hike: InsertHike & { userId: string }): Promise<Hike>;
  getHike(id: string): Promise<Hike | undefined>;
  getUserHikes(userId: string): Promise<Hike[]>;
  getSharedHikes(userId: string): Promise<Hike[]>;
  updateHike(id: string, userId: string, hike: Partial<InsertHike>): Promise<Hike | undefined>;
  deleteHike(id: string, userId: string): Promise<boolean>;
  
  // Photo operations
  addPhoto(photo: InsertPhoto): Promise<Photo>;
  getHikePhotos(hikeId: string): Promise<Photo[]>;
  deletePhoto(id: string): Promise<boolean>;
  
  // Collaborator operations
  addCollaborator(collaborator: InsertCollaborator): Promise<Collaborator>;
  getHikeCollaborators(hikeId: string): Promise<Array<Collaborator & { user: User }>>;
  removeCollaborator(hikeId: string, userId: string): Promise<boolean>;
  isCollaborator(hikeId: string, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // MySQL: Use onDuplicateKeyUpdate, then SELECT
    await db
      .insert(users)
      .values(userData)
      .onDuplicateKeyUpdate({
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      });
    
    // Fetch the user after insert/update
    const [user] = await db.select().from(users).where(eq(users.id, userData.id));
    return user!;
  }

  // Hike operations
  async createHike(hikeData: InsertHike & { userId: string }): Promise<Hike> {
    const hikeId = randomUUID();
    const insertData = {
      id: hikeId,
      ...hikeData,
      date: new Date(hikeData.date),
    };
    
    // MySQL: Insert then SELECT
    await db.insert(hikes).values(insertData);
    const [hike] = await db.select().from(hikes).where(eq(hikes.id, hikeId));
    return hike!;
  }

  async getHike(id: string): Promise<Hike | undefined> {
    const [hike] = await db.select().from(hikes).where(eq(hikes.id, id));
    return hike;
  }

  async getUserHikes(userId: string): Promise<Hike[]> {
    return await db
      .select()
      .from(hikes)
      .where(eq(hikes.userId, userId))
      .orderBy(desc(hikes.date));
  }

  async getSharedHikes(userId: string): Promise<Hike[]> {
    const sharedHikes = await db
      .select({ hike: hikes })
      .from(collaborators)
      .innerJoin(hikes, eq(collaborators.hikeId, hikes.id))
      .where(eq(collaborators.userId, userId))
      .orderBy(desc(hikes.date));
    
    return sharedHikes.map(sh => sh.hike);
  }

  async updateHike(id: string, userId: string, hikeData: Partial<InsertHike>): Promise<Hike | undefined> {
    // Check if user owns hike or is a collaborator
    const hike = await this.getHike(id);
    if (!hike) return undefined;
    
    const isOwner = hike.userId === userId;
    const isCollab = await this.isCollaborator(id, userId);
    
    if (!isOwner && !isCollab) return undefined;

    const updateData: any = { ...hikeData };
    if (hikeData.date) {
      updateData.date = new Date(hikeData.date);
    }
    updateData.updatedAt = new Date();

    // MySQL: Update then SELECT
    await db.update(hikes).set(updateData).where(eq(hikes.id, id));
    const [updated] = await db.select().from(hikes).where(eq(hikes.id, id));
    return updated;
  }

  async deleteHike(id: string, userId: string): Promise<boolean> {
    // MySQL: Check existence first, then delete
    const existing = await this.getHike(id);
    if (!existing || existing.userId !== userId) return false;
    await db.delete(hikes).where(eq(hikes.id, id));
    return true;
  }

  // Photo operations
  async addPhoto(photoData: InsertPhoto): Promise<Photo> {
    const photoId = randomUUID();
    const insertData = { id: photoId, ...photoData };
    
    // MySQL: Insert then SELECT
    await db.insert(photos).values(insertData);
    const [photo] = await db.select().from(photos).where(eq(photos.id, photoId));
    return photo!;
  }

  async getHikePhotos(hikeId: string): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.hikeId, hikeId));
  }

  async deletePhoto(id: string): Promise<boolean> {
    // MySQL: Check existence first, then delete
    const [existing] = await db.select().from(photos).where(eq(photos.id, id));
    if (!existing) return false;
    await db.delete(photos).where(eq(photos.id, id));
    return true;
  }

  // Collaborator operations
  async addCollaborator(collaboratorData: InsertCollaborator): Promise<Collaborator> {
    const collabId = randomUUID();
    const insertData = { id: collabId, ...collaboratorData };
    
    // MySQL: Insert then SELECT
    await db.insert(collaborators).values(insertData);
    const [collaborator] = await db.select().from(collaborators).where(eq(collaborators.id, collabId));
    return collaborator!;
  }

  async getHikeCollaborators(hikeId: string): Promise<Array<Collaborator & { user: User }>> {
    const results = await db
      .select({
        collaborator: collaborators,
        user: users,
      })
      .from(collaborators)
      .innerJoin(users, eq(collaborators.userId, users.id))
      .where(eq(collaborators.hikeId, hikeId));
    
    return results.map(r => ({ ...r.collaborator, user: r.user }));
  }

  async removeCollaborator(hikeId: string, userId: string): Promise<boolean> {
    // MySQL: Check existence first, then delete
    const existing = await this.isCollaborator(hikeId, userId);
    if (!existing) return false;
    await db.delete(collaborators).where(and(eq(collaborators.hikeId, hikeId), eq(collaborators.userId, userId)));
    return true;
  }

  async isCollaborator(hikeId: string, userId: string): Promise<boolean> {
    const [collaborator] = await db
      .select()
      .from(collaborators)
      .where(and(eq(collaborators.hikeId, hikeId), eq(collaborators.userId, userId)));
    
    return !!collaborator;
  }
}

export const storage = new DatabaseStorage();