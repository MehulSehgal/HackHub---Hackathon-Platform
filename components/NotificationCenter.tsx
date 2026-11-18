import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Users,
  UserCheck,
  ClipboardList,
  Clock,
  MessageSquare,
  Trophy,
  Award,
  Filter,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { NotificationCategory, InAppNotification } from '../types/notifications';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const getCategoryIcon = (category: NotificationCategory) => {
  switch (category) {
    case 'team_invitation':
      return <Users className="w-5 h-5 text-indigo-400" />;
    case 'team_membership':
      return <UserCheck className="w-5 h-5 text-emerald-400" />;
    case 'task_assigned':
      return <ClipboardList className="w-5 h-5 text-sky-400" />;
    case 'task_deadline':
      return <Clock className="w-5 h-5 text-amber-400" />;
    case 'team_chat':
      return <MessageSquare className="w-5 h-5 text-purple-400" />;
    case 'hackathon_update':
      return <Trophy className="w-5 h-5 text-yellow-400" />;
    case 'participation_status':
      return <Award className="w-5 h-5 text-rose-400" />;
    default:
      return <Bell className="w-5 h-5 text-slate-400" />;
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
  } = useAppContext();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | NotificationCategory>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notif.read;
    return notif.category === activeFilter;
  });

  return (
    <div className="absolute right-0 mt-2 w-96 max-w-[92vw] bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl z-50 overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-sky-400" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
          <h3 className="font-semibold text-base">Notifications</h3>
          {unreadNotificationCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium">
              {unreadNotificationCount} new
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {unreadNotificationCount > 0 && (
            <button
              onClick={() => markAllNotificationsAsRead()}
              className="text-slate-400 hover:text-sky-400 flex items-center space-x-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-800"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Read all</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => clearAllNotifications()}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1 rounded-md hover:bg-slate-800"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
            activeFilter === 'unread'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Unread ({unreadNotificationCount})
        </button>
        <button
          onClick={() => setActiveFilter('team_invitation')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeFilter === 'team_invitation'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Invites
        </button>
        <button
          onClick={() => setActiveFilter('task_assigned')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeFilter === 'task_assigned'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          Tasks
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60 transition-all">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-sm text-slate-400 font-medium">No notifications</p>
            <p className="text-xs text-slate-500 mt-1">You are all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification: InAppNotification) => (
            <div
              key={notification.id}
              onClick={() => markNotificationAsRead(notification.id)}
              className={`p-3.5 flex items-start space-x-3 transition-colors cursor-pointer group hover:bg-slate-800/60 ${
                !notification.read ? 'bg-sky-950/20' : 'bg-transparent'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0 group-hover:border-slate-600 transition-colors">
                {getCategoryIcon(notification.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4
                    className={`text-sm truncate ${
                      !notification.read ? 'font-semibold text-slate-100' : 'text-slate-300'
                    }`}
                  >
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1">
                  <span className="text-[11px] text-slate-500">{notification.timestamp}</span>
                  {notification.actionUrl && (
                    <Link
                      href={notification.actionUrl}
                      onClick={() => onClose()}
                      className="text-xs text-sky-400 hover:text-sky-300 font-medium hover:underline"
                    >
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/80 text-center">
        <Link
          href="/notifications"
          onClick={() => onClose()}
          className="text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
        >
          View all in full notification dashboard →
        </Link>
      </div>
    </div>
  );
};
