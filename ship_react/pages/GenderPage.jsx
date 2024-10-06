import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { UserContext } from "../context/userContext";

export default function GenderPage({ setPage, page }) {
  const [gender, setGender] = useState(-1);
  const [transition, setTransition] = useState(false);

  const { setRegisteryUser, registeryUser } = useContext(UserContext);

  const transVal = 1250;

  const continueButtonOpacity = useSharedValue(0.4);
  const transitionScale = useSharedValue(transVal);

  const handleHelp = () => {};
  const onPress = () => {
    if (gender === -1) return;

    setTransition(true);
    continueButtonOpacity.value = 1;
    transitionScale.value = transVal;

    setRegisteryUser({
      phoneNum: registeryUser.phoneNum,
      username: registeryUser.username,
      gender: gender,
    });

    setTimeout(() => setPage("BIRTHDAY"), 1000);
  };

  const onGenderPress = (ndx) => {
    setGender(ndx);
    continueButtonOpacity.value = 1;
  };

  useEffect(() => {
    if (page === "GENDER") {
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
        <Text style={styles.label}>I identify as...</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            onPress={() => onGenderPress(0)}
            style={[
              styles.genderButton,
              { backgroundColor: "#5f8cd4" },
              gender === 0 && styles.genderButtonPressed,
            ]}
          >
            <Text style={styles.genderLabel}>MAN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onGenderPress(1)}
            style={[
              styles.genderButton,
              { backgroundColor: "#d45f6d" },
              gender === 1 && styles.genderButtonPressed,
            ]}
          >
            <Text style={styles.genderLabel}>WOMAN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onGenderPress(2)}
            style={[
              styles.genderButton,
              { backgroundColor: "rgba(255, 255, 255, 0.4)" },
              gender === 2 && styles.genderButtonPressed,
            ]}
          >
            <Text style={styles.genderLabel}>NON BINARY</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.warning}>Share your most authentic self</Text>
      </View>
      <KeyboardAvoidingView style={styles.bottom} behavior="position">
        <Animated.View
          style={[styles.button, animatedContinueButton]}
          onTouchStart={() => {
            if (gender !== -1) continueButtonOpacity.value = 0.6;
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
            Go go go
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
  genderContainer: {
    width: "80%",
    marginTop: 25,
    height: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  genderButton: {
    paddingHorizontal: 12,
    paddingVertical: 25,
    borderRadius: 25,
  },
  genderButtonPressed: {
    paddingHorizontal: 12,
    paddingVertical: 25,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "whitesmoke",
  },
  genderLabel: {
    color: "whitesmoke",
    fontSize: 17,
    fontWeight: "500",
  },
  transition: {
    position: "absolute",
    alignSelf: "center",
    bottom: 0,
    zIndex: 1000,
    borderRadius: 10000,
    width: 1,
    height: 1,
    marginBottom: 350,
    backgroundColor: "#ff85ea",
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
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  input: {
    marginTop: 15,
    color: "whitesmoke",
    fontSize: 40,
    fontWeight: "700",
  },
});
