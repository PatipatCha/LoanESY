
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { SavedPlan } from './types';

type DbData = {
  plans: SavedPlan[];
};

let db: Low<DbData>;

export async function getDb() {
  if (!db) {
    const adapter = new JSONFile<DbData>('db.json');
    db = new Low(adapter, { plans: [] });
    await db.read();
    // If db.data is null (e.g., file doesn't exist or is empty), initialize it.
    db.data ||= { plans: [] };
  }
  return db;
}
