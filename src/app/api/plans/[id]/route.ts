
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { id } = params;
  const { name, formData } = await request.json();

  const planIndex = db.data.plans.findIndex((p) => p.id === id);

  if (planIndex === -1) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  const updatedPlan = { ...db.data.plans[planIndex], name, formData };
  db.data.plans[planIndex] = updatedPlan;
  await db.write();

  return NextResponse.json(updatedPlan);
}
