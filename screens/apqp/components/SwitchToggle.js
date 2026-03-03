import React, { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";

const SwitchToggle = (props) => {
  const value = typeof props.value === "boolean" ? props.value : !!props.switch1Value;
  const onValueChange = props.onValueChange || props.toggleSwitch1 || (() => {});

  const activeTrackColor = props.activeTrackColor || "#1FBFD0";
  const inactiveTrackColor = props.inactiveTrackColor || "#a5a5a5";
  const inactiveBorderColor = props.inactiveBorderColor || "#a5a5a5";
  const thumbColor = props.thumbColor || "#FFFFFF";
  const disabled = !!props.disabled;
  const scale = typeof props.scale === "number" ? props.scale : 1;

  const trackWidth = props.trackWidth || 50;
  const trackHeight = props.trackHeight || 30;
  const padding = props.padding || 3;
  const thumbSize = Math.max(trackHeight - padding * 2, 12);
  const maxTranslateX = Math.max(trackWidth - thumbSize - padding * 2, 0);

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxTranslateX],
  });

  const shadowStyle =
    Platform.OS === "ios"
      ? styles.iosShadow
      : {
          elevation: 2,
        };

  return (
    <View style={[styles.container, props.containerStyle, props.style]}>
      <Pressable
        onPress={() => onValueChange(!value)}
        disabled={disabled}
        style={[
          styles.pressable,
          {
            opacity: disabled ? 0.55 : 1,
            transform: [{ scaleX: scale }, { scaleY: scale }],
          },
        ]}
      >
        <View
          style={[
            styles.track,
            {
              width: trackWidth,
              height: trackHeight,
              borderRadius: trackHeight / 2,
              backgroundColor: value ? activeTrackColor : inactiveTrackColor,
              // borderWidth: value ? 0 : 1,
              // borderColor: value ? "transparent" : inactiveBorderColor,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              shadowStyle,
              {
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                backgroundColor: thumbColor,
                // borderWidth: value ? 0 : 1,
                // borderColor: value ? "transparent" : inactiveBorderColor,
                transform: [{ translateX }],
                left: padding,
                top: padding,
              },
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default SwitchToggle;
const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
  },
  track: {
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
  },
  iosShadow: {
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1.5,
  },
});
