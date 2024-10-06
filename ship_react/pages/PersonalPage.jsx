import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gyroscope } from "expo-sensors";
import { BackgroundGradient } from "../components/BackgroundGradient";
import { UserContext } from "../context/userContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function InterestsBanner({ interest }) {
  return (
    <View
      style={{
        backgroundColor: "#ff85ea",
        padding: 10,
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

export default function PersonalPage({ navigation }) {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [blob, setBlob] = useState(null);

  const { user, host, config } = useContext(UserContext);

  const logOut = async () => {
    await AsyncStorage.removeItem("user");
    navigation.navigate("LogInStack");
  };

  const getProfilePicture = () => {
    axios
      .get(host + "user/get_profile_picture/" + user._id, config)
      .then((result) => {
        if (result.status === 200) {
          setBlob(result.data);
        }
      });
  };

  const subscribe = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        setData(gyroscopeData);
      })
    );
  };
  const unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
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

  // useEffect(() => {
  //   subscribe();
  //   return () => unsubscribe();
  // }, [x, y]);
  useEffect(() => {
    getProfilePicture();
  }, []);

  const AnimatedStyles = {
    motion: useAnimatedStyle(() => {
      return {
        position: "absolute",
        height: "95%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bottom: 30,
        transform: [
          { translateX: withSpring(y * 10) },
          { translateY: withSpring(x * 10) },
        ],
      };
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <BackgroundGradient width={360} height={633} />
      <Animated.View style={AnimatedStyles.motion}>
        <ImageBackground
          style={styles.card}
          imageStyle={{ borderRadius: 50 }}
          source={{ uri: `data:image/jpeg;base64,${blob}` }}
        >
          <View style={styles.top}></View>
          <View style={styles.bottom}>
            <View style={styles.nameHolder}>
              <Text style={styles.nameLabel}>{user.username},</Text>
              <Text style={styles.ageLabel}>{getAge(user.birthday)}</Text>
            </View>
            <View style={styles.infoHolder}>
              <View style={styles.location}>
                <EvilIcons
                  name={"location"}
                  color={"#ffffff"}
                  size={27}
                  opacity={0.8}
                />
                <Text style={styles.locationLabel}>{user.location}</Text>
              </View>
              <View style={styles.interestsHolder}>
                {user.interests.map((a) => {
                  return <InterestsBanner interest={a} key={Math.random()} />;
                })}
              </View>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
      <TouchableOpacity style={styles.icon} onPress={logOut}>
        <Ionicons name="settings-sharp" size={28} color={"#fff"} />
      </TouchableOpacity>
    </View>
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
    fontSize: 22,
  },
  nameHolder: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    flex: 1,
  },
  interestsHolder: {
    paddingHorizontal: 3,
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    columnGap: 10,
    rowGap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoHolder: {
    paddingHorizontal: 12,
    flex: 4,
  },
  top: {
    display: "flex",
    flex: 4,
  },
  bottom: {
    flex: 2,
  },
  ageLabel: {
    color: "#fff",
    fontSize: 30,
    marginLeft: 15,
    fontWeight: "400",
    opacity: 0.7,
  },
  nameLabel: {
    color: "#fff",
    fontSize: 35,
    fontWeight: "600",
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#080b10",
  },
  topBar: {
    marginTop: 45,
    height: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: -25,
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 30,
  },
  icon: {
    position: "absolute",
    right: 0,
    marginRight: 20,
    marginTop: 56,
    backgroundColor: "#2d3034",
    padding: 15,
    borderRadius: 50,
    zIndex: 99,
  },
  card: {
    width: 350,
    aspectRatio: 9 / 16,
    display: "flex",
  },
});
