// This file now exports access to the MongoDB database instance.
// It previously exported the Supabase client.

import { getMongoDb } from '@/lib/mongo/client';
import type { Db } from 'mongodb';

// Export a function that returns the Db instance.
// API files will use this to get the database instance.
export async function getDbInstance(): Promise<Db> {
  return await getMongoDb();
}

// For compatibility, we can also provide a more direct export if preferred,
// but an async function helps ensure the connection is established.
// export const db = getMongoDb; // Example of a more direct export