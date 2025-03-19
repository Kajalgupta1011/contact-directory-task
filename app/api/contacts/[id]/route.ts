// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// // Update contact - PUT method
// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Parse the request body
//     const body = await request.json();

//     // Ensure the ID is a valid number
//     const id = parseInt(params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
//     }

//     // Update the contact in the database
//     const contact = await prisma.card.update({
//       where: { id },
//       data: {
//         name: body.name,
//         email: body.email,
//         phone: body.phone,
//         company: body.designation,
//         title: body.designation,
//       },
//     });

//     // Return the updated contact
//     return NextResponse.json({ message: 'Contact updated successfully', contact });
//   } catch (error) {
//     console.error('Error updating contact:', error); // Log the error for debugging
//     return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
//   }
// }

// // Delete contact - DELETE method
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Ensure the ID is a valid number
//     const id = parseInt(params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
//     }

//     // Delete the contact by ID
//     const deletedContact = await prisma.card.delete({
//       where: { id },
//     });

//     // Return success message
//     return NextResponse.json({ message: 'Contact deleted successfully', deletedContact });
//   } catch (error) {
//     console.error('Error deleting contact:', error); // Log the error for debugging
//     return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
//   }
// }

// // Add this function for static generation
// export async function generateStaticParams() {
//   // Fetch all the contact IDs from your database
//   const contacts = await prisma.card.findMany({
//     select: { id: true },
//   });

//   // Return an array of static params, which are the IDs of your contacts
//   return contacts.map((contact) => ({
//     id: contact.id.toString(), // Convert to string for dynamic routing
//   }));
// }


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Update contact - PUT method
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Ensure all required fields exist
    if (!body.name || !body.email || !body.phone || !body.designation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const contact = await prisma.card.update({
      where: { id },
      data: {
        name: body.name,
        designation: body.designation, // Fixing incorrect fields
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
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await prisma.card.delete({ where: { id } });

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}

// Static Params (For Static Generation)
export async function generateStaticParams() {
  const contacts = await prisma.card.findMany({ select: { id: true } });

  return contacts.map((contact: { id: number }) => ({
    id: contact.id.toString(),
  }));
}
