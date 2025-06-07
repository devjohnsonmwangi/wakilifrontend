// src/features/chats/components/MessageList.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useGetMessagesForConversationQuery } from '../chatsAPI';
import MessageItem from './MessageItem';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../users/userSlice';
import { ArrowDownCircle, Loader2, AlertTriangle } from 'lucide-react';

interface MessageListProps {
  conversationId: number;
}

const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const [offset, setOffset] = useState(0);
  const limit = 30;

  const currentUserId = useSelector(selectCurrentUserId);

  // --- START OF CHANGES ---
  const {
    data: messagesData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetMessagesForConversationQuery(
    {
      conversationId,
      requestingUserId: currentUserId as number,
      limit,
      offset,
    },
    {
      skip: currentUserId === null,
      // Add this line to automatically refresh messages every 3 seconds
      pollingInterval: 3000, 
    }
  );
  // --- END OF CHANGES ---


  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | null>(null);

  // Scroll to bottom logic
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if user is scrolled near the bottom before auto-scrolling
    const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

    if (initialLoad && messagesData && messagesData.length > 0 && !isFetching) {
      // On initial load, always jump to the bottom
      container.scrollTop = container.scrollHeight;
      setInitialLoad(false);
    } else if (prevScrollHeight && !isFetching) {
      // When loading older messages, restore scroll position
      container.scrollTop = container.scrollHeight - prevScrollHeight;
      setPrevScrollHeight(null);
    } else if (isScrolledToBottom && !isFetching) {
      // NEW: For polled updates, only scroll if the user is already near the bottom
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messagesData, initialLoad, prevScrollHeight, isFetching]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Load more messages when user scrolls to the top
      if (scrollTop === 0 && !isFetching && messagesData && messagesData.length >= (offset + limit)) {
        setPrevScrollHeight(scrollHeight);
        setOffset(prevOffset => prevOffset + limit);
      }
      // Show/hide the "Scroll to Bottom" button
      setShowScrollToBottom(scrollHeight - scrollTop > clientHeight + 200);
    }
  };

  const scrollToBottom = () => {
    messagesContainerRef.current?.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: 'smooth' });
  };
  
  // (The rest of your component's JSX remains exactly the same)
  // ...
  // Enhanced Loading/Error/Empty States
  if (currentUserId === null) {
    return (
      <div className="flex-1 p-4 text-center text-neutral-500 dark:text-neutral-400 flex items-center justify-center">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Authenticating...
      </div>
    );
  }

  if (isLoading && offset === 0) { // Initial load
    return (
      <div className="flex-1 p-4 text-center text-neutral-500 dark:text-neutral-400 flex items-center justify-center">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Loading messages...
      </div>
    );
  }

  if (isError) {
    interface FetchError { data?: { error?: string }; status?: number; error?: string; [key: string]: unknown; }
    const fetchError = error as FetchError;
    const errorMessage = fetchError?.data?.error || fetchError?.error || 'Failed to load messages.';
    return (
      <div className="flex-1 p-4 text-center text-red-500 dark:text-red-400 flex flex-col items-center justify-center">
        <AlertTriangle className="w-6 h-6 mb-2" />
        Error: {errorMessage}
        <button onClick={() => refetch()} className="mt-2 text-blue-500 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-200">
          Try again
        </button>
      </div>
    );
  }

  if (!messagesData || messagesData.length === 0) {
    return (
      <div className="flex-1 p-4 text-center text-neutral-500 dark:text-neutral-400">
        No messages yet. Be the first to say hi! 👋
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto p-4 space-y-0.5 scroll-smooth"
      >
        {isFetching && offset > 0 && (
          <div className="text-center py-3 text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading older messages...
          </div>
        )}
        {messagesData.map((msg, index) => {
          const prevMsg = messagesData[index - 1];
          const showAvatarAndName =
            !prevMsg ||
            prevMsg.sender_id !== msg.sender_id ||
            (new Date(msg.sent_at).getTime() - new Date(prevMsg.sent_at).getTime()) > 5 * 60 * 1000;

          return (
            <MessageItem
              key={`${msg.message_id}-${index}`}
              message={msg}
              isOwnMessage={msg.sender_id === currentUserId}
              showAvatarAndName={showAvatarAndName}
            />
          );
        })}
      </div>
      {showScrollToBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-6 right-6 bg-blue-500 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          title="Scroll to bottom"
        >
          <ArrowDownCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default MessageList;