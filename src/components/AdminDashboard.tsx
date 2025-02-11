import React from 'react';

export function AdminDashboard() {

  return (
    <div className="container mx-auto px-4 py-16 text-white">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
      <div className="mb-4">
        <p>
          To upload videos, please place them directly into the <code>videos</code> folder in the project root.
          These videos will then be accessible and listed in the dashboard.
        </p>
      </div>
    </div>
  );
}
