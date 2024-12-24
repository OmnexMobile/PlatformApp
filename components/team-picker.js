import React, { createContext, useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, FlatList } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { APP_VARIABLES, FONT_TYPE, ICON_TYPE, PLACEHOLDERS } from 'constants/app-constant';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/api-urls';
import useTheme from 'theme/useTheme';
import { useAppContext } from 'contexts/app-context';
import { formReq, objToQs, showErrorMessage, successMessage } from 'helpers/utils';
import TextComponent from './text';
import ModalComponent from './modal-component';
import TabViewComponent from './tab-view-component';
import Header from './header';
import Content from './content';
import NoRecordFound from './NoRecordFound';
import IconComponent from './icon-component';
import GradientButton from './gradient-button';
import PlaceHolders from './placeholders';

const TeamContext = createContext({});

const useTeamContext = () => {
    return useContext(TeamContext);
};
const TeamProvider = ({ children }) => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    return <TeamContext.Provider value={{ selectedTeam, setSelectedTeam }}>{children}</TeamContext.Provider>;
};

const TeamCard = ({ onPress, isSelected, text }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={{ paddingVertical: SPACING.NORMAL, borderBottomWidth: 1, borderColor: theme.mode.borderColor, flexDirection: 'row' }}>
            <View style={{ paddingHorizontal: SPACING.NORMAL, alignItems: 'center', justifyContent: 'center' }}>
                <IconComponent
                    size={FONT_SIZE.LARGE}
                    type={ICON_TYPE.Ionicons}
                    name={isSelected ? 'md-checkbox' : 'square-outline'}
                    color={theme.colors.primaryThemeColor}
                />
            </View>
            <View style={{ flex: 8, alignItems: 'flex-start', justifyContent: 'center' }}>
                <TextComponent type={isSelected ? FONT_TYPE.BOLD : FONT_TYPE.REGULAR}>{text}</TextComponent>
            </View>
        </TouchableOpacity>
    );
};

const TeamList = () => {
    const { selectedTeam, setSelectedTeam } = useTeamContext();
    const [list, setList] = useState({
        data: [],
        loading: true,
    });
    const { sites } = useAppContext();
    const getListData = async req => {
        try {
            const { Data } = await postAPI(
                `${API_URL.GET_TEAM_LIST}${objToQs({
                    SiteID: req.SiteId,
                })}`,
            );
            setList({
                data: Data,
                loading: false,
            });
        } catch (err) {
            setList({
                data: [],
                loading: false,
            });
            console.log('🚀 ~ file: team-picker.js:71 ~ getListData ~ err', err);
        }
    };

    useEffect(() => {
        if (sites?.selectedSite) {
            setTimeout(() => {
                getListData(sites?.selectedSite);
            }, 1500);
        }
    }, [sites?.selectedSite]);

    return (
        <Content noPadding>
            {list.loading ? (
                <PlaceHolders type={PLACEHOLDERS.TEAM_CARD} />
            ) : (
                <FlatList
                    ListEmptyComponent={<NoRecordFound />}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: SPACING.NORMAL }}
                    data={list?.data}
                    renderItem={({ item }) => (
                        <TeamCard
                            text={item?.TeamName}
                            isSelected={selectedTeam?.id === item?.TeamId}
                            onPress={() =>
                                setSelectedTeam({
                                    id: item?.TeamId,
                                    type: 'TEAM',
                                    name: item?.TeamName,
                                })
                            }
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </Content>
    );
};

const TeamUsers = () => {
    const { selectedTeam, setSelectedTeam } = useTeamContext();
    const [list, setList] = useState({
        data: [],
        loading: true,
    });
    const { sites } = useAppContext();

    const getListData = async req => {
        var formData = new FormData();
        formData.append(APP_VARIABLES.SITE_ID, req.SiteId);
        formData.append(APP_VARIABLES.CHAMPION_ID, 0);
        formData.append(APP_VARIABLES.PAGE, 1);
        formData.append(APP_VARIABLES.SIZE, 10);
        try {
            const { Data } = await postAPI(`${API_URL.GET_TEAM_USERS}`, formData);
            setList({
                data: Data,
                loading: false,
            });
        } catch (err) {
            setList({
                data: [],
                loading: false,
            });
            console.log('🚀 ~ file: team-picker.js:139 ~ getListData ~ err', err);
        }
    };

    useEffect(() => {
        if (sites?.selectedSite) {
            getListData(sites?.selectedSite);
        }
    }, [sites?.selectedSite]);

    return (
        <Content noPadding>
            {list?.loading ? (
                <PlaceHolders type={PLACEHOLDERS.TEAM_CARD} />
            ) : (
                <FlatList
                    ListEmptyComponent={<NoRecordFound />}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: SPACING.NORMAL }}
                    data={list?.data}
                    renderItem={({ item }) => (
                        <TeamCard
                            text={item?.FullName}
                            isSelected={selectedTeam?.id === item?.UserID}
                            onPress={() =>
                                setSelectedTeam({
                                    id: item?.UserID,
                                    type: 'USERS',
                                    name: item?.FullName,
                                })
                            }
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </Content>
    );
};

const ModalTabs = ({ modalVisible, setModalVisible, ConcernID, handleInputChange }) => {
    const { selectedTeam } = useTeamContext();
    const [savingTeam, setSavingTeam] = useState(false);

    // useEffect(() => {
    //     selectedTeam?.name && handleInputChange?.(selectedTeam?.name);
    // }, [selectedTeam?.name]);

    const handleSaveTeam = async () => {
        setSavingTeam(true);
        try {
            const res = await postAPI(`${API_URL.SAVE_TEAM}`, formReq({ TeamId: selectedTeam?.id, [APP_VARIABLES.CONCERN_ID]: ConcernID }));
            if (res?.Success) {
                setSavingTeam(false);
                setModalVisible(false);
                console.log('selectedTeam?.name', selectedTeam?.name);
                handleInputChange?.('TeamId', selectedTeam?.name);
                successMessage({ message: 'Success', description: 'Team has been assigned' });
            } else {
                showErrorMessage(res?.Error);
                setSavingTeam(false);
                setModalVisible(false);
            }
        } catch (err) {
            console.log('🚀 ~ file: team-picker.js:207 ~ handleSaveTeam ~ err', err);
            showErrorMessage("Sorry can't able to save right now!!");
            // console.log("🚀 ~ file: concern-screen-functional.js:355 ~ handleSaveConcern ~ err", err)
            setSavingTeam(false);
            setModalVisible(false);
        }
    };
    return (
        <ModalComponent modalVisible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <View style={{ flex: 1 }}>
                <Header title="Select Team" handleBackClick={() => setModalVisible(false)} />
                <TabViewComponent
                    tabs={[
                        {
                            title: 'Team List',
                            component: TeamList,
                        },
                        // {
                        //     title: 'Team Users',
                        //     component: TeamUsers,
                        // },
                    ]}
                />
            </View>
            {selectedTeam ? (
                <View style={{ padding: SPACING.NORMAL }}>
                    <GradientButton loading={savingTeam} onPress={handleSaveTeam}>
                        Save
                    </GradientButton>
                </View>
            ) : null}
        </ModalComponent>
    );
};

const InputContent = ({ name, label, required, value, setModalVisible, editable, ConcernID }) => {
    const { theme } = useTheme();
    const { selectedTeam } = useTeamContext();
    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} type={FONT_TYPE.BOLD}>
                    {label}
                </TextComponent>
                {required && (
                    <TextComponent style={{ fontSize: FONT_SIZE.SMALL }} color={COLORS.ERROR}>
                        *
                    </TextComponent>
                )}
            </View>
            <TouchableOpacity
                disabled={!editable}
                onPress={() => editable && setModalVisible(true)}
                activeOpacity={0.8}
                style={{
                    borderBottomWidth: 1,
                    borderColor: theme.mode.borderColor,
                    paddingVertical: SPACING.X_SMALL,
                }}>
                <TextComponent
                    style={{
                        fontSize: FONT_SIZE.LARGE,
                        paddingVertical: SPACING.X_SMALL,
                        color: !value && !selectedTeam?.name ? COLORS.searchText : theme?.mode.textColor,
                    }}>
                    {value || selectedTeam?.name || 'Select Team'}
                </TextComponent>
            </TouchableOpacity>
        </>
    );
};

const TeamPickerComponent = ({ name, label, required, value, editable = true, ConcernID, handleInputChange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { theme } = useTheme();
    return (
        <TeamProvider>
            <View
                style={{
                    padding: SPACING.NORMAL,
                    flex: 1,
                    paddingBottom: SPACING.SMALL,
                    marginBottom: SPACING.X_SMALL,
                    ...(!editable && { backgroundColor: theme.mode.disabledBackgroundColor }),
                }}>
                <ModalTabs {...{ modalVisible, setModalVisible, ConcernID, handleInputChange }} />
                <InputContent {...{ name, label, required, value, setModalVisible, editable, ConcernID }} />
            </View>
        </TeamProvider>
    );
};

export default TeamPickerComponent;
