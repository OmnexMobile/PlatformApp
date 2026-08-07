import React from 'react';
import { Text } from 'react-native';
import CustomHeader from '../Components/CustomHeader';

const ReportDowntime = () => {
    return (
        <CustomHeader title="Report Downtime" activeTabId={6} showIcons={false}>
            <Text>REPORT_DOWNTIME</Text>
        </CustomHeader>
    );
};

export default ReportDowntime;
