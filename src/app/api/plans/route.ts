
import { NextResponse } from 'next/server';
import { getPlans, addPlan } from '@/lib/db';

export async function GET() {
  try {
    const plans = await getPlans();
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Failed to get plans:', error);
    return NextResponse.json({ error: 'Failed to retrieve plans' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, formData } = await request.json();

    if (!name || !formData) {
      return NextResponse.json({ error: 'Missing name or formData' }, { status: 400 });
    }

    const newPlan = await addPlan(name, formData);
    return new Response(JSON.stringify(newPlan), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to create plan:', error);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}
