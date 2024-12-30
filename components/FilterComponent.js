import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import strings from 'config/localization';
import { useNavigation } from '@react-navigation/native';
import { AnimatableView, ButtonComponent } from 'components';
import { OPACITY_ANIMATION } from 'constants/app-constant';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Formik } from 'formik';

const FilterComponent = props => {
    const [search, setSearch] = useState({
        date:"",
        task:""
    });
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const navigation = useNavigation();
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(responseJson => {
                setFilteredDataSource(responseJson);
                setMasterDataSource(responseJson);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    const searchFilterFunction = text => {
        if (text) {
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };
    const ItemView = ({ item }) => {
        return (
            <Text style={styles.itemStyle} onPress={() => getItem(item)}>
                {item.id}
                {'.'}
                {item.title.toUpperCase()}
            </Text>
        );
    };
    const ItemSeparatorView = () => {
        return (
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                }}
            />
        );
    };
    const getItem = item => {
        'Id : ' + item.id + ' Title : ' + item.title;
    };
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.searchSection}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => searchFilterFunction(text)}
                        value={search}
                        underlineColorAndroid="transparent"
                        placeholder="Search Here"
                    />
                    <Icon style={styles.searchIcon} name="search" size={20} color="#000" />
                </View>
                <Formik initialValues={{ email: '' }} onSubmit={values => console.log(values)}>
                    {({ handleChange, handleBlur, handleSubmit, handleReset, values }) => (
                        <View>
                            <View style={styles.searchSection}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    placeholder="Date"
                                />
                                <TouchableOpacity onPress={() => console.log('Calender pressed')}>
                                    <Icon style={styles.searchIcon} name="calendar" size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <AnimatableView animationConfig={OPACITY_ANIMATION} delay={500} style={{ flex: 6 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                                        <ButtonComponent style={{ width: '40%' }} onPress={handleSubmit}>
                                            {strings.Apply}
                                        </ButtonComponent>
                                        <ButtonComponent style={{ width: '40%' }} onPress={handleReset}>
                                            {strings.Clear_All}
                                        </ButtonComponent>
                                    </View>
                                </AnimatableView> 
                            </View>
                        </View>
                    )}
                </Formik>
                {filteredDataSource.length > 0 ? (
                    <FlatList
                      //  data={filteredDataSource}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={ItemSeparatorView}
                        renderItem={ItemView}
                    />
                ) : (
                    <View style={styles.records}>
                        <Text style={{ fontSize: 18 }}>No records found!</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default FilterComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        color: '#424242',
    },
    records: {
        width: '100%',
        height: 200,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
