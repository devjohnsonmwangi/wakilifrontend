// src/features/notifications/components/NotificationItem.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, UserPlus, FileText, DollarSign, AlertTriangle, Bell, Trash2, CheckCircle } from 'lucide-react';
import { Notification, useMarkAsReadMutation, useDeleteNotificationMutation } from '../notificationAPI';

// Helper to get an icon based on notification type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'new_message': return <MessageSquare className="w-5 h-5 text-blue-500" />;
    case 'new_follower': return <UserPlus className="w-5 h-5 text-green-500" />;
    case 'booking_confirmation': return <FileText className="w-5 h-5 text-purple-500" />;
    case 'payment_received': return <DollarSign className="w-5 h-5 text-teal-500" />;
    case 'system_alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
    default: return <Bell className="w-5 h-5 text-neutral-500" />;
  }
};

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const navigate = useNavigate();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleItemClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
    if (notification.link_url) {
      navigate(notification.link_url);
    }
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`group flex items-start p-4 border-b border-neutral-200 dark:border-neutral-800 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
    >
      {/* Unread Indicator */}
      {!notification.is_read && (
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${!notification.is_read ? 'ml-0' : 'ml-5' }`}>
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 cursor-pointer" onClick={handleItemClick}>
        <p className="text-sm text-neutral-800 dark:text-neutral-200" dangerouslySetInnerHTML={{ __html: notification.message }}></p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
      
      {/* Actions (appear on hover) */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.is_read && (
          <button
            onClick={(e) => { e.stopPropagation(); markAsRead(notification.notification_id); }}
            title="Mark as read"
            className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); deleteNotification(notification.notification_id); }}
          title="Delete notification"
          className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationItem;