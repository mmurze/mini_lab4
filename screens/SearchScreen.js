import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, Text, TextInput } from 'react-native';
import { Avatar, Input, ListItem } from 'react-native-elements';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import ChatListItem from '../components/ChatListItem';
import { AntDesign, FontAwesome, Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import { auth, db } from '../firebase';
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome"



const FindChatScreen = ({ navigation }) => {
    // Отслеживаем и обрабатываем изменения списка чатов
    const [chats, setChats] = useState([]);
    const [input, setInput] = useState('');

    // Если введенный текст совпадает с началом назавания / самим названием чата, то выводить чат
    useEffect(() => {
        const q = query(collection(db, "chats"), where("chatName", '!=', ""));
        const unsubscribe = onSnapshot(q, (querySnaphots) => {
            const chats = [];
            querySnaphots.forEach((doc) => {
                let flag = true;
                for (let i = 0; i < input.length; i++) {
                    if (doc.data().chatName[i] != input[i]) {
                        flag = false;
                    }
                }
                if (flag) {
                    chats.push({
                        id: doc.id,
                        data: doc.data()
                    });
                }
            });
            console.log(chats);
            setChats(chats);
        });
        return unsubscribe;
    }, [input])

    // Перед отрисовкой UI настраиваем содержимое верхней плашки
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Find Chat",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },

            // Задаем разметку частей слева и справа от заголовка
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>

                    <TouchableOpacity style={{ marginLeft: 10 }}
                        onPress={navigation.goBack}>
                        <Ionicons name="chevron-back-outline" size={24} color="green" />
                    </TouchableOpacity>

                </View>
            )
        })
    }, [navigation])

    // Переходим на экран чата; при этом передаем id и name выбранного чата, 
    // чтобы на экране чата отобразить нужное содержимое 

    //(Надо бы запихнуть этот компонент отдельно, чтобы код не дублировать)
    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", { id, chatName, })
    }
    return (
        <SafeAreaView>
            <View>

                <Input placeholder='Enter a chat name' onChangeText={(text) => setInput(text)}></Input>

            </View>
            <ScrollView style={styles.container}>
                {chats.map(({ id, data: { chatName } }) => (
                    <ChatListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
};

export default FindChatScreen

const styles = StyleSheet.create({
    container: {
        height: "100%"
    }
})