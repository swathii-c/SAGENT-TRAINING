import React, { useEffect, useState } from 'react';
import { getNotificationsByUser, markNotificationRead } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const r = await getNotificationsByUser(user.userId);
      setNotifications(r.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.allSettled(unread.map(n => markNotificationRead(n.notificationId)));
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type) => {
    const map = {
      BOOKING_CONFIRMED: '✅',
      BOOKING_CANCELLED: '❌',
      PAYMENT_SUCCESS: '💰',
      REMINDER: '🔔',
      PROMOTION: '🎉',
    };
    return map[type] || '📢';
  };

  return (
    <div className="user-page fade-in">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="page-title-sub">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={handleMarkAllRead}>
            Mark All Read
          </button>
        )}
      </div>

      {loading ? <div className="spinner" /> : notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map(n => (
            <div
              key={n.notificationId}
              className="card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                opacity: n.isRead ? 0.65 : 1,
                borderColor: !n.isRead ? 'var(--border-accent)' : undefined,
                cursor: !n.isRead ? 'pointer' : 'default',
              }}
              onClick={() => !n.isRead && handleMarkRead(n.notificationId)}
            >
              <div style={{ fontSize: 22, flexShrink: 0 }}>{getIcon(n.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: n.isRead ? 400 : 600, marginBottom: 4 }}>{n.message || n.title || 'Notification'}</div>
                    {n.body && <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{n.body}</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 6px var(--gold)' }} />}
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
