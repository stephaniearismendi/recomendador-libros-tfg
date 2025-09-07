import React, { useCallback, useEffect, useMemo, useRef, useState, useContext } from 'react';
import {
  View,
  Text,
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
import { clubRoomStyles } from '../styles/components';
import { 
  createOptimisticMessage,
  updateMessageWithResponse,
  removeOptimisticMessage,
  getFirstChapter,
  sortChapters,
  getChapterDisplayText,
  validateTokenAndHandleExpiry
} from '../utils/clubRoomUtils';
import { getUserAvatar } from '../utils/userUtils';

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

        setCurrent(getFirstChapter(chapters));
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
    
    if (!(await validateTokenAndHandleExpiry(token, logout, navigation))) {
      return;
    }
    
    const optimisticMessage = createOptimisticMessage(messageText, user);
    
    setPosting(true);
    try {
      setMessages((prev) => [...prev, optimisticMessage]);
      setText('');
      Keyboard.dismiss();
      
      setTimeout(() => {
        listRef.current?.scrollToEnd?.({ animated: true });
      }, 100);

      const response = await postChapterMessage(clubId, current, messageText, token);
      setMessages((prev) => updateMessageWithResponse(prev, optimisticMessage.id, response));
    } catch (error) {
      if (error?.response?.status === 401) {
        await logout();
        navigation.navigate('Login');
        return;
      }
      
      setMessages((prev) => removeOptimisticMessage(prev, optimisticMessage.id));
      setText(messageText);
    } finally {
      setPosting(false);
    }
  }, [text, token, current, clubId, logout, navigation, user]);

  const headerTitle = useMemo(() => club?.name || 'Club de lectura', [club?.name]);
  
  useEffect(() => {
    navigation.setOptions({ title: headerTitle });
  }, [navigation, headerTitle]);

  const MessageRow = ({ item }) => {
    const isCurrentUser = user && item.userId === user.id;
    const avatarToUse = isCurrentUser ? getUserAvatar(user) : item.userAvatar;
    
    return (
      <View style={clubRoomStyles.msgRow}>
        <Image 
          source={{ 
            uri: avatarToUse,
            cache: 'reload'
          }} 
          style={clubRoomStyles.msgAvatar}
        />
        <View style={clubRoomStyles.msgBubble}>
          <Text style={clubRoomStyles.msgAuthor}>{item.userName || 'Usuario'}</Text>
          <Text style={clubRoomStyles.msgText}>{item.text}</Text>
          {!!item.createdAt && (
            <Text style={clubRoomStyles.msgTime}>{new Date(item.createdAt).toLocaleString()}</Text>
          )}
        </View>
      </View>
    );
  };

  const currentMeta = chapters.find((c) => c.chapter === current);

  if (loading) {
    return (
      <SafeAreaView style={clubRoomStyles.safe}>
        <ActivityIndicator style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={clubRoomStyles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={clubRoomStyles.headerCard}>
          <View style={clubRoomStyles.headerContent}>
            {!!club?.cover && <Image source={{ uri: club.cover }} style={clubRoomStyles.cover} />}
            <View style={clubRoomStyles.headerInfo}>
              <Text style={clubRoomStyles.title}>{club?.name}</Text>
              <Text style={clubRoomStyles.subtitle}>{club?.members || 0} miembros</Text>
            </View>
          </View>

          <View style={clubRoomStyles.selectorContainer}>
            <TouchableOpacity
              style={clubRoomStyles.selectorBtn}
              onPress={() => setPickerVisible(true)}
              activeOpacity={0.9}
            >
              <MaterialIcons name="menu-book" size={16} color="#fff" />
              <Text style={clubRoomStyles.selectorText}>
                {getChapterDisplayText(currentMeta)}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={clubRoomStyles.divider} />

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
                clubRoomStyles.msgList,
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

        <View style={[clubRoomStyles.inputRow, { marginBottom: keyboardHeight > 0 ? 10 : 16 }]}>
          <TextInput
            ref={inputRef}
            style={clubRoomStyles.input}
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
            style={[clubRoomStyles.sendBtn, !text.trim() && { opacity: 0.5 }]}
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
        <View style={clubRoomStyles.modalBackdrop}>
          <View style={clubRoomStyles.pickerCard}>
            <Text style={clubRoomStyles.modalTitle}>Elegir capítulo</Text>
            <FlatList
              data={sortChapters(chapters)}
              keyExtractor={(c) => `c_${c.chapter}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[clubRoomStyles.pickerItem, item.chapter === current && clubRoomStyles.pickerItemActive]}
                  onPress={() => {
                    setCurrent(item.chapter);
                    setPickerVisible(false);
                  }}
                >
                  <Text
                    style={[
                      clubRoomStyles.pickerItemText,
                      item.chapter === current && clubRoomStyles.pickerItemTextActive,
                    ]}
                  >
                    {getChapterDisplayText(item)}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={clubRoomStyles.emptyChaptersText}>Este club no tiene capítulos.</Text>
              }
            />
            <TouchableOpacity style={clubRoomStyles.modalCloseBtn} onPress={() => setPickerVisible(false)}>
              <Text style={clubRoomStyles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

