import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground, Text } from "react-native";
import Triangle from "react-native-triangle";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
  withDelay,
} from "react-native-reanimated";
import { UserContext } from "../context/userContext";
import axios from "axios";
import EvilIcons from "react-native-vector-icons/EvilIcons";

function InterestsBanner({ interest }) {
  return (
    <View
      style={{
        backgroundColor: "#ff85ea",
        padding: 6,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "whitesmoke",
          textAlign: "center",
          fontSize: 12,
        }}
      >
        {interest}
      </Text>
    </View>
  );
}

export default function ShipBanner({ male, top, shipped, canceled, person }) {
  const shipMoveVertical = useSharedValue(0);
  const shipScale = useSharedValue(1);
  const shipOpacity = useSharedValue(1);
  const shipMoveHorizontal = useSharedValue(0);
  const glow = useSharedValue(0.5);
  const { user, host, config } = useContext(UserContext);
  const [blob, setBlob] = useState(null);

  const [resetPos, setResetPos] = useState(true);

  const easing = Easing.bezier(0.25, -0.5, 0.25, 1);
  const duration = 1000;

  useEffect(() => {
    if (shipped && !canceled) {
      onShip();
    }
  }, [shipped]);
  useEffect(() => {
    if (canceled && !shipped) {
      onCancel();
    }
  }, [canceled]);
  useEffect(() => {
    glow.value = withRepeat(
      withTiming(0, { duration: duration, easing: easing }),
      -1,
      true
    );
  }, []);

  const onShip = () => {
    shipMoveVertical.value = top ? 20 : -76;
    setTimeout(shipFadeout, 500);
  };
  const onCancel = () => {
    shipMoveHorizontal.value = top ? 1000 : -1000;
    shipFadeout();
  };
  const shipFadeout = () => {
    shipScale.value = 3;
    shipOpacity.value = 0;
    setResetPos(false);
    setTimeout(resetSelf, 500);
  };

  const resetSelf = () => {
    shipMoveVertical.value = 0;
    shipMoveHorizontal.value = 0;
    shipScale.value = 1;
    shipOpacity.value = 1;
    setResetPos(true);
  };

  useEffect(() => {
    if (!person) return;

    getProfilePicture();
  }, [person]);

  const getProfilePicture = () => {
    axios
      .get(host + "user/get_profile_picture/" + person._id, config)
      .then((result) => {
        if (result.status === 200) {
          setBlob(result.data);
        }
      });
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

  const animatedBanner = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: resetPos
          ? withSpring(shipMoveVertical.value, {
              duration: 1000,
              dampingRatio: 0.2,
              stiffness: 100,
            })
          : shipMoveVertical.value,
      },
      {
        scale: withSpring(shipScale.value),
      },
      {
        translateX: withSpring(shipMoveHorizontal.value, { duration: 1000 }),
      },
    ],
    opacity: withSpring(shipOpacity.value),
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        top ? styles.top : styles.bottom,
        animatedBanner,
        { backgroundColor: male ? "#407cff" : "#f21120" },
        { shadowColor: male ? "#407cff" : "#f21120" },
      ]}
    >
      <ImageBackground
        style={styles.outer}
        source={{ uri: `data:image/jpeg;base64,${blob}` }}
        borderRadius={30}
      >
        <View style={styles.infoHolder}>
          <View style={styles.nameHolder}>
            <Text style={styles.nameLabel}>{person && person.username},</Text>
            <Text style={styles.ageLabel}>
              {person && getAge(person.birthday)}
            </Text>
          </View>
          <View style={styles.location}>
            <EvilIcons
              name={"location"}
              color={"#ffffff"}
              size={22}
              opacity={0.8}
            />
            <Text style={styles.locationLabel}>{user.location}</Text>
          </View>
          <View style={styles.interestsHolder}>
            {person &&
              person.interests.map((a) => {
                return <InterestsBanner interest={a} key={Math.random()} />;
              })}
          </View>
        </View>
        {top ? (
          <Triangle
            width={36}
            height={21}
            color={male ? "#407cff" : "#f21120"}
            direction={"down"}
            style={styles.arrowTop}
          />
        ) : (
          <Triangle
            width={45}
            height={25}
            color={"#080b10"}
            direction={"down"}
            style={styles.arrowBottom}
          />
        )}
      </ImageBackground>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  location: {
    display: "flex",
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  locationLabel: {
    color: "#fff",
    opacity: 0.8,
    fontWeight: "200",
    fontSize: 18,
  },
  interestsHolder: {
    paddingHorizontal: 3,
    marginTop: 12,
    display: "flex",
    alignItems: "flex-start",
    columnGap: 10,
    rowGap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  infoHolder: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 12,
    justifyContent: "flex-end",
  },
  nameHolder: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  nameLabel: {
    color: "#fff",
    fontSize: 27,
    fontWeight: "600",
  },
  ageLabel: {
    color: "#fff",
    fontSize: 24,
    marginLeft: 5,
    fontWeight: "400",
    opacity: 0.7,
  },
  container: {
    width: 400,
    alignSelf: "center",
    height: 260,
    position: "absolute",
    borderRadius: 30,
    shadowOffset: 0,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
  outer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  inner: {},
  arrowTop: {
    position: "absolute",
    bottom: -20.5,
    zIndex: 20,
  },
  arrowBottom: {
    position: "absolute",
    top: -4,
    zIndex: 10,
  },
});
