import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Paperclip, MinusCircle } from 'lucide-react';
import clsx from 'clsx';

interface ChatWidgetProps {
  isVisible: boolean;
  onClose?: () => void;
  mode?: 'chat' | 'voice';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isVisible, onClose, mode = 'chat' }) => {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      text: string;
      sender: 'user' | 'ai';
      timestamp: Date;
    }>
  >([
    {
      id: 1,
      text: `Hello! I'm your ${mode === 'chat' ? 'chat' : 'voice'} assistant. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  // Handler for sending a message
  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);
    // Simulate AI reply after 1 second
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: "I understand you're interested in our AI solutions. How can I assist you further?",
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }, 1000);
    setMessage('');
  }, [message]);

  // Handle pressing Enter key in the input
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    },
    [handleSend]
  );

  // Reset minimized state when widget is hidden
  useEffect(() => {
    if (!isVisible) {
      setIsMinimized(false);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Chat Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? 'auto' : 600,
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-[400px] max-h-[90vh]"
          >
            <div className="relative w-full bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="h-16 bg-gray-900/50 border-b border-gray-800/50 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    {mode === 'chat' ? (
                      <span className="text-white font-semibold">AI</span>
                    ) : (
                      <Mic className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">AI Assistant</h3>
                    <p className="text-gray-400 text-sm">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-gray-700/50 transition-colors"
                  >
                    <MinusCircle className="w-4 h-4 text-gray-400" />
                  </motion.button>
                  {onClose && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-gray-700/50 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Messages */}
                    <div className="h-[440px] overflow-y-auto p-4 space-y-4">
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={clsx('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={clsx(
                              'max-w-[80%] rounded-2xl p-3',
                              msg.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-800/50 text-gray-100'
                            )}
                          >
                            <p>{msg.text}</p>
                            <p className="text-xs opacity-50 mt-1">
                              {msg.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </motion.div>
                        </div>
                      ))}
                    </div>

                    {/* Input Area */}
                    <div className="h-20 bg-gray-900/50 border-t border-gray-800/50 p-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
                        >
                          <Paperclip className="w-5 h-5 text-gray-400" />
                        </motion.button>
                        <input
                          type="text"
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={mode === 'chat' ? 'Type your message...' : 'Type or speak...'}
                          className="flex-1 bg-gray-800/50 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                        {mode === 'voice' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
                          >
                            <Mic className="w-5 h-5 text-gray-400" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleSend}
                          className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors"
                        >
                          <Send className="w-5 h-5 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ChatWidget);
