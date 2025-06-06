// src/features/chats/components/MessageInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useSendMessageMutation } from '../chatsAPI';
import { Send, Paperclip, X, Loader2 } from 'lucide-react'; // Added Loader2 for sending state
import { useSelector } from 'react-redux'; // Import useSelector
import { selectCurrentUserId } from '../../users/userSlice'; // Import your selector

interface MessageInputProps {
  conversationId: number;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [content, setContent] = useState('');
  const [sendMessage, { isLoading: isSending, error: sendError }] = useSendMessageMutation(); // Added sendError
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentUserId = useSelector(selectCurrentUserId); // Get current user's ID

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleClearInput = () => {
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentUserId) {
      console.error("Cannot send message: User ID is not available.");
      // Optionally, show a user-facing error here (e.g., using a toast)
      return;
    }

    if (content.trim() && !isSending) {
      const messageContent = content.trim();
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      try {
        await sendMessage({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: messageContent,
          // message_type: 'text' // Default type, can be omitted if 'text' is the backend default
        }).unwrap();
        // Optionally, clear sendError if it was previously set
        if (sendError) { /* logic to clear error if displayed in UI */ }
      } catch (err) {
        console.error('Failed to send message:', err);
        setContent(messageContent); // Restore content on error
        // TODO: Show error toast to user (using 'err' or 'sendError' from the hook)
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = content.trim() && currentUserId !== null;

  return (
    <div className="p-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
      {/* Potential area for displaying sendError */}
      {/* {sendError && <div className="text-xs text-red-500 mb-2 px-1">Failed to send. Please try again.</div>} */}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-white dark:bg-neutral-700 rounded-xl shadow p-1.5"
      >
        <button
          type="button"
          // onClick={handleAttachment} // TODO
          className="p-2 text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach file"
          disabled={isSending || currentUserId === null}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={currentUserId === null ? "Authenticating..." : "Type a message..."}
          className="flex-1 py-2.5 px-2 text-sm bg-transparent border-none focus:ring-0 resize-none max-h-[120px] dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
          rows={1}
          disabled={isSending || currentUserId === null}
        />
        {content.trim() && !isSending && currentUserId !== null && (
          <button
            type="button"
            onClick={handleClearInput}
            className="p-2 text-neutral-500 hover:text-red-500 dark:hover:text-red-400 flex-shrink-0"
            title="Clear input"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <button
          type="submit"
          disabled={isSending || !canSubmit}
          className="p-2.5 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed flex-shrink-0 transition-colors"
          title="Send message"
        >
          {isSending ? (
            // Using Loader2 for consistency with other loading states
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;