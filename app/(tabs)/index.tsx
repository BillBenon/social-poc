import { useState } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Post } from '@/components/Post';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';

const DUMMY_POSTS = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    content: 'Just finished my first marathon! 🏃‍♀️ Still can\'t believe it! #running #achievement',
    image: 'https://picsum.photos/seed/1/400/300',
    likes: 42,
    comments: 7,
    liked: false,
  },
  {
    id: '2',
    user: {
      name: 'Alex Rivera',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    content: 'New coffee shop discovery! Their matcha latte is incredible ☕',
    image: 'https://picsum.photos/seed/2/400/300',
    likes: 28,
    comments: 3,
    liked: false,
  },
];

export default function HomeScreen() {
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          }
        : post
    ));
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} onLike={handleLike} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <ThemedText type="title" style={styles.header}>Feed</ThemedText>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 15,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
});