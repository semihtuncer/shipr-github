import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { CameraView, useCameraPermissions } from "expo-camera";
import Ionicons from "react-native-vector-icons/Ionicons";
import { manipulateAsync, FlipType } from "expo-image-manipulator";

export default function PhotoPage({ page, navigation }) {
  const [transition, setTransition] = useState(false);
  const [state, setState] = useState("PHOTO");
  const [blob, setBlob] = useState("");

  const [camera, setCamera] = useState(null);

  const {
    setRegisteryUser,
    host,
    registeryToken,
    setUser,
    registeryUser,
    saveUserLocal,
  } = useContext(UserContext);

  const [permission, requestPermission] = useCameraPermissions();

  const transVal = 1250;

  const continueButtonOpacity = useSharedValue(1);
  const continueButtonWidth = useSharedValue(100);
  const continueButtonHeight = useSharedValue(100);
  const continueButtonBorderRadius = useSharedValue(100);
  const continueButtonBorderWidth = useSharedValue(5);
  const continueButtonColor = useSharedValue("transparent");
  const deleteOpacity = useSharedValue(0);
  const holeOpacity = useSharedValue(1);
  const transitionScale = useSharedValue(transVal);

  const handleHelp = () => {};

  const onPress = () => {
    if (state === "SENT") return;

    continueButtonOpacity.value = 1;

    if (state === "PHOTO") {
      continueButtonHeight.value = 55;
      continueButtonWidth.value = 325;
      continueButtonBorderRadius.value = 15;
      continueButtonBorderWidth.value = 0;
      continueButtonColor.value = "#ff9fef";
      holeOpacity.value = 0;
      deleteOpacity.value = 1;

      takePicture();
      setState("TAKEN");
    } else if (state === "TAKEN") {
      axios
        .post(host + "auth/register", registeryUser, {
          headers: { token: "Bearer " + registeryToken },
        })
        .then((result) => {
          if (result.status === 200) {
            setUser(result.data);
            setPhotoServer(result.data);
            saveUserLocal(result.data);
          } else {
            setTransition(false);
          }
        })
        .catch((err) => {
          setTransition(false);
        });
    }
  };
  const setPhotoServer = (user) => {
    continueButtonOpacity.value = 0.4;
    setState("SENT");

    let fd = new FormData();
    fd.append("photo", blob.base64);

    axios
      .post(host + "user/set_profile_picture/" + user._id, fd, {
        headers: {
          token: "Bearer " + user.accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((result) => {
        if (result.status === 200) {
          continueButtonOpacity.value = 1;
          transitionScale.value = transVal;

          setRegisteryUser(null);
          setTransition(true);
          setTimeout(() => navigation.navigate("MainStack"), 1000);
        } else {
          setState("TAKEN");
          setTransition(false);
        }
      })
      .catch((err) => {
        setState("TAKEN");
        setTransition(false);
      });
  };

  const takePicture = async () => {
    if (camera) {
      let pic = await camera.takePictureAsync();

      pic = await manipulateAsync(
        pic.localUri || pic.uri,
        [{ rotate: 180 }, { flip: FlipType.Vertical }],
        { base64: true, compress: 0.5 }
      );

      setBlob(pic);
    }
  };

  const resetPhoto = () => {
    setBlob("");
    setState("PHOTO");
    resetButton();
  };
  const resetButton = () => {
    continueButtonHeight.value = 100;
    continueButtonWidth.value = 100;
    continueButtonBorderRadius.value = 100;
    continueButtonBorderWidth.value = 4;
    continueButtonColor.value = "transparent";
    continueButtonOpacity.value = 1;
    holeOpacity.value = 1;
    deleteOpacity.value = 0;
  };

  useEffect(() => {
    if (page === "PHOTO") {
      transitionScale.value = 0;
    }
  }, [page]);

  const animatedContinueButton = useAnimatedStyle(() => ({
    opacity: withSpring(continueButtonOpacity.value),
    width: withSpring(continueButtonWidth.value),
    height: withSpring(continueButtonHeight.value),
    borderRadius: withSpring(continueButtonBorderRadius.value),
    backgroundColor: withSpring(continueButtonColor.value),
    borderWidth: withTiming(continueButtonBorderWidth.value),
  }));
  const animatedHole = useAnimatedStyle(() => ({
    opacity: withSpring(holeOpacity.value),
  }));
  const animatedDelete = useAnimatedStyle(() => ({
    opacity: withSpring(deleteOpacity.value),
  }));
  const animatedTransition = useAnimatedStyle(() => ({
    transform: [
      { scale: withTiming(transitionScale.value, { duration: 350 }) },
    ],
  }));

  return (
    <View style={styles.main}>
      <View style={styles.top}>
        <Text style={styles.title}>ShipR.</Text>
        <Text style={styles.help} onPress={handleHelp}>
          Help
        </Text>
      </View>
      {(state === "TAKEN" || state === "SENT") && (
        <Image source={{ uri: blob.uri }} style={styles.photo} />
      )}
      <Text style={styles.label}>
        {permission && permission.granted
          ? state === "TAKEN"
            ? "Wow."
            : "Now... Smile!"
          : "Enable camera!"}
      </Text>
      <Text style={styles.warning}>
        {state === "TAKEN"
          ? "You look nice."
          : "This will be your photo to display. You can change it later."}
      </Text>
      <View style={styles.bannerBorder}></View>
      <View style={styles.middle}>
        {permission &&
          (permission.granted ? (
            <>
              <View style={styles.cameraHolder}>
                <CameraView
                  ref={(ref) => setCamera(ref)}
                  style={styles.camera}
                  facing={"front"}
                  active={true}
                  mode="picture"
                  autofocus="on"
                  animateShutter
                  mirror={false}
                />
              </View>
            </>
          ) : (
            <View style={styles.nocamera}>
              <Text style={styles.enableCamMessage}>
                You need to enable camera!
              </Text>
              <TouchableOpacity
                style={styles.enableCamButton}
                onPress={requestPermission}
              >
                <Text style={styles.buttonLabel}>Enable</Text>
              </TouchableOpacity>
            </View>
          ))}
      </View>
      <KeyboardAvoidingView style={styles.bottom} behavior="position">
        {permission && permission.granted && (
          <Animated.View
            style={[styles.button, animatedContinueButton]}
            onTouchStart={() => {
              continueButtonOpacity.value = 0.6;
            }}
            onTouchEnd={onPress}
          >
            <Animated.View style={[styles.hole, animatedHole]}></Animated.View>
            {state === "TAKEN" && (
              <Text
                style={{
                  color: "whitesmoke",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Let's go
              </Text>
            )}
          </Animated.View>
        )}
        <Animated.View
          style={[styles.deletePhoto, animatedDelete]}
          onTouchEnd={() => {
            if (deleteOpacity.value === 0) return;
            resetPhoto();
          }}
          onTouchStart={() => {
            if (deleteOpacity.value === 0) return;
            deleteOpacity.value = 0.6;
          }}
        >
          <Ionicons name="backspace" color="whitesmoke" size={35} />
        </Animated.View>
      </KeyboardAvoidingView>
      <Animated.View
        style={[styles.transition, animatedTransition]}
      ></Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerBorder: {
    height: 260,
    width: 400,
    alignSelf: "center",
    borderStyle: "dashed",
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    zIndex: 12,
    marginTop: 370,
    borderRadius: 30,
  },
  photo: {
    borderRadius: 45,
    position: "absolute",
    width: "100%",
    aspectRatio: 9 / 16,
    zIndex: 10,
    marginTop: 141.5,
    backgroundColor: "whitesmoke",
  },
  deletePhoto: {
    position: "absolute",
    marginTop: -40,
  },
  hole: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: 60,
    height: 60,
    borderRadius: 200,
  },
  cameraHolder: {
    borderRadius: 50,
    backgroundColor: "#080b10",
    overflow: "hidden",
    position: "absolute",
    top: 0,
    display: "flex",
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -2,
  },
  camera: {
    width: "100%",
    zIndex: -2,
    aspectRatio: 9 / 16,
  },
  nocamera: {
    width: "85%",
    borderWidth: 5,
    borderColor: "whitesmoke",
    borderRadius: 50,
    marginTop: 15,
    aspectRatio: 9 / 16,
    backgroundColor: "#080b10",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  enableCamMessage: {
    textAlign: "center",
    color: "whitesmoke",
    fontSize: 25,
  },
  buttonLabel: {
    fontSize: 20,
    color: "whitesmoke",
    textAlign: "center",
  },
  enableCamButton: {
    textAlign: "center",
    backgroundColor: "#ff85ea",
    fontSize: 25,
    marginTop: 25,
    borderRadius: 15,
    paddingHorizontal: 75,
    paddingVertical: 15,
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
    zIndex: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "whitesmoke",
    marginTop: 65,
  },
  help: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: 18,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: "400",
    color: "whitesmoke",
    marginTop: 25,
  },
  label: {
    width: "100%",
    textAlign: "center",
    top: 0,
    marginTop: 165,
    fontSize: 24,
    color: "whitesmoke",
    fontWeight: "600",
    position: "absolute",
    zIndex: 26,
  },
  warning: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.5)",
    top: 0,
    textAlign: "center",
    position: "absolute",
    width: "90%",
    alignSelf: "center",
    zIndex: 26,
    marginTop: 200,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
});
