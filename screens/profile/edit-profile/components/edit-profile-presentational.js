import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import moment from 'moment';
import { Colors, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { ButtonComponent, GradientButton, Header, ImageComponent, PageLoader, TextComponent } from 'components';
import { FONT_TYPE } from 'constants/app-constant';
import EditProfileInput from './edit-profile-input';

const GALLARY_IMAGE_SIZE = RFPercentage(16);

const EditProfilePresentational = ({ buttonLoading, handleUpdate, loading, inputs = [], profileDetails, handleChange, isSame }) => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <Header back title="Profile" />

            <>
                <ScrollView style={{ paddingTop: SPACING.NORMAL }} contentContainerStyle={{ flexGrow: 1 }}>
                    {/* <TouchableOpacity>
                            <ImageComponent
                                style={{ borderRadius: 8, width: GALLARY_IMAGE_SIZE, height: GALLARY_IMAGE_SIZE, marginBottom: SPACING.NORMAL }}
                                source={{
                                    uri: 'https://via.placeholder.com/150',
                                }}
                            />
                        </TouchableOpacity> */}
                    <View style={{ flex: 1 }}>
                        {inputs.map((props, index) => (
                            <EditProfileInput
                                {...{
                                    handleChange,
                                    value: profileDetails?.[props?.name],
                                    ...props,
                                    key: index,
                                    inputStyle: {
                                        fontSize: FONT_SIZE.X_LARGE,
                                        fontFamily: 'ProximaNova-Bold',
                                    },
                                }}
                            />
                        ))}

                        <View style={{ padding: SPACING.NORMAL }}>
                            <TextComponent type={FONT_TYPE.BOLD} color={Colors.primaryThemeColor} fontSize={FONT_SIZE.SMALL}>
                                Last updated {moment(profileDetails?.updatedAt).fromNow()}
                            </TextComponent>
                        </View>
                    </View>
                    <View style={{ padding: SPACING.NORMAL }}>
                        <GradientButton
                            {...{
                                disabled: isSame,
                                loading,
                                onPress: handleUpdate,
                            }}>
                            Update
                        </GradientButton>
                    </View>
                </ScrollView>

                {loading && (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: Colors.transparentGrey,
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}>
                        <PageLoader />
                    </View>
                )}
            </>
        </View>
    );
};

export default EditProfilePresentational;
