// src/features/chats/components/ChatWindowHeader.tsx
import React from 'react';
import { Conversation } from '../chatsAPI';
import UserAvatar from './UserAvatar';
// import { ArrowLeftIcon, EllipsisVerticalIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/solid'; // Removed Heroicons
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react'; // Added Lucide icons
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../users/userSlice'; // Assuming this path is correct, user had 'users' instead of 'user' in previous examples. Keep as is.

interface ChatWindowHeaderProps {
  conversation: Conversation | undefined; // Full conversation object
  onBack?: () => void; // For mobile view to go back to conversation list
}

const ChatWindowHeader: React.FC<ChatWindowHeaderProps> = ({ conversation, onBack }) => {
  const currentUserId = useSelector(selectCurrentUserId);

  if (!conversation) {
    return (
      <div className="p-3 h-[69px] border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-between shadow-sm">
        <div className="animate-pulse flex items-center">
           {onBack && <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-md mr-3"></div>}
           <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
           <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  const { title, is_group_chat, participants = [], creator } = conversation;
  let displayTitle = title;
  interface ParticipantUser {
    user_id: number;
    full_name: string | null;
    profile_picture?: string | null;
  }

  interface Participant {
    user?: ParticipantUser;
    user_id?: number;
    full_name?: string | null;
    profile_picture?: string | null;
  }

  let avatarUser: ParticipantUser | undefined;
  let statusText = "Offline"; // Placeholder for online status or last seen

  if (!is_group_chat) {
    const otherParticipantData = participants.find(
      (p: Participant) => p.user && p.user.user_id !== currentUserId
    ) || participants.find(
      (p: Participant) => p.user_id !== currentUserId
    );
     if (otherParticipantData) {
        avatarUser = 'user' in otherParticipantData ? otherParticipantData.user : {
          user_id: otherParticipantData.user_id!,
          full_name: otherParticipantData.full_name ?? null,
          profile_picture: otherParticipantData.profile_picture
        };
    } else if (creator && creator.user_id !== currentUserId) {
        avatarUser = creator;
    }
    displayTitle = avatarUser?.full_name || "Chat";
    // TODO: Get real online status
    // statusText = getOnlineStatus(avatarUser?.user_id) ? "Online" : "Offline";
  } else {
    displayTitle = title || "Group Chat";
    statusText = `${participants.length} members`;
  }


  return (
    <div className="p-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-between shadow-sm">
      <div className="flex items-center min-w-0">
        {onBack && (
          <button onClick={onBack} className="mr-2 p-1 text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 md:hidden">
            {/* <ArrowLeftIcon className="w-6 h-6" /> */}
            <ArrowLeft className="w-6 h-6" /> {/* Replaced with Lucide icon */}
          </button>
        )}
        <UserAvatar
          name={is_group_chat ? displayTitle : avatarUser?.full_name}
          src={is_group_chat ? undefined : avatarUser?.profile_picture}
          size="md"
          // isOnline={!is_group_chat && getOnlineStatus(avatarUser?.user_id)} // TODO
          // showOnlineIndicator={!is_group_chat}
        />
        <div className="ml-3 min-w-0">
          <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-100 truncate">{displayTitle}</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{statusText}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {/* TODO: Add functionality to these buttons */}
        <button className="p-2 text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400" title="Call">
          {/* <PhoneIcon className="w-5 h-5" /> */}
          <Phone className="w-5 h-5" /> {/* Replaced with Lucide icon */}
        </button>
        <button className="p-2 text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400" title="Video Call">
          {/* <VideoCameraIcon className="w-5 h-5" /> */}
          <Video className="w-5 h-5" /> {/* Replaced with Lucide icon */}
        </button>
        <button className="p-2 text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400" title="More options">
          {/* <EllipsisVerticalIcon className="w-5 h-5" /> */}
          <MoreVertical className="w-5 h-5" /> {/* Replaced with Lucide icon */}
        </button>
      </div>
    </div>
  );
};

export default ChatWindowHeader;