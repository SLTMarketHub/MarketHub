import React from 'react';

export const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
        <p className="mb-4">This is the contact page. Here you can find our contact information and send us a message.</p>
      </div>
    </div>
  );
};

export default ContactPage;
