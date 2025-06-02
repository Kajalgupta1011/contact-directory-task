'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Contact, setContacts, addContact, updateContact, deleteContact, } from '@/lib/store/contactSlice';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ContactForm } from '@/components/contact-form';
import { ContactCard } from '@/components/contact-card';
import { Plus } from 'lucide-react';
import { RootState } from '@/lib/store/store';

interface CardData {
  id: string | number;
  name: string;
  designation: string;
  companyName: string;
  phone: string;
  email: string;
}

export default function Home() {
  const dispatch = useDispatch();
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (!response.ok) throw new Error('Failed to fetch contacts');
        const data: CardData[] = await response.json();
        const formattedContacts: Contact[] = data.map((card) => ({
          id: card.id.toString(),
          name: card.name,
          designation: card.designation,
          companyName: card.companyName,
          phone: card.phone,
          email: card.email,
        }));

        dispatch(setContacts(formattedContacts));
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchContacts();
  }, [dispatch]);
  //create contact
  const handleCreateContact = async (values: Omit<Contact, 'id'>) => {
    try {
      console.log('Creating contact with values:', JSON.stringify(values));
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Unknown error');
      }

      const data: CardData = await response.json();

      dispatch(
        addContact({
          id: data.id.toString(),
          name: data.name,
          designation: data.designation,
          companyName: data.companyName,
          phone: data.phone,
          email: data.email,
        })
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  // Update contact
  const handleUpdateContact = async (values: Omit<Contact, 'id'>) => {
    if (!editingContact) return;
    try {
      const response = await fetch(`/api/contacts/${editingContact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const responseBody = await response.json();
      if (!response.ok) throw new Error(responseBody?.error || 'Failed to update contact');

      const data: CardData = responseBody.data || responseBody;

      dispatch(
        updateContact({
          id: data.id.toString(),
          name: data.name,
          designation: data.designation,
          companyName: data.companyName,
          phone: data.phone,
          email: data.email,
        })
      );

      setEditingContact(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  // Delete contact
  const handleDeleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete contact');
      dispatch(deleteContact(id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Handle edit button click
  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Directory</h1>
          <Button
            onClick={() => {
              setEditingContact(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Contact
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={() => handleEditClick(contact)}
                onDelete={() => handleDeleteContact(contact.id)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">No contacts</div>
          )}
        </div>

        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditingContact(null);
            }
            setIsModalOpen(open);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingContact ? 'Edit Contact' : 'New Contact'}</DialogTitle>
              <DialogDescription>
                {editingContact
                  ? `Editing contact: ${editingContact.name || 'Unnamed'}`
                  : 'Fill the form to add a new contact.'}
              </DialogDescription>
            </DialogHeader>
            <ContactForm
              initialValues={editingContact || undefined}
              onSubmit={editingContact ? handleUpdateContact : handleCreateContact}
              onCancel={() => {
                setEditingContact(null);
                setIsModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>

  );
}
