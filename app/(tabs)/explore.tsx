import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Link } from 'expo-router';

const EXPLORE_DATA = Array.from({ length: 30 }, (_, i) => ({
  id: `${i}`,
  image: `https://picsum.photos/seed/${i}/400/400`,
  likes: Math.floor(Math.random() * 1000),
  user: {
    name: `User ${i}`,
    avatar: `https://i.pravatar.cc/150?img=${i}`,
  },
}));

const TRENDING_TAGS = [
  '#photography',
  '#travel',
  '#food',
  '#art',
  '#nature',
  '#fashion',
  '#technology',
  '#fitness',
].map((tag, index) => ({
  id: index.toString(),
  tag,
  posts: Math.floor(Math.random() * 100000),
}));

interface Post {
  id: string;
  image: string;
  likes: number;
  user: {
    name: string;
    avatar: string;
  };
}

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<Post[]>(EXPLORE_DATA);
  const [loading, setLoading] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPosts(prevPosts => 
      [...prevPosts.sort(() => Math.random() - 0.5)]
    );
    setRefreshing(false);
  }, []);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPosts = Array.from({ length: 10 }, (_, i) => ({
      id: `${posts.length + i}`,
      image: `https://picsum.photos/seed/${posts.length + i}/400/400`,
      likes: Math.floor(Math.random() * 1000),
      user: {
        name: `User ${posts.length + i}`,
        avatar: `https://i.pravatar.cc/150?img=${posts.length + i}`,
      },
    }));
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setLoading(false);
  };

  const renderTrendingTag = ({ item }: { item: { id: string; tag: string; posts: number } }) => (
    <TouchableOpacity style={styles.trendingTag}>
      <ThemedText style={styles.tagText}>{item.tag}</ThemedText>
      <ThemedText style={styles.tagPosts}>{item.posts.toLocaleString()} posts</ThemedText>
    </TouchableOpacity>
  );

  const renderPost = ({ item, index }: { item: Post; index: number }) => {
    const width = (Dimensions.get('window').width - 40) / 3;
    return (
      <Link href={`/post/${item.id}`} asChild>
        <TouchableOpacity style={[styles.postContainer, { width }]}>
          <Image source={{ uri: item.image }} style={[styles.postImage, { width, height: width }]} />
          <ThemedView style={styles.likesContainer}>
            <FontAwesome5 name="heart" size={12} color="#fff" />
            <ThemedText style={styles.likesText}>{item.likes}</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.searchContainer}>
        <FontAwesome5 name="search" size={16} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </ThemedView>

      <FlatList
        ListHeaderComponent={() => (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Trending Tags</ThemedText>
            <FlatList
              data={TRENDING_TAGS}
              renderItem={renderTrendingTag}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.trendingList}
            />
            <ThemedText type="subtitle" style={styles.sectionTitle}>Popular Posts</ThemedText>
          </>
        )}
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        numColumns={3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.content}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 10,
    paddingTop: 60,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sectionTitle: {
    marginVertical: 15,
    marginLeft: 5,
  },
  trendingList: {
    marginBottom: 10,
  },
  trendingTag: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 100,
  },
  tagText: {
    fontWeight: 'bold',
  },
  tagPosts: {
    fontSize: 12,
    opacity: 0.7,
  },
  postContainer: {
    margin: 1,
  },
  postImage: {
    borderRadius: 5,
  },
  likesContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    borderRadius: 10,
  },
  likesText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
});