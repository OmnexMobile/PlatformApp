import React from 'react';
import { View } from 'react-native';
import { IMAGES } from 'assets/images';
import { FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage } from 'helpers/utils';
import ImageComponent from './image-component';
import TextComponent from './text';
import { FONT_TYPE } from 'constants/app-constant';

const NoRecordFound = () => (
    <View
        style={{
            padding: SPACING.NORMAL,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        }}>
        <View
            style={{
                width: RFPercentage(10),
                height: RFPercentage(10),
                paddingBottom: SPACING.NORMAL,
            }}>
            <ImageComponent source={IMAGES.emptyIcon} />
        </View>
        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
            No records found
        </TextComponent>
    </View>
);

export default NoRecordFound;
