import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

import Constants from 'expo-constants';

export default function Main({ navigation }) {
  const id = navigation.getParam('user');
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      const { data } = await api.get('/devs', {
        headers: { user: id },
      });

      setUsers(data);
    }

    loadUsers();
  }, [id, matchDev]);

  useEffect(() => {
    const socket = io('http://192.168.0.103:3333', {
      query: { user: id },
    });

    socket.on('match', (dev) => {
      setMatchDev(dev);
    });
  }, [id, matchDev]);

  async function handleLike(_id) {
    function removeItemArray(array, index) {
      const filter = array.filter((arr) => arr._id !== index);
      return filter;
    }
    const newUsers = removeItemArray(users, _id);

    await api.post(`/devs/${_id}/likes`, null, {
      headers: { user: id },
    });

    setUsers(newUsers);
  }

  async function handleDislike() {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: { user: id },
    });

    setUsers(rest);
  }

  async function handleLogout() {
    AsyncStorage.clear();

    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <FlatList
        style={styles.cardsContainer}
        data={users}
        renderItem={({ item }) => (
          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Image style={styles.avatar} source={{ uri: item.avatar }} />
              <View style={styles.footer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {item.bio}
                </Text>
              </View>
            </View>

            {item && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleDislike} style={styles.button}>
                  <Image source={dislike} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleLike(item._id)}
                  style={styles.button}
                >
                  <Image source={like} />
                </TouchableOpacity>
              </View>
            )}

            {matchDev && (
              <View style={styles.matchContainer}>
                <Image style={styles.matchImage} source={itsamatch} />
                <Image
                  style={styles.matchAvatar}
                  source={{ uri: matchDev.avatar }}
                />

                <Text style={styles.matchName}>{matchDev.name}</Text>
                <Text style={styles.matchBio}>{matchDev.bio}</Text>

                <TouchableOpacity onPress={() => setMatchDev(null)}>
                  <Text style={styles.closeMatch}>Fechar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    marginTop: 50,
  },
  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
  },
  avatar: {
    flex: 1,
    height: 300,
    backgroundColor: '#DDD',
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 10,
  },
  button: {
    flex: 1,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
  },
  empty: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  matchImage: {
    height: 60,
    resizeMode: 'contain',
  },

  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#FFF',
    marginVertical: 30,
  },

  matchName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },

  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  closeMatch: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
});
