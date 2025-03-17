'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Contact } from '@/lib/store/contactSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  designation: Yup.string().required('Designation is required'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

interface ContactFormProps {
  initialValues?: Contact;
  onSubmit: (values: Omit<Contact, 'id'>) => void;
  onCancel: () => void;
}

export function ContactForm({ initialValues, onSubmit, onCancel }: ContactFormProps) {
  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || '',
      designation: initialValues?.designation || '',
      phone: initialValues?.phone || '',
      email: initialValues?.email || '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...formik.getFieldProps('name')}
          className={formik.errors.name && formik.touched.name ? 'border-red-500' : ''}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-sm text-red-500">{formik.errors.name}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="designation">Designation</Label>
        <Input
          id="designation"
          {...formik.getFieldProps('designation')}
          className={formik.errors.designation && formik.touched.designation ? 'border-red-500' : ''}
        />
        {formik.touched.designation && formik.errors.designation && (
          <div className="text-sm text-red-500">{formik.errors.designation}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          {...formik.getFieldProps('phone')}
          className={formik.errors.phone && formik.touched.phone ? 'border-red-500' : ''}
        />
        {formik.touched.phone && formik.errors.phone && (
          <div className="text-sm text-red-500">{formik.errors.phone}</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...formik.getFieldProps('email')}
          className={formik.errors.email && formik.touched.email ? 'border-red-500' : ''}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-sm text-red-500">{formik.errors.email}</div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialValues ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}