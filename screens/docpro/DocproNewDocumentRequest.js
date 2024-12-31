import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import CustomHeader from './CustomHeader';
import { TextInput } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Content, TextComponent, ExitModal, ListCard, PlaceHolders, NoRecordFound, FAB, Avatar, IconComponent } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { APP_VARIABLES, FONT_TYPE, ICON_TYPE, LOCAL_STORAGE_VARIABLES, PLACEHOLDERS, ROUTES, STATUS_CODES } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import { useNavigation } from '@react-navigation/native';
import DocproListCard from './DocproListCard';
import React, { useState } from 'react';
import Fonts from 'constants/Fonts';
import { CheckBox } from 'react-native-elements';
import BottomView from './BottomView';
const DocproNewDocumentRequest = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [text, setText] = useState('');
    const [checked, setChecked] = useState(false);

    const [items, setItems] = useState([
        { label: 'Document Number', value: 'option1' },
        { label: 'Document Name', value: 'option2' },
        { label: 'Last Revison Date', value: 'option3' },
        { label: 'Effective Date', value: 'option4' },
    ]);
    const handleTouchOutside = () => {
        if (open) {
            setOpen(false);
        }
        Keyboard.dismiss();
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomHeader title={'Document'} />
            <ScrollView>
                <TouchableWithoutFeedback onPress={handleTouchOutside}>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row' }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} color={COLORS.headerText}>
                                Site{' '}
                            </TextComponent>
                            <TextComponent style={{ fontSize: FONT_SIZE.LARGE }} color={COLORS.ERROR}>
                                *
                            </TextComponent>
                        </View>
                        <View style={styles.dropdownWrapper}>
                            <DropDownPicker
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                placeholder="Select an option"
                                containerStyle={styles.dropdownContainer}
                                dropDownContainerStyle={styles.dropdown}
                                zIndex={5000}
                                zIndexInverse={1000}
                                style={styles.dropdownStyle}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} color={COLORS.headerText}>
                                Document Level{' '}
                            </TextComponent>
                            <TextComponent style={{ fontSize: FONT_SIZE.LARGE }} color={COLORS.ERROR}>
                                *
                            </TextComponent>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput style={styles.textInput} placeholder="" onChangeText={setText} />
                            <View
                                style={{
                                    width: '20%',
                                    backgroundColor: 'red',
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} color={COLORS.headerText}>
                                Attach Document{' '}
                            </TextComponent>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput style={styles.textInput} placeholder="" onChangeText={setText} />
                            <View
                                style={{
                                    width: '20%',
                                    backgroundColor: 'red',
                                }}
                            />
                        </View>
                        <View style={styles.checkBox}>
                            <CheckBox containerStyle={styles.checkboxContainer} checked={checked} onPress={() => setChecked(!checked)} />
                            <Text style={styles.checkBoxtext}>Online Document</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} color={COLORS.headerText}>
                                Last Document Number{' '}
                            </TextComponent>
                        </View>
                        <TextInput style={styles.textInput} placeholder="" onChangeText={setText} />
                        <View style={{ height: 0.2, backgroundColor: 'gray', marginTop: 10 }}></View>

                        <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} color={COLORS.headerText}>
                                Document Number{' '}
                            </TextComponent>
                            <TextComponent style={{ fontSize: FONT_SIZE.LARGE }} color={COLORS.ERROR}>
                                *
                            </TextComponent>
                        </View>
                        <TextInput style={styles.textInput} placeholder="" onChangeText={setText} />

                        <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} color={COLORS.headerText}>
                                Document Name{' '}
                            </TextComponent>
                            <TextComponent style={{ fontSize: FONT_SIZE.LARGE }} color={COLORS.ERROR}>
                                *
                            </TextComponent>
                        </View>
                        <TextInput style={styles.textInput} placeholder="" onChangeText={setText} />

                        <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} color={COLORS.headerText}>
                                Keyword(s){' '}
                            </TextComponent>
                        </View>
                        <TextInput style={styles.textInput} placeholder="" onChangeText={setText} />
                        <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                            <TextComponent numberOfLines={1} type={FONT_TYPE.BOLD} color={COLORS.headerText}>
                                Revision{' '}
                            </TextComponent>
                            <TextComponent style={{ fontSize: FONT_SIZE.LARGE }} color={COLORS.ERROR}>
                                *
                            </TextComponent>
                        </View>
                        <TextInput style={styles.textInput} placeholder="" onChangeText={setText} />
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
            <BottomView/>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },
    container: {
        flex: 1,
        padding: 16,
        width: '96%',
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginTop: '5%',
        marginBottom: 10,
    },
    textInput: {
        // marginLeft: 10,
        flex: 1,
        height: 50,
        // width: 80,
        borderColor: '#ececec',
        borderWidth: 1,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        paddingHorizontal: 10,
        // backgroundColor: '#ececec',
    },
    checkBox: {
        flexDirection: 'row',
        alignItems: 'center',
        // padding: 10,
        // backgroundColor:'black'
    },
    checkBoxtext: {
        // marginLeft: 10, // Space between checkbox and text
        fontSize: 16,
    },
    checkboxContainer: {
        backgroundColor: 'transparent', // To remove default background
        padding: 0, // To adjust padding
        marginLeft: 2,
    },
});

export default DocproNewDocumentRequest;
