import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome5 } from '@expo/vector-icons';

export default function CreateScreen() {
  const [content, setContent] = useState('');

  const handlePost = () => {
    // Handle post creation
    console.log('Creating post:', content);
    setContent('');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Create Post</ThemedText>
      
      <TextInput
        style={styles.input}
        multiline
        placeholder="What's on your mind?"
        placeholderTextColor="#666"
        value={content}
        onChangeText={setContent}
      />
      
      <TouchableOpacity style={styles.imageButton}>
        <FontAwesome5 name="image" size={24} color="#666" />
        <ThemedText style={styles.buttonText}>Add Photo</ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.postButton, !content && styles.postButtonDisabled]}
        onPress={handlePost}
        disabled={!content}
      >
        <ThemedText style={styles.postButtonText}>Post</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
  },
  input: {
    height: 150,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        fontSize: 16,
      },
      android: {
        textAlignVertical: 'top',
      },
    }),
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    marginLeft: 10,
  },
  postButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});