
import { NextResponse } from 'next/server';
import { updatePlan, deletePlan } from '@/lib/db';

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
    const errorMessage = error instanceof Error ? error.message : 'Failed to update plan';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const result = await deletePlan(id);

    if (!result) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Plan deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete plan ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete plan';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
