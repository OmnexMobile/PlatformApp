import React from 'react';
import { FlatList, Platform, View } from 'react-native';
import { Content, Header, ListCard, NoRecordFound, PlaceHolders } from 'components';
import { PLACEHOLDERS, } from 'constants/app-constant';
import { SPACING } from 'constants/theme-constants';

const ListScreenPresentational = ({ list, title, handleRefresh, refreshing }) =>
  <Content noPadding>
     {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : null }
    <Header title={`${title} Concerns`} backState={true} />
      {/* <Header title={`${title} (${list?.data?.length})`} /> */}
      {/* <Header title={`${title} ${list?.loading ? '' : `- (${list?.data?.length})`}`} /> */}
      {list?.loading ? (
        <PlaceHolders type={PLACEHOLDERS.TODAY_CARD} />
      ) : (
          <FlatList
              refreshing={refreshing}
              onRefresh={handleRefresh}
              ListEmptyComponent={<NoRecordFound />}
              style={{ paddingVertical: SPACING.NORMAL, flex: 1 }}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: SPACING.NORMAL}}
              data={list?.data}
              renderItem={({ item }) => <ListCard item={item} />}
              keyExtractor={(item, index) => index.toString()}
          />
      )}
    {/* <FAB onPress={() => navigation.navigate(ROUTES.CONCERN_SCREEN)} /> */}
</Content>

export default ListScreenPresentational;
