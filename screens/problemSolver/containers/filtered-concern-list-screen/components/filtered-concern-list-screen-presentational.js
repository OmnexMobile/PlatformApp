import React from 'react';
import { FlatList } from 'react-native';
import { Content, Header, ListCard, NoRecordFound, PlaceHolders } from 'components';
import { PLACEHOLDERS } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';

const FilteredConcernListScreenPresentational = ({ list, title, handleRefresh, refreshing }) => (
    <Content noPadding>
        {/* <Header title={`${title} Concerns`} /> */}
        {/* <Header title={`${title} Concerns (${list?.data?.length})`} /> */}
        <Header title={`${title} ${list?.loading ? '' : `- (${list?.data?.length})`}`} />
        {list?.loading ? (
            <PlaceHolders type={PLACEHOLDERS.TODAY_CARD} />
        ) : (
            <FlatList
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={<NoRecordFound />}
                style={{ paddingVertical: SPACING.NORMAL, flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: SPACING.NORMAL }}
                data={list?.data}
                renderItem={({ item }) => <ListCard item={item} />}
                keyExtractor={(item, index) => index.toString()}
            />
        )}
        {/* <FAB onPress={() => navigation.navigate(ROUTES.CONCERN_SCREEN)} /> */}
    </Content>
);

export default FilteredConcernListScreenPresentational;
