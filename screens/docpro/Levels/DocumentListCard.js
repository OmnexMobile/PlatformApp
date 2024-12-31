import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Text,
    Alert,
    Modal,
    Button,
    PermissionsAndroid,
    Platform,
    useWindowDimensions,
} from 'react-native';
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
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import ImageViewer from './ImageViewer';
import RenderHtml, { HTMLElementModel, HTMLContentModel } from 'react-native-render-html';
import PdfViewer from './PdfViewer';
const DocumentListCard = ({ fileContent, setlistStatus, listStatus, setlisthead, nodata }) => {
    const { width } = useWindowDimensions();

    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const [fileView, setfileView] = useState();
    const [extenstion, setextenstion] = useState();

    const [pdfStatus, setpdfStatus] = useState(false);
    const [pdffile, setpdfFile] = useState();
    console.log('checkdatadocumentlist', nodata);

    const openModal = (ext, base64String) => {
        setfileView(base64String);
        // console.log('checkfilesdkviewextension', ext, base64String);
        setextenstion(ext);
        // console.log('checkfileset', fileView);
        // console.log('checkext', ext);
        if (ext == 'png') {
            console.log('inside png');
            setModalVisible(true);
        } else if (ext == 'html') {
            console.log('inside html');
        } else if (ext == 'pdf') {
            const base64PDF = base64String;
            setpdfStatus(true);
            setpdfFile(base64PDF);
            console.log('inside pdf');
        } else if (ext == 'jpeg') {
            console.log('inside jpeg');
            setModalVisible(true);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => openModal(item.ext, item.file)}>
                    <Icon name="file" size={24} color="gray" style={{ marginLeft: 10 }}></Icon>
                    <Text numberOfLines={4} style={styles.itemText}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            {modalVisible == false ? (
                <>
                    {nodata == false ? (
                        <FlatList
                            data={fileContent}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.gridContainer}
                            numColumns={4}
                        />
                    ) : (
                        <View style={{ height: '100%', width: '100%',justifyContent:'center'}}>
                            <TextComponent
                                type={FONT_TYPE.BOLD}
                                color={COLORS.black}
                                fontSize={FONT_SIZE.LARGE}
                                numberOfLines={1}
                                style={{ alignSelf:'center' }}>
                                No Data Found
                            </TextComponent>
                        </View>
                    )}
                </>
            ) : (
                <ImageViewer fileView={fileView} extenstion={extenstion} modalVisible={modalVisible} setModalVisible={setModalVisible} />
            )}
            {pdfStatus === true ? <PdfViewer setpdfStatus={setpdfStatus} pdffile={pdffile} /> : null}

            {/* <RenderHtml contentWidth={300} source={{ html: decodedHTML }} />  */}

            <View style={{ height: 20 }}></View>
        </View>
    );
};

export default DocumentListCard;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // padding: 16,
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
        margin: 5, // Adjust margin for smaller grid items
        padding: 10, // Adjust padding based on grid size
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    itemText: {
        fontSize: 14,
        textAlign: 'center', // Adjust text size for smaller grid items
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        height: '100%',
        width: '100%', // Makes the background semi-transparent
    },
    modalView: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
