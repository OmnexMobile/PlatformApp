import React, { useState, useMemo, useEffect } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import moment from 'moment';
import Accordion from 'react-native-collapsible/Accordion';
import WebView from 'react-native-webview';
import {
    ButtonComponent,
    DatePickerComponent,
    DropdownComponent,
    IconComponent,
    InputWithLabel,
    LottieAnimation,
    ModalComponent,
    TextComponent,
} from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage, formReq, showErrorMessage } from 'helpers/utils';
import { APP_VARIABLES, DATE_FORMAT, FONT_TYPE, ICON_TYPE, INPUTS_CONSTANTS } from 'constants/app-constant';
import { LOTTIE_FILE } from 'assets/lottie';
import useTheme from 'theme/useTheme';
import { IMAGES } from 'assets/images';
import { Modalize } from 'react-native-modalize';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/api-urls';
import EightDDynamicInputModal from './eightd-dynamic-input-modal';

// const RESPONSE_NEW = {
//     Data: {
//         FormConcernDetails: {
//             Site: 'Corporate',
//             Entity: 'Corporate',
//             ProductName: 'Steering Cover',
//             ProductCode: 'SC',
//             ConcernNo: '08-2023-SU-015',
//             CustomerName: 'Fargo',
//             TeamLeader: 'Bhavya Jayakumar m   ',
//             Opened: '08/08/2023',
//             ConcernTitle: 'repeat',
//         },
//         FormData: [
//             {
//                 Title: 'Implement and Verify Interim Action',
//                 FormDataElement: [
//                     {
//                         Data: [
//                             {
//                                 Key: 'InterimAction_ActionDescription',
//                                 Label: 'Action Description',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'ActionDescription',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'InterimAction_Responsibility',
//                                 Label: 'Responsibility',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'Responsibility',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'InterimAction_DueDate',
//                                 Label: 'Due Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'DueDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'InterimAction_ActualDate',
//                                 Label: 'Actual Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'ActualDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'InterimAction_Status',
//                                 Label: 'Status',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'Status',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'InterimAction_Attachment',
//                                 Label: 'Attachment',
//                                 Type: 'FILE_UPLOAD',
//                                 ColumnDefinition: 'Attachment',
//                             },
//                         ],
//                     },
//                 ],
//                 FormDataValue: [
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: [
//                                     {
//                                         UsageId: 2,
//                                         Value: 'Interim',
//                                     },
//                                 ],
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: [
//                                     {
//                                         UsageId: 2,
//                                         Value: 'Admin-1 Pioneer Techonologies ',
//                                     },
//                                 ],
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: [
//                                     {
//                                         UsageId: 2,
//                                         Value: '8/8/2023 12:00:00 AM',
//                                     },
//                                 ],
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: [
//                                     {
//                                         UsageId: 2,
//                                         Value: '',
//                                     },
//                                 ],
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: [
//                                     {
//                                         UsageId: 2,
//                                         Value: 'Active',
//                                     },
//                                 ],
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: [
//                                     {
//                                         UsageId: 2,
//                                         Value: '',
//                                     },
//                                 ],
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 Title: 'Find and Verify Root Cause',
//                 FormDataElement: [
//                     {
//                         Data: [
//                             {
//                                 Key: 'RootCause_RootCauseDescription',
//                                 Label: 'Root Cause Description',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'RootCauseDescription',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'RootCause_Contribution',
//                                 Label: 'Contribution',
//                                 Type: 'INPUT',
//                                 ColumnDefinition: 'Contribution',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'RootCause_VerificationDate',
//                                 Label: 'Verification Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'VerificationDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'RootCause_RootCauseCategory',
//                                 Label: 'Root Cause Catgeory',
//                                 Type: 'ROOT_CAUSE_CATEGORY_PICKER',
//                                 ColumnDefinition: 'RootCauseCatgeory',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'RootCause_Attachment',
//                                 Label: 'Attachment',
//                                 Type: 'FILE_UPLOAD',
//                                 ColumnDefinition: 'Attachment',
//                             },
//                         ],
//                     },
//                 ],
//                 FormDataValue: [
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: [
//                                     {
//                                         UsageId: 1,
//                                         Value: 'Root Cause',
//                                     },
//                                 ],
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: [
//                                     {
//                                         UsageId: 1,
//                                         Value: '90',
//                                     },
//                                 ],
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: [
//                                     {
//                                         UsageId: 1,
//                                         Value: '8/10/2023 12:00:00 AM',
//                                     },
//                                 ],
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: [
//                                     {
//                                         UsageId: 1,
//                                         Value: 'Occur',
//                                     },
//                                 ],
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: [
//                                     {
//                                         UsageId: 1,
//                                         Value: '',
//                                     },
//                                 ],
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 Title: 'Select Permanent Corrective Actions',
//                 FormDataElement: [
//                     {
//                         Data: [
//                             {
//                                 Key: 'CorrectiveAction_ActionDescription',
//                                 Label: 'Action Description',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'ActionDescription',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'CorrectiveAction_Contribution',
//                                 Label: 'Contribution',
//                                 Type: 'INPUT',
//                                 ColumnDefinition: 'Contribution',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'CorrectiveAction_VerificationDate',
//                                 Label: 'Verification Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'VerificationDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'CorrectiveAction_Attachment',
//                                 Label: 'Attachment',
//                                 Type: 'FILE_UPLOAD',
//                                 ColumnDefinition: 'Attachment',
//                             },
//                         ],
//                     },
//                 ],
//                 FormDataValue: [
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: [
//                                     {
//                                         UsageId: 1,
//                                         Value: 'PCA',
//                                     },
//                                 ],
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: [
//                                     {
//                                         UsageId: 1,
//                                         Value: '40',
//                                     },
//                                 ],
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: [
//                                     {
//                                         UsageId: 1,
//                                         Value: '8/10/2023 12:00:00 AM',
//                                     },
//                                 ],
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: [
//                                     {
//                                         UsageId: 1,
//                                         Value: '',
//                                     },
//                                 ],
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 Title: 'Implement Permanent Corrective Actions',
//                 FormDataElement: [
//                     {
//                         Data: [
//                             {
//                                 Key: 'PermanentCorrective_ActionDescription',
//                                 Label: 'Action Description',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'ActionDescription',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PermanentCorrective_Responsibility',
//                                 Label: 'Responsibility',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'Responsibility',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PermanentCorrective_DueDate',
//                                 Label: 'Due Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'DueDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PermanentCorrective_ActualDate',
//                                 Label: 'Actual Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'ActualDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PermanentCorrective_Status',
//                                 Label: 'Status',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'Status',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PermanentCorrective_Attachment',
//                                 Label: 'Attachment',
//                                 Type: 'FILE_UPLOAD',
//                                 ColumnDefinition: 'Attachment',
//                             },
//                         ],
//                     },
//                 ],
//                 FormDataValue: [
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: [
//                                     {
//                                         UsageId: 57,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 58,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 59,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 60,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 105,
//                                         Value: 'PCA',
//                                     },
//                                 ],
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: [
//                                     {
//                                         UsageId: 57,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 58,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 59,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 60,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 105,
//                                         Value: 'Admin-1 Pioneer Techonologies ',
//                                     },
//                                 ],
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: [
//                                     {
//                                         UsageId: 57,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 58,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 59,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 60,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 105,
//                                         Value: '8/8/2023 12:00:00 AM',
//                                     },
//                                 ],
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: [
//                                     {
//                                         UsageId: 57,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 58,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 59,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 60,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 105,
//                                         Value: '8/10/2023 12:00:00 AM',
//                                     },
//                                 ],
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: [
//                                     {
//                                         UsageId: 57,
//                                         Value: 'Inactive',
//                                     },
//                                     {
//                                         UsageId: 58,
//                                         Value: 'Inactive',
//                                     },
//                                     {
//                                         UsageId: 59,
//                                         Value: 'Inactive',
//                                     },
//                                     {
//                                         UsageId: 60,
//                                         Value: 'Inactive',
//                                     },
//                                     {
//                                         UsageId: 105,
//                                         Value: 'Completed',
//                                     },
//                                 ],
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: [
//                                     {
//                                         UsageId: 57,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 58,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 59,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 60,
//                                         Value: '',
//                                     },
//                                     {
//                                         UsageId: 105,
//                                         Value: '',
//                                     },
//                                 ],
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 Title: 'Prevent System Problems',
//                 FormDataElement: [
//                     {
//                         Data: [
//                             {
//                                 Key: 'PreventReocurrance_ActionDescription',
//                                 Label: 'Action Description',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'ActionDescription',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PreventReocurrance_Responsibility',
//                                 Label: 'Responsibility',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'Responsibility',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PreventReocurrance_DueDate',
//                                 Label: 'Due Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'DueDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PreventReocurrance_ActualDate',
//                                 Label: 'Actual Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'ActualDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PreventReocurrance_Status',
//                                 Label: 'Status',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'Status',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'PreventReocurrance_Attachment',
//                                 Label: 'Attachment',
//                                 Type: 'FILE_UPLOAD',
//                                 ColumnDefinition: 'Attachment',
//                             },
//                         ],
//                     },
//                 ],
//                 FormDataValue: [
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: [
//                                     {
//                                         UsageId: 1,
//                                         Value: 'Prevent Systems',
//                                     },
//                                 ],
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: [
//                                     {
//                                         UsageId: 1,
//                                         Value: 'Admin Pioneer Techonologies ',
//                                     },
//                                 ],
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: [
//                                     {
//                                         UsageId: 1,
//                                         Value: '8/8/2023 12:00:00 AM',
//                                     },
//                                 ],
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: [
//                                     {
//                                         UsageId: 1,
//                                         Value: '8/10/2023 12:00:00 AM',
//                                     },
//                                 ],
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: [
//                                     {
//                                         UsageId: 1,
//                                         Value: 'Completed',
//                                     },
//                                 ],
//                                 PreventReocurrance_Attachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 InterimAction_ActionDescription: null,
//                                 InterimAction_Responsibility: null,
//                                 InterimAction_ActionDueDate: null,
//                                 InterimAction_ActionActualDate: null,
//                                 InterimAction_ActionStatus: null,
//                                 InterimAction_ActionAttachment: null,
//                                 RootCause_RootCauseDescription: null,
//                                 RootCause_Contribution: null,
//                                 RootCause_VerificationDate: null,
//                                 RootCause_RootCauseCategory: null,
//                                 RootCause_Attachment: null,
//                                 CorrectiveAction_ActionDescription: null,
//                                 CorrectiveAction_Contribution: null,
//                                 CorrectiveAction_VerificationDate: null,
//                                 CorrectiveAction_Attachment: null,
//                                 PermanentCorrective_ActionDescription: null,
//                                 PermanentCorrective_Responsibility: null,
//                                 PermanentCorrective_DueDate: null,
//                                 PermanentCorrective_ActualDate: null,
//                                 PermanentCorrective_Status: null,
//                                 PermanentCorrective_Attachment: null,
//                                 PreventReocurrance_ActionDescription: null,
//                                 PreventReocurrance_Responsibility: null,
//                                 PreventReocurrance_DueDate: null,
//                                 PreventReocurrance_ActualDate: null,
//                                 PreventReocurrance_Status: null,
//                                 PreventReocurrance_Attachment: [
//                                     {
//                                         UsageId: 1,
//                                         Value: '',
//                                     },
//                                 ],
//                             },
//                         ],
//                     },
//                 ],
//             },
//         ],
//     },
//     Success: true,
//     Message: 'Success',
//     Status: 200,
// };
// const RESPONSE = {
//     Data: {
//         FormConcernDetails: {
//             Site: 'Corporate',
//             Entity: 'Corporate',
//             ProductName: 'Default Product',
//             ProductCode: 'DefaultProd',
//             ConcernNo: 'SU5',
//             CustomerName: 'Fargo',
//             TeamLeader: 'Bhavya Jayakumar m  ',
//             Opened: '07/08/2023',
//             ConcernTitle: 'Form check',
//         },
//         FormData: [
//             {
//                 Title: 'Implement and Verify Interim Action',
//                 FormDataElement: [
//                     {
//                         Data: [
//                             {
//                                 Key: 'Interim_ActionDescription',
//                                 Label: 'Action Description',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'ActionDescription',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'Interim_Responsibility',
//                                 Label: 'Responsibility',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'Responsibility',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'Interim_ActionDueDate',
//                                 Label: 'Due Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'DueDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'Interim_ActionActualDate',
//                                 Label: 'Actual Date',
//                                 Type: 'DATE_PICKER',
//                                 ColumnDefinition: 'ActualDate',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'Interim_ActionStatus',
//                                 Label: 'Status',
//                                 Type: 'DROPDOWN',
//                                 ColumnDefinition: 'Status',
//                             },
//                         ],
//                     },
//                     {
//                         Data: [
//                             {
//                                 Key: 'Interim_ActionAttachment',
//                                 Label: 'Attachment',
//                                 Type: 'FILE_UPLOAD',
//                                 ColumnDefinition: 'Attachment',
//                             },
//                         ],
//                     },
//                 ],
//                 FormDataValue: [
//                     {
//                         Values: [
//                             {
//                                 Interim_ActionDescription: [
//                                     {
//                                         UsageId: 20,
//                                         Value: 'Interim_ActionDescription',
//                                     },
//                                     {
//                                         UsageId: 21,
//                                         Value: 'Interim_ActionDescription',
//                                     },
//                                     {
//                                         UsageId: 22,
//                                         Value: 'Interim_ActionDescription',
//                                     },
//                                 ],
//                                 Interim_Responsibility: null,
//                                 Interim_ActionDueDate: null,
//                                 Interim_ActionActualDate: null,
//                                 Interim_ActionStatus: null,
//                                 Interim_ActionAttachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 Interim_ActionDescription: null,
//                                 Interim_Responsibility: [
//                                     {
//                                         UsageId: 20,
//                                         Value: 'Interim_Responsibility',
//                                     },
//                                     {
//                                         UsageId: 21,
//                                         Value: 'Interim_Responsibility',
//                                     },
//                                     {
//                                         UsageId: 22,
//                                         Value: 'Interim_Responsibility',
//                                     },
//                                 ],
//                                 Interim_ActionDueDate: null,
//                                 Interim_ActionActualDate: null,
//                                 Interim_ActionStatus: null,
//                                 Interim_ActionAttachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 Interim_ActionDescription: null,
//                                 Interim_Responsibility: null,
//                                 Interim_ActionDueDate: [
//                                     {
//                                         UsageId: 20,
//                                         Value: '8/7/2023 12:00:00 AM',
//                                     },
//                                     {
//                                         UsageId: 21,
//                                         Value: '8/7/2023 12:00:00 AM',
//                                     },
//                                     {
//                                         UsageId: 22,
//                                         Value: '8/7/2023 12:00:00 AM',
//                                     },
//                                 ],
//                                 Interim_ActionActualDate: null,
//                                 Interim_ActionStatus: null,
//                                 Interim_ActionAttachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 Interim_ActionDescription: null,
//                                 Interim_Responsibility: null,
//                                 Interim_ActionDueDate: null,
//                                 Interim_ActionActualDate: [
//                                     {
//                                         UsageId: 20,
//                                         Value: 'ActualDate',
//                                     },
//                                     {
//                                         UsageId: 21,
//                                         Value: 'ActualDate',
//                                     },
//                                     {
//                                         UsageId: 22,
//                                         Value: 'ActualDate',
//                                     },
//                                 ],
//                                 Interim_ActionStatus: null,
//                                 Interim_ActionAttachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 Interim_ActionDescription: null,
//                                 Interim_Responsibility: null,
//                                 Interim_ActionDueDate: null,
//                                 Interim_ActionActualDate: null,
//                                 Interim_ActionStatus: [
//                                     {
//                                         UsageId: 20,
//                                         Value: 'Active1',
//                                     },
//                                     {
//                                         UsageId: 21,
//                                         Value: 'Active',
//                                     },
//                                     {
//                                         UsageId: 22,
//                                         Value: 'Active',
//                                     },
//                                 ],
//                                 Interim_ActionAttachment: null,
//                             },
//                         ],
//                     },
//                     {
//                         Values: [
//                             {
//                                 Interim_ActionDescription: null,
//                                 Interim_Responsibility: null,
//                                 Interim_ActionDueDate: null,
//                                 Interim_ActionActualDate: null,
//                                 Interim_ActionStatus: null,
//                                 Interim_ActionAttachment: [
//                                     {
//                                         UsageId: 20,
//                                         Value: 'Interim_ActionAttachment',
//                                     },
//                                     {
//                                         UsageId: 21,
//                                         Value: 'Interim_ActionAttachment',
//                                     },
//                                     {
//                                         UsageId: 22,
//                                         Value: 'Interim_ActionAttachment',
//                                     },
//                                 ],
//                             },
//                         ],
//                     },
//                 ],
//             },
//             {
//                 Title: 'Find and Verify Root Cause',
//                 FormDataElement: null,
//                 FormDataValue: null,
//             },
//             // {
//             //     Title: 'Select Permanent Corrective Actions',
//             //     FormDataElement: null,
//             //     FormDataValue: null,
//             // },
//             // {
//             //     Title: 'Implement Permanent Corrective Actions',
//             //     FormDataElement: null,
//             //     FormDataValue: null,
//             // },
//             // {
//             //     Title: 'Prevent System Problems',
//             //     FormDataElement: null,
//             //     FormDataValue: null,
//             // },
//         ],
//     },
//     Success: true,
//     Message: 'Success',
//     Status: 200,
// };

const TITLES = [
    'Implement and Verify Interim Action',
    'Find and Verify Root Cause',
    'Select Permanent Corrective Actions',
    'Implement Permanent Corrective Actions',
    'Prevent System Problems',
];

const DATA = [
    { label: 'Value 1', value: 'Value 1' },
    { label: 'Value 2', value: 'Value 2' },
];

const ConcernID = 493;

const DISABLED_FIELDS = [INPUTS_CONSTANTS.TREE_PICKER, INPUTS_CONSTANTS.ROOT_CAUSE_CATEGORY_PICKER];

const EightDDynamicForm = ({
    modalVisible,
    onRequestClose,
    formName,
    ConcernID,
    url = 'https://cloudqa3.ewqims.com//Common/ProblemSolver/PSShowForm/Index?ConcernID=16&modeid=2&ApproachID=1&Documenttype=13&ConcernAnalysis=1&PrimaryLangID=1&SecondaryLangID=1',
}) => {
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const [selectedData, setSelectedData] = useState(null);
    const [activeSections, setActiveSections] = useState([]);
    const [eightDData, setEightDData] = useState({
        loading: true,
        data: null,
    });

    console.log('🚀 ~ file: eightd-dynamic-form.js:294 ~ selectedData:', activeSections);

    const getDynamicFormData = async SiteId => {
        setEightDData({
            loading: true,
            data: null,
        });
        try {
            const response = await postAPI(
                `${API_URL.GET_EIGHTD_FORM_DATA}`,
                formReq({
                    [APP_VARIABLES.CONCERN_ID]: ConcernID,
                }),
            );
            console.log('🚀 ~ file: eightd-dynamic-form.js:318 ~ getDynamicFormData ~ response:', response);
            setEightDData({
                loading: false,
                data: response,
            });
        } catch (err) {
            showErrorMessage('Sorry, Error while loading the Dropdown List!!');
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
            setEightDData({
                loading: false,
                data: null,
            });
        }
    };

    useEffect(() => {
        modalVisible && getDynamicFormData();
    }, [modalVisible]);

    const renderHeader = (section, index) => {
        const isSelected = activeSections?.[0] === index;
        return (
            <View style={{ paddingBottom: SPACING.SMALL }}>
                <View style={styles.header}>
                    <TextComponent type={FONT_TYPE.BOLD}>
                        {index + 1}. {section.title}
                    </TextComponent>
                    <TouchableOpacity
                        activeOpacity={1}
                        // onPress={() => handleSelectionChange(section.name)}
                        style={{
                            width: RFPercentage(3),
                            height: RFPercentage(3),
                            borderRadius: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <IconComponent size={FONT_SIZE.NORMAL} name={isSelected ? 'down' : 'right'} type={ICON_TYPE.AntDesign} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderContent = ({ Component }) => {
        const ViewComponent = Component || null;
        return <View style={styles.content}>{ViewComponent}</View>;
    };
    const updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    const SECTIONS = useMemo(
        () =>
            TITLES.map((title, parentIndex) => {
                console.log('🚀 ~ file: eightd-dynamic-form.js:540 ~ SECTIONS ~ RESPONSE.Data.FormData[index]:', eightDData?.data?.Data);
                return {
                    title: title,
                    name: title,
                    Component: (
                        <ScrollView
                            horizontal
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                width: '100%',
                            }}>
                            {(eightDData?.data?.Data?.FormData[parentIndex]?.FormDataElement || []).map((formdata, index, array) => {
                                const obj = eightDData?.data?.Data?.FormData?.[parentIndex]?.FormDataValue?.[index].Values[0];
                                // console.log(
                                //     '🚀 ~ file: eightd-dynamic-form.js:607 ~ { ~ obj:  {formdata.Data[0].Label}',
                                //     // formdata.Data[0]?.Type,
                                //     array,
                                //     // obj[formdata.Data[0].Key]?.length,
                                // );
                                const allFields = {};

                                array.forEach((form, index) => {
                                    form?.Data?.forEach((innerForm, value) => {
                                        allFields[innerForm?.Key] = innerForm?.Key;
                                    });
                                });

                                return DISABLED_FIELDS.includes(formdata.Data[0]?.Type) ? null : (
                                    <View>
                                        {obj?.[formdata?.Data?.[0].Key]?.map((data, rowIndex) => (
                                            <View key={index} style={{ padding: SPACING.NORMAL, paddingTop: 0, paddingBottom: SPACING.SMALL }}>
                                                <View>
                                                    {rowIndex === 0 && (
                                                        <TextComponent
                                                            style={{ marginBottom: SPACING.X_SMALL }}
                                                            type={FONT_TYPE.BOLD}
                                                            fontSize={FONT_SIZE.SMALL}>
                                                            {formdata?.Data?.[0].Label}
                                                        </TextComponent>
                                                    )}
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setSelectedData({
                                                                ...formdata?.Data?.[0],
                                                                ...data,
                                                                ...(formdata?.Data?.[0]?.Type === INPUTS_CONSTANTS.DATE_PICKER && {
                                                                    Value: data.Value ? moment(data.Value, 'DD-MM-YYYY HH:mm:ss') : moment(),
                                                                }),
                                                                title,
                                                                allFields,
                                                            })
                                                        }>
                                                        <TextComponent>
                                                            {formdata?.Data?.[0]?.Type === INPUTS_CONSTANTS.DATE_PICKER && data?.Value
                                                                ? moment(data.Value, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')
                                                                : // ? moment(data?.Value).format(DATE_FORMAT.DD_MM_YYYY)
                                                                  data?.Value || 'No Data'}
                                                        </TextComponent>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                );
                            })}
                        </ScrollView>
                    ),
                };
            }),
        [TITLES, eightDData],
    );

    return (
        <ModalComponent {...{ modalVisible, onRequestClose }}>
            {/* <ModalComponent
                {...{
                    modalVisible: !!selectedData,
                    onRequestClose: () => setSelectedData(null),
                    modalBackgroundColor: COLORS.transparentGrey,
                    transparent: true,
                }}>
                <View style={{ backgroundColor: COLORS.transparentGrey, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flex: 0.5, backgroundColor: COLORS.transparentGrey }}></View>
                    <View
                        style={{
                            flex: 0.5,
                            backgroundColor: theme.mode.backgroundColor,
                            borderTopLeftRadius: SPACING.NORMAL,
                            borderTopRightRadius: SPACING.NORMAL,
                            width: '100%',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                padding: SPACING.NORMAL,
                                justifyContent: 'space-between',
                                borderBottomWidth: 1,
                                borderColor: theme.mode.borderColor,
                            }}>
                            <TextComponent fontSize={FONT_SIZE.LARGE} type={FONT_TYPE.BOLD}>
                                Select Data
                            </TextComponent>
                            <TouchableOpacity onPress={() => setSelectedData(null)}>
                                <IconComponent size={FONT_SIZE.X_LARGE} type={ICON_TYPE.Ionicons} name="close" />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                padding: SPACING.NORMAL,
                                flex: 1,
                            }}>
                            <DropdownComponent
                                containerStyle={{ padding: 0 }}
                                label={selectedData?.Label}
                                onChange={value => console.log('customerType', value)}
                                data={DATA}
                            />
                            <DatePickerComponent
                                containerStyle={{ padding: 0 }}
                                label={selectedData?.Label}
                                onChange={value => console.log('customerType', value)}
                            />
                             <InputWithLabel
                                 noPadding
                                 label={selectedData?.Label}
                                 onChange={value => console.log('customerType', value)}
                            />
                        </View>
                        <View style={{ padding: SPACING.NORMAL }}>
                            <ButtonComponent>Submit</ButtonComponent>
                        </View>
                    </View>
                </View>
            </ModalComponent> */}
            <EightDDynamicInputModal
                {...{
                    selectedData,
                    setSelectedData,
                    ConcernID: ConcernID,
                    getDynamicFormData,
                }}
            />
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                <View
                    style={{
                        height: SPACING.XX_LARGE,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: SPACING.SMALL,
                    }}>
                    <View style={{ width: 10 }} />
                    <View>
                        <TextComponent fontSize={FONT_SIZE.LARGE} type={FONT_TYPE.BOLD}>
                            {formName} Form
                        </TextComponent>
                    </View>
                    <TouchableOpacity
                        onPress={onRequestClose}
                        style={{
                            padding: SPACING.SMALL,
                            alignSelf: 'flex-end',
                            borderRadius: SPACING.SMALL,
                            backgroundColor: theme.colors.primaryThemeColor,
                            marginBottom: SPACING.NORMAL,
                        }}>
                        <IconComponent
                            color={COLORS.white}
                            name="close"
                            type={ICON_TYPE.AntDesign}
                            resizeMode="contain"
                            source={IMAGES.apqpModuleIcon}
                        />
                    </TouchableOpacity>
                </View>
                {eightDData?.loading ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <ActivityIndicator size="large" color={theme.colors.primaryThemeColor} />
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE} style={{ paddingTop: SPACING.NORMAL }}>
                            Fetching form data...
                        </TextComponent>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                            Please Wait...
                        </TextComponent>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ paddingBottom: SPACING.LARGE }}>
                        <View
                            style={{
                                backgroundColor: COLORS.whiteGrey,
                                padding: SPACING.NORMAL,
                                borderBottomWidth: SPACING.SMALL,
                                borderColor: COLORS.white,
                            }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: SPACING.NORMAL }}>
                                <View>
                                    <TextComponent fontSize={FONT_SIZE.SMALL}>Site</TextComponent>
                                    <TextComponent type={FONT_TYPE.BOLD}>
                                        {eightDData?.data?.Data?.FormConcernDetails?.Site || 'No Data'}
                                    </TextComponent>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <TextComponent fontSize={FONT_SIZE.SMALL}>Entity</TextComponent>
                                    <TextComponent type={FONT_TYPE.BOLD}>
                                        {eightDData?.data?.Data?.FormConcernDetails?.Entity || 'No Data'}
                                    </TextComponent>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: SPACING.NORMAL }}>
                                <View>
                                    <TextComponent fontSize={FONT_SIZE.SMALL}>Product Name</TextComponent>
                                    <TextComponent type={FONT_TYPE.BOLD}>
                                        {eightDData?.data?.Data?.FormConcernDetails?.ProductName || 'No Data'}
                                    </TextComponent>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <TextComponent fontSize={FONT_SIZE.SMALL}>Product Code</TextComponent>
                                    <TextComponent type={FONT_TYPE.BOLD}>
                                        {eightDData?.data?.Data?.FormConcernDetails?.ProductCode || 'No Data'}
                                    </TextComponent>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: SPACING.NORMAL }}>
                                <View>
                                    <TextComponent fontSize={FONT_SIZE.SMALL}>Concern Number</TextComponent>
                                    <TextComponent type={FONT_TYPE.BOLD}>
                                        {eightDData?.data?.Data?.FormConcernDetails?.ConcernNo || 'No Data'}
                                    </TextComponent>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <TextComponent fontSize={FONT_SIZE.SMALL}>Customer Name</TextComponent>
                                    <TextComponent type={FONT_TYPE.BOLD}>
                                        {eightDData?.data?.Data?.FormConcernDetails?.CustomerName || 'No Data'}
                                    </TextComponent>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: SPACING.NORMAL }}>
                                <View>
                                    <TextComponent fontSize={FONT_SIZE.SMALL}>Team Leader</TextComponent>
                                    <TextComponent type={FONT_TYPE.BOLD}>
                                        {eightDData?.data?.Data?.FormConcernDetails?.TeamLeader || 'No Data'}
                                    </TextComponent>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <TextComponent fontSize={FONT_SIZE.SMALL}>Opened</TextComponent>
                                    <TextComponent type={FONT_TYPE.BOLD}>
                                        {eightDData?.data?.Data?.FormConcernDetails?.Opened || 'No Data'}
                                    </TextComponent>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: SPACING.NORMAL }}>
                                <View style={{ alignItems: 'flex-start' }}>
                                    <TextComponent fontSize={FONT_SIZE.SMALL}>Concern Title</TextComponent>
                                    <TextComponent type={FONT_TYPE.BOLD}>
                                        {eightDData?.data?.Data?.FormConcernDetails?.ConcernTitle || 'No Data'}
                                    </TextComponent>
                                </View>
                            </View>
                        </View>

                        <Accordion
                            touchableComponent={Pressable}
                            sections={SECTIONS}
                            {...{ activeSections, renderHeader, renderContent, onChange: updateSections }}
                        />
                    </ScrollView>
                )}
            </View>
        </ModalComponent>
    );
};

export default EightDDynamicForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20,
    },
    header: {
        backgroundColor: COLORS.whiteGrey,
        padding: RFPercentage(3),
        paddingHorizontal: SPACING.NORMAL,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        // textAlign: 'center',
    },
    content: {
        borderRadius: SPACING.SMALL,
        // marginBottom: SPACING.SMALL,
    },
    active: {
        backgroundColor: 'rgba(255,255,255,1)',
    },
    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    },
    selectors: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    selector: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    activeSelector: {
        fontWeight: 'bold',
    },
    selectTitle: {
        fontSize: 14,
        fontWeight: '500',
        padding: 10,
    },
    multipleToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
        alignItems: 'center',
    },
    multipleToggle__title: {
        fontSize: 16,
        marginRight: 8,
    },
});
