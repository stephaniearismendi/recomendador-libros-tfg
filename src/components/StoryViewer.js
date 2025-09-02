import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Image, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/socialStyles';

export default function StoryViewer({ visible, stories = [], startIndex = 0, onClose }) {
  const [i, setI] = useState(startIndex);
  const [j, setJ] = useState(0);
  const timer = useRef(null);
  const slides = stories[i]?.slides || [];
  const cur = slides[j];

  useEffect(() => { if (visible) { setI(startIndex); setJ(0); } }, [visible, startIndex]);

  useEffect(() => {
    if (!visible) return;
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setJ((p) => {
        const next = p + 1;
        if (next < slides.length) return next;
        setI((k) => {
          const nextI = k + 1;
          if (nextI < stories.length) return nextI;
          onClose?.();
          return k;
        });
        return 0;
      });
    }, 2200);
    return () => clearInterval(timer.current);
  }, [visible, i, j, stories.length, slides.length, onClose]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.viewerBackdrop}>
        <View style={styles.viewerCard}>
          <View style={styles.viewerBars}>
            {slides.map((_, idx) => (<View key={idx} style={[styles.viewerBar, idx <= j ? styles.viewerBarActive : null]} />))}
          </View>
          <Image source={{ uri: cur?.uri }} style={styles.viewerImage} />
          <Text style={styles.viewerCaption}>{cur?.caption || ''}</Text>
          <View style={styles.viewerNav}>
            <TouchableOpacity style={styles.viewerTap} onPress={() => setJ(Math.max(0, j - 1))} />
            <TouchableOpacity style={styles.viewerTap} onPress={() => setJ(Math.min(slides.length - 1, j + 1))} />
          </View>
          <TouchableOpacity style={styles.viewerClose} onPress={onClose}><Text style={styles.viewerCloseText}>Cerrar</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
