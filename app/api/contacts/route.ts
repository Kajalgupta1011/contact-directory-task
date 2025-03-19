import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all contacts
export async function GET() {
  try {
    const contacts = await prisma.card.findMany();
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// POST: Create a new contact
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Log incoming request for debugging
    console.log('Received data:', body);

    // Validate input fields
    if (!body.name || !body.email || !body.phone || !body.designation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new contact
    const contact = await prisma.card.create({
      data: {
        name: body.name,
        designation: body.designation,
        phone: body.phone,
        email: body.email,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error); // Logs error for debugging
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}