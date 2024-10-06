import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import ChatBanner from "../components/ChatBanner";

export default function ChatPage({ navigation }) {
  const TEMP_CHATBOX_COUNT = 5;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Chat</Text>
      </View>

      <View style={styles.bannerContainerBack}>
        <ScrollView
          contentContainerStyle={styles.bannerContainer}
          scrollsToTop={true}
          persistentScrollbar={false}
        >
          {Array.from({ length: TEMP_CHATBOX_COUNT }).map((index) => {
            return <ChatBanner key={Math.random()}></ChatBanner>;
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#080b10",
    alignItems: "center",
  },
  topBar: {
    marginTop: 45,
    height: 80,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 30,
  },
  bannerContainerBack: {
    marginTop: 30,
    height: 620,
    width: 375,
    borderRadius: 50,
    backgroundColor: "#212328",
    overflow: "hidden",
  },
});
