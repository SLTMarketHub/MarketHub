import React from 'react';

export const PartnerPortalPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Partner Portal</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Partner Dashboard</h2>
        <p className="mb-4">This is the partner portal. Here you can manage your partnership and access partner resources.</p>
      </div>
    </div>
  );
};

export default PartnerPortalPage;
