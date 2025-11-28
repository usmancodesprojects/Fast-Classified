import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import api from '../api';

function Messages({ user }) {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8000';
    const newSocket = io(socketUrl, {
      query: { token: localStorage.getItem('token') },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });

    newSocket.on('new_message', (message) => {
      if (selectedChat && message.conversation_id === selectedChat.id) {
        setMessages(prev => [...prev, message.data]);
      }
      // Refresh conversations to update last message
      fetchConversations();
    });

    newSocket.on('typing', ({ conversation_id, user_id, is_typing }) => {
      if (selectedChat && conversation_id === selectedChat.id) {
        setTypingUser(is_typing ? user_id : null);
      }
    });

    newSocket.on('online_status', ({ user_id, is_online }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (is_online) {
          newSet.add(user_id);
        } else {
          newSet.delete(user_id);
        }
        return newSet;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [selectedChat]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchMessages = async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(response.data.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const otherParticipantId = selectedChat.participant_1_id === user.id 
        ? selectedChat.participant_2_id 
        : selectedChat.participant_1_id;

      const response = await api.post('/messages', {
        receiver_id: otherParticipantId,
        content: newMessage
      });

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      // Stop typing indicator
      if (socket) {
        socket.emit('typing', {
          conversation_id: selectedChat.id,
          is_typing: false,
          receiver_id: otherParticipantId
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedChat) return;

    const otherParticipantId = selectedChat.participant_1_id === user.id 
      ? selectedChat.participant_2_id 
      : selectedChat.participant_1_id;

    // Send typing indicator
    socket.emit('typing', {
      conversation_id: selectedChat.id,
      is_typing: true,
      receiver_id: otherParticipantId
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        conversation_id: selectedChat.id,
        is_typing: false,
        receiver_id: otherParticipantId
      });
    }, 2000);
  };

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
    }
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)]">
        <Navbar user={user} />
        <div className="flex items-center justify-center py-20">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-upwork overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-[var(--color-border)] flex flex-col">
              <div className="p-4 border-b border-[var(--color-border)]">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Messages</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-[var(--color-text-secondary)]">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedChat(conv)}
                      className={`p-4 border-b border-[var(--color-border)] cursor-pointer transition-all hover:bg-[var(--color-bg-secondary)] ${
                        selectedChat?.id === conv.id ? 'bg-[var(--color-primary-light)]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="avatar">
                            {conv.other_participant_name?.charAt(0) || '?'}
                          </div>
                          {onlineUsers.has(conv.participant_1_id === user.id ? conv.participant_2_id : conv.participant_1_id) && (
                            <div className="absolute bottom-0 right-0 status-online"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                              {conv.other_participant_name || 'Unknown User'}
                            </h3>
                            <span className="text-xs text-[var(--color-text-secondary)]">
                              {formatDate(conv.last_message_at)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-[var(--color-text-secondary)] truncate">
                              {conv.last_message || 'No messages yet'}
                            </p>
                            {conv.unread_count > 0 && (
                              <span className="bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded-full">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-3">
                    <div className="relative">
                      <div className="avatar">
                        {selectedChat.other_participant_name?.charAt(0) || '?'}
                      </div>
                      {onlineUsers.has(selectedChat.participant_1_id === user.id ? selectedChat.participant_2_id : selectedChat.participant_1_id) && (
                        <div className="absolute bottom-0 right-0 status-online"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)]">
                        {selectedChat.other_participant_name || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {onlineUsers.has(selectedChat.participant_1_id === user.id ? selectedChat.participant_2_id : selectedChat.participant_1_id) 
                          ? 'Online' 
                          : 'Offline'}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => {
                      const isOwn = message.sender_id === user.id;
                      const showDate = index === 0 || 
                        formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="bg-[var(--color-bg-secondary)] px-3 py-1 rounded-full text-sm text-[var(--color-text-secondary)]">
                                {formatDate(message.created_at)}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  isOwn
                                    ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-bl-md'
                                }`}
                              >
                                <p>{message.content}</p>
                              </div>
                              <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-xs text-[var(--color-text-secondary)]">
                                  {formatTime(message.created_at)}
                                </span>
                                {isOwn && message.is_read && (
                                  <span className="text-xs text-[var(--color-primary)]">✓✓</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {typingUser && (
                      <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-[var(--color-text-secondary)] rounded-full animate-pulse"></span>
                          <span className="w-2 h-2 bg-[var(--color-text-secondary)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2 h-2 bg-[var(--color-text-secondary)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                        <span className="text-sm">typing...</span>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="p-4 border-t border-[var(--color-border)]">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        className="input-field flex-1"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="btn-primary px-6"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[var(--color-text-secondary)]">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                    <p>Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;

