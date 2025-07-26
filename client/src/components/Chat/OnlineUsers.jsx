import React from 'react';
import { Users, Circle } from 'lucide-react';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

const OnlineUsers = () => {
  const { onlineUsers, connected } = useSocket();
  const { user } = useAuth();

  const otherUsers = onlineUsers.filter(u => u.id !== user?.id);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Online
        </h3>
        <div className="flex items-center space-x-2">
          <Circle className={`w-3 h-3 ${connected ? 'text-green-500 fill-current' : 'text-red-500 fill-current'}`} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {otherUsers.map((onlineUser) => (
          <div
            key={onlineUser.id}
            className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {onlineUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {onlineUser.username}
              </p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
        ))}

        {otherUsers.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No other users online</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineUsers;
