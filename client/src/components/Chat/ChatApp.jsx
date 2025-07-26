import React, { useState, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

import Sidebar from '../Layout/Sidebar';
import ConversationList from './ConversationList';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import OnlineUsers from './OnlineUsers';
import CreateConversation from './CreateConversation';
import TypingIndicator from './TypingIndicator';
import UserList from './UserList';

const ChatApp = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showCreateConversation, setShowCreateConversation] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const { socket } = useSocket();
  const { token, user } = useAuth();

  useEffect(() => {
    loadConversations();
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.conversationId === selectedConversation?._id) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedConversation]);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    socket?.emit('joinConversation', conv._id);

    try {
      const res = await fetch(`/api/messages/conversations/${conv._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const msgs = await res.json();
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    const confirmed = window.confirm('Are you sure you want to delete this conversation?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/messages/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setConversations(prev => prev.filter(conv => conv._id !== conversationId));
        if (selectedConversation?._id === conversationId) {
          setSelectedConversation(null);
          setMessages([]);
        }
      } else {
        console.error('Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !socket) return;

    try {
      const res = await fetch(`/api/messages/conversations/${selectedConversation._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      const message = await res.json();
      setMessages(prev => [...prev, message]);

      socket.emit('sendMessage', {
        conversationId: selectedConversation._id,
        content
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (isTyping) => {
    if (!selectedConversation || !socket) return;

    socket.emit('typing', {
      conversationId: selectedConversation._id,
      isTyping
    });
  };

  const handleCreateConversation = async (name, description, participants) => {
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, participants })
      });

      const newConversation = await res.json();
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      setShowCreateConversation(false);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleStartChat = async (targetUser) => {
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `${user?.username}-${targetUser.username}`,
          description: '',
          participants: [targetUser._id]
        })
      });

      const conversation = await res.json();
      setConversations(prev => [conversation, ...prev]);
      setSelectedConversation(conversation);
      setShowUserList(false);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex relative">
      <Sidebar />

      <div className="absolute top-4 left-20 z-40">
        <button
          onClick={() => setShowUserList(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Start Chat
        </button>
      </div>

      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={() => setShowCreateConversation(true)}
        onDeleteConversation={handleDeleteConversation}
      />

      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader conversation={selectedConversation} />
          <MessageList messages={messages} loading={messagesLoading} />
          <TypingIndicator conversationId={selectedConversation._id} />
          <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-4xl font-bold">💬</span>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      )}

      <OnlineUsers />

      {showCreateConversation && (
        <CreateConversation
          onClose={() => setShowCreateConversation(false)}
          onCreateConversation={handleCreateConversation}
        />
      )}

      {showUserList && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-[350px] max-h-[80vh] overflow-y-auto">
            <UserList onStartChat={handleStartChat} />
            <button
              onClick={() => setShowUserList(false)}
              className="mt-4 text-red-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
