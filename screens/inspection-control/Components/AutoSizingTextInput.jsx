// import { COLORS } from 'constants/theme-constants';
// import React, { useEffect, useState } from 'react';
// import { TextInput, View, StyleSheet } from 'react-native';

// const AutoSizingTextInput = ({ isEditable = false, backgroundColor = '#fff', handleChange = () => {}, value = '', placeholder = '' }) => {
//     const [height, setHeight] = useState(40); // Initial height for a single line
//     useEffect(() => {
//         if (value?.length > 100) {
//             setHeight(80);
//         }
//     }, [value]);
//     return (
//         <TextInput
//             style={[styles.input, { height: Math.max(40, height), backgroundColor: isEditable ? backgroundColor : COLORS.whiteGrey }]}
//             onChangeText={val => {
//                 isEditable && handleChange(val);
//             }}
//             value={value}
//             multiline={true}
//             // onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height)}
//             placeholder={placeholder}
//             scrollEnabled={true} // allow scrolling
//             showsVerticalScrollIndicator={true} // show scroll bar
//         />
//     );
// };

// const styles = StyleSheet.create({
//     input: {
//         borderWidth: 1,
//         borderRadius: 4,
//         borderColor: COLORS.icBottomBox,
//         marginTop: 8,
//         color: COLORS.ictextBlack,
//         paddingHorizontal: 10,
//         textAlignVertical: 'top',
//     },
// });

// export default AutoSizingTextInput;
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const PAD_V = 10;
const PAD_H = 10;
const BORDER = 1;

const AutoSizingTextInput = ({
    value = '',
    onChangeText = () => {},
    editable = true,
    placeholder = '',
    minHeight = 40,
    maxHeight = 80,
    fontSize = 14,
    fontFamily,
    color = '#000',
    backgroundColor = '#fff',
    borderColor = '#ccc',
    style,
    ...rest
}) => {
    const [textHeight, setTextHeight] = useState(0);

    // A trailing "\n" is ignored by Text, so add a space to count that empty line.
    const measureText = value ? (value.endsWith('\n') ? `${value} ` : value) : ' ';

    const contentHeight = textHeight + PAD_V * 2 + BORDER * 2;
    const boxHeight = Math.min(maxHeight, Math.max(minHeight, contentHeight));
    const needsScroll = contentHeight > maxHeight;

    const textStyle = { fontSize, fontFamily, includeFontPadding: false };

    return (
        <View style={style}>
            {/* Hidden mirror: same font and width as the input, used only to measure */}
            <Text
                pointerEvents="none"
                style={[styles.hidden, textStyle, { left: BORDER + PAD_H, right: BORDER + PAD_H }]}
                onLayout={e => setTextHeight(Math.ceil(e.nativeEvent.layout.height))}>
                {measureText}
            </Text>

            <TextInput
                {...rest}
                value={value}
                onChangeText={val => editable && onChangeText(val)}
                // editable={editable}
                placeholder={placeholder}
                multiline
                scrollEnabled={needsScroll}
                textAlignVertical="top"
                style={[
                    textStyle,
                    {
                        height: boxHeight,
                        color,
                        backgroundColor,
                        borderColor,
                        borderWidth: BORDER,
                        borderRadius: 4,
                        paddingHorizontal: PAD_H,
                        paddingTop: PAD_V,
                        paddingBottom: PAD_V,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    hidden: {
        position: 'absolute',
        opacity: 0,
        top: 0,
    },
});

export default AutoSizingTextInput;

//  <AutoSizingTextInput
//                     value={value || ''}
//                     onChangeText={handleChange}
//                     editable={isEditable}
//                     placeholder={placeHolder}
//                     backgroundColor={isEditable ? backgroundColor : COLORS.whiteGrey}
//                     borderColor={COLORS.icBottomBox}
//                     color={COLORS.ictextBlack}
//                     style={{ marginTop: 8 }}
//                 />
