import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextComponent } from 'components';
import { FONT_TYPE, INPUTS_CONSTANTS } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';

const RenderConcernDetails = ({ formConcernDetails }) => {
    const { theme } = useTheme();

    const getAlignment = (index, type) =>
        type === INPUTS_CONSTANTS.RICH_EDITOR ? 'flex-start' : index % 2 === 0 ? 'flex-start' : 'flex-end';

    const getTextAlign = (index) => (index % 2 === 0 ? 'left' : 'right');

    const getDisplayValue = (value) => (value || '').replace(/(<([^>]+)>)/gi, '') || 'No Data';

    return (
        <View style={[styles.container, { backgroundColor: theme.mode.backgroundColor }]}>
            <View style={styles.concernContainer}>
                {formConcernDetails?.map((formConcern, index) => (
                    <View
                        key={index}
                        style={[
                            styles.concernItem,
                            {
                                alignItems: getAlignment(index, formConcern?.Type),
                                width: formConcern?.Type !== INPUTS_CONSTANTS.RICH_EDITOR ? '50%' : '100%',
                            },
                        ]}
                    >
                        <TextComponent
                            numberOfLines={5}
                            fontSize={FONT_SIZE.X_SMALL}
                            color={COLORS.searchText}
                            type={FONT_TYPE.BOLD}
                            style={{ textAlign: getTextAlign(index) }}
                        >
                            {formConcern?.Label}
                        </TextComponent>
                        <TextComponent
                            type={FONT_TYPE.BOLD}
                            numberOfLines={formConcern?.Type === INPUTS_CONSTANTS.RICH_EDITOR ? 2000 : 1}
                        >
                            {getDisplayValue(formConcern?.Value)}
                        </TextComponent>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.NORMAL,
    },
    concernContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: SPACING.NORMAL,
        flexWrap: 'wrap',
        flex: 1,
    },
    concernItem: {
        paddingBottom: SPACING.SMALL,
    },
});

export default RenderConcernDetails;
