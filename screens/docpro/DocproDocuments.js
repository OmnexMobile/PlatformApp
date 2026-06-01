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
import {  TextComponent } from 'components';
import { COLORS, FONT_SIZE} from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
const HomeListComponent = ({ title, data, loading, statusCode, hideSeeAll }) => {
    const { theme } = useTheme();
    const { handleRecentActivity } = useAppContext();
    const navigation = useNavigation();
    console.log('CURRENT_PAGE---->', 'home-presentational');
    return (
        <View style={{marginBottom:100}}>
            {data?.length > 0
                ? data?.map((item, index) => <DocproListCard key={index} item={item} handleRecentActivity={handleRecentActivity} />)
                : // <NoRecordFound />
                  null}
        </View>
    );
};
const DocproDocuments = (navigation) => {
    console.log('checkkkkk------',navigation);
    
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
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
    const [text, setText] = useState('');
    var todayList = ['IFSA-Printed Circuit Board-1', 'IFSA-S120-2.1 MW NACELLE', 'IS-Battery Management System', 'IS-Battery Management System-1'];

    return (
        <View style={styles.safeArea}>
            <CustomHeader title={'Document'} />

            <TouchableWithoutFeedback onPress={handleTouchOutside}>
                <View style={styles.container}>
                    <View style={styles.row}>
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
                        <View style={{ flex: 1 }}>
                            <TextInput style={styles.textInput} placeholder="" value={text} onChangeText={setText} />
                        </View>
                        <TouchableOpacity style={styles.moreIconWrapper}>
                            <Icon name="ellipsis-v" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {/* <HomeListComponent
                            {...{
                                statusCode: STATUS_CODES.TODAY_CONCERN,
                                // title: APP_VARIABLES.TODAY_CONCERN,
                                title: 'Today’s Concern',
                                data: todayList,
                                // loading: todayList?.loading,
                            }}
                        /> */}
                    </ScrollView>

                    <View style={styles.bottomFixedView}>
                        <Text style={styles.bottomText}>Total Documents</Text>
                        <View
                            style={{
                                width: 35,
                                height: 35,
                                borderRadius: 12,
                                backgroundColor: '#24c5d9',
                                marginLeft: '5%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <TextComponent fontSize={FONT_SIZE.X_LARGE}>10</TextComponent>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },
    header: {
        padding: 16,
        backgroundColor: '#6200EE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        padding: 16,
        width: '96%',
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginTop: '5%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 5000,
        // backgroundColor:'green'
    },
    dropdownWrapper: {
        flex: 1,
        zIndex: 5000,
        marginRight: 10,
        width: 150,
    },
    dropdownContainer: {
        width: '100%',
    },
    dropdown: {
        backgroundColor: '#ececec',
    },

    textInput: {
        // marginLeft: 10,
        flex: 1,
        height: 50,
        borderColor: '#ececec',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#ececec',
    },
    list: {
        marginTop: 20,
    },

    listItem: {
        padding: 16,
        backgroundColor: 'transparent',
        marginBottom: 10,
        borderRadius: 8,
    },
    dropdownStyle: {
        backgroundColor: '#ececec',
        borderWidth: 1,
        borderColor: '#ececec',
        borderRadius: 2,
    },

    moreIconWrapper: {
        marginLeft: 10,
        backgroundColor: ' #ffffff',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#e0e0e0',
        borderWidth: 1,
    },
    bottomFixedView: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    bottomText: {
        color: 'black',
        fontSize: 16,
    },
});

export default DocproDocuments;
