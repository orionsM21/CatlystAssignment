import React, { useRef, useEffect } from "react";
import {
  View,
  Animated,
  PanResponder,
  Pressable,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TRACK_WIDTH = SCREEN_WIDTH * 0.9;
const THUMB_SIZE = 22;

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

const snap = (v, step) => Math.round(v / step) * step;

const RangeSlider = ({
  min = 0,
  max = 10,
  step = 0.5,
  minValue = 0,
  maxValue = 10,
  onChange,
}) => {
  const minX = useRef(new Animated.Value(0)).current;
  const maxX = useRef(new Animated.Value(TRACK_WIDTH)).current;

  useEffect(() => {
    minX.setValue((minValue / max) * TRACK_WIDTH);
    maxX.setValue((maxValue / max) * TRACK_WIDTH);
  }, [minValue, maxValue]);

  const updateValues = (newMinX, newMaxX) => {
    const minVal = snap((newMinX / TRACK_WIDTH) * max, step);
    const maxVal = snap((newMaxX / TRACK_WIDTH) * max, step);

    onChange?.({
      minAmount: minVal,
      maxAmount: maxVal,
    });
  };

  const createPan = (type) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, g) => {
        if (type === "min") {
          const x = clamp(
            g.dx + minX._value,
            0,
            maxX._value - THUMB_SIZE
          );
          minX.setValue(x);
          updateValues(x, maxX._value);
        } else {
          const x = clamp(
            g.dx + maxX._value,
            minX._value + THUMB_SIZE,
            TRACK_WIDTH
          );
          maxX.setValue(x);
          updateValues(minX._value, x);
        }
      },
    });

  const minPan = useRef(createPan("min")).current;
  const maxPan = useRef(createPan("max")).current;

  return (
    <Pressable
      onPress={(e) => {
        const x = e.nativeEvent.locationX;
        const distToMin = Math.abs(x - minX._value);
        const distToMax = Math.abs(x - maxX._value);

        if (distToMin < distToMax) {
          minX.setValue(clamp(x, 0, maxX._value - THUMB_SIZE));
        } else {
          maxX.setValue(clamp(x, minX._value + THUMB_SIZE, TRACK_WIDTH));
        }

        updateValues(minX._value, maxX._value);
      }}
    >
      <View style={{ width: TRACK_WIDTH, height: 40, justifyContent: "center" }}>
        {/* Track */}
        <View
          style={{
            height: 6,
            backgroundColor: "#E5E5E5",
            borderRadius: 3,
          }}
        />

        {/* Active Range */}
        <Animated.View
          style={{
            position: "absolute",
            height: 6,
            backgroundColor: "#C9A23F",
            borderRadius: 3,
            left: minX,
            width: Animated.subtract(maxX, minX),
          }}
        />

        {/* MIN Thumb */}
        <Animated.View
          {...minPan.panHandlers}
          style={{
            position: "absolute",
            left: -THUMB_SIZE / 2,
            transform: [{ translateX: minX }],
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: "#C9A23F",
          }}
        />

        {/* MAX Thumb */}
        <Animated.View
          {...maxPan.panHandlers}
          style={{
            position: "absolute",
            left: -THUMB_SIZE / 2,
            transform: [{ translateX: maxX }],
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: "#C9A23F",
          }}
        />
      </View>
    </Pressable>
  );
};

export default RangeSlider;
