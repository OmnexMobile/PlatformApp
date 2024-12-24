import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Content, Header, NoRecordFound, TextComponent } from 'components';
import { APP_VARIABLES, FONT_TYPE } from 'constants/app-constant';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import API_URL from 'global/api-urls';
import { getElevation } from 'helpers/utils';
import { postAPI } from 'global/api-helpers';

const ValueContent = ({ title, value }) => {
    const { theme } = useTheme();
    return (
        <View
            style={{
                width: '33%',
                paddingBottom: SPACING.X_SMALL,
                marginBottom: SPACING.X_SMALL,
            }}>
            <TextComponent color={COLORS.staysIcon} type={FONT_TYPE.BOLD}>
                {title}
            </TextComponent>
            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.SMALL} color={theme.colors.primaryThemeColor}>
                {value || '-'}
            </TextComponent>
        </View>
    );
};

const ViewLogs = ({}) => {
    const { theme } = useTheme();
    const { ConcernID } = useRoute().params;
    const elevation = getElevation();
    const [details, setDetails] = useState({
        data: [],
        loading: true,
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const formData = new FormData();
                formData.append(APP_VARIABLES.CONCERN_ID, ConcernID);
                formData.append(APP_VARIABLES.PAGE, '1');
                formData.append(APP_VARIABLES.SIZE, '10');
                formData.append(APP_VARIABLES.Column, 'RevisionId');
                formData.append(APP_VARIABLES.Order, 'asc');
                formData.append(APP_VARIABLES.Mode, 'Page');
                formData.append(APP_VARIABLES.PageMode, '1');
                const response = await postAPI(`${API_URL.GET_CAR_VIEW_LOG}`, formData);
                setDetails({ data: response?.Data || [], loading: false });
            } catch (error) {
                setDetails({ data: [], loading: false });
            }
        };

        getData();
    }, []);

    return (
        <Content noPadding>
            <Header title="View Logs" />
            {details?.loading ? (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={theme.colors.primaryThemeColor} />
                    <TextComponent style={styles.loadingText} type={FONT_TYPE.BOLD}>
                        Loading logs...
                    </TextComponent>
                    <TextComponent style={styles.loadingTextContainer} type={FONT_TYPE.BOLD}>
                        Please Wait...
                    </TextComponent>
                </View>
            ) : (
                <FlatList
                    data={details.data}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.scrollViewContent}
                    style={{ flex: 1 }}
                    ListEmptyComponent={<NoRecordFound />}
                    renderItem={({ item }) => (
                        <View style={styles.logContainer}>
                            <View style={[styles.logItem, elevation]}>
                                <ValueContent title="Planned On" value={item?.PlannedDate} />
                                <ValueContent title="Requested On" value={item?.RequestedDate} />
                                <ValueContent title="Approver" value={item?.Approver} />
                                <View style={{ flexDirection: 'row' }}>
                                    <ValueContent title="Approved On" value={item?.ApprovalDate} />
                                    <ValueContent title="Status" value={item?.Status} />
                                    <ValueContent title="Remarks" value={item?.Remarks} />
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </Content>
    );
};

export default ViewLogs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        paddingTop: SPACING.NORMAL,
        fontSize: FONT_SIZE.LARGE,
    },
    loadingTextContainer: {
        fontSize: FONT_SIZE.LARGE,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingVertical: SPACING.NORMAL,
    },
    logContainer: {
        paddingHorizontal: SPACING.NORMAL,
    },
    logItem: {
        padding: SPACING.SMALL,
        borderRadius: SPACING.SMALL,
        marginBottom: SPACING.SMALL,
        marginTop: SPACING.X_SMALL,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
