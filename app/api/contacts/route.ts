
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {uri} from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // await mongoose.connect (uri);
    // return NextResponse.json({ message: 'Connected to MongoDB successfully' });
    const client = await clientPromise;
    const db = client.db('contactDB');
    const collection = db.collection('contacts');
    const contacts = await collection.find({}).toArray();

    return NextResponse.json(
      contacts.map((contact) => ({
        ...contact,
        id: contact._id.toString(),
      }))
    );
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('POST body:', body);

    const requiredFields = ['name', 'email', 'phone', 'designation', 'companyName'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const client = await clientPromise;
    const db = client.db('contactDB');
    const collection = db.collection('contacts');

    const result = await collection.insertOne(body);
    console.log('✅ Inserted:', result.insertedId.toString());

    return NextResponse.json({
      ...body,
      id: result.insertedId.toString(),
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error inserting contact:', error);
    return NextResponse.json({ error: 'Failed to insert contact' }, { status: 500 });
  }
}