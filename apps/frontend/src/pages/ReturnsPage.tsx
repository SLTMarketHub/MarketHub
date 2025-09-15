import React from 'react';

export const ReturnsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Returns & Refunds</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
        <p className="mb-4">This is the returns page. Here you can find information about our return policy and process returns.</p>
      </div>
    </div>
  );
};

export default ReturnsPage;
