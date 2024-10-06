import { useFocusEffect } from "@react-navigation/native";
import { Animated } from "react-native";
import * as React from "react";

export default FadeInView = (props, { navigation }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useFocusEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    };
  });

  return (
    <Animated.View
      needsOffscreenAlphaCompositing
      style={{
        flex: 1,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};
