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
    const isOpen = useRef(false);
    const searchText = useRef('');
    useEffect(() => {
        const sub = Keyboard.addListener('keyboardDidHide', () => {
            if (isOpen.current && dropdownRef.current) {
                if (Platform.OS !== 'android') return;
                dropdownRef.current.close();
                // wait for the modal layout to settle, then reopen so it re-measures
                setTimeout(() => dropdownRef.current?.open(), 50);
            }
        });
        return () => sub.remove();
    }, []);
    // return (
    //     <View style={[styles.container]}>
    //         {title !== '' && <Text style={[styles.headerText]}>{title}</Text>}
    //         <Dropdown
    //             style={[{
    //                 backgroundColor: backgroundColor,
    //                 borderWidth: borderWidth,
    //                 padding: padding, marginTop: marginTop,
    //                 borderRadius: borderRadius,
    //                 borderColor: borderColor,
    //                 height: 40,
    //             }]}
    //             placeholderStyle={styles.placeholderStyle}
    //             selectedTextStyle={styles.selectedTextStyle}
    //             inputSearchStyle={styles.inputSearchStyle}
    //             iconStyle={styles.iconStyle}
    //             itemTextStyle={styles.itemTextStyle}
    //             data={data}
    //             search={showSearch}
    //             maxHeight={maxHeight}
    //             labelField="label"
    //             valueField="value"
    //             placeholder={placeholder}
    //             searchPlaceholder="Search..."
    //             value={value}
    //             onChange={item => {
    //                 onChange(item);
    //             }}
    //             disable={!editable}
    //             containerStyle={containerStyle}
    //             dropdownPosition={dropdownPosition}
    //         />
    //     </View>
    // );
    return (
        <View style={styles.container}>
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
                keyboardAvoiding={true}
                statusBarIsTranslucent={true}
                onChangeText={t => {
                    searchText.current = t;
                }}
                flatListProps={{ keyboardShouldPersistTaps: 'handled' }}
            />
        </View>
    );
};

export default SingleDropDown;

const styles = StyleSheet.create({
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
