import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import PhoneInput from "../components/PhoneInput";
import { isValidPhoneNumber } from "libphonenumber-js";
import axios from "axios";
import { UserContext } from "../context/userContext";

export default function PhoneNumberPage({ setPage, page, navigation }) {
  const [phoneNum, setPhoneNum] = useState("");
  const [phoneNumValid, setPhoneNumValid] = useState(false);
  const [transition, setTransition] = useState(false);

  const { host, setUser, setRegisteryUser, user, getUserLocal, saveUserLocal } =
    useContext(UserContext);

  const transVal = 1250;

  const continueButtonOpacity = useSharedValue(0.4);
  const transitionScale = useSharedValue(transVal);

  const handleHelp = () => {};
  const onPress = () => {
    if (phoneNumValid && !transition) {
      continueButtonOpacity.value = 1;

      axios
        .post(host + "auth/request_otp", {
          phoneNum: phoneNum.replaceAll(" ", ""),
        })
        .then((result) => {
          if (result.status === 200) {
            transitionScale.value = transVal;
            setUser({ phoneNum: phoneNum.replaceAll(" ", "") });
            setRegisteryUser({ phoneNum: phoneNum.replaceAll(" ", "") });

            setTransition(true);
            setTimeout(() => setPage("OTP"), 1000);
          } else {
            setTransition(false);
          }
        })
        .catch((err) => {
          setTransition(false);
        });
    }
  };

  useEffect(() => {
    if (!user) {
      getUserLocal().then((u) => {
        if (u) {
          axios
            .get(host + "auth/verify_token/" + u._id, {
              headers: { token: "Bearer " + u.accessToken },
            })
            .then((result) => {
              if (result.status === 200) {
                const resUser = result.data;

                if (resUser !== null) {
                  resUser.accessToken = u.accessToken;
                  setUser(resUser);
                  saveUserLocal(resUser);
                  navigation.navigate("MainStack");
                }
              }
            });
        }
      });
    }
  }, [user]);
  useEffect(() => {
    const val = isValidPhoneNumber(phoneNum);
    setPhoneNumValid(val);
    continueButtonOpacity.value = val ? 1 : 0.4;
  }, [phoneNum]);
  useEffect(() => {
    if (page === "PHONENUM") {
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
        <Text style={styles.label}>Enter your phone number</Text>
        <PhoneInput setPhone={setPhoneNum} />
        <Text style={styles.warning}>
          By continuing, you agree to our Privacy Policy and Terms of Service.
        </Text>
      </View>
      <KeyboardAvoidingView style={styles.bottom} behavior="position">
        <Animated.View
          style={[styles.button, animatedContinueButton]}
          onTouchStart={() => {
            if (phoneNumValid && !transition) continueButtonOpacity.value = 0.6;
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
            Send Verification Code
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
    marginLeft: -25,
  },
  blob2: {
    position: "absolute",
    tintColor: "#ff85ea",
    right: 0,
    marginRight: -255,
    transform: "rotate(200deg)",
    bottom: 0,
    marginBottom: 305,
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
});
