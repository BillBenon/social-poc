import React, { useState } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';

// Generate fake posts
const POSTS = Array.from({ length: 24 }, (_, i) => ({
  id: i.toString(),
  image: `https://picsum.photos/seed/${i}/400/400`,
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 100),
  caption: `Great day exploring! 📸 #photography #adventure ${i}`,
  timestamp: new Date(Date.now() - Math.random() * 7776000000).toISOString(),
}));

const HIGHLIGHTS = [
  { id: '1', title: 'Travel', image: 'https://picsum.photos/seed/travel/100/100' },
  { id: '2', title: 'Food', image: 'https://picsum.photos/seed/food/100/100' },
  { id: '3', title: 'Nature', image: 'https://picsum.photos/seed/nature/100/100' },
  { id: '4', title: 'Work', image: 'https://picsum.photos/seed/work/100/100' },
];

type ViewMode = 'grid' | 'list';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [posts, setPosts] = useState(POSTS);

  const StatsItem = ({ label, value }: { label: string; value: number }) => (
    <ThemedView style={styles.statsItem}>
      <ThemedText style={styles.statsValue}>{value.toLocaleString()}</ThemedText>
      <ThemedText style={styles.statsLabel}>{label}</ThemedText>
    </ThemedView>
  );

  const HighlightItem = ({ item }: { item: typeof HIGHLIGHTS[0] }) => (
    <TouchableOpacity style={styles.highlightItem}>
      <Image source={{ uri: item.image }} style={styles.highlightImage} />
      <ThemedText style={styles.highlightTitle}>{item.title}</ThemedText>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item, index }: { item: typeof POSTS[0]; index: number }) => {
    const width = (Dimensions.get('window').width - 4) / 3;
    return (
      <Link href={`/post/${item.id}`} asChild>
        <TouchableOpacity style={[styles.gridItem, { width }]}>
          <Image source={{ uri: item.image }} style={[styles.gridImage, { width, height: width }]} />
        </TouchableOpacity>
      </Link>
    );
  };

  const renderListItem = ({ item }: { item: typeof POSTS[0] }) => (
    <Link href={`/post/${item.id}`} asChild>
      <TouchableOpacity style={styles.listItem}>
        <Image source={{ uri: item.image }} style={styles.listImage} />
        <ThemedView style={styles.listContent}>
          <ThemedText numberOfLines={2} style={styles.caption}>{item.caption}</ThemedText>
          <ThemedView style={styles.listStats}>
            <ThemedView style={styles.listStatItem}>
              <FontAwesome5 name="heart" size={14} color="#666" />
              <ThemedText style={styles.listStatText}>{item.likes}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.listStatItem}>
              <FontAwesome5 name="comment" size={14} color="#666" />
              <ThemedText style={styles.listStatText}>{item.comments}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerTop}>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            <ThemedView style={styles.statsContainer}>
              <StatsItem label="Posts" value={posts.length} />
              <StatsItem label="Followers" value={user?.followers || 0} />
              <StatsItem label="Following" value={user?.following || 0} />
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.bioContainer}>
            <ThemedText style={styles.name}>{user?.name}</ThemedText>
            <ThemedText style={styles.username}>@{user?.username}</ThemedText>
            <ThemedText style={styles.bio}>{user?.bio}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.buttons}>
            <TouchableOpacity style={styles.editButton}>
              <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={logout}>
              <FontAwesome5 name="cog" size={20} color="#666" />
            </TouchableOpacity>
          </ThemedView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.highlights}>
            {HIGHLIGHTS.map(highlight => (
              <HighlightItem key={highlight.id} item={highlight} />
            ))}
          </ScrollView>
        </ThemedView>

        <ThemedView style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'grid' && styles.activeToggle]}
            onPress={() => setViewMode('grid')}
          >
            <FontAwesome5 
              name="th" 
              size={20} 
              color={viewMode === 'grid' ? '#007AFF' : '#666'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => setViewMode('list')}
          >
            <FontAwesome5 
              name="list" 
              size={20} 
              color={viewMode === 'list' ? '#007AFF' : '#666'} 
            />
          </TouchableOpacity>
        </ThemedView>

        <FlatList
          data={posts}
          renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
          keyExtractor={item => item.id}
          numColumns={viewMode === 'grid' ? 3 : 1}
          scrollEnabled={false}
          key={viewMode} // Force remount when view mode changes
        />
      </ScrollView>
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
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 20,
    },
    statsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statsItem: {
      alignItems: 'center',
    },
    statsValue: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    statsLabel: {
      fontSize: 12,
      color: '#666',
    },
    bioContainer: {
      marginTop: 15,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    username: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    bio: {
      fontSize: 14,
      lineHeight: 20,
    },
    buttons: {
      flexDirection: 'row',
      marginTop: 15,
      marginBottom: 20,
    },
    editButton: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      padding: 8,
      borderRadius: 5,
      marginRight: 10,
    },
    editButtonText: {
      textAlign: 'center',
      fontWeight: '600',
    },
    settingsButton: {
      padding: 8,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    highlights: {
      marginBottom: 15,
    },
    highlightItem: {
      alignItems: 'center',
      marginRight: 15,
    },
    highlightImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginBottom: 5,
      borderWidth: 2,
      borderColor: '#666',
    },
    highlightTitle: {
      fontSize: 12,
    },
    viewToggle: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    toggleButton: {
      flex: 1,
      alignItems: 'center',
      padding: 10,
    },
    activeToggle: {
      borderBottomWidth: 2,
      borderBottomColor: '#007AFF',
    },
    gridItem: {
      padding: 1,
    },
    gridImage: {
      backgroundColor: '#f0f0f0',
    },
    listItem: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    listImage: {
      width: 100,
      height: 100,
      borderRadius: 5,
      marginRight: 10,
    },
    listContent: {
      flex: 1,
      justifyContent: 'space-between',
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
    },
    listStats: {
      flexDirection: 'row',
      marginTop: 5,
    },
    listStatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    listStatText: {
      marginLeft: 5,
      color: '#666',
    },
  });