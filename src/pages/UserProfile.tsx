
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from '@/components/user/UserProfile';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="mb-8">
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
