// src/features/chats/components/MessageList.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useGetMessagesForConversationQuery } from '../chatsAPI';
import MessageItem from './MessageItem';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../users/userSlice'; // Ensure this path is correct
import { ArrowDownCircle, Loader2, AlertTriangle } from 'lucide-react'; // Added Loader2, AlertTriangle

interface MessageListProps {
  conversationId: number;
}

const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const [offset, setOffset] = useState(0);
  const limit = 30; // Number of messages to fetch per page (was 20, common to use 30)

  const currentUserId = useSelector(selectCurrentUserId); // Get current user's ID

  const {
    data: messagesData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch // Added refetch for a manual "Try Again" button
  } = useGetMessagesForConversationQuery(
    {
      conversationId,
      requestingUserId: currentUserId as number, // Pass currentUserId as requestingUserId
      limit,
      offset,
    },
    {
      skip: currentUserId === null, // Skip query if currentUserId is not yet available
      // Note: `merge` logic is in the API slice.
      // refetchOnMountOrArgChange: true, // Fetches when conversationId or requestingUserId changes (already handled by RTK Query default behavior with arg changes)
    }
  );

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number | null>(null);

  // Scroll to bottom logic
  useEffect(() => {
    if (messagesContainerRef.current && initialLoad && messagesData && messagesData.length > 0 && !isFetching) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      setInitialLoad(false);
    } else if (messagesContainerRef.current && prevScrollHeight && !isFetching) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - prevScrollHeight;
      setPrevScrollHeight(null);
    }
  }, [messagesData, initialLoad, prevScrollHeight, isFetching]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      if (scrollTop === 0 && !isFetching && messagesData && messagesData.length >= (offset + limit)) {
        setPrevScrollHeight(scrollHeight);
        setOffset(prevOffset => prevOffset + limit);
      }
      setShowScrollToBottom(scrollHeight - scrollTop > clientHeight + 200);
    }
  };

  const scrollToBottom = () => {
    messagesContainerRef.current?.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

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
        className="h-full overflow-y-auto p-4 space-y-0.5 scroll-smooth" // Adjusted space-y for tighter packing if desired
      >
        {isFetching && offset > 0 && ( // Loading older messages indicator
          <div className="text-center py-3 text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading older messages...
          </div>
        )}
        {messagesData.map((msg, index) => {
          const prevMsg = messagesData[index - 1];
          // Show avatar/name if: no previous message, OR different sender, OR time gap > 5 mins
          const showAvatarAndName =
            !prevMsg ||
            prevMsg.sender_id !== msg.sender_id ||
            (new Date(msg.sent_at).getTime() - new Date(prevMsg.sent_at).getTime()) > 5 * 60 * 1000;

          return (
            <MessageItem
              key={`${msg.message_id}-${index}`} // Use index for temp stability if message_id isn't unique during optimistic updates
              message={msg}
              isOwnMessage={msg.sender_id === currentUserId} // currentUserId is now guaranteed to be a number here or skipped
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