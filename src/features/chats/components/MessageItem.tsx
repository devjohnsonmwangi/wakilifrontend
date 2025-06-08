// src/features/chats/components/MessageItem.tsx
import React from 'react';
import { ChatMessage } from '../chatsAPI';
import UserAvatar from './UserAvatar';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
// import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'; 
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'; // Lucide icons

interface MessageItemProps {
  message: ChatMessage & { hadError?: boolean }; 
  isOwnMessage: boolean;
  showAvatarAndName: boolean; // To show avatar only for first message in a sequence from same user
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwnMessage, showAvatarAndName }) => {
  const { content, sent_at, sender, message_id } = message;

  // Placeholder for demonstrating AlertCircle.
  // this would come from message.status or an actual error condition.
  const messageHadError = message.hadError || false; // Example: Set to true on a message to see AlertCircle

  const isTemporary = typeof message_id === 'string' && message_id.startsWith('temp_');

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return format(date, 'p'); // e.g., 2:30 PM
    if (isYesterday(date)) return `Yesterday ${format(date, 'p')}`;
    return format(date, 'MMM d, p'); // e.g., Jan 5, 2:30 PM
  };

  return (
    <div className={`flex my-0.5 ${isOwnMessage ? 'justify-end' : 'justify-start'} ${showAvatarAndName ? 'mt-2' : ''}`}>
      <div className={`flex items-end max-w-[70%] md:max-w-[60%] ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
        {!isOwnMessage && showAvatarAndName && (
          <UserAvatar
            src={sender?.profile_picture}
            name={sender?.full_name}
            size="sm"
            className="mr-2 self-start flex-shrink-0" // Added flex-shrink-0
          />
        )}
        {!isOwnMessage && !showAvatarAndName && (
             <div className="w-8 mr-2 flex-shrink-0"></div> // Placeholder for alignment
        )}

        <div
          className={`
            p-2.5 rounded-lg shadow-sm
            ${isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-bl-none'
            }
          `}
        >
          {!isOwnMessage && showAvatarAndName && sender?.full_name && (
            <p className="text-xs font-semibold mb-1 text-blue-600 dark:text-blue-400">{sender.full_name}</p>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
          <div className={`text-xs mt-1 flex items-center ${isOwnMessage ? 'text-blue-200 justify-end' : 'text-neutral-500 dark:text-neutral-400 justify-start'}`}>
            <span>{formatDate(sent_at)}</span>
            {isOwnMessage && (
              <span className="ml-1.5">
                {messageHadError ? (
                  <AlertCircle className="w-3.5 h-3.5 text-red-300" /> // Was ExclamationCircleIcon
                ) : isTemporary ? (
                  <Clock className="w-3.5 h-3.5 text-blue-200/80" /> // Was ClockIcon
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-200/80" /> /* Was CheckCircleIcon, TODO: Double tick for read */
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessageItem;