import React, { useState, useEffect } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  const { user } = useAuth();

  useEffect(() => {
    const filtered = conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [conversations, searchTerm]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chats</h2>
          <button
            onClick={onCreateConversation}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-sm">Create a new conversation to get started</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors ${
                selectedConversation?._id === conversation._id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-r-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-lg">
                    {conversation.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {conversation.name}
                    </h3>
                    {conversation.updatedAt && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(conversation.updatedAt)}
                      </span>
                    )}
                  </div>
                  
                  {conversation.lastMessage ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {conversation.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-1">
                      No messages yet
                    </p>
                  )}

                  {/* Delete button */}
                  <div className="flex items-center mt-2 justify-between">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-400">
                        {conversation.participants.length} members
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation._id);
                      }}
                      className="text-xs text-red-500 hover:text-red-700 transition ml-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
