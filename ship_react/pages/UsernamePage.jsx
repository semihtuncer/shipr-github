import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import axios from "axios";
import { UserContext } from "../context/userContext";

export default function UsernamePage({ setPage, page }) {
  const [username, setUsername] = useState("");
  const [transition, setTransition] = useState(false);

  const { setRegisteryUser, registeryUser } = useContext(UserContext);

  const transVal = 1250;
  const usernameMinLength = 4;

  const continueButtonOpacity = useSharedValue(0.4);
  const transitionScale = useSharedValue(transVal);

  const capitalizeString = (val) => {
    if (val === undefined) return "";

    str = val.split(" ");
    for (var i = 0; i < str.length; i++) {
      if (str[i][0] !== undefined)
        str[i] = str[i][0].toUpperCase() + str[i].substring(1);
    }
    return str.join(" ");
  };
  const checkUsername = (val) => {
    for (let i = 0; i < val.length; i++) {
      const c = val[i];
      const lastC = val[i - 1];

      if (lastC) {
        if (c === " " && lastC === " ") {
          var n = val.slice(0, i) + val.slice(i + 1, val.length);
          val = n;
        }
      } else {
        if (c === " ") {
          var n = val.slice(0, i) + val.slice(i + 1, val.length);
          val = n;
        }
      }
    }

    return val;
  };

  const handleHelp = () => {};
  const onPress = () => {
    if (username.length >= usernameMinLength && !transition) {
      continueButtonOpacity.value = 1;
      transitionScale.value = transVal;
      setTransition(true);

      setRegisteryUser({
        phoneNum: registeryUser.phoneNum,
        username: username.trim(),
      });

      setTimeout(() => setPage("GENDER"), 1000);
    }
  };

  useEffect(() => {
    const formatName = capitalizeString(checkUsername(username));
    setUsername(formatName);

    continueButtonOpacity.value =
      username.length >= usernameMinLength ? 1 : 0.4;
  }, [username]);
  useEffect(() => {
    if (page === "USERNAME") {
      transitionScale.value = 0;
    }
  }, [page]);

  const animatedContinueButton = useAnimatedStyle(() => ({
    opacity: withSpring(continueButtonOpacity.value),
  }));
  const animatedTransition = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(transitionScale.value, { duration: 350 }) },
    ],
  }));

  return (
    <View style={styles.main}>
      <Image style={styles.blob1} source={require("../src/VectorBlob1.png")} />
      <Image style={styles.blob2} source={require("../src/VectorBlob2.png")} />
      <View style={styles.top}>
        <Text style={styles.title}>ShipR.</Text>
        <Text style={styles.help} onPress={handleHelp}>
          Help
        </Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.label}>This should be your real name</Text>
        <TextInput
          autoFocus
          style={styles.usernameInput}
          value={username}
          keyboardType="default"
          multiline={true}
          maxLength={100}
          selectionColor={"whitesmoke"}
          autoComplete="name"
          onChangeText={setUsername}
          placeholder="Jon Doe"
        />
        <Text style={styles.warning}>
          {username.length < usernameMinLength
            ? "Too short for a name."
            : username.length > 12
            ? "That's a really long name!"
            : "Nice name"}
        </Text>
      </View>
      <KeyboardAvoidingView style={styles.bottom} behavior="position">
        <Animated.View
          style={[styles.button, animatedContinueButton]}
          onTouchStart={() => {
            if (username.length >= usernameMinLength && !transition)
              continueButtonOpacity.value = 0.6;
          }}
          onTouchEnd={onPress}
        >
          <Text
            style={{
              color: "whitesmoke",
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            This is my name!
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
      <Animated.View
        style={[styles.transition, animatedTransition]}
      ></Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  transition: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 1000,
    borderRadius: 10000,
    width: 1,
    height: 1,
    bottom: 0,
    backgroundColor: "#ff85ea",
    marginBottom: 350,
  },
  blob1: {
    position: "absolute",
    tintColor: "#ff85ea",
    marginRight: -25,
    right: 0,
    transform: "scaleX(-1)",
  },
  blob2: {
    position: "absolute",
    tintColor: "#ff85ea",
    left: 0,
    marginLeft: -255,
    transform: "rotate(200deg)",
    bottom: 0,
    marginBottom: 275,
    transform: "scaleY(-1)",
  },
  main: {
    height: "100%",
    width: "100%",
    backgroundColor: "#080b10",
    display: "flex",
  },
  top: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  middle: {
    flex: 5,
    display: "flex",
    alignItems: "center",
  },
  bottom: {
    flex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "whitesmoke",
    marginTop: 45,
  },
  help: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: 18,
    marginBottom: 35,
    fontSize: 16,
    fontWeight: "400",
    color: "whitesmoke",
    marginTop: 25,
  },
  label: {
    width: "100%",
    textAlign: "center",
    marginTop: 6,
    fontSize: 24,
    color: "whitesmoke",
    fontWeight: "600",
  },
  warning: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 30,
    textAlign: "center",
    marginHorizontal: 15,
  },
  button: {
    backgroundColor: "#ff85ea",
    width: 325,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  usernameInput: {
    width: 375,
    marginTop: 15,
    color: "whitesmoke",
    textAlign: "center",
    fontSize: 35,
    fontWeight: "700",
  },
});
