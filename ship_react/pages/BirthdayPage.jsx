import React, { useContext, useEffect, useRef, useState } from "react";
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

export default function BirthdayPage({ setPage, page }) {
  const [birthday, setBirthday] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birth, setBirth] = useState(null);
  const [age, setAge] = useState(null);
  const [transition, setTransition] = useState(false);

  const { setRegisteryUser, registeryUser } = useContext(UserContext);

  const transVal = 1250;
  const minAge = 18;
  const maxAge = 99;

  const dayInput = useRef(null);
  const monthInput = useRef(null);
  const yearInput = useRef(null);

  const continueButtonOpacity = useSharedValue(0.4);
  const transitionScale = useSharedValue(transVal);

  const dateValid = (date) => {
    if (
      date.getFullYear() == parseInt(birthYear) &&
      date.getMonth() == parseInt(birthMonth - 1) &&
      date.getDate() == parseInt(birthday)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const check = (newAge) => {
    const a = newAge ? newAge : age;

    return (
      birthday.length === 2 &&
      birthMonth.length === 2 &&
      birthYear.length === 4 &&
      !transition &&
      dateValid(birth) &&
      a >= minAge &&
      a <= maxAge
    );
  };

  const handleHelp = () => {};
  const onPress = () => {
    if (check()) {
      continueButtonOpacity.value = 1;
      setRegisteryUser({
        phoneNum: registeryUser.phoneNum,
        username: registeryUser.username,
        gender: registeryUser.gender,
        birthday: birth,
      });

      transitionScale.value = transVal;
      setTransition(true);
      setTimeout(() => setPage("INTERESTS"), 1000);
    }
  };

  useEffect(() => {
    const a = parseInt(birthday);
    if (a > 31) setBirthday("31");
    const newDate = new Date(
      parseInt(birthYear),
      parseInt(birthMonth - 1),
      parseInt(birthday)
    );
    setBirth(newDate);
    if (birthday.length === 2) {
      monthInput.current?.focus();
    }
  }, [birthday]);
  useEffect(() => {
    const a = parseInt(birthMonth);
    if (a > 12) setBirthMonth("12");

    const newDate = new Date(
      parseInt(birthYear),
      parseInt(birthMonth - 1),
      parseInt(birthday)
    );
    setBirth(newDate);

    if (birthMonth.length === 2) {
      yearInput.current?.focus();
    }
  }, [birthMonth]);
  useEffect(() => {
    const newDate = new Date(
      parseInt(birthYear),
      parseInt(birthMonth - 1),
      parseInt(birthday)
    );
    setBirth(newDate);
  }, [birthYear]);

  useEffect(() => {
    const a = getAge(birth);
    setAge(a);

    continueButtonOpacity.value = check(a) ? 1 : 0.4;
  }, [birth]);

  useEffect(() => {
    if (page === "BIRTHDAY") {
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
        <Text style={styles.label}>How old are you?</Text>
        <View style={styles.holder}>
          <TextInput
            autoComplete="birthdate-day"
            autoFocus
            style={[styles.input, { width: 60 }]}
            value={birthday}
            keyboardType="numeric"
            maxLength={2}
            selectionColor={"whitesmoke"}
            onChangeText={setBirthday}
            placeholder="DD"
            ref={dayInput}
          />
          <TextInput
            autoComplete="birthdate-month"
            style={[styles.input, { width: 70 }]}
            value={birthMonth}
            keyboardType="number-pad"
            maxLength={2}
            selectionColor={"whitesmoke"}
            onChangeText={setBirthMonth}
            placeholder="MM"
            ref={monthInput}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                if (birthMonth.length === 0) {
                  dayInput.current?.focus();
                  setBirthMonth("");
                }
              }
            }}
          />
          <TextInput
            autoComplete="birthdate-year"
            style={[styles.input, { width: 120 }]}
            value={birthYear}
            keyboardType="number-pad"
            maxLength={4}
            selectionColor={"whitesmoke"}
            onChangeText={setBirthYear}
            placeholder="YYYY"
            ref={yearInput}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace") {
                if (birthYear.length === 0) {
                  monthInput.current?.focus();
                  setBirthYear("");
                }
              }
            }}
          />
        </View>
        <Text style={styles.warning}>
          {birth && !dateValid(birth) && "You need to enter an existing day."}
        </Text>
      </View>
      <KeyboardAvoidingView style={styles.bottom} behavior="position">
        <Animated.View
          style={[styles.button, animatedContinueButton]}
          onTouchStart={() => {
            if (check()) continueButtonOpacity.value = 0.6;
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
            {age >= 0 && age < minAge && "I'am a new born!"}
            {age > maxAge && "I'am too old for this..."}
            {age >= minAge && age <= maxAge && "I am " + age + "."}
            {age < 0 && "I come from the future."}
            {isNaN(birth) && "Continue"}
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
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  input: {
    marginTop: 15,
    color: "whitesmoke",
    fontSize: 40,
    fontWeight: "700",
  },
  holder: {
    display: "flex",
    flexDirection: "row",
    columnGap: 10,
    marginLeft: 15,
  },
});
