
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const db = await getDb();
  return NextResponse.json(db.data.plans);
}

export async function POST(request: Request) {
  const db = await getDb();
  const { name, formData } = await request.json();

  if (!name || !formData) {
    return NextResponse.json({ error: 'Missing name or formData' }, { status: 400 });
  }

  const newPlan = { id: uuidv4(), name, formData };
  db.data.plans.push(newPlan);
  await db.write();

  return NextResponse.json(newPlan, { status: 201 });
}
