import React, { useContext, useEffect, useState } from "react";
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
import AntDesign from "react-native-vector-icons/AntDesign";

import { UserContext } from "../context/userContext";

function InterestsBanner({ interest, setInterests }) {
  const onClick = () => {
    setInterests((prev) => prev.filter((a) => a.id !== interest.id));
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#ff85ea",
        padding: 10,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={onClick}
    >
      <View
        style={{
          padding: 2,
          position: "absolute",
          top: -5,
          right: -5,
          zIndex: 25,
          width: 15,
          height: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AntDesign name={"closecircle"} color={"whitesmoke"} size={10} />
      </View>
      <Text
        style={{
          color: "whitesmoke",
          textAlign: "center",
          fontSize: 15,
        }}
      >
        {interest.text}
      </Text>
    </TouchableOpacity>
  );
}

export default function InterestsPage({ setPage, page }) {
  const [interestsInput, setInterestsInput] = useState("");
  const [transition, setTransition] = useState(false);
  const [interestCount, setInterestCount] = useState(0);
  const [interests, setInterests] = useState([]);

  const { setRegisteryUser, registeryUser } = useContext(UserContext);

  const transVal = 1250;
  const minInterests = 2;
  const maxInterests = 4;

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
  const checkInput = (val) => {
    for (let i = 0; i < val.length; i++) {
      const c = val[i];
      const lastC = val[i - 1];

      if (lastC) {
        if (c === " " && lastC === " ") {
          var n = val.slice(0, i) + val.slice(i + 1, val.length);
          val = n;
        } else if (c === " " && lastC !== " ") {
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
    if (
      interestCount >= minInterests &&
      !transition &&
      interestCount <= maxInterests
    ) {
      continueButtonOpacity.value = 1;
      transitionScale.value = transVal;
      setTransition(true);

      const a = interests.map((b) => b.text.trim());

      setRegisteryUser({
        phoneNum: registeryUser.phoneNum,
        username: registeryUser.username,
        gender: registeryUser.gender,
        birthday: registeryUser.birthday,
        interests: a,
      });

      setTimeout(() => setPage("PHOTO"), 1000);
    }
  };

  useEffect(() => {
    const formatName = capitalizeString(
      checkInput(interestsInput.replaceAll("\n", ""))
    );

    if (
      (interestsInput.endsWith(" ") || interestsInput.endsWith("\n")) &&
      interestsInput.length > 1
    ) {
      const a = interests;
      a.push({
        text: formatName,
        id: interests.length,
      });
      setInterests(a);
      setInterestsInput("");
      setInterestCount(interestCount + 1);
    } else {
      setInterestsInput(formatName);
    }

    continueButtonOpacity.value =
      interestCount >= minInterests &&
      !transition &&
      interestCount <= maxInterests
        ? 1
        : 0.4;
  }, [interestsInput, interestCount]);
  useEffect(() => {
    if (page === "INTERESTS") {
      transitionScale.value = 0;
    }
  }, [page]);
  useEffect(() => {
    setInterestCount(interests.length);
  }, [interests]);

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
        <Text style={styles.label}>Let's get to know each other</Text>
        <TextInput
          autoFocus
          style={styles.input}
          value={interestsInput}
          keyboardType="default"
          multiline={true}
          selectionColor={"whitesmoke"}
          placeholder="Reading, movies, games..."
          onChangeText={setInterestsInput}
          maxLength={12}
        />
        <View style={styles.holder}>
          {interests.map((a) => (
            <InterestsBanner
              interest={a}
              key={a.id}
              setInterests={setInterests}
            />
          ))}
        </View>
        <Text
          style={[
            styles.count,
            interestCount > maxInterests && { color: "red" },
          ]}
        >
          {interestCount + "/" + maxInterests}
        </Text>
        <Text style={styles.warning}>
          What are your interests each in one word
        </Text>
      </View>
      <KeyboardAvoidingView style={styles.bottom} behavior="position">
        <Animated.View
          style={[styles.button, animatedContinueButton]}
          onTouchStart={() => {
            if (
              interestCount >= minInterests &&
              !transition &&
              interestCount <= maxInterests
            )
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
            {interestCount >= minInterests
              ? "Continue"
              : "You need at least " + minInterests}
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
  input: {
    backgroundColor: "#ff85ebb",
    borderRadius: 15,
    width: 375,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 15,
    color: "whitesmoke",
    fontSize: 25,
    fontWeight: "400",
  },
  holder: {
    backgroundColor: "#ff85eb17",
    borderRadius: 15,
    width: 340,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginTop: 15,
    color: "whitesmoke",
    fontSize: 25,
    fontWeight: "300",
    display: "flex",
    alignItems: "flex-start",
    columnGap: 10,
    rowGap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  count: {
    fontSize: 15,
    color: "whitesmoke",
    width: "85%",
    textAlign: "right",
  },
});
