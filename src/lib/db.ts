
import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import type { LoanFormValues, SavedPlan } from './types';
import clientPromise from './mongodb';

let client: MongoClient;
let db: Db;
let plans: Collection<SavedPlan>;

async function init() {
  if (db) {
    return;
  }
  try {
    client = await clientPromise;
    db = client.db();
    plans = db.collection('plans');
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

export async function getDbConnectionStatus(): Promise<boolean> {
  try {
    await init();
    // Use the admin database to ping the server
    await client.db().admin().ping();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export async function getPlans(): Promise<SavedPlan[]> {
  try {
    if (!plans) await init();
    const result = await plans
      .find({})
      .map(plan => ({ ...plan, id: plan._id.toString() }))
      .toArray();
      
    // The mongo _id is converted to a string id. We need to tell TS to delete the _id property.
    return result.map(({ _id, ...rest }) => rest) as SavedPlan[];
  } catch (error) {
    console.error('Failed to get plans:', error);
    throw new Error('Failed to retrieve plans.');
  }
}

export async function addPlan(name: string, formData: LoanFormValues) {
  try {
    if (!plans) await init();
    const result = await plans.insertOne({ name, formData });
    return {
      ...{ name, formData },
      id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('Failed to create plan:', error);
    throw new Error('Failed to create plan.');
  }
}

export async function updatePlan(id: string, name: string, formData: LoanFormValues) {
  try {
    if (!plans) await init();
    
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid plan ID format.');
    }
    
    const result = await plans.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, formData } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return null;
    }

    const { _id, ...updatedPlan } = result;
    return { ...updatedPlan, id: _id.toString() } as SavedPlan;
  } catch (error)
 {
    console.error(`Failed to update plan ${id}:`, error);
    throw new Error('Failed to update plan.');
  }
}
