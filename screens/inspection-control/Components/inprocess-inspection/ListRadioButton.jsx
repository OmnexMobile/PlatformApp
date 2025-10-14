import { StyleSheet, View, Dimensions } from 'react-native';
import RadioButtonComponent from '../RadioButtonComponent';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = Math.min(width, height) >= 768; // threshold for tablet
const ListRadioButton = ({ options = [], onChange, value, title = '',handleRadioChange=()=>{} }) => {
    const [selected, setSelected] = useState('');
    useEffect(() => {
        if (value !== '') {
            setSelected(value);
        } else {
            setSelected('');
        }
    }, [value]);
    const handleChange = item => {
        handleRadioChange(item);
        setSelected(item);
        onChange?.(item);
    };

    return (
        <ScrollView
            horizontal={!isTablet} // horizontal scroll for mobile, vertical scroll for tablet
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container, { flexDirection: isTablet ? 'row' : 'column' }]}>
            {Boolean(options.length) ? (
                options.map((item, index) => (
                    <View key={index} style={{ marginRight: isTablet ? 0 : 16, marginBottom: isTablet ? 12 : 0 }}>
                        <RadioButtonComponent
                            lable={item.label}
                            staticValue={item.value}
                            value={selected}
                            obj={item}
                            onChange={handleChange}
                            size={17}
                            selectedSize={8}
                            textSize={17}
                        />
                    </View>
                ))
            ) : (
                <RadioButtonComponent
                    lable={title}
                    staticValue={title}
                    value={selected}
                    obj={{
                        label: title,
                        value: title,
                    }}
                    onChange={handleChange}
                    size={17}
                    selectedSize={8}
                    textSize={17}
                />
            )}
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
