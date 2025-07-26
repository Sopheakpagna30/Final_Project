import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserList = ({ onStartChat }) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold text-gray-200">Start New Chat</h2>
      {users.map(user => (
        <button
          key={user.id}
          onClick={() => onStartChat(user)}
          className="block w-full text-left p-2 bg-gray-800 rounded hover:bg-gray-700 text-white"
        >
          {user.username}
        </button>
      ))}
    </div>
  );
};

export default UserList;
