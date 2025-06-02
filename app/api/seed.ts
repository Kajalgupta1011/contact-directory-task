// pages/api/seed.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;

    // ✅ Set your actual DB name here
    const db = client.db('your_database_name'); // replace this

    const contactsCollection = db.collection('contacts');

    // Optional: remove existing data
    await contactsCollection.deleteMany({});

    // Demo data
    const demoContacts = [
      {
        name: 'Alice Johnson',
        designation: 'Software Engineer',
        companyName: 'TechCorp',
        phone: '1234567890',
        email: 'alice@techcorp.com',
      },
      {
        name: 'Bob Smith',
        designation: 'Product Manager',
        companyName: 'BizWorks',
        phone: '9876543210',
        email: 'bob@bizworks.com',
      },
    ];

    const result = await contactsCollection.insertMany(demoContacts);

    res.status(200).json({ message: 'Inserted demo contacts', count: result.insertedCount });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ error: 'Failed to insert demo contacts' });
  }
}
