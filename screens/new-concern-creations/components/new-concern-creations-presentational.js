import React from 'react';
import { ScrollView } from 'react-native';
import useTheme from 'theme/useTheme';
import { Content, DropdownComponent, FAB, GradientButton, Header, InputWithLabel, KeyboardAwareScrollViewComponent, TextComponent } from 'components';
import { SPACING } from 'constants/theme-constants';
import { FONT_TYPE, ICON_TYPE } from 'constants/app-constant';

const DATA = [
    { label: 'Value 1', value: 'Value 1' },
    { label: 'Value 2', value: 'Value 2' },
];

const NewConcernCreationsPresentational = ({}) => {
    const { theme } = useTheme();
    return (
        <Content noPadding>
            <Header title="New Concern Creations" />
            <TextComponent style={{ margin: SPACING.NORMAL }} type={FONT_TYPE.BOLD}>
                Concern Details
            </TextComponent>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <KeyboardAwareScrollViewComponent style={{ paddingTop: 0 }}>
                    <DropdownComponent
                        containerStyle={{ paddingTop: 0 }}
                        label="Entity"
                        onChange={value => console.log('customerType', value)}
                        data={DATA}
                    />
                    <DropdownComponent label="Category" onChange={value => console.log('customerType', value)} data={DATA} />
                    <DropdownComponent label="Sub Category" onChange={value => console.log('customerType', value)} data={DATA} />
                    <DropdownComponent label="Problem Classification" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Concern Title" onChange={value => console.log('customerType', value)} data={DATA} />
                    <DropdownComponent label="Customer" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Primary Contact Name" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Contact Number" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Contact Email" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Problem Description" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Reported Date" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Interior" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Comments" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Contact Email Id" onChange={value => console.log('customerType', value)} data={DATA} />
                    <InputWithLabel label="Date of Delivery" onChange={value => console.log('customerType', value)} data={DATA} />
                    <GradientButton style={{ marginTop: SPACING.NORMAL }}>Submit</GradientButton>
                </KeyboardAwareScrollViewComponent>
            </ScrollView>
            <FAB iconType={ICON_TYPE.AntDesign} iconName="check" bottom={SPACING.NORMAL * 5} />
            <FAB iconType={ICON_TYPE.AntDesign} iconName="plus" />
        </Content>
    );
};

export default NewConcernCreationsPresentational;
