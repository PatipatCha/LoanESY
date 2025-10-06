
import { kv } from '@vercel/kv';
import type { SavedPlan } from './types';
import { v4 as uuidv4 } from 'uuid';


const PLANS_KEY = 'plans';

// Helper function to get all plans
async function getAllPlans(): Promise<SavedPlan[]> {
  const planIds = await kv.zrange(PLANS_KEY, 0, -1, { rev: true });
  if (planIds.length === 0) {
    return [];
  }
  // The type parameter for mget needs to be SavedPlan, not SavedPlan[]
  const plans = await kv.mget<SavedPlan[]>(...planIds.map(id => `plan:${id}`));
  return plans.filter((p): p is SavedPlan => p !== null);
}

// Get all plans
export async function getPlans() {
  return await getAllPlans();
}

// Add a new plan
export async function addPlan(name: string, formData: any) {
  const id = uuidv4();
  const newPlan: SavedPlan = { id, name, formData };

  await kv.set(`plan:${id}`, newPlan);
  await kv.zadd(PLANS_KEY, { score: Date.now(), member: id });

  return newPlan;
}

// Update an existing plan
export async function updatePlan(id: string, name: string, formData: any) {
  const existingPlan = await kv.get(`plan:${id}`);
  if (!existingPlan) {
    return null;
  }

  const updatedPlan: SavedPlan = { id, name, formData };
  await kv.set(`plan:${id}`, updatedPlan);

  return updatedPlan;
}
