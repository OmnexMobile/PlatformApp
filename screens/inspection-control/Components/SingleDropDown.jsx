import { COLORS } from 'constants/theme-constants';
import React, { useEffect, useRef } from 'react';
import { Keyboard, Platform, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const SingleDropDown = ({
    data = [],
    onChange = () => {},
    value,
    title = '',
    backgroundColor = COLORS.inputBG,
    borderWidth = StyleSheet.hairlineWidth,
    padding = 2,
    marginTop = 8,
    borderRadius = 5,
    borderColor = COLORS.inputBorder,
    showSearch = true,
    maxHeight = 300,
    placeholder = '',
    editable = true,
    containerStyle = {},
    dropdownPosition = 'top',
}) => {
    const dropdownRef = useRef(null);
    const isOpen = useRef(false); // true while the dropdown list is showing
    const timers = useRef([]);

    // clear any pending timers on unmount
    useEffect(() => {
        return () => timers.current.forEach(clearTimeout);
    }, []);

    // Only intercept the tap that OPENS the dropdown while a keyboard is up.
    // Never intercept taps while the list is already open (search + item selection).
    const handleTouchCapture = () => {
        if (!editable || isOpen.current || !Keyboard.isVisible()) {
            return false;
        }

        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        let opened = false;

        const openOnce = () => {
            if (opened) return;
            opened = true;
            sub.remove();
            timers.current.push(
                setTimeout(() => {
                    dropdownRef.current?.open();
                }, 250), // tune between 150-350ms if needed
            );
        };

        const sub = Keyboard.addListener(hideEvent, openOnce);
        timers.current.push(setTimeout(openOnce, 700)); // fallback if the event never fires

        Keyboard.dismiss();
        return true;
    };

    return (
        <View style={styles.container} onStartShouldSetResponderCapture={handleTouchCapture}>
            {title !== '' && <Text style={styles.headerText}>{title}</Text>}
            <Dropdown
                ref={dropdownRef}
                onFocus={() => {
                    isOpen.current = true;
                }}
                onBlur={() => {
                    isOpen.current = false;
                }}
                style={{
                    backgroundColor,
                    borderWidth,
                    padding,
                    marginTop,
                    borderRadius,
                    borderColor,
                    height: 40,
                }}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={styles.itemTextStyle}
                data={data}
                search={showSearch}
                maxHeight={maxHeight}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                searchPlaceholder="Search..."
                value={value}
                onChange={item => {
                    onChange(item);
                }}
                disable={!editable}
                containerStyle={containerStyle}
                dropdownPosition={dropdownPosition}
                keyboardAvoiding={showSearch}
                statusBarIsTranslucent={true}
                flatListProps={{ keyboardShouldPersistTaps: 'always' }}
            />
        </View>
    );
};

export default SingleDropDown;

const styles = StyleSheet.create({
    container: {},
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 14,
        paddingLeft: 10,
        color: '#333333',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#333333',
        paddingLeft: 10,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    itemTextStyle: {
        fontSize: 14,
        color: '#333333',
        marginTop: -10,
    },
    headerText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        color: COLORS.headerText,
    },
});