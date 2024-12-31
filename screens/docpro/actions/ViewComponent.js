import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Ripple from 'react-native-material-ripple';
import moment from 'moment';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { DATE_FORMAT, FONT_TYPE, ICON_TYPE, ROUTES } from 'constants/app-constant';
import TextComponent from '../../../components/text';
import Icon from 'react-native-vector-icons/FontAwesome';
import ReqDetails from '../json/PendingReqDetails';
const ViewComponent = ({ reqDetails }) => {
    useEffect(() => {
        console.log('reqDetails123-----', reqDetails);
    });
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.viewStyle}>
                <Text style={styles.label}>Site</Text>
                <Text style={styles.value} numberOfLines={1}>
                    {reqDetails?.sitename || 'N/A'}
                </Text>
            </View>

            <View style={styles.viewStyle}>
                <Text style={styles.label}>Document Number</Text>
                <Text style={styles.value} numberOfLines={1}>
                    {reqDetails?.number || 'N/A'}
                </Text>
            </View>
            <View style={styles.viewStyle}>
                <Text style={styles.label}>Keyword(s)</Text>
                <Text style={styles.value} numberOfLines={1}>
                    {reqDetails.keyword || 'N/A'}
                </Text>
            </View>

            <View style={styles.viewStyle}>
                <Text style={styles.label}>Request Date</Text>
                <Text style={styles.value} numberOfLines={1}>
                    {reqDetails.reqdate || 'N/A'}
                </Text>
            </View>

            <View style={styles.viewStyle}>
                <Text style={styles.label}>Effective Date</Text>
                <Text style={styles.value} numberOfLines={1}>
                    {reqDetails.effectivedate || 'N/A'}
                </Text>
            </View>

            <View style={styles.viewStyle}>
                <Text style={styles.label}>Reference Attachments</Text>
                <Text style={styles.value} numberOfLines={1}>
                    No Reference Attachments
                </Text>
            </View>
            <View style={styles.viewStyle}>
                <Text style={styles.label}>Reason for Change</Text>
                <Text style={styles.value} numberOfLines={1}>
                    {reqDetails.reason}
                </Text>
            </View>
            <View style={styles.viewStyle}>
                <Text style={styles.label}>Document Level</Text>
                <Text style={styles.value} numberOfLines={1}>
                    Details
                </Text>
            </View>
            <View style={styles.viewStyle}>
                <Text style={styles.label}>Document Name</Text>
                <Text style={styles.value} numberOfLines={1}>
                    {reqDetails.name}
                </Text>
            </View>
            <View style={styles.viewStyle}>
                <Text style={styles.label}>Requested By</Text>
                <Text style={styles.value} numberOfLines={1}>
                    {reqDetails.requestedby}
                </Text>
            </View>
            <View style={styles.viewStyle}>
                <Text style={styles.label}>Revision Number</Text>
                <Text style={styles.value} numberOfLines={1}>
                    {reqDetails.rev}
                </Text>
            </View>
            <View style={styles.viewStyle}>
                <Text style={styles.label}>Change Description</Text>
                <Text style={styles.value} numberOfLines={1}>
                    Details
                </Text>
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    
    scrollContainer: {
        padding: 10,
        flexGrow: 1, // Ensures ScrollView takes minimum required height
    },
    viewStyle: {
        backgroundColor: 'rgba(237,242,246,255)',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#333',
    },
    value: {
        marginTop:5,
        fontSize: 16,
        color: '#666',
    },
});

export default ViewComponent;
