import axios from "axios";
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
import { UserContext } from "../context/userContext";

export default function OTPPage({ setPage, page, navigation }) {
  const [otpCode, setOTPCode] = useState("");
  const [transition, setTransition] = useState(false);
  const [loop, setLoop] = useState(0);
  const [counter, setCounter] = useState(new Date());
  const [secsLeft, setSecsLeft] = useState(COUNTDOWN);
  const [warn, setWarn] = useState("");

  const {
    host,
    setRegisteryToken,
    user,
    setUser,
    setRegisteryUser,
    saveUserLocal,
  } = useContext(UserContext);

  const transVal = 1250;
  const COUNTDOWN = 45;

  const continueButtonOpacity = useSharedValue(0.4);
  const transitionScale = useSharedValue(transVal);

  const handleHelp = () => {};
  const onPress = () => {
    if (!transition && otpCode.length === 6) {
      continueButtonOpacity.value = 1;

      axios
        .post(host + "auth/verify_otp", {
          phoneNum: user.phoneNum,
          code: otpCode,
        })
        .then((result) => {
          if (result.status === 200) {
            transitionScale.value = transVal;
            setTransition(true);

            setUser(result.data);
            saveUserLocal(result.data);
            setRegisteryUser({});

            setTimeout(() => navigation.navigate("MainStack"), 1000);
          } else if (result.status === 201) {
            transitionScale.value = transVal;
            setTransition(true);

            setRegisteryToken(result.data.registerToken);

            setTimeout(() => setPage("USERNAME"), 1000);
          } else {
            setTransition(false);
            setWarn("wrong code");
          }
        })
        .catch((err) => {
          setWarn("wrong code");
          setTransition(false);
        });
    }
  };
  const requestOtp = () => {
    if (secsLeft > 0) return;

    axios
      .post(host + "auth/request_otp", {
        phoneNum: user.phoneNum,
      })
      .then((result) => {
        if (result.status === 200) {
          setLoop(0);
          setCounter(new Date());
          setSecsLeft(COUNTDOWN);
          setWarn("");
        }
      })
      .catch((err) => {
        setTransition(false);
      });
  };
  const handleBack = () => {
    transitionScale.value = transVal;
    setTransition(true);
    setTimeout(() => setPage("PHONENUM"), 1000);
  };

  useEffect(() => {
    if (page === "OTP") {
      transitionScale.value = 0;
      setSecsLeft(COUNTDOWN);
      setCounter(new Date());
      setLoop(0);
    }
  }, [page]);
  useEffect(() => {
    if (otpCode.length === 6) setTimeout(onPress, 500);
    if (otpCode.length === 0) setWarn("");

    continueButtonOpacity.value = otpCode.length === 6 ? 1 : 0.4;
  }, [otpCode]);
  useEffect(() => {
    const timer = setInterval(() => {
      setLoop((time) => time + 1);
    }, 1000);

    if (secsLeft <= 0) setSecsLeft(0);

    const secs = (new Date().getTime() - counter.getTime()) / 1000;
    setSecsLeft((COUNTDOWN - secs).toFixed());

    return () => {
      clearInterval(timer);
    };
  }, [loop]);

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
        <Text style={styles.back} onPress={handleBack}>
          {"< "}Back
        </Text>
        <Text style={styles.title}>ShipR.</Text>
        <Text style={styles.help} onPress={handleHelp}>
          Help
        </Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.label}>Enter verification code.</Text>
        <TextInput
          autoFocus
          style={styles.otpInput}
          placeholder="••••••"
          keyboardType="number-pad"
          maxLength={6}
          selectionColor={"whitesmoke"}
          autoComplete="sms-otp"
          onChangeText={setOTPCode}
        />
        <Text
          style={[
            styles.warning,
            {
              color: "red",
              fontSize: 12,
              marginTop: 40,
              fontWeight: "600",
              position: "absolute",
            },
          ]}
        >
          {warn}
        </Text>
        <Text style={styles.warning} onTouchEnd={requestOtp}>
          {secsLeft <= 0 ? "Click to resend" : "Resend in " + secsLeft + "s"}
        </Text>
      </View>
      <KeyboardAvoidingView style={styles.bottom} behavior="position">
        <Animated.View
          style={[styles.button, animatedContinueButton]}
          onTouchStart={() => {
            if (!transition && otpCode.length === 6)
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
            Verify
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
    tintColor: "#080b10",
    marginLeft: -25,
  },
  blob2: {
    position: "absolute",
    tintColor: "#080b10",
    right: 0,
    marginRight: -255,
    transform: "rotate(200deg)",
    bottom: 0,
    marginBottom: 305,
  },
  main: {
    height: "100%",
    width: "100%",
    backgroundColor: "#ff85ea",
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
  back: {
    position: "absolute",
    left: 0,
    bottom: 0,
    marginLeft: 18,
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
    marginTop: 15,
    textAlign: "center",
    marginHorizontal: 15,
  },
  button: {
    backgroundColor: "#080b10",
    width: 325,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpInput: {
    marginTop: 25,
    width: 250,
    height: 75,
    color: "whitesmoke",
    textAlign: "center",
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: 10,
  },
});
