import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface PostProps {
  post: {
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    liked: boolean;
  };
  onLike: (id: string) => void;
}

export const Post = ({ post, onLike }: PostProps) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <ThemedText type="defaultSemiBold">{post.user.name}</ThemedText>
      </View>
      
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onLike(post.id)} style={styles.actionButton}>
          <FontAwesome5 
            name={post.liked ? "heart" : "heart-o"} 
            size={24} 
            color={post.liked ? "#e74c3c" : "#666"} 
          />
          <ThemedText style={styles.actionText}>{post.likes}</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="comment-o" size={24} color="#666" />
          <ThemedText style={styles.actionText}>{post.comments}</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="share" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <ThemedText>
          <ThemedText type="defaultSemiBold">{post.user.name}</ThemedText>
          {' '}{post.content}
        </ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  actions: {
    flexDirection: 'row',
    padding: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
  },
  content: {
    padding: 10,
    paddingTop: 0,
  },
});
