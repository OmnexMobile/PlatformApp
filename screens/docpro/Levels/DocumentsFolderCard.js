import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, FlatList, Text, Alert } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import { getElevation, RFPercentage } from 'helpers/utils';
import useTheme from 'theme/useTheme';
import IconComponent from '../../../components/icon-component';
import TextComponent from '../../../components/text';
import { IMAGES } from 'assets/images';
import Icon from 'react-native-vector-icons/FontAwesome';
import DocumentListJson from '../../docpro/json/DocumentListJson';
import DocumentListCard from './DocumentListCard';
const DocumentsFolderCard = ({ handleRecentActivity, fetchedLevels, levelStatus, setlevelStatus }) => {
    const { theme } = useTheme();
    const elevation = getElevation();
    const navigation = useNavigation();

    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [listStatus, setlistStatus] = useState(false);
    const [nodata, setNoData] = useState(false);
    const [listhead, setlisthead] = useState(false);
    const handleClickCard = item => {
        navigation.navigate(ROUTES.CONCERN_INITIAL_EVALUATION, { ConcernID: item?.ConcernID });
        handleRecentActivity?.(item);
    };

    useEffect(() => {
        const documentList = DocumentListJson.response.loaded.documents.document;
        setList(documentList);

        console.log('DPLEVELLISTINNGDATA*******321321', documentList);
    }, []);

    const checkModules = sitelevelid => {
        const documentList = DocumentListJson.response.loaded.documents.document;
        if (documentList.length > 0) {
            console.log('checkingdetials*************', DocumentListJson.response.loaded.documents.sitelevelid);
            console.log('checkingdetials!!!!!!!!!!!!', sitelevelid);

            if (DocumentListJson.response.loaded.documents.sitelevelid == sitelevelid) {
                // Alert.alert(fetchedLevels.name);
                // Alert.alert('siteid matched');
                setlistStatus(true);
                setNoData(false);
            } else {
                setlistStatus(true);

                // setlistStatus(false);
                setNoData(true);
                // Alert.alert('No data found');
            }
            setList(documentList);
            // setlistStatus(true);
        } else {
            Alert.alert('No data found');
            setlistStatus(false);
        }
    };
    const screenWidth = Dimensions.get('window').width;
    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    style={{ alignItems: 'center' }}
                    onPress={() => {
                        checkModules(item.sitelevelid);
                    }}>
                    <Image resizeMode="cover" style={{ height: 35, width: 35 }} source={IMAGES.folder} />
                    <Text numberOfLines={4} style={styles.itemText}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <View style={{ height: 0.3, backgroundCort6lor: 'gray', marginTop: 5 }}></View>
            <View style={{ marginTop: 5, flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => {
                        setlevelStatus(false);
                    }}>
                    <Icon name="home" size={24} color="gray" style={{ marginLeft: 10 }}></Icon>
                </TouchableOpacity>
                <Icon name="angle-right" size={24} color="gray" style={{ marginLeft: 15 }}></Icon>
                <TouchableOpacity
                    onPress={() => {
                        setlistStatus(false);
                    }}>
                    <Icon name="list" size={24} color="gray" style={{ marginLeft: 10 }}></Icon>
                </TouchableOpacity>
                <Icon name="angle-right" size={24} color="gray" style={{ marginLeft: 15 }}></Icon>
                <TextComponent type={FONT_TYPE.BOLD} color={COLORS.black} fontSize={FONT_SIZE.LARGE} numberOfLines={1} style={{ marginLeft: 10 }}>
                    Documents
                </TextComponent>
            </View>
            <View style={{ height: 0.3, backgroundColor: 'gray', marginTop: 5, flexDirection: 'row' }}></View>
            {listStatus == true  ? (
                <DocumentListCard
                    fileContent={list}
                    setlistStatus={setlistStatus}
                    listStatus={listStatus}
                    setlisthead={setlisthead}
                    nodata={nodata}
                />
            ) : (
                <FlatList
                    data={fetchedLevels}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.gridContainer}
                    numColumns={4}
                />
            )}

            <View style={{ height: 20 }}></View>
        </View>
    );
};

export default DocumentsFolderCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginTop: '2%',
    },
    cardOuterView: {
        flexDirection: 'row',
    },
    borderEnabled: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
    },
    detailsView: {
        flex: 3,
        borderLeftWidth: 4,
        paddingLeft: 8,
    },
    progressRound: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: 'lightgrey',
        borderWidth: 4,
    },
    floatingDiv: {
        position: 'absolute',
        right: 20,
        bottom: 120,
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    apqpTypeIcon: {
        width: 30,
        height: 17,
    },
    projectBoxContent: { marginLeft: '2%' },
    gridContainer: {
        justifyContent: 'center',
    },
    itemContainer: {
        flex: 1,
        margin: 5, 
        padding: 10, 
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    itemText: {
        fontSize: 14,
        textAlign: 'center', 
    },
});
