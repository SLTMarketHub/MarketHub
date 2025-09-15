import React from 'react';

export const HelpCenterPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <p className="mb-4">This is the help center page. Here you can find answers to common questions and get support.</p>
      </div>
    </div>
  );
};

export default HelpCenterPage;
