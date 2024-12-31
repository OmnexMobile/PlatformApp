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
    Dimensions,
    Alert,
    StatusBar
} from 'react-native';
import { IMAGES } from 'assets/images';
import CustomHeader from '../CustomHeader';
import { TextInput } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Content, TextComponent, ExitModal, ListCard, PlaceHolders, NoRecordFound, FAB, Avatar, IconComponent } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { APP_VARIABLES, FONT_TYPE, ICON_TYPE, LOCAL_STORAGE_VARIABLES, PLACEHOLDERS, ROUTES, STATUS_CODES } from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import { useNavigation } from '@react-navigation/native';
import DocumentsFolderCard from './DocumentsFolderCard';
import React, { useEffect, useState } from 'react';
import Fonts from 'constants/Fonts';
import BottomView from '../BottomView';
import DPLeveljson from '../../docpro/json/DPLeveljson';
const DocumentFolder = () => {
    const navigation = useNavigation();

    const [levels, setLevels] = useState([]);
    const [open, setOpen] = useState(false);
    const [levelStatus, setlevelStatus] = useState(false);
    useEffect(() => {
        const fetchedLevels = DPLeveljson.response.levels.cat;
        setLevels(fetchedLevels);

        console.log('DPLEVELLISTINNGDATA*******', fetchedLevels);
    }, []);
    const checkModules = () => {
        const fetchedLevels = DPLeveljson.response.levels.cat;
        if (fetchedLevels.length > 0) {
            setLevels(fetchedLevels);
            setlevelStatus(true);
        } else {
            Alert.alert('No data found');
            setlevelStatus(false);
        }
    };
    const handleTouchOutside = () => {
        if (open) {
            setOpen(false);
        }
        Keyboard.dismiss();
    };
    const [text, setText] = useState('');
    const data = [
        { id: '1', title: 'Documents' },
        { id: '2', title: 'Modules' },
    ];
    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    style={{ alignItems: 'center' }}
                    onPress={() => {
                        checkModules();
                    }}>
                    <Image resizeMode="cover" style={{ height: 35, width: 35 }} source={IMAGES.folder} />
                    <Text style={styles.itemText}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomHeader title={'Document'} />
            <StatusBar hidden={true} />
            <TouchableWithoutFeedback onPress={handleTouchOutside}>
                <View style={styles.container}>
                    <TextComponent
                        type={FONT_TYPE.BOLD}
                        color={COLORS.black}
                        fontSize={FONT_SIZE.NORMAL}
                        numberOfLines={1}
                        style={{ marginLeft: 10, marginTop: 10 }}>
                        Documents and Owned Documents
                    </TextComponent>
                    {levelStatus == false ? (
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item['id']}
                            contentContainerStyle={styles.gridContainer}
                            numColumns={4}
                        />
                    ) : (
                        <DocumentsFolderCard fetchedLevels={levels} levelStatus={levelStatus} setlevelStatus={setlevelStatus} />
                    )}
                    <View style={{ height: 20 }}></View>
                </View>
            </TouchableWithoutFeedback>
            {/* <View style={styles.bottomFixedView}>
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#dedede',
                        marginLeft: '5%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}>
                        <Icon name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View> */}
        </SafeAreaView>
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
        // padding: 16,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginTop: '2%',
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
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
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
    gridContainer: {
        justifyContent: 'center',
    },
    itemContainer: {
        flex: 1,
        margin: 5, // Adjust margin for smaller grid items
        padding: 10, // Adjust padding based on grid size
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    itemText: {
        fontSize: 14, // Adjust text size for smaller grid items
    },
});

export default DocumentFolder;
