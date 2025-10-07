
import { NextResponse } from 'next/server';
import { getPlans, addPlan } from '@/lib/db';

export async function GET() {
  try {
    const plans = await getPlans();
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Failed to get plans:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve plans';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, formData } = await request.json();

    if (!name || !formData) {
      return NextResponse.json({ error: 'Missing name or formData' }, { status: 400 });
    }

    const newPlan = await addPlan(name, formData);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error('Failed to create plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create plan';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
