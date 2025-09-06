import React, { useCallback, useEffect, useMemo, useRef, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getClub, getClubChapters, getChapterMessages, postChapterMessage } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const AVATAR = (u) => `https://i.pravatar.cc/100?u=${u || 'anon'}`;

export default function ClubRoomScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { token, logout, user } = useContext(AuthContext);

  const clubId = route.params?.clubId;
  const initialName = route.params?.clubName || 'Club de lectura';
  const initialCover = route.params?.cover || null;
  const [club, setClub] = useState({
    id: clubId,
    name: initialName,
    cover: initialCover,
    members: 0,
  });
  const [chapters, setChapters] = useState([]); // [{ chapter, title, messagesCount, lastMessageAt }]
  const [current, setCurrent] = useState(null); // number
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [pickerVisible, setPickerVisible] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [clubResponse, chaptersResponse] = await Promise.all([
          getClub(clubId).catch(() => ({ data: null })),
          getClubChapters(clubId).catch(() => ({ data: [] })),
        ]);
        if (!alive) return;

        const clubData = clubResponse?.data || {};
        if (clubData?.name) setClub(clubData);

        const chapters = Array.isArray(chaptersResponse?.data) ? chaptersResponse.data : [];
        setChapters(chapters);

        const firstChapter = chapters.length ? Math.min(...chapters.map((x) => x.chapter)) : 1;
        setCurrent(firstChapter);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clubId]);

  useEffect(() => {
    if (!current) return;
    let alive = true;
    (async () => {
      setLoadingMsgs(true);
      try {
        const response = await getChapterMessages(clubId, current);
        if (!alive) return;
        
        // Debug de los mensajes del backend
        console.log('🔍 ClubRoom: Messages from backend:', {
          clubId: clubId,
          chapter: current,
          messagesCount: response?.data?.length || 0,
          messages: response?.data?.map(m => ({
            id: m.id,
            userId: m.userId,
            userName: m.userName,
            userAvatar: m.userAvatar,
            text: m.text?.substring(0, 30) + '...'
          }))
        });
        
        setMessages(response?.data || []);
        setTimeout(() => listRef.current?.scrollToEnd?.({ animated: false }), 50);
      } catch (error) {
        if (error?.response?.status === 401) {
          await logout();
          navigation.navigate('Login');
        }
      } finally {
        if (alive) setLoadingMsgs(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [clubId, current, logout, navigation]);

  const sendMessage = useCallback(async () => {
    const messageText = (text || '').trim();
    if (!messageText || !token || !current) return;
    
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        await logout();
        navigation.navigate('Login');
        return;
      }
    } catch (error) {
      await logout();
      navigation.navigate('Login');
      return;
    }
    
    const optimisticMessage = {
      id: `tmp_${Date.now()}`,
      userName: 'Tú',
      userAvatar: user?.avatar || 'https://i.pravatar.cc/150?u=default', // Usar avatar real del usuario
      text: messageText,
      createdAt: new Date().toISOString(),
    };
    
    setPosting(true);
    try {
      setMessages((prev) => [...prev, optimisticMessage]);
      setText('');
      Keyboard.dismiss();
      
      setTimeout(() => {
        listRef.current?.scrollToEnd?.({ animated: true });
      }, 100);

      const response = await postChapterMessage(clubId, current, messageText, token);
      
      if (response?.data?.id) {
        setMessages((prev) => 
          prev.map((m) => (m.id === optimisticMessage.id ? response.data : m))
        );
      } else if (response?.data) {
        setMessages((prev) => 
          prev.map((m) => (m.id === optimisticMessage.id ? response.data : m))
        );
      } else {
        setMessages((prev) => 
          prev.map((m) => 
            m.id === optimisticMessage.id 
              ? { ...m, id: `sent_${Date.now()}`, status: 'sent' }
              : m
          )
        );
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        await logout();
        navigation.navigate('Login');
        return;
      }
      
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setText(messageText);
    } finally {
      setPosting(false);
    }
  }, [text, token, current, clubId, logout, navigation]);

  const headerTitle = useMemo(() => club?.name || 'Club de lectura', [club?.name]);
  
  useEffect(() => {
    navigation.setOptions({ title: headerTitle });
  }, [navigation, headerTitle]);

  const MessageRow = ({ item }) => {
    // Usar el avatar real del usuario actual si coincide con el mensaje
    const isCurrentUser = user && item.userId === user.id;
    const avatarToUse = isCurrentUser ? user.avatar : item.userAvatar;
    
    // Debug del mensaje completo
    console.log('🔍 ClubRoom: MessageRow item:', {
      id: item.id,
      userId: item.userId,
      userName: item.userName,
      userAvatar: item.userAvatar,
      isCurrentUser: isCurrentUser,
      avatarToUse: avatarToUse,
      currentUserAvatar: user?.avatar,
      text: item.text?.substring(0, 50) + '...',
      allKeys: Object.keys(item)
    });
    
    return (
      <View style={styles.msgRow}>
        <Image 
          source={{ 
            uri: avatarToUse || 'https://i.pravatar.cc/150?u=default',
            cache: 'reload'
          }} 
          style={styles.msgAvatar}
          onLoad={() => console.log('✅ ClubRoom: Message avatar loaded:', {
            userId: item.userId,
            userName: item.userName,
            avatar: avatarToUse,
            isCurrentUser: isCurrentUser,
            usingFallback: !avatarToUse
          })}
          onError={(error) => console.log('❌ ClubRoom: Message avatar failed to load:', error)}
        />
        <View style={styles.msgBubble}>
          <Text style={styles.msgAuthor}>{item.userName || 'Usuario'}</Text>
          <Text style={styles.msgText}>{item.text}</Text>
          {!!item.createdAt && (
            <Text style={styles.msgTime}>{new Date(item.createdAt).toLocaleString()}</Text>
          )}
        </View>
      </View>
    );
  };

  const currentMeta = chapters.find((c) => c.chapter === current);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            {!!club?.cover && <Image source={{ uri: club.cover }} style={styles.cover} />}
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{club?.name}</Text>
              <Text style={styles.subtitle}>{club?.members || 0} miembros</Text>
            </View>
          </View>

          <View style={styles.selectorContainer}>
            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => setPickerVisible(true)}
              activeOpacity={0.9}
            >
              <MaterialIcons name="menu-book" size={16} color="#fff" />
              <Text style={styles.selectorText}>
                {currentMeta
                  ? `Cap. ${currentMeta.chapter}${
                      currentMeta.title ? ` · ${currentMeta.title}` : ''
                    }`
                  : 'Capítulos'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={{ flex: 1 }}>
          {loadingMsgs ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(m) => String(m.id)}
              renderItem={({ item }) => <MessageRow item={item} />}
              contentContainerStyle={[
                styles.msgList,
                { paddingBottom: keyboardHeight > 0 ? 20 : 80 }
              ]}
              onContentSizeChange={() => listRef.current?.scrollToEnd?.({ animated: false })}
              ListEmptyComponent={
                <Text style={{ textAlign: 'center', color: '#777', marginTop: 18 }}>
                  No hay mensajes en este capítulo.
                </Text>
              }
            />
          )}
        </View>

        <View style={[styles.inputRow, { marginBottom: keyboardHeight > 0 ? 10 : 16 }]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={`Mensaje para cap. ${current}`}
            editable={!posting}
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && { opacity: 0.5 }]}
            onPress={sendMessage}
            disabled={!text.trim() || posting}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={pickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.pickerCard}>
            <Text style={styles.modalTitle}>Elegir capítulo</Text>
            <FlatList
              data={[...chapters].sort((a, b) => a.chapter - b.chapter)}
              keyExtractor={(c) => `c_${c.chapter}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, item.chapter === current && styles.pickerItemActive]}
                  onPress={() => {
                    setCurrent(item.chapter);
                    setPickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      item.chapter === current && styles.pickerItemTextActive,
                    ]}
                  >
                    Cap. {item.chapter}
                    {item.title ? ` · ${item.title}` : ''}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyChaptersText}>Este club no tiene capítulos.</Text>
              }
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setPickerVisible(false)}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },

  headerCard: {
    margin: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#727272',
  },

  selectorContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectorText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginHorizontal: 12,
  },

  msgList: {
    padding: 12,
  },
  msgRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  msgAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  msgBubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 1,
  },
  msgAuthor: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#1f2937',
  },
  msgText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#111',
    marginTop: 2,
  },
  msgTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#888',
    marginTop: 6,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FAF8F5',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sendBtn: {
    backgroundColor: '#5A4FFF',
    borderRadius: 12,
    padding: 12,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerCard: {
    width: '86%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  pickerItemActive: {
    backgroundColor: '#EEF2FF',
  },
  pickerItemText: {
    fontFamily: 'Poppins-Medium',
    color: '#1f2937',
  },
  pickerItemTextActive: {
    color: '#4338CA',
  },
  emptyChaptersText: {
    color: '#666',
    padding: 12,
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#111',
    marginTop: 8,
  },
  modalCloseText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
});
