// src/features/chats/components/ChatPageLayout.tsx
import React, { useState } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import NewConversationModal from './NewConversationModal';
import { useSelector } from 'react-redux';
// Make sure selectCurrentUserId is exported from your userSlice
import { selectIsAuthenticated, selectCurrentUserId } from '../../users/userSlice'; // Added selectCurrentUserId
import { Navigate } from 'react-router-dom';
import { MessageSquare, PlusCircle } from 'lucide-react';
// import { RootState } from '../../app/store'; // Not needed directly in component if selectors are well-defined

const ChatPageLayout: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [isNewConvoModalOpen, setIsNewConvoModalOpen] = useState(false);
  const [showConversationListMobile, setShowConversationListMobile] = useState(true);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUserId = useSelector(selectCurrentUserId); // Get the current user's ID

  // If using react-router, redirect if not authenticated
  // Also, if authenticated but currentUserId is somehow null, it might indicate an issue.
  // However, if isAuthenticated is true, currentUserId should ideally be a number.
  if (!isAuthenticated || currentUserId === null) { // Added check for currentUserId
    // If currentUserId is null while authenticated, it might be a state inconsistency.
    // For now, redirecting to login. You might want to handle this differently (e.g., show error, force logout).
    console.warn("ChatPageLayout: Not authenticated or currentUserId is null. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setShowConversationListMobile(false);
  };

  const handleBackToConversations = () => {
    setSelectedConversationId(null);
    setShowConversationListMobile(true);
  };

  const handleStartNewConversation = () => {
    // Ensure we have a user ID before opening the modal that requires it
    if (currentUserId !== null) {
      setIsNewConvoModalOpen(true);
    } else {
      console.error("Cannot start new conversation: currentUserId is null.");
      // Optionally, show a user-facing error or redirect
    }
  };

  const handleCloseNewConvoModal = (createdConversationId?: number) => {
    setIsNewConvoModalOpen(false);
    if (createdConversationId) {
        handleSelectConversation(createdConversationId);
    }
  };


  return (
    <div className="flex h-screen antialiased text-neutral-800 dark:text-neutral-200 overflow-hidden">
      <div className={`
        flex-shrink-0 w-full md:w-80 lg:w-96
        transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${showConversationListMobile || !selectedConversationId ? 'translate-x-0' : '-translate-x-full'}
        absolute md:static h-full z-20 md:z-auto
      `}>
        <ConversationList
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onStartNewConversation={handleStartNewConversation}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <ChatWindow
            conversationId={selectedConversationId}
            onBack={handleBackToConversations}
            // If ChatWindow also needs currentUserId, pass it here:
            // currentUserId={currentUserId}
          />
        ) : (
          <div className={`
            flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900
            ${showConversationListMobile ? 'hidden md:flex' : 'flex'}
          `}>
            <div className="text-center p-8">
              <MessageSquare
                className="mx-auto h-16 w-16 text-neutral-400"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">Select a conversation</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Or start a new one to begin chatting with your colleagues or clients.</p>
              <button
                onClick={handleStartNewConversation}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
      {isNewConvoModalOpen && typeof currentUserId === 'number' && ( // Ensure currentUserId is a number before rendering
        <NewConversationModal
          isOpen={isNewConvoModalOpen}
          onClose={handleCloseNewConvoModal}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default ChatPageLayout;