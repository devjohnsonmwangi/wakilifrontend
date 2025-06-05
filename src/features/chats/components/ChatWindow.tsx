// src/features/chats/components/ChatWindow.tsx
import React, { useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatWindowHeader from './ChatWindowHeader';
import { useMarkConversationAsReadMutation, useGetUserConversationsQuery } from '../chatsAPI';
import { useSelector } from 'react-redux'; // Import useSelector
import { selectCurrentUserId } from '../../users/userSlice'; // Import your selector
import { Loader2, AlertTriangle } from 'lucide-react'; // For better loading/error states

interface ChatWindowProps {
  conversationId: number;
  onBack?: () => void; // For mobile view
  // currentUserId: number; // No longer needed as prop, will get from Redux
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onBack }) => {
  const currentUserId = useSelector(selectCurrentUserId); // Get current user's ID from Redux

  const [markAsRead] = useMarkConversationAsReadMutation();

  // Fetch conversations for the current user to find details about the currentConversation
  const {
    data: conversations,
    isLoading: isLoadingConversations,
    // isError: isErrorConversations, // Can be used for more specific error handling
    // error: errorConversations, // Can be used for more specific error handling
  } = useGetUserConversationsQuery(
    currentUserId as number, // Pass currentUserId
    {
      skip: currentUserId === null, // Skip if userId is not available
    }
  );

  const currentConversation = conversations?.find(c => c.conversation_id === conversationId);

  useEffect(() => {
    // Ensure currentUserId is available before attempting to mark as read
    if (
      typeof currentUserId === 'number' &&
      typeof conversationId === 'number' &&
      currentConversation &&
      (currentConversation.unread_count || 0) > 0
    ) {
      markAsRead({ conversationId, userId: currentUserId })
        .unwrap()
        .catch(err => console.error("Failed to mark as read:", err));
    }
  }, [conversationId, markAsRead, currentConversation, currentUserId]);

  // Handle loading and error states
  if (currentUserId === null) {
    // This state should ideally be brief or handled by a higher-level auth guard
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

  if (!currentConversation && !isLoadingConversations) { // Conversations loaded, but specific one not found
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

  // If currentConversation is still undefined here but isLoadingConversations is false,
  // it means the find operation failed after successful fetch. This is covered by the above.
  // If currentConversation is available, render the chat.
  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900">
      <ChatWindowHeader conversation={currentConversation} onBack={onBack} />
      {/*
        MessageList and MessageInput will need currentUserId.
        It's better if they fetch it themselves via useSelector for better component independence,
        unless there's a strong reason to pass it down (e.g., if the ID could change dynamically
        for these components in a way ChatWindow controls, which is unlikely here).

        Assuming MessageList and MessageInput will also use useSelector(selectCurrentUserId):
      */}
      <MessageList conversationId={conversationId} />
      <MessageInput conversationId={conversationId} />
    </div>
  );
};

export default ChatWindow;