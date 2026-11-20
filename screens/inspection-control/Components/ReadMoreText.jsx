// ReadMoreText.js
import React, { useState, useCallback, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

const ReadMoreText = ({
  label,
  text,
  numberOfLines = 4,
  labelStyle,
  textStyle,
  linkStyle,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [lineCount, setLineCount] = useState(0);

  // Only collapse on text change; never reset lineCount here (it would race with the measurer)
  useEffect(() => {
    setExpanded(false);
  }, [text]);

  const onMeasureLayout = useCallback((e) => {
    setLineCount(e.nativeEvent.lines.length);
  }, []);

  const content = (
    <>
      {!!label && <Text style={labelStyle}>{label}</Text>}
      {text}
    </>
  );

  const isTruncatable = lineCount > numberOfLines;

  return (
    <View>
      {/* Hidden full-text measurer: same width, takes no layout space */}
      <Text
        style={[textStyle, styles.hidden]}
        onTextLayout={onMeasureLayout}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {content}
      </Text>

      {/* Visible text */}
      <Text
        style={textStyle}
        numberOfLines={expanded ? undefined : numberOfLines}
        ellipsizeMode="tail"
      >
        {content}
      </Text>

      {isTruncatable && (
        <TouchableOpacity
          onPress={() => setExpanded((p) => !p)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.link, linkStyle]}>
            {expanded ? 'Less' : 'More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
  },
  link: {
    color: '#00BCD4',
    fontWeight: '600',
    marginTop: 2,
  },
});

export default ReadMoreText;