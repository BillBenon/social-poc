import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { formatRelativeTime } from '@/utils/date';

type NotificationType = 'like' | 'comment' | 'follow' | 'mention';

interface Notification {
  id: string;
  type: NotificationType;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  post?: {
    id: string;
    image: string;
  };
  timestamp: string;
  read: boolean;
  content?: string;
}

// Generate fake notifications
const NOTIFICATIONS: Notification[] = Array.from({ length: 20 }, (_, i) => {
  const types: NotificationType[] = ['like', 'comment', 'follow', 'mention'];
  const type = types[Math.floor(Math.random() * types.length)];
  const baseNotif = {
    id: i.toString(),
    type,
    user: {
      id: `user${i}`,
      name: `User ${i}`,
      avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
    },
    timestamp: new Date(Date.now() - Math.random() * 604800000).toISOString(),
    read: Math.random() > 0.3,
  };

  if (type !== 'follow') {
    return {
      ...baseNotif,
      post: {
        id: `post${i}`,
        image: `https://picsum.photos/seed/${i}/100/100`,
      },
      content: type === 'comment' || type === 'mention' 
        ? 'Great photo! Love the composition 📸' 
        : undefined,
    };
  }

  return baseNotif;
});

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const getNotificationText = () => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'mention':
        return 'mentioned you in a comment';
      default:
        return '';
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return 'heart';
      case 'comment':
        return 'comment';
      case 'follow':
        return 'user-plus';
      case 'mention':
        return 'at';
      default:
        return 'bell';
    }
  };

  return (
    <Link href={notification.type === 'follow' 
      ? `/profile/${notification.user.id}` 
      : `/post/${notification.post?.id}`} 
      asChild
    >
      <TouchableOpacity>
        <ThemedView style={[
          styles.notificationItem,
          !notification.read && styles.unreadNotification
        ]}>
          <Image source={{ uri: notification.user.avatar }} style={styles.avatar} />
          
          <ThemedView style={styles.notificationContent}>
            <ThemedView style={styles.notificationHeader}>
              <ThemedText style={styles.username}>{notification.user.name}</ThemedText>
              <FontAwesome5 
                name={getNotificationIcon()} 
                size={14} 
                color="#666" 
                style={styles.typeIcon} 
              />
            </ThemedView>
            
            <ThemedText style={styles.notificationText}>
              {getNotificationText()}
            </ThemedText>
            
            {notification.content && (
              <ThemedText style={styles.commentText} numberOfLines={1}>
                "{notification.content}"
              </ThemedText>
            )}
            
            <ThemedText style={styles.timestamp}>
              {formatRelativeTime(notification.timestamp)}
            </ThemedText>
          </ThemedView>

          {notification.post && (
            <Image source={{ uri: notification.post.image }} style={styles.postThumbnail} />
          )}
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
};

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate fetching new notifications
    await new Promise(resolve => setTimeout(resolve, 1500));
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        type: 'like',
        user: {
          id: 'newUser',
          name: 'New User',
          avatar: 'https://i.pravatar.cc/150?img=50',
        },
        post: {
          id: 'newPost',
          image: 'https://picsum.photos/seed/new/100/100',
        },
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
    setRefreshing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Notifications</ThemedText>
      
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingTop: 60,
  },
  list: {
    padding: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
  },
  unreadNotification: {
    backgroundColor: '#e6f3ff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  typeIcon: {
    marginLeft: 5,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  postThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});