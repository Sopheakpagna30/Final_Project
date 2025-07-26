import React, { useEffect, useRef } from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getYoutubeThumbnail } from '../../utils/getYoutubeThumbnail';

const MessageList = ({ messages, loading }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Start the conversation by sending a message</p>
        </div>
      </div>
    );
  }

  let lastDate = '';

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const messageDate = formatDate(message.createdAt);
        const showDate = messageDate !== lastDate;
        lastDate = messageDate;

        const isOwn = message.sender.id === user?.id;
        const showAvatar = !isOwn && (index === 0 || messages[index - 1].sender.id !== message.sender.id);
        const thumbnail = getYoutubeThumbnail(message.content);

        return (
          <div key={message._id}>
            {showDate && (
              <div className="text-center my-4">
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm">
                  {messageDate}
                </span>
              </div>
            )}

            <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
              <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
                {showAvatar && !isOwn && (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {message.sender.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className={`${isOwn ? 'ml-2' : 'mr-2'} flex flex-col`}>
                  {!isOwn && showAvatar && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-3">
                      {message.sender.username}
                    </span>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl w-fit ${
                      isOwn
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                    }`}
                  >
                    {/* Show thumbnail if it's a YouTube link */}
                    {thumbnail ? (
                      <a href={message.content} target="_blank" rel="noopener noreferrer" className="block">
                        <img
                          src={thumbnail}
                          alt="YouTube Thumbnail"
                          className="rounded-lg mb-1 w-64 h-auto"
                        />
                        <p className="text-xs underline">Watch on YouTube</p>
                      </a>
                    ) : (
                      <p className="text-sm break-words">{message.content}</p>
                    )}
                  </div>

                  <div className={`flex items-center mt-1 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(message.createdAt)}
                    </span>
                    {isOwn && (
                      <div className="text-gray-500 dark:text-gray-400">
                        {message.readBy && message.readBy.length > 1 ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
