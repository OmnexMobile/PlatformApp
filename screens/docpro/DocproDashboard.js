import React from 'react';
import { Image, View, TouchableOpacity, Text, Dimensions, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DocproAction from './actions/DocproAction';
import DocproAdminAction from './DocproAdminAction';
import DocproDocuments from './DocproDocuments';
import DocproNewDocumentRequest from './DocproNewDocumentRequest';
import { IMAGES } from 'assets/images';

import { connect } from 'react-redux';

const Tab = createBottomTabNavigator();

const DocproDashboard = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Tab.Screen
                name="Documents"
                component={DocproDocuments}
                options={{
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{width:25,height:25}}>
                                 <Image
                                style={{ width: 18, height: 22 }}
                                source={IMAGES.docdocument}
                            />
                            </View>
                           
                        );
                    },
                }}
            />

            <Tab.Screen name="Action" component={DocproAction}  options={{
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                style={{ width: size, height: size }}
                                source={IMAGES.docAction}
                            />
                        );
                    },
                }}/>
            <Tab.Screen name="Admin Action" component={DocproAdminAction} options={{
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                style={{ width: size, height: size }}
                                source={IMAGES.docadmin}
                            />
                        );
                    },
                }}/>
            <Tab.Screen name="Doc Request" component={DocproNewDocumentRequest} options={{
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                style={{ width: size, height: size }}
                                source={IMAGES.docnewdocument}
                            />
                        );
                    },
                }}/>
        </Tab.Navigator>
    );
};
export default DocproDashboard;
