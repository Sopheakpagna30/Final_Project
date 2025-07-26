import React from 'react';
import { useSocket } from '../../contexts/SocketContext';

const TypingIndicator = ({ conversationId }) => {
  const { typingUsers } = useSocket();

  const typingInThisConversation = typingUsers.filter(user => user.isTyping && user.conversationId === conversationId);

  if (typingInThisConversation.length === 0) {
    return null;
  }

  const names = typingInThisConversation.map(user => user.username);
  let text = '';

  if (names.length === 1) {
    text = `${names[0]} is typing...`;
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing...`;
  } else {
    text = `${names[0]} and ${names.length - 1} others are typing...`;
  }

  return (
    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
