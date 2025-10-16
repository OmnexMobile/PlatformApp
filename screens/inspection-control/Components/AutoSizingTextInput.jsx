import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const AutoSizingTextInput = ({ isEditable = false, backgroundColor = '#fff', handleChange = () => {}, value = '', placeholder = '' }) => {
    const [height, setHeight] = useState(40); // Initial height for a single line
    useEffect(() => {
        if (value?.length > 100) {
            setHeight(80);
        }
    }, [value]);
    return (
        <TextInput
            style={[styles.input, { height: Math.max(40, height), backgroundColor: isEditable ? backgroundColor : COLORS.whiteGrey }]}
            onChangeText={val => {
                isEditable && handleChange(val);
            }}
            value={value}
            multiline={true}
            // onContentSizeChange={event => setHeight(event.nativeEvent.contentSize.height)}
            placeholder={placeholder}
            scrollEnabled={true} // allow scrolling
            showsVerticalScrollIndicator={true} // show scroll bar
        />
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: COLORS.icBottomBox,
        marginTop: 8,
        color: COLORS.ictextBlack,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
});

export default AutoSizingTextInput;
