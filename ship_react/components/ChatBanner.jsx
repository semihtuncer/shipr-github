import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";

export default function ChatBanner({ ndx, last }) {
  return (
    <TouchableOpacity style={[styles.main, { marginTop: ndx == 0 ? 0 : 18 }]}>
      <Image style={styles.image}></Image>
      <View style={styles.labelContainer}>
        <Text style={styles.nameLabel}>Jane Doe</Text>
        <Text style={styles.messageLabel}>Hello world!</Text>
      </View>
      {!last && <View style={styles.seperator}></View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: 74,
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  seperator: {
    width: "100%",
    height: 3,
    backgroundColor: "#080b10",
    opacity: 0.5,
    position: "absolute",
    bottom: -10,
    alignSelf: "center",
  },
  nameLabel: {
    color: "white",
    fontWeight: "600",
    fontSize: 22,
  },
  image: {
    width: 60,
    height: 60,
    marginLeft: 15,
    borderRadius: 50,
    backgroundColor: "white",
  },
  messageLabel: {
    color: "white",
    fontWeight: "300",
    fontSize: 15,
    marginTop: 5,
    opacity: 0.6,
  },
  labelContainer: {
    marginLeft: 12,
    height: "90%",
    marginTop: 15,
  },
});
