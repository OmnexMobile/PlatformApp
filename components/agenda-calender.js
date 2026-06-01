import React from 'react';
import { Agenda } from 'react-native-calendars';
import { Alert, View } from 'react-native';
import TextComponent from './text';

const AgendaCalender = ({
    items
}) => {
    const [state, setState] = React.useState({
        items: items || [],
    });
    const loadItems = day => {
        const items = state.items || {};

        setTimeout(() => {
            for (let i = 0; i < 10; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];

                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: 'Item for ' + strTime + ' #' + j,
                            // height: Math.max(50, Math.floor(Math.random() * 150)),
                            day: strTime,
                        });
                    }
                }
            }

            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            setState({
                items: newItems,
            });
        }, 1000);
    };

    const renderItem = (reservation, isFirst) => {
        const fontSize = isFirst ? 16 : 14;
        const color = isFirst ? 'black' : '#43515c';

        return (
            <TouchableOpacity
                // testID={testIDs.agenda.ITEM}
                activeOpacity={1}
                style={[
                    { backgroundColor: 'white', flex: 1, borderRadius: 5, padding: 10, marginRight: 10, marginTop: 17 },
                    { height: reservation.height },
                ]}
                onPress={() => Alert.alert(reservation.name)}>
                <TextComponent style={{ fontSize, color }}>{reservation.name}</TextComponent>
            </TouchableOpacity>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View style={{ height: 15, flex: 1, paddingTop: 30 }}>
                <TextComponent>This is empty date!</TextComponent>
            </View>
        );
    };

    const rowHasChanged = (r1, r2) => {
        return r1.name !== r2.name;
    };

    const timeToString = time => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    };
    return (
    <Agenda
        // testID={testIDs.agenda.CONTAINER}
        items={state.items}
        loadItemsForMonth={loadItems}
        selected={'2023-04-13'}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        rowHasChanged={rowHasChanged}
        showClosingKnob={true}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#43515c'},
        //    '2017-05-09': {textColor: '#43515c'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        // hideExtraDays={false}
        // showOnlySelectedDayItems
        // reservationsKeyExtractor={reservationsKeyExtractor}
      />
);}

export default AgendaCalender;
