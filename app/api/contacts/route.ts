import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all contacts
export async function GET() {
  try {
    const contacts = await prisma.Card.findMany(); // Fixed: Capital "C"
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

// POST Method: Create a new contact
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received data in POST Method:', body);

    // Validate input fields
    if (!body.name || !body.email || !body.phone || !body.designation || !body.companyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new contact
    const contact = await prisma.Card.create({
      data: {
        name: body.name,
        designation: body.designation,
        companyName: body.companyName,
        phone: body.phone,
        email: body.email,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error); // Add error logging to the console
    return NextResponse.json({ error: 'Failed to create contact', details: (error as Error).message }, { status: 500 });
  }
}
