import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all contacts from the database
    const contacts = await prisma.card.findMany();
    return NextResponse.json(contacts);
  } catch (error) {
    // Log error for debugging
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the incoming data (simple check, can be expanded)
    if (!body.name || !body.email || !body.phone || !body.designation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new contact
    const contact = await prisma.card.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.designation,  // Ensure this field exists in your Prisma schema
        title: body.designation,    // Ensure this field exists in your Prisma schema
      },
    });

    // Return the newly created contact
    return NextResponse.json(contact);
  } catch (error) {
    // Log error for debugging
    console.error('Failed to create contact:', error);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
