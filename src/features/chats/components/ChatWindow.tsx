// src/features/chats/components/ChatWindow.tsx
import React, { useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatWindowHeader from './ChatWindowHeader';
import { useMarkConversationAsReadMutation, useGetUserConversationsQuery } from '../chatsAPI';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../users/userSlice';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ChatWindowProps {
  conversationId: number;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack }) => {
  const currentUserId = useSelector(selectCurrentUserId);

  const [markAsRead] = useMarkConversationAsReadMutation();

  // Fetch conversations to find details for the current one
  const {
    data: conversations,
    isLoading: isLoadingConversations,
  } = useGetUserConversationsQuery(
    currentUserId as number,
    {
      skip: currentUserId === null,
      //  polling to automatically refresh conversation details (e.g., title)
      // A longer interval is fine here as this data changes infrequently.
      pollingInterval: 15000, // Refresh every 15 seconds
    }
  );

  const currentConversation = conversations?.find(c => c.conversation_id === conversationId);

  useEffect(() => {
    if (
      typeof currentUserId === 'number' &&
      typeof conversationId === 'number' &&
      currentConversation &&
      (currentConversation.unread_count || 0) > 0
    ) {
      markAsRead({ conversation_id: conversationId, user_id: currentUserId })
        .unwrap()
        .catch(err => console.error("Failed to mark as read:", err));
    }
  }, [conversationId, markAsRead, currentConversation, currentUserId]);

  // Handle loading and error states 
  if (currentUserId === null) {
    return (
      <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900">
        <ChatWindowHeader conversation={undefined} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-neutral-500 dark:text-neutral-400 flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Authenticating user...
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingConversations) {
    return (
      <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900">
        <ChatWindowHeader conversation={undefined} onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-neutral-500 dark:text-neutral-400 flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading chat details...
          </div>
        </div>
      </div>
    );
  }

  if (!currentConversation && !isLoadingConversations) {
    return (
      <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900">
        <ChatWindowHeader conversation={undefined} onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
          <h3 className="text-lg font-semibold text-red-500 dark:text-red-400">Conversation Not Found</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            The selected conversation could not be loaded or you may not have access to it.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900">
      <ChatWindowHeader conversation={currentConversation} onBack={onBack} />
      {/* The MessageList component  handles its own data fetching and refreshing */}
      <MessageList conversationId={conversationId} />
      <MessageInput conversationId={conversationId} />
    </div>
  );
};

export default ChatWindow;