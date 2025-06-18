
import React from 'react';
import { PasswordMigration } from '@/components/admin/PasswordMigration';
import { MainLayout } from '@/components/layout/MainLayout';

const AdminUtils = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Utilities</h1>
        <div className="grid gap-6">
          <PasswordMigration />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminUtils;
