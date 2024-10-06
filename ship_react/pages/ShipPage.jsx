import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import ShipBanner from "../components/ShipBanner";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ShipParticles from "../components/ShipParticles";
import { UserContext } from "../context/userContext";
import axios from "axios";
import * as Progress from "react-native-progress";
import GestureRecognizer from "react-native-swipe-gestures";

export default function ShipPage({ navigation }) {
  const [shipped, setShipped] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const [ship, setShip] = useState(null);

  const [state, setState] = useState(true);

  const SHIP_PARTICLE_AMOUNT = 15;

  const shipButtonPadding = useSharedValue(35);
  const shipButtonOpacity = useSharedValue(1);
  const shipButtonZ = useSharedValue(100);
  const shipButtonColor = useSharedValue("rgb(255, 133, 234)");

  const cancelButtonPadding = useSharedValue(35);
  const cancelButtonOpacity = useSharedValue(1);
  const cancelButtonZ = useSharedValue(100);
  const cancelButtonColor = useSharedValue("rgb(33, 35, 40)");

  const { getLocation, user, host, config, setSwipeOnShip } =
    useContext(UserContext);

  useEffect(() => {
    if (canceled && !shipped) {
      setTimeout(resetStates, 1000);
    } else if (!canceled && shipped) {
      setTimeout(resetStates, 1000);
    }
  }, [shipped, canceled]);
  useEffect(() => {
    if (!user.location) getLocation();
  }, []);
  useEffect(() => {
    if (ship) return;

    requestShip();
  }, [ship]);

  const onShipPressed = () => {
    if (!shipped) {
      setShipped(true);
      shipButtonPadding.value = 117;
      shipButtonOpacity.value = 1;
      shipButtonZ.value = 101;
      cancelButtonOpacity.value = 0;
      shipButtonColor.value = "rgb(255, 0, 212)";
      sendShip();
    }
  };
  const onCancelPressed = () => {
    if (!canceled) {
      setCanceled(true);
      cancelButtonPadding.value = 117;
      cancelButtonOpacity.value = 1;
      cancelButtonZ.value = 101;
      shipButtonOpacity.value = 0;
      cancelButtonColor.value = "rgb(220, 14, 14)";

      setShip(null);
    }
  };
  const resetStates = () => {
    cancelButtonPadding.value = 35;
    cancelButtonOpacity.value = 1;
    cancelButtonZ.value = 100;
    cancelButtonColor.value = "rgb(33, 35, 40)";

    shipButtonPadding.value = 35;
    shipButtonOpacity.value = 1;
    shipButtonZ.value = 100;
    shipButtonColor.value = "rgb(255, 133, 234)";

    setCanceled(false);
    setShipped(false);
  };
  const requestShip = () => {
    axios.get(host + "ship/request_ship/" + user._id, config).then((result) => {
      setShip(result.data);
    });
  };
  const sendShip = () => {
    if (ship) {
      axios
        .post(host + "ship/send_ship/" + user._id, ship, config)
        .then((result) => {
          if (result.status === 200) {
            setShip(null);
          }
        });
    }
  };

  const [cancelPressed, setCancelPressed] = useState(false);
  const [shipPressed, setShipPressed] = useState(false);
  const [shipFill, setShipFill] = useState(0);
  const [cancelFill, setCancelFill] = useState(0);
  const PRESS_DURATION = 200;
  const LONGPRESS_DURATION = 0;

  const cancelOpacity = useSharedValue(0);
  const shipOpacity = useSharedValue(0);

  const interval = useRef();

  useEffect(() => {
    if (cancelFill >= PRESS_DURATION + 100) {
      onPressOutCancel();
      onCancelPressed();
    }
  }, [cancelFill]);

  const onLongPressCancel = () => {
    interval.current = setInterval(() => {
      setCancelFill((prev) => prev + 10);
    }, 10);
  };
  const onPressInCancel = () => {
    setCancelPressed(true);
    cancelOpacity.value = 1;
    setSwipeOnShip(false);
  };
  const onPressOutCancel = () => {
    setCancelPressed(false);
    cancelOpacity.value = 0;
    setSwipeOnShip(true);
    setCancelFill(0);
    clearInterval(interval.current);
  };

  useEffect(() => {
    if (shipFill >= PRESS_DURATION + 100) {
      onPressOutShip();
      onShipPressed();
    }
  }, [shipFill]);

  const onLongPressShip = () => {
    interval.current = setInterval(() => {
      setShipFill((prev) => prev + 10);
    }, 10);
  };
  const onPressInShip = () => {
    setShipPressed(true);
    shipOpacity.value = 1;
    setSwipeOnShip(false);
  };
  const onPressOutShip = () => {
    setShipPressed(false);
    shipOpacity.value = 0;
    setSwipeOnShip(true);
    setShipFill(0);
    clearInterval(interval.current);
  };

  const animatedShipIcon = useAnimatedStyle(() => ({
    opacity: withSpring(shipOpacity.value),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const animatedCancelIcon = useAnimatedStyle(() => ({
    opacity: withSpring(cancelOpacity.value),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const animatedShipButton = useAnimatedStyle(() => ({
    paddingHorizontal: withSpring(shipButtonPadding.value, { duration: 750 }),
    opacity: withSpring(shipButtonOpacity.value),
    zIndex: shipButtonZ.value,
    backgroundColor: withSpring(shipButtonColor.value),
  }));
  const animatedCancelButton = useAnimatedStyle(() => ({
    paddingHorizontal: withSpring(cancelButtonPadding.value, { duration: 750 }),
    opacity: withSpring(cancelButtonOpacity.value),
    zIndex: cancelButtonZ.value,
    backgroundColor: withTiming(cancelButtonColor.value),
  }));
  const c = {
    velocityThreshold: 0,
  };
  return (
    <GestureRecognizer
      style={styles.container}
      onSwipeUp={onShipPressed}
      onSwipeDown={onCancelPressed}
      config={c}
    >
      <View style={styles.topBar}>
        <Text style={styles.title}>Ship</Text>
      </View>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          setState(!state);
        }}
      >
        <FontAwesome name="heart" size={24} color={"#fff"} />
      </TouchableOpacity>
      {state && (
        <View style={styles.buttons}>
          <View style={styles.cancelButtonTest}>
            <Animated.View style={animatedCancelIcon}>
              <Progress.Circle
                progress={cancelFill / PRESS_DURATION}
                size={100}
                color="#fff"
                borderWidth={0}
                thickness={8}
                strokeCap={"round"}
                direction={"counter-clockwise"}
                style={{ position: "absolute" }}
              />
              <FontAwesome name="close" size={32} color={"#fff"} />
            </Animated.View>
            <TouchableOpacity
              style={styles.touchableOpacity}
              activeOpacity={0.2}
              delayLongPress={LONGPRESS_DURATION}
              delayPressIn={150}
              onPressIn={onPressInCancel}
              onPressOut={onPressOutCancel}
              onLongPress={onLongPressCancel}
            ></TouchableOpacity>
          </View>
          <Animated.View style={styles.shipButtonTest}>
            <Animated.View style={animatedShipIcon}>
              <Progress.Circle
                progress={shipFill / PRESS_DURATION}
                size={100}
                color="#fff"
                borderWidth={0}
                thickness={8}
                strokeCap={"round"}
                style={{ position: "absolute" }}
              />
              <FontAwesome name="check" size={32} color={"#fff"} />
            </Animated.View>
            <TouchableOpacity
              style={[styles.touchableOpacity, { backgroundColor: "#ff85ea" }]}
              activeOpacity={0.2}
              delayLongPress={LONGPRESS_DURATION}
              delayPressIn={150}
              onPressIn={onPressInShip}
              onPressOut={onPressOutShip}
              onLongPress={onLongPressShip}
            ></TouchableOpacity>
          </Animated.View>
        </View>
      )}
      <View style={styles.main}>
        {shipped
          ? Array.from({ length: SHIP_PARTICLE_AMOUNT }).map((index) => {
              return <ShipParticles key={Math.random()}></ShipParticles>;
            })
          : null}
        {!state && (
          <>
            <Animated.View
              style={[styles.shipButton, animatedShipButton]}
              onTouchEnd={onShipPressed}
              onTouchStart={() => {
                if (!shipped) shipButtonOpacity.value = 0.6;
              }}
            >
              <FontAwesome name="check" size={25} color={"#fff"} />
            </Animated.View>
            <Animated.View
              style={[styles.cancelButton, animatedCancelButton]}
              onTouchEnd={onCancelPressed}
              onTouchStart={() => {
                if (!canceled) cancelButtonOpacity.value = 0.6;
              }}
            >
              <FontAwesome name="close" size={25} color={"#fff"} />
            </Animated.View>
          </>
        )}
        <View style={styles.bannerHolder}>
          <ShipBanner
            top={false}
            male={false}
            person={ship && ship.woman}
            shipped={shipped}
            canceled={canceled}
          ></ShipBanner>
          <ShipBanner
            top={true}
            male={true}
            person={ship && ship.man}
            shipped={shipped}
            canceled={canceled}
          ></ShipBanner>
        </View>
      </View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  touchableOpacity: {
    width: "100%",
    height: "100%",
    backgroundColor: "#c83434",
    position: "absolute",
    opacity: 0,
    borderRadius: 50,
  },
  buttons: {
    position: "absolute",
    zIndex: 100,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
  },
  shipButtonTest: {
    flex: 1,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonTest: {
    flex: 1,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    zIndex: -25,
    alignItems: "center",
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
    padding: 17,
    borderRadius: 50,
    zIndex: 101,
  },
  main: {
    position: "absolute",
    height: "66%",
    width: "90%",
    display: "flex",
    alignSelf: "center",
    bottom: 0,
    marginBottom: 160,
  },
  bannerHolder: {
    width: "100%",
    height: "100%",
  },
  shipButton: {
    position: "absolute",
    paddingHorizontal: 35,
    paddingVertical: 20,
    borderRadius: 80,
    backgroundColor: "#ff85ea",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    bottom: -25,
    elevation: 5,
    alignSelf: "center",
    right: 65,
  },
  cancelButton: {
    position: "absolute",
    paddingHorizontal: 35,
    paddingVertical: 20,
    borderRadius: 80,
    backgroundColor: "#212328",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    bottom: -25,
    left: 65,
    elevation: 5,
  },
});
