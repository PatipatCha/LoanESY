
import { JSONFile, Low } from 'lowdb';
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
  }
  return db;
}
