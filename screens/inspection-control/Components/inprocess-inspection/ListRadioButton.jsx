import { StyleSheet, View, Dimensions } from 'react-native';
import RadioButtonComponent from '../RadioButtonComponent';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = Math.min(width, height) >= 768; // threshold for tablet
const ListRadioButton = ({ options = [], onChange,value }) => {
    const [selected, setSelected] = useState('');
    useEffect(() => {
        if(value!==''){
            setSelected(value);
        }else{
            setSelected('');
        }
    },[value])
    const handleChange = item => {
        setSelected(item.label);
        onChange?.(item);
    };

    return (
        <ScrollView
            horizontal={!isTablet} // horizontal scroll for mobile, vertical scroll for tablet
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container, { flexDirection: isTablet ? 'row' : 'column' }]}>
            {options.map((item, index) => (
                <View key={index} style={{ marginRight: isTablet ? 0 : 16, marginBottom: isTablet ? 12 : 0 }}>
                    <RadioButtonComponent
                        lable={item.label}
                        value={selected}
                        obj={item}
                        onChange={handleChange}
                        size={17}
                        selectedSize={8}
                        textSize={17}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        flexWrap: 'nowrap', // keep single line in mobile
        paddingVertical: 4,
    },
});

export default ListRadioButton;
