import React, { useState } from 'react';

const Message = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Instructor',
      content: 'Hello! How can I help you with the course?',
      timestamp: '2024-02-20T10:00:00',
      status: 'read'
    },
    {
      id: 2,
      sender: 'You',
      content: 'I have a question about the last lecture.',
      timestamp: '2024-02-20T10:05:00',
      status: 'read'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Messages Header */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Messages</h1>
          </div>

          {/* Messages List */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'You'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">{message.sender}</div>
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Message; 