import React, { useMemo, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

function ZoomableImage({ fileList }) {  // ← pass full list
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const styles = makeStyles(SCREEN_WIDTH, SCREEN_HEIGHT);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ── Filter only images from list ──
  const imageFiles = useMemo(() =>
    fileList?.filter(file =>
      imageExtensions.includes(file?.FileExtension?.toLowerCase())
    ) || [],
    [fileList]
  );

  const currentFile = imageFiles[currentIndex];

  const uri = useMemo(() => {
    if (!currentFile?.FileContentBase64) return null;
    const mime = currentFile.FileExtension?.toLowerCase() === 'jpg'
      ? 'jpeg'
      : currentFile.FileExtension?.toLowerCase();
    return currentFile.FileContentBase64.startsWith('data:')
      ? currentFile.FileContentBase64
      : `data:image/${mime};base64,${currentFile.FileContentBase64}`;
  }, [currentFile]);

  // ── Zoom values ──
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetZoom = () => {
    'worklet';
    scale.value = withSpring(1);
    savedScale.value = 1;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  // ── Navigate & reset zoom ──
  const goNext = () => {
    if (currentIndex < imageFiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetZoom();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetZoom();
    }
  };

  // ── Gestures ──
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 1), 4);
    })
    .onEnd(() => {
      if (scale.value <= 1) {
        resetZoom();
      } else {
        savedScale.value = scale.value;
      }
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (savedScale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => resetZoom());

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // ── No images at all ──
  if (imageFiles.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.placeholderText}>No images available</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>

      {/* ── Image ── */}
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={{ uri }}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>

      {/* ── Prev Button ── */}
      {currentIndex > 0 && (
        <TouchableOpacity style={styles.prevBtn} onPress={goPrev}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
      )}

      {/* ── Next Button ── */}
      {currentIndex < imageFiles.length - 1 && (
        <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      )}

      {/* ── Counter & filename ── */}
      {/* <View style={styles.footer}>
        <Text style={styles.counter}>
          {currentIndex + 1} / {imageFiles.length}
        </Text>
        <Text style={styles.filename} numberOfLines={1}>
          {currentFile?.FileName}
        </Text>
      </View> */}
      <Text style={styles.hint}>Pinch to zoom · Double-tap to reset</Text>
    </View>
  );
}

const makeStyles = (SCREEN_WIDTH, SCREEN_HEIGHT) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
    height: SCREEN_HEIGHT / 2,

  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.38,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.30,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    width: '100%',
    paddingTop:5
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },

  // ── Arrows ──
  prevBtn: {
    position: 'absolute',
    left: 8,
    top: '40%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    position: 'absolute',
    right: 8,
    top: '40%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 36,
  },

  // ── Footer ──
  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
  },
  counter: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 10,
  },
  filename: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    maxWidth: SCREEN_WIDTH * 0.7,
  },
  hint: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
});

export default ZoomableImage;