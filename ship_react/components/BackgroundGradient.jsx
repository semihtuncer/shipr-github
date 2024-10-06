import {
  BlurMask,
  Canvas,
  RoundedRect,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const BackgroundGradient = React.memo(({ width, height }, style) => {
  const canvasPadding = 75;
  const rValue = useSharedValue(0);
  const skValue = useSharedValue(0);

  useEffect(() => {
    rValue.value = withRepeat(withTiming(10, { duration: 2000 }), -1, true);
    skValue.value = rValue.value;
  }, [rValue]);

  return (
    <Canvas
      style={[
        {
          width: width + canvasPadding,
          height: (width / 9) * 16 + canvasPadding,
        },
        style,
      ]}
    >
      <RoundedRect
        x={35}
        y={18}
        width={width}
        height={height}
        color={"white"}
        r={50}
      >
        <SweepGradient
          c={vec((width + canvasPadding) / 2, (height + canvasPadding) / 2)}
          colors={["cyan", "magenta", "yellow", "cyan"]}
        />
        <BlurMask blur={skValue} style={"solid"} />
      </RoundedRect>
    </Canvas>
  );
});

export { BackgroundGradient };
