import React from 'react';

interface UserAvatarsProps {
  users: string[];
}

const UserAvatars = ({ users }: UserAvatarsProps) => {
  return (
    <div className="flex -space-x-2">
      {users.map((url, i) => (
        <img 
          key={i}
          src={url}
          alt={`User ${i + 1}`}
          className="w-8 h-8 rounded-full border-2 border-white hover:scale-110 transition-transform duration-200"
        />
      ))}
    </div>
  );
};

export default UserAvatars;