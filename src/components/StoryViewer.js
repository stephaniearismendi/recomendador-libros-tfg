import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Modal, View, Image, Text, TouchableOpacity } from 'react-native';
import { storyViewerStyles } from '../styles/components';
import { 
  validateStories, 
  getCurrentStory, 
  getCurrentSlide, 
  getNextSlideIndex, 
  getNextStoryIndex, 
  getPreviousSlideIndex,
  shouldCloseViewer,
  getSafeImageUri,
  getSafeCaption
} from '../utils/storyViewerUtils';

export default function StoryViewer({ visible, stories = [], startIndex = 0, onClose }) {
  const [storyIndex, setStoryIndex] = useState(startIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const timer = useRef(null);
  
  const validStories = validateStories(stories);
  const currentStory = getCurrentStory(validStories, storyIndex);
  const currentSlide = getCurrentSlide(currentStory, slideIndex);
  const slides = currentStory?.slides || [];

  const handleNext = useCallback(() => {
    const nextSlideIndex = getNextSlideIndex(slideIndex, slides.length);
    if (nextSlideIndex === 0) {
      const nextStoryIndex = getNextStoryIndex(storyIndex, validStories.length);
      if (shouldCloseViewer(nextStoryIndex, validStories.length)) {
        onClose?.();
        return;
      }
      setStoryIndex(nextStoryIndex);
    }
    setSlideIndex(nextSlideIndex);
  }, [slideIndex, slides.length, storyIndex, validStories.length, onClose]);

  const handlePrevious = useCallback(() => {
    if (slideIndex > 0) {
      setSlideIndex(getPreviousSlideIndex(slideIndex));
    } else if (storyIndex > 0) {
      const prevStory = getCurrentStory(validStories, storyIndex - 1);
      setStoryIndex(storyIndex - 1);
      setSlideIndex(prevStory?.slides?.length - 1 || 0);
    }
  }, [slideIndex, storyIndex, validStories]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      setStoryIndex(Math.max(0, Math.min(startIndex, validStories.length - 1)));
      setSlideIndex(0);
    }
  }, [visible, startIndex, validStories.length]);

  useEffect(() => {
    if (!visible || slides.length === 0) return;
    
    clearInterval(timer.current);
    timer.current = setInterval(handleNext, 2200);
    
    return () => clearInterval(timer.current);
  }, [visible, slides.length, handleNext]);

  if (!visible) return null;

  if (validStories.length === 0 || slides.length === 0) {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
        <View style={storyViewerStyles.backdrop}>
          <View style={storyViewerStyles.card}>
            <Text style={storyViewerStyles.caption}>No hay historias disponibles</Text>
            <TouchableOpacity style={storyViewerStyles.close} onPress={handleClose}>
              <Text style={storyViewerStyles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const imageUri = getSafeImageUri(currentSlide);
  const caption = getSafeCaption(currentSlide);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={storyViewerStyles.backdrop}>
        <View style={storyViewerStyles.card}>
          <View style={storyViewerStyles.bars}>
            {slides.map((_, idx) => (
              <View 
                key={idx} 
                style={[
                  storyViewerStyles.bar, 
                  idx <= slideIndex && storyViewerStyles.barActive
                ]} 
              />
            ))}
          </View>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={storyViewerStyles.image} />
          )}
          {caption && (
            <Text style={storyViewerStyles.caption}>{caption}</Text>
          )}
          <View style={storyViewerStyles.nav}>
            <TouchableOpacity style={storyViewerStyles.tap} onPress={handlePrevious} />
            <TouchableOpacity style={storyViewerStyles.tap} onPress={handleNext} />
          </View>
          <TouchableOpacity style={storyViewerStyles.close} onPress={handleClose}>
            <Text style={storyViewerStyles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
