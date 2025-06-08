// src/features/chats/components/ConversationList.tsx
import React, { useState } from 'react';
import { useGetUserConversationsQuery } from '../chatsAPI';
import ConversationListItem from './ConversationListItem';
import { PlusCircle, Search, Loader2, AlertTriangle } from 'lucide-react'; 
import { useSelector } from 'react-redux'; 
import { selectCurrentUserId } from '../../users/userSlice'; 

interface ConversationListProps {
  selectedConversationId: number | null;
  onSelectConversation: (conversationId: number) => void;
  onStartNewConversation: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversationId,
  onSelectConversation,
  onStartNewConversation
}) => {
  const currentUserId = useSelector(selectCurrentUserId); // Get current user's ID

  const {
    data: conversations,
    isLoading,
    isError,
    error,
    refetch,
    
  } = useGetUserConversationsQuery(
    currentUserId as number, // Pass the userId as an argument
    {
      skip: currentUserId === null, // Skip the query if userId is not yet available
       pollingInterval: 30000,
      refetchOnFocus: true,
     refetchOnReconnect: true,
    }
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Define a type for participant (can be kept as is or refined based on actual Conversation type)
  type Participant = {
    user?: { full_name: string | null | undefined };
    full_name?: string | null | undefined;
  };

  const filteredConversations = conversations?.filter(convo => {
    const title = convo.title || '';
    const participants = convo.participants
      ?.map((p: Participant) => {
        if (p.user && typeof p.user === 'object' && 'full_name' in p.user && p.user.full_name) {
          return p.user.full_name;
        }
        if ('full_name' in p && p.full_name) {
          return p.full_name;
        }
        return '';
      })
      .join(' ');
    const lastMessage = convo.last_message_content_preview || '';
    const contentToSearch = `${title} ${participants} ${lastMessage}`.toLowerCase();
    return contentToSearch.includes(searchTerm.toLowerCase());
  });

  let content;

  if (currentUserId === null) {
    // This case should ideally not happen if ChatPageLayout correctly gates access
    content = <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">Authenticating...</div>;
  } else if (isLoading) {
    content = (
      <div className="p-4 text-center text-neutral-500 dark:text-neutral-400 flex items-center justify-center">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Loading conversations...
      </div>
    );
  } else if (isError) {
    type APIError = {
      data?: { error?: string };
      message?: string;
    };
    const apiError = error as APIError;
    const errorMessage =
      apiError?.data?.error || apiError?.message || 'Failed to load conversations';
    content = (
      <div className="p-4 text-center text-red-500 dark:text-red-400 flex flex-col items-center justify-center">
        <AlertTriangle className="w-6 h-6 mb-2" />
        Error: {errorMessage}
        <button onClick={() => refetch()} className="mt-2 text-blue-500 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-200">
          Try again
        </button>
      </div>
    );
  } else if (!filteredConversations || filteredConversations.length === 0) {
    content = (
      <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
        {searchTerm ? `No conversations found for "${searchTerm}".` : "No conversations yet. Start a new one!"}
      </div>
    );
  } else {
    content = filteredConversations.map((convo) => (
      <ConversationListItem
        key={convo.conversation_id}
        conversation={convo}
        isSelected={selectedConversationId === convo.conversation_id}
        onSelect={onSelectConversation}
      />
    ));
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Chats</h2>
          <button
            onClick={onStartNewConversation}
            className="p-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            title="New Conversation"
            disabled={currentUserId === null} // Disable if no user ID
          >
            <PlusCircle className="w-7 h-7" />
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-neutral-100"
            disabled={currentUserId === null || isLoading} // Disable search while loading or no user
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {content}
      </div>
    </div>
  );
};
export default ConversationList;