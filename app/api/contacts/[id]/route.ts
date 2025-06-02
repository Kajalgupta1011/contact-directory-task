// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Update contact - PUT method
// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await request.json();
//     const id = params.id; // Keep ID as string

//     // Validate required fields
//     if (!body.name || !body.email || !body.phone || !body.designation || !body.companyName) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const contact = await prisma.Card.update({
//       where: { id }, // ID is now correctly treated as a string
//       data: {
//         name: body.name,
//         designation: body.designation, 
//         companyName: body.companyName, 
//         phone: body.phone,
//         email: body.email,
//       },
//     });

//     return NextResponse.json({ message: 'Contact updated successfully', contact });
//   } catch (error) {
//     console.error('Error updating contact:', error);
//     return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
//   }
// }

// // Delete contact - DELETE method
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id; // ID remains a string

//     await prisma.Card.delete({ where: { id } });

//     return NextResponse.json({ message: 'Contact deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting contact:', error);
//     return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
//   }
// }

// // Static Params (For Static Generation)
// export async function generateStaticParams() {
//   const contacts = await prisma.Card.findMany({ select: { id: true } });

//   return contacts.map((contact: { id: string }) => ({
//     id: contact.id,
//   }));
// }


// mongodb =====================================================

// import clientPromise from '@/lib/mongodb';
// import { NextResponse } from 'next/server';
// import { ObjectId } from 'mongodb';

// // PUT: Update card
// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const body = await request.json();
//     const client = await clientPromise;
//     const db = client.db('contacts');

//     const result = await db.collection('cards').updateOne(
//       { _id: new ObjectId(params.id) },
//       { $set: body }
//     );

//     return NextResponse.json({ message: 'Card updated', result });
//   } catch (error) {
//     console.error('Error updating card:', error);
//     return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
//   }
// }

// // DELETE: Delete card
// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const client = await clientPromise;
//     const db = client.db('contacts');

//     const result = await db.collection('cards').deleteOne({ _id: new ObjectId(params.id) });

//     return NextResponse.json({ message: 'Card deleted', result });
//   } catch (error) {
//     console.error('Error deleting card:', error);
//     return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
//   }
// }

// import { NextResponse } from 'next/server';
// import clientPromise from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';

// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   const client = await clientPromise;
//   const db = client.db('contact');
//   const collection = db.collection('cards');
//   const body = await req.json();

//   const result = await collection.findOneAndUpdate(
//     { _id: new ObjectId(params.id) },
//     { $set: body },
//     { returnDocument: 'after' }
//   );

//   if (!result || !result.value) {
//     return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
//   }

//   return NextResponse.json({ ...result.value, id: result.value._id.toString() });
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   const client = await clientPromise;
//   const db = client.db('contact');
//   const collection = db.collection('cards');

//   await collection.deleteOne({ _id: new ObjectId(params.id) });
//   return NextResponse.json({ success: true });
// }


// app/api/contacts/[id]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const updates = await req.json();

    const client = await clientPromise;
    const db = client.db('contactDB');
    const result = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ id, ...updates });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db('contactDB');
    const result = await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
