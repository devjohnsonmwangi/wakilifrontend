// src/pages/ChatPage.tsx
import React from 'react';
import ChatPageLayout from '../features/chats/components/ChatPageLayout'; // Path to your layout

const ChatPage: React.FC = () => {
  return (
    // You can add any page-specific wrappers or context providers here if needed
    <ChatPageLayout />
  );
};

export default ChatPage;