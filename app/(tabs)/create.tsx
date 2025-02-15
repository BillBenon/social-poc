import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatePostScreen() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please grant permission to access your photos to select an image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) {
      Alert.alert('Error', 'Please add some content or an image to your post');
      return;
    }

    setLoading(true);

    try {
      // Simulate post creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would upload the image and create the post here
      
      router.replace('/(tabs)/');
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Create Post</ThemedText>
        <TouchableOpacity 
          style={[styles.postButton, (!content.trim() && !selectedImage) && styles.postButtonDisabled]} 
          onPress={handlePost}
          disabled={loading || (!content.trim() && !selectedImage)}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.postButtonText}>Post</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.userInfo}>
        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        <ThemedText style={styles.username}>{user?.name}</ThemedText>
      </ThemedView>

      <TextInput
        style={styles.input}
        multiline
        placeholder="What's on your mind?"
        placeholderTextColor="#666"
        value={content}
        onChangeText={setContent}
        editable={!loading}
      />

      {selectedImage && (
        <ThemedView style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={() => setSelectedImage(null)}
          >
            <FontAwesome5 name="times-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </ThemedView>
      )}

      <ThemedView style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <FontAwesome5 name="image" size={20} color="#666" />
          <ThemedText style={styles.actionText}>Photo</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <FontAwesome5 name={showAdvanced ? "chevron-up" : "chevron-down"} size={20} color="#666" />
          <ThemedText style={styles.actionText}>
            {showAdvanced ? 'Less' : 'More'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {showAdvanced && (
        <ThemedView style={styles.advancedOptions}>
          <ThemedView style={styles.locationContainer}>
            <FontAwesome5 name="map-marker-alt" size={20} color="#666" style={styles.locationIcon} />
            <TextInput
              style={styles.locationInput}
              placeholder="Add location"
              placeholderTextColor="#666"
              value={location}
              onChangeText={setLocation}
              editable={!loading}
            />
          </ThemedView>

          <TouchableOpacity style={styles.advancedButton}>
            <FontAwesome5 name="users" size={20} color="#666" />
            <ThemedText style={styles.actionText}>Tag People</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.advancedButton}>
            <FontAwesome5 name="hashtag" size={20} color="#666" />
            <ThemedText style={styles.actionText}>Add Topic</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  input: {
    minHeight: 100,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    margin: 15,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    color: '#666',
  },
  advancedOptions: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
  },
  advancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});