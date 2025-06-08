// src/features/notifications/components/NotificationBell.t
import { Link } from 'react-router-dom';
import { useGetUnreadCountQuery } from '../notificationAPI';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const { data } = useGetUnreadCountQuery(undefined, {
    // This will automatically refetch the count every 1 seconds
    pollingInterval: 1000, 
  });

  const unreadCount = data?.count || 0;

  return (
    <Link to="/notifications" className="relative p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700">
      <Bell className="w-6 h-6" />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full"
          >
            {unreadCount}
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
};

export default NotificationBell;