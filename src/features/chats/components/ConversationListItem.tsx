// src/features/chats/components/ConversationListItem.tsx
import React from 'react';
import { Conversation } from '../chatsAPI'; // Assuming types are exported from chatsAPI.ts
import UserAvatar from './UserAvatar';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../users/userSlice'; // Path to your userSlice selectors

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversationId: number) => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isSelected,
  onSelect,
}) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const {
    conversation_id,
    title,
    is_group_chat,
    last_message_content_preview,
    last_message_sent_at,
    unread_count = 0,
    participants = [],
    creator,
  } = conversation;

  // Type guard for participant with 'user' property
  function isParticipantWithUser(
    obj: unknown
  ): obj is { user: { user_id: number; full_name: string | null; profile_picture?: string | null } } {
      return (
        typeof obj === 'object' &&
        obj !== null &&
        'user' in obj &&
        typeof (obj as { user?: unknown }).user === 'object' &&
        (obj as { user?: unknown }).user !== undefined
      );
  }

  let displayTitle = title;
  let avatarUser: { user_id: number; full_name: string | null; profile_picture?: string | null } | undefined;
  let otherParticipantsNames = "Group Chat Members";


  if (!is_group_chat) {
    type Participant = { user: { user_id: number; full_name: string | null; profile_picture?: string | null } } | { user_id: number; full_name: string | null; profile_picture?: string | null };

    const otherParticipantData = participants.find(
      (p: Participant) => 'user' in p && p.user.user_id !== currentUserId // p.user for ParticipantInConversation
    ) || participants.find(
      (p: Participant) => !('user' in p) && p.user_id !== currentUserId // p for UserSummary[]
    );

    if (otherParticipantData) {
        avatarUser = isParticipantWithUser(otherParticipantData)
            ? otherParticipantData.user
            : (otherParticipantData as { user_id: number; full_name: string | null; profile_picture?: string | null });
    } else if (creator && creator.user_id !== currentUserId) {
        avatarUser = creator;
    } else if (participants.length > 0) { // Self-chat or only one participant listed
        avatarUser = isParticipantWithUser(participants[0])
            ? participants[0].user
            : (participants[0] as { user_id: number; full_name: string | null; profile_picture?: string | null });
    }


    displayTitle = avatarUser?.full_name || "Chat";
  } else {
    displayTitle = title || "Group Chat";
    type Participant = { user: { user_id: number; full_name: string | null } } | { user_id: number; full_name: string | null };

    if (participants.length > 0) {
        otherParticipantsNames = (participants as Participant[])
            .map((p) => ('user' in p ? p.user.full_name : p.full_name))
            .filter(name => name !== null)
            .slice(0, 3) // Show first few names
            .join(', ');
        if (participants.length > 3) otherParticipantsNames += '...';
    }
  }


  // Placeholder for online status - this would come from a WebSocket/presence system
  // const isUserOnline = getOnlineStatus(avatarUser?.user_id); // You'd need a presence system
  const isUserOnline = false; // For now

  return (
    <div
      onClick={() => onSelect(conversation_id)}
      className={`
        flex items-center p-3 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer
        transition-colors duration-150 ease-in-out border-b border-neutral-100 dark:border-neutral-750
        ${isSelected ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-white dark:bg-neutral-800'}
      `}
    >
      <UserAvatar
        name={is_group_chat ? displayTitle : avatarUser?.full_name}
        src={is_group_chat ? undefined /* groupAvatarUrl */ : avatarUser?.profile_picture}
        showOnlineIndicator={!is_group_chat}
        isOnline={isUserOnline}
        size="md"
      />
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
            {displayTitle}
          </h3>
          {last_message_sent_at && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
              {formatDistanceToNowStrict(parseISO(last_message_sent_at), { addSuffix: false })}
            </p>
          )}
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
          {is_group_chat && participants.length > 0 && !title && ( // Show participant names if group and no title
             <span className="italic">{otherParticipantsNames}</span>
          )}
        </p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-neutral-600 dark:text-neutral-300 truncate flex-1">
            {last_message_content_preview || (is_group_chat ? 'Group created' : 'Conversation started')}
          </p>
          {unread_count > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {unread_count > 9 ? '9+' : unread_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationListItem;