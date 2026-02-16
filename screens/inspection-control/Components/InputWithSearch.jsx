import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const InputWithSearch = ({ placeholder, onSearch = () => {}, clearText = false, searchValue = '', height = 41 }) => {
    const [search, setSearch] = useState('');
    useEffect(() => {
        setSearch(searchValue);
    }, [searchValue]);
    return (
        <View style={[styles.container, { height: height }]}>
            <TextInput
                style={styles.input}
                placeholder={placeholder || 'Search...'}
                placeholderTextColor="#888"
                onChangeText={text => {
                    setSearch(text);
                    onSearch(text);
                }}
                value={search}
            />
            <Icon name="search" size={20} color={COLORS.black} style={styles.icon} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.staysIcon,
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingLeft: 5,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        // fontSize: 16,
        // height: 40,
        // color: COLORS.ictextBlack,
        fontFamily: 'OpenSans-Regular',
        fontSize: FONT_SIZE.SMALL,
        width: '100%',
        color: COLORS.themeBlack,
        padding: 0,
        paddingHorizontal: SPACING.SMALL,
    },
});

export default InputWithSearch;
