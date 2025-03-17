'use client';

import { Contact } from '@/lib/store/contactSlice';
import { MoreVertical, Mail, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-4 right-4">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onEdit(contact)}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(contact.id)}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
          <p className="text-sm text-gray-600">{contact.designation}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{contact.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}