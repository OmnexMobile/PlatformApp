import React from 'react';
import { FlatList, View } from 'react-native';
import { Content, Header, ProjectCard, NoRecordFound, PlaceHolders, ListSearch } from 'components';
import { PLACEHOLDERS } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';
import useTheme from 'theme/useTheme';
import UpdatePercentageModel from './update-progress-modal';

const ProjectListScreenPresentational = ({
    list,
    title,
    handleRefresh,
    refreshing,
    searchKey,
    setSearchKey,
    handleUpdatePercentage,
    setSelectedTask,
    selectedTask,
    updatingPercentage,
    errorText
}) => {
    const { theme } = useTheme();
    return (
        <Content noPadding>
            {/* <Header title={`${title} Concerns`} /> */}
            {/* <Header title={`${title} Concerns (${list?.data?.length})`} /> */}
            <Header title={`${title} ${list?.loading ? '' : `- (${list?.data?.length})`}`} />
            <ListSearch {...{ searchKey, setSearchKey, placeholder: 'search by project name' }} />
            {list?.loading ? (
                <PlaceHolders type={PLACEHOLDERS.TODAY_CARD} />
            ) : (
                <FlatList
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ItemSeparatorComponent={<View style={{ height: 3, backgroundColor: theme.mode.borderColor, marginBottom: SPACING.NORMAL }} />}
                    ListEmptyComponent={<NoRecordFound />}
                    style={{ paddingVertical: SPACING.NORMAL, flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: SPACING.NORMAL }}
                    data={list?.data}
                    renderItem={({ item }) => (
                        <ProjectCard
                            item={item}
                            onClick={item =>
                                setSelectedTask({
                                    ...item,
                                    FromPercent: (item?.Percentage || "")?.toString(),
                                    Percentage: (item?.Percentage || "")?.toString(),
                                })
                            }
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
            {/* <FAB onPress={() => navigation.navigate(ROUTES.CONCERN_SCREEN)} /> */}
            <UpdatePercentageModel
                {...{
                    modalVisible: !!selectedTask,
                    onOk: handleUpdatePercentage,
                    // onChangeText: (value) => console.log("value111", value),
                    onChangeText: value =>
                        setSelectedTask({
                            ...selectedTask,
                            Percentage: value,
                        }),
                    onCancel: () => setSelectedTask(null),
                    onRequestClose: () => setSelectedTask(null),
                    value: (selectedTask?.Percentage || '')?.toString(),
                    updatingPercentage,
                    errorText: errorText,
                    isValid: selectedTask?.Percentage !== selectedTask?.FromPercent
                }}
            />
        </Content>
    );
};

export default ProjectListScreenPresentational;
