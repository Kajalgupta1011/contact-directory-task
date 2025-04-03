import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update contact - PUT method
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = params.id; // Keep ID as string

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.designation || !body.companyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const contact = await prisma.Card.update({
      where: { id }, // ID is now correctly treated as a string
      data: {
        name: body.name,
        designation: body.designation, 
        companyName: body.companyName, 
        phone: body.phone,
        email: body.email,
      },
    });

    return NextResponse.json({ message: 'Contact updated successfully', contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

// Delete contact - DELETE method
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id; // ID remains a string

    await prisma.Card.delete({ where: { id } });

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}

// Static Params (For Static Generation)
export async function generateStaticParams() {
  const contacts = await prisma.Card.findMany({ select: { id: true } });

  return contacts.map((contact: { id: string }) => ({
    id: contact.id,
  }));
}
