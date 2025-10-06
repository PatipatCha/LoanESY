
import { NextResponse } from 'next/server';
import { updatePlan } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name, formData } = await request.json();

    const updatedPlan = await updatePlan(id, name, formData);

    if (!updatedPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error(`Failed to update plan ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}
