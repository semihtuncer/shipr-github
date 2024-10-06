import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import AntDesign from "react-native-vector-icons/AntDesign";

export default function ShipParticles() {
  const moveX = useSharedValue(Math.random() * 350);
  const rotate = useSharedValue(0);
  const moveY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    moveY.value = 450;
    opacity.value = 0;
    rotate.value = withTiming(Math.random() * 360, { duration: 1000 });
    scale.value = Math.random() * 1.5 + 1;
  });

  const particleAnimation = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(moveX.value) },
      {
        translateY: withSpring(-moveY.value, {
          duration: 2000,
          dampingRatio: Math.random() * 6 + 2,
          stiffness: 500,
        }),
      },
      { rotate: rotate.value + "deg" },
      { scale: withSpring(scale.value, { duration: 1000 }) },
    ],
    opacity: withSpring(opacity.value, { duration: 2500 }),
  }));

  return (
    <Animated.View style={[styles.main, particleAnimation]}>
      <AntDesign name="heart" size={25} color={"#ff0000"} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: 25,
    height: 25,
    position: "absolute",
    zIndex: 999,
    bottom: "52%",
    left: "5%",
    shadowRadius: 5,
    shadowColor: "red",
    shadowOpacity: 0.5,
    shadowOffset: 0,
  },
});
