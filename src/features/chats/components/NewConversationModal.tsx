// src/features/chats/components/NewConversationModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'; // Using specific imports
import { X, UserPlus, Users, Search, Loader2, AlertTriangle } from 'lucide-react';
import { useCreateConversationMutation, useFindOrCreateOneOnOneConversationMutation } from '../chatsAPI';
import UserAvatar from './UserAvatar';

import {
  useFetchUsersQuery,
  UserApiResponse,
} from '../../users/usersAPI';


function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: (createdConversationId?: number) => void;
  currentUserId: number; // This prop is crucial
}

function getApiErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null) {
    if ('data' in error && typeof (error as { data?: { error?: string } }).data === 'object') {
      const data = (error as { data?: { error?: string } }).data;
      if (data && typeof data.error === 'string') {
        return data.error;
      }
    }
    if ('message' in error && typeof (error as { message?: string }).message === 'string') {
      return (error as { message?: string }).message;
    }
    // Add more specific error shapes from RTK Query if needed
    if ('status' in error && 'error' in error) { // Standard RTK Query error shape
        const rtkError = error as { status: number | string, error: string };
        return `${rtkError.status}: ${rtkError.error}`;
    }
  }
  return undefined;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({ isOpen, onClose, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserApiResponse[]>([]);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 300);

  const {
    data: allUsers,
    isLoading: isLoadingAllUsers,
    error: fetchAllUsersError,
  } = useFetchUsersQuery();


  const [createConversation, { isLoading: isCreatingConversation, error: createApiError }] = useCreateConversationMutation();
  const [findOrCreateOneOnOne, { isLoading: isFindingOrCreating, error: findApiError }] = useFindOrCreateOneOnOneConversationMutation();

  const [searchResults, setSearchResults] = useState<UserApiResponse[]>([]);

  useEffect(() => {
    if (debouncedSearchTerm && allUsers) {
      const filtered = allUsers
        .filter(u => u.user_id !== currentUserId)
        .filter(u =>
          u.full_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
        .filter(u => !selectedUsers.find(su => su.user_id === u.user_id));
      setSearchResults(filtered);
    } else if (!debouncedSearchTerm) {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, allUsers, selectedUsers, currentUserId]);

  useEffect(() => {
    if (selectedUsers.length > 1) {
      setIsGroupChat(true);
    } else if (selectedUsers.length === 0) {
      setIsGroupChat(false);
    }
  }, [selectedUsers.length]);

  useEffect(() => {
    if(localError && (selectedUsers.length > 0 || groupTitle || searchTerm)) {
        // Clear local error if user starts typing or selecting again
        setLocalError(null);
    }
  }, [selectedUsers, groupTitle, searchTerm, localError]);


  const toggleUserSelection = useCallback((user: UserApiResponse) => {
    setLocalError(null);
    setSelectedUsers(prevSelected => {
      const isAlreadySelected = prevSelected.find(u => u.user_id === user.user_id);
      if (isAlreadySelected) {
        return prevSelected.filter(u => u.user_id !== user.user_id);
      } else {
        if (!isGroupChat && prevSelected.length === 1 && selectedUsers.length <= 1) {
          return [user];
        }
        return [...prevSelected, user];
      }
    });
    setSearchTerm('');
  }, [isGroupChat, selectedUsers.length]);


  const isGroupChatForced = selectedUsers.length > 1;

  const resetModalState = useCallback(() => {
    setSearchTerm('');
    setSelectedUsers([]);
    setIsGroupChat(false);
    setGroupTitle('');
    setLocalError(null);
  }, []);

  const handleCloseModal = useCallback((createdConversationId?: number) => {
    resetModalState();
    onClose(createdConversationId);
  }, [onClose, resetModalState]);

  const handleCreateChat = async () => {
    setLocalError(null);
    if (selectedUsers.length === 0) {
        setLocalError("Please select at least one person.");
        return;
    }
    try {
      let conversation;
      if (isGroupChat) {
        if (selectedUsers.length < 1) {
            setLocalError("A group chat needs at least one other person."); return;
        }
        if (selectedUsers.length === 1 && !isGroupChatForced && !groupTitle.trim()) {
             setLocalError("Please provide a group name or uncheck 'Create a group chat' for a direct message."); return;
        }
        conversation = await createConversation({
          creator_id: currentUserId, // Pass currentUserId as creator_id
          participant_user_ids: selectedUsers.map(u => u.user_id),
          title: groupTitle.trim() || undefined,
          is_group: true,
        }).unwrap();
      } else {
        if (selectedUsers.length !== 1) {
            setLocalError("Please select exactly one person for a direct chat."); return;
        }
        conversation = await findOrCreateOneOnOne({
          user_id_1: currentUserId, // Pass currentUserId as user_id_1
          user_id_2: selectedUsers[0].user_id,
        }).unwrap();
      }
      if (conversation?.conversation_id) {
        handleCloseModal(conversation.conversation_id);
      }
    } catch (err) {
      // Error is now handled by the combinedApiError display, but console.error is good for debugging
      console.error("Failed to create/find conversation:", err);
    }
  };

  const combinedApiError = createApiError || findApiError;
  const isLoadingMutation = isCreatingConversation || isFindingOrCreating;

  // --- Determine content for the search results area ---
  let searchResultsContent;
  if (isLoadingAllUsers) {
    searchResultsContent = (
      <div className="p-4 text-sm text-neutral-500 dark:text-neutral-400 text-center flex items-center justify-center">
        <Loader2 className="w-4 h-4 mr-2 animate-spin"/> Loading users...
      </div>
    );
  } else if (fetchAllUsersError) {
    searchResultsContent = (
      <div className="p-4 text-sm text-red-500 dark:text-red-400 text-center flex flex-col items-center justify-center">
        <AlertTriangle className="w-5 h-5 mb-2" />
        Error loading users.
        <span className="text-xs mt-1">Please try closing and reopening the modal.</span>
      </div>
    );
  } else if (!debouncedSearchTerm && selectedUsers.length === 0 && !isLoadingAllUsers) {
    searchResultsContent = (
      <p className="p-4 text-sm text-neutral-500 dark:text-neutral-400 text-center">
        Start typing to find people to chat with.
      </p>
    );
  } else if (debouncedSearchTerm && searchResults.length === 0 && !isLoadingAllUsers) {
    searchResultsContent = (
      <p className="p-4 text-sm text-neutral-500 dark:text-neutral-400 text-center">
        No users found matching "{debouncedSearchTerm}".
      </p>
    );
  } else {
    searchResultsContent = searchResults.map(user => (
      <div
          key={user.user_id}
          onClick={() => toggleUserSelection(user)}
          onKeyDown={(e) => e.key === 'Enter' && toggleUserSelection(user)}
          role="option"
          aria-selected={selectedUsers.some(su => su.user_id === user.user_id)}
          tabIndex={0}
          className="flex items-center p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700/70 cursor-pointer border-b border-neutral-200 dark:border-neutral-700/50 last:border-b-0 focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-700/70"
      >
          <UserAvatar name={user.full_name} src={user.profile_picture || undefined} size="sm" className="mr-3 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">{user.full_name}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
          </div>
      </div>
    ));
  }

  return (
    <Dialog open={isOpen} onClose={() => handleCloseModal()} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <DialogPanel className="mx-auto w-full max-w-md transform rounded-lg bg-white dark:bg-neutral-800 shadow-xl p-6 my-8 transition-all">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              {isGroupChat ? 'New Group Chat' : 'New Conversation'}
            </DialogTitle>
            <button
              onClick={() => handleCloseModal()}
              className="p-1 -m-1 rounded-full text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
            </div>
            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
            />
          </div>

          <div className="min-h-[120px] max-h-60 overflow-y-auto mb-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-750/30">
            {selectedUsers.length > 0 && (
              <div className="p-2 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex flex-wrap gap-1.5">
                  {selectedUsers.map(user => (
                    <span key={user.user_id} className="flex items-center text-xs bg-blue-100 dark:bg-blue-600/50 text-blue-700 dark:text-blue-200 rounded-full pl-2.5 pr-1.5 py-1 font-medium">
                      {user.full_name}
                      <button
                        onClick={() => toggleUserSelection(user)}
                        className="ml-1.5 p-0.5 rounded-full text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-500/50 transition-colors"
                        aria-label={`Remove ${user.full_name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {searchResultsContent}
          </div>

          {selectedUsers.length > 0 && (
             <div className="mb-4">
                <label className="flex items-center space-x-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isGroupChat}
                      onChange={(e) => {
                          setIsGroupChat(e.target.checked);
                          if (!e.target.checked) setGroupTitle('');
                      }}
                      className="form-checkbox h-4 w-4 rounded text-blue-600 border-neutral-300 dark:border-neutral-500 focus:ring-blue-500 dark:bg-neutral-600 dark:checked:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isGroupChatForced}
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">Create a group chat</span>
                </label>
            </div>
          )}

          {isGroupChat && selectedUsers.length > 0 && (
            <div className="mb-4">
                <label htmlFor="groupTitleInput" className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Group Name (optional)</label>
                <input
                    id="groupTitleInput"
                    type="text"
                    placeholder="e.g., Project Alpha Team"
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
                />
            </div>
          )}

          <button
            onClick={handleCreateChat}
            disabled={selectedUsers.length === 0 || isLoadingMutation || isLoadingAllUsers}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-neutral-800 disabled:bg-neutral-400 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoadingMutation ? (
              <Loader2 className="w-5 h-5 mr-2.5 animate-spin"/>
            ) : isGroupChat ? (
              <Users className="mr-2 h-5 w-5" aria-hidden="true" />
            ) : (
              <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
            )}
            {isLoadingMutation ? 'Starting...' : 'Start Chat'}
          </button>

          {(localError || combinedApiError) && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-2.5 text-center">
                {localError || getApiErrorMessage(combinedApiError) || "An unexpected error occurred."}
            </p>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default NewConversationModal;