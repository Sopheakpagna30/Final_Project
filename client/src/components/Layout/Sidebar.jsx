import React from 'react';
import { MessageCircle, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();

  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-4">
      {/* User Avatar */}
      <div className="relative mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {user?.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
          connected ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col space-y-4">
        <button className="p-3 text-blue-400 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-colors">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
          <User className="w-5 h-5" />
        </button>
        <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Sidebar;
