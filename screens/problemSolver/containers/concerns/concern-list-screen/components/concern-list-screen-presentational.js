import React from 'react';
import { FlatList } from 'react-native';
import { Content, Header, ListCard, NoRecordFound, PlaceHolders, ListSearch, FAB } from 'components';
import { PLACEHOLDERS, ROUTES } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';
import { useNavigation } from '@react-navigation/native';


const ConcernListScreenPresentational = ({ list, title, handleRefresh, refreshing, searchKey, setSearchKey }) => {
    const navigation = useNavigation();
    console.log('ConcernListScreenPresentational title--->', title);
    return (
        <Content noPadding>
            {/* <Header title={`${title} Concerns`} /> */}
            {/* <Header title={`${title} Concerns (${list?.data?.length})`} /> */}
            <Header title={`${title} ${list?.loading ? '' : `- (${list?.data?.length})`}`} />
            <ListSearch {...{ searchKey, setSearchKey, placeholder: 'search by concern no' }} />
            {list?.loading ? (
                <PlaceHolders type={PLACEHOLDERS.TODAY_CARD} />
            ) : (
                <FlatList
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ListEmptyComponent={<NoRecordFound />}
                    style={{ paddingVertical: SPACING.NORMAL, flex: 1, paddingTop: 0 }}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: SPACING.NORMAL }}
                    data={list?.data}
                    renderItem={({ item }) => <ListCard item={item} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
           {title === 'All' && <FAB onPress={() => navigation.navigate(ROUTES.CONCERN_SCREEN)} />}
        </Content>
    )
};

export default ConcernListScreenPresentational;