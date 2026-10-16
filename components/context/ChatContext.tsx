'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ChatContextType = {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  /** A message waiting to be sent to Alfred as soon as the chat opens. */
  pendingMessage: string | null;
  /** Opens Alfred's chat and sends `message` on the visitor's behalf. */
  askAlfred: (message: string) => void;
  clearPendingMessage: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen((open) => !open);

  const askAlfred = useCallback((message: string) => {
    setPendingMessage(message);
    setIsOpen(true);
  }, []);

  const clearPendingMessage = useCallback(() => setPendingMessage(null), []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        pendingMessage,
        askAlfred,
        clearPendingMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
