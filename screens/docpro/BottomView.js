import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { IMAGES } from 'assets/images';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { ICON_TYPE, ROUTES } from 'constants/app-constant';

const BottomView = ({ title }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const isActiveTab = tabName => route.name === tabName;
    console.log(tabName => route.name === tabName, '##############################');

    // const navigation = useNavigation();
    console.log('bhbhbhbhbh------', navigation, title);
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.tab, isActiveTab(ROUTES.DOCPRO_DOCUMENTS) && styles.activeTab]} // Apply active style if the tab is active
                onPress={() => navigation.navigate(ROUTES.DOCPRO_DOCUMENTS)}>
                <Image style={isActiveTab(ROUTES.DOCPRO_DOCUMENTS) ? styles.activeImage : styles.inActiveImage} source={IMAGES.docdocument} />
                <Text style={isActiveTab(ROUTES.DOCPRO_DOCUMENTS) ? styles.activeText : styles.inactiveText}>Documents</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, isActiveTab(ROUTES.DOCPRO_ACTION) && styles.activeTab]} // Apply active style if the tab is active
                onPress={() => navigation.navigate(ROUTES.DOCPRO_ACTION)}>
                <Image style={isActiveTab(ROUTES.DOCPRO_ACTION) ? styles.activeImage : styles.inActiveImage} source={IMAGES.docAction} />
                <Text style={isActiveTab(ROUTES.DOCPRO_ACTION) ? styles.activeText : styles.inactiveText}>Actionn</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, isActiveTab(ROUTES.DOCPRO_ADMINACTION) && styles.activeTab]} // Apply active style if the tab is active
                onPress={() => navigation.navigate(ROUTES.DOCPRO_ADMINACTION)}>
                <Image style={isActiveTab(ROUTES.DOCPRO_ADMINACTION) ? styles.activeImage : styles.inActiveImage} source={IMAGES.docadmin} />
                <Text style={isActiveTab(ROUTES.DOCPRO_ADMINACTION) ? styles.activeText : styles.inactiveText}>Admin Actions</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, isActiveTab(ROUTES.DOCPRO_NEWDOCUMENTREQUEST) && styles.activeTab]} // Apply active style if the tab is active
                onPress={() => navigation.navigate(ROUTES.DOCPRO_NEWDOCUMENTREQUEST)}>
                <Image
                    style={isActiveTab(ROUTES.DOCPRO_NEWDOCUMENTREQUEST) ? styles.activeImage : styles.inActiveImage}
                    source={IMAGES.docnewdocument}
                />
                <Text style={isActiveTab(ROUTES.DOCPRO_NEWDOCUMENTREQUEST) ? styles.activeText : styles.inactiveText}>Doc Requests</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Aligns the items in a row
        justifyContent: 'space-around', // Distribute tabs evenly
        backgroundColor: '#f8f8f8', // Optional background color
        padding: 10, // Optional padding
        position: 'absolute', // Fix the tab bar at the bottom
        bottom: 0, // Position it at the bottom of the screen
        left: 0, // Stretch to the left edge of the screen
        right: 0, // Stretch to the right edge of the screen
        borderTopWidth: 1, // Optional top border for separation
        borderColor: '#ccc',
    },
    activeImage: {
        borderColor: 'rgba(0,164,174,255)',
        height: 24,
        width: 22,
    },
    inActiveImage: {
        borderColor: 'black',
        height: 24,
        width: 22,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        // paddingVertical: 15,
        // marginHorizontal: 5,
        // borderRadius: 10,
        // backgroundColor: '#ddd', // Default background color for inactive tabs
    },
   
    inactiveText: {
        color: '#000', // Inactive tab text color
    },
    activeText: {
        color: 'rgba(0,164,174,255)', // Active tab text color
    },
});
export default BottomView;
