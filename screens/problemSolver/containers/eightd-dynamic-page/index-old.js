import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View, StyleSheet, ActivityIndicator, Platform, StatusBar } from 'react-native';
import moment from 'moment';
import { RichEditor } from 'react-native-pell-rich-editor';
import Accordion from 'react-native-collapsible/Accordion';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Modalize } from 'react-native-modalize';
import { ButtonComponent, FAB, IconComponent, TextComponent, EightDDynamicInputModal, Content, Header } from 'components';
import { COLORS, FONT_SIZE, SPACING } from 'constants/theme-constants';
import { RFPercentage, formReq, showErrorMessage } from 'helpers/utils';
import {
    APP_VARIABLES,
    DATE_FORMAT,
    EIGHTD_FORM_VALUE_TYPE,
    FOLLOWUP_PICKER_STATUS,
    FONT_TYPE,
    ICON_TYPE,
    INPUTS_CONSTANTS,
    Modes,
    ROUTES,
} from 'constants/app-constant';
import useTheme from 'theme/useTheme';
import { IMAGES } from 'assets/images';
import { postAPI } from 'global/api-helpers';
import API_URL from 'global/ApiUrl';
import ApproveRejectComponent from './approve-reject';

// const ConcernID = 493;

const PSD_RESPONSE = {
    Data: {
        CARApprovalStatus: {
            StatusId: 0,
            ApproveButtonId: 0,
            RejectButtonId: 0,
            ViewLogCount: 0,
        },
        FormConcernDetails: [
            {
                Label: 'Author',
                Value: 'Chandran Bragi  ',
                Type: null,
            },
            {
                Label: 'Date',
                Value: '07/08/2024',
                Type: null,
            },
            {
                Label: 'PSD#',
                Value: 'PRR-08-2024-AP-747',
                Type: null,
            },
            {
                Label: 'Category',
                Value: 'Approaches',
                Type: null,
            },
        ],
        FormData: [
            {
                Title: 'Title',
                Identifier: 'Title',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'Title',
                            Type: 'TEXT_INPUT',
                            PhaseName: 'Title',
                            NodeName: 'Title_ConcernTitle',
                            ColumnDefinition: 'ConcernTitle',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                    ],
                },
            },
            {
                Title: 'Problem Definition',
                Identifier: 'Problem Definition',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'Problem ReDefinition',
                            Type: 'RICH_EDITOR',
                            PhaseName: 'Problem Definition',
                            NodeName: 'ProblemDefinition_Redefinition',
                            ColumnDefinition: 'ProblemDesc',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'FRAAttachment',
                            Type: 'FILE_UPLOAD',
                            PhaseName: 'Problem Definition',
                            NodeName: 'ProblemDefinition_FRAAttachment',
                            ColumnDefinition: 'FRAAttachment',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                    ],
                },
            },
            {
                Title: 'Point of Cause',
                Identifier: 'Point of Cause',
                CanAdd: true,
                ResponseByPhaseName: {
                    Dynamic: [
                        {
                            Label: 'Containment Activity',
                            Type: 'DROPDOWN',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_ActionDescription',
                            ColumnDefinition: 'ActionDescription',
                            IsDynamic: 1,
                            DynamicNodeName: 'ERActionUsage',
                        },
                        {
                            Label: "Owner's Name",
                            Type: 'DROPDOWN',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_Responsibility',
                            ColumnDefinition: 'Responsibility',
                            IsDynamic: 1,
                            DynamicNodeName: 'ERActionUsage',
                        },
                        {
                            Label: 'Target Date',
                            Type: 'DATE_PICKER',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_DueDate',
                            ColumnDefinition: 'DueDate',
                            IsDynamic: 1,
                            DynamicNodeName: 'ERActionUsage',
                        },
                        {
                            Label: 'Breakpoint Date',
                            Type: 'DATE_PICKER',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_ActualDate',
                            ColumnDefinition: 'ActualDate',
                            IsDynamic: 1,
                            DynamicNodeName: 'ERActionUsage',
                        },
                        {
                            Label: 'Status',
                            Type: 'DROPDOWN',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_Status',
                            ColumnDefinition: 'Status',
                            IsDynamic: 1,
                            DynamicNodeName: 'ERActionUsage',
                        },
                        {
                            Label: 'Breakpoint Serial No',
                            Type: 'INPUT',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_BreakPointSerialNo',
                            ColumnDefinition: 'BreakPointSerialNo',
                            IsDynamic: 1,
                            DynamicNodeName: 'ERActionUsage',
                        },
                        {
                            Label: 'Recurrence Date',
                            Type: 'DATE_PICKER',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_Breakpoint',
                            ColumnDefinition: 'Breakpoint',
                            IsDynamic: 1,
                            DynamicNodeName: 'ERActionUsage',
                        },
                    ],
                    Static: [
                        {
                            Label: 'Dept',
                            Type: 'INPUT',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_Department',
                            ColumnDefinition: 'UserDefinedDepartment',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'Area',
                            Type: 'INPUT',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_Area',
                            ColumnDefinition: 'UserDefinedArea',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'Shift',
                            Type: 'INPUT',
                            PhaseName: 'Point of Cause',
                            NodeName: 'InterimAction_Shift',
                            ColumnDefinition: 'UserDefinedShift',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                    ],
                },
            },
            {
                Title: 'CORRECT PROCESS',
                Identifier: 'CORRECT PROCESS',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'STD WRK/PQS FOLLOWED?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT PROCESS',
                            NodeName: 'CorrectProcess_STDWRKFOLLOW',
                            ColumnDefinition: 'STDWRKFOLLOW',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'REG OPER/PROPERLY TRAINED?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT PROCESS',
                            NodeName: 'CorrectProcess_PROPERLYTRAINED',
                            ColumnDefinition: 'PROPERLYTRAINED',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'CNTRL PLAN ADEQUATE/FOLLOWED?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT PROCESS',
                            NodeName: 'CorrectProcess_CNTRLPLANFOLLOW',
                            ColumnDefinition: 'CNTRLPLANFOLLOW',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'MANDATORY SEQUENCE FOLLOWED?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT PROCESS',
                            NodeName: 'CorrectProcess_MANDATORYSEQ',
                            ColumnDefinition: 'MANDATORYSEQ',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                    ],
                },
            },
            {
                Title: 'CORRECT TOOLS',
                Identifier: 'CORRECT TOOLS',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'CORRECT TOOLS?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT TOOLS',
                            NodeName: 'CorrectTools_CORRECTTOOLS',
                            ColumnDefinition: 'CORRECTTOOLS',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'ERROR PROOFED?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT TOOLS',
                            NodeName: 'CorrectTools_ERRORPROOFED',
                            ColumnDefinition: 'ERRORPROOFED',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'TOOLS FUNCTION PROPERLY?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT TOOLS',
                            NodeName: 'CorrectTools_FUNCPROPERLY',
                            ColumnDefinition: 'FUNCPROPERLY',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'PM CURRENT/COMPLETED?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT TOOLS',
                            NodeName: 'CorrectTools_PMCURRENTCOMPLETED',
                            ColumnDefinition: 'PMCURRENTCOMPLETED',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                    ],
                },
            },
            {
                Title: 'CORRECT PARTS',
                Identifier: 'CORRECT PARTS',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'PARTS CORRECT?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT PARTS',
                            NodeName: 'CorrectParts_PARTSCORRECT',
                            ColumnDefinition: 'PARTSCORRECT',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'IDENTIFIED PROPERLY?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT PARTS',
                            NodeName: 'CorrectParts_IDENTIFIEDPROPERLY',
                            ColumnDefinition: 'IDENTIFIEDPROPERLY',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'INCORRECT LOCATION?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT PARTS',
                            NodeName: 'CorrectParts_INCORRECTLOCATION',
                            ColumnDefinition: 'INCORRECTLOCATION',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'ERROR PROOFED?',
                            Type: 'DROPDOWN',
                            PhaseName: 'CORRECT PARTS',
                            NodeName: 'CorrectParts_CPERRORPROOFED',
                            ColumnDefinition: 'CPERRORPROOFED',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                    ],
                },
            },
            {
                Title: 'PARTS CHANGED',
                Identifier: 'PARTS CHANGED',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'WITHIN SPEC?',
                            Type: 'DROPDOWN',
                            PhaseName: 'PARTS CHANGED',
                            NodeName: 'PartsChanged_WITHINSPEC',
                            ColumnDefinition: 'WITHINSPEC',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'PARTS CHANGED?',
                            Type: 'DROPDOWN',
                            PhaseName: 'PARTS CHANGED',
                            NodeName: 'PartsChanged_PARTSCHANGED',
                            ColumnDefinition: 'PARTSCHANGED',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'Y',
                                    Value: 1,
                                },
                                {
                                    Label: 'N',
                                    Value: 0,
                                },
                            ],
                        },
                        {
                            Label: 'PARTS DIFFERENT?',
                            Type: 'DROPDOWN',
                            PhaseName: 'PARTS CHANGED',
                            NodeName: 'PartsChanged_PARTSDIFF',
                            ColumnDefinition: 'PARTSDIFF',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                    ],
                },
            },
            {
                Title: 'ROOT CAUSE ANALYSIS',
                Identifier: 'ROOT CAUSE ANALYSIS',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'Direct Cause',
                            Type: 'INPUT',
                            PhaseName: 'ROOT CAUSE ANALYSIS',
                            NodeName: 'RootCause_DirectCause',
                            ColumnDefinition: 'DirectCause',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'Why?',
                            Type: 'INPUT',
                            PhaseName: 'ROOT CAUSE ANALYSIS',
                            NodeName: 'RootCause_Why1Dec',
                            ColumnDefinition: 'Why1Dec',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'Root Cause',
                            Type: 'TEXT_INPUT',
                            PhaseName: 'ROOT CAUSE ANALYSIS',
                            NodeName: 'RootCause_RootCause',
                            ColumnDefinition: 'RootCause',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                    ],
                },
            },
            {
                Title: 'Long-Term Problem Correction',
                Identifier: 'Long-Term Problem Correction',
                CanAdd: true,
                ResponseByPhaseName: {
                    Dynamic: [
                        {
                            Label: 'Impact Root Cause',
                            Type: 'DROPDOWN',
                            PhaseName: 'Long-Term Problem Correction',
                            NodeName: 'PreventReocurrance_ActionDescription',
                            ColumnDefinition: 'ActionDescription',
                            IsDynamic: 1,
                            DynamicNodeName: 'SystemProblemPreventionUsage',
                        },
                        {
                            Label: "Owner's Name",
                            Type: 'DROPDOWN',
                            PhaseName: 'Long-Term Problem Correction',
                            NodeName: 'PreventReocurrance_Responsibility',
                            ColumnDefinition: 'Responsibility',
                            IsDynamic: 1,
                            DynamicNodeName: 'SystemProblemPreventionUsage',
                        },
                        {
                            Label: 'Target Date',
                            Type: 'DATE_PICKER',
                            PhaseName: 'Long-Term Problem Correction',
                            NodeName: 'PreventReocurrance_DueDate',
                            ColumnDefinition: 'DueDate',
                            IsDynamic: 1,
                            DynamicNodeName: 'SystemProblemPreventionUsage',
                        },
                        {
                            Label: 'Breakpoint Date',
                            Type: 'DATE_PICKER',
                            PhaseName: 'Long-Term Problem Correction',
                            NodeName: 'PreventReocurrance_ActualDate',
                            ColumnDefinition: 'ActualDate',
                            IsDynamic: 1,
                            DynamicNodeName: 'SystemProblemPreventionUsage',
                        },
                        {
                            Label: 'Status',
                            Type: 'DROPDOWN',
                            PhaseName: 'Long-Term Problem Correction',
                            NodeName: 'PreventReocurrance_Status',
                            ColumnDefinition: 'Status',
                            IsDynamic: 1,
                            DynamicNodeName: 'SystemProblemPreventionUsage',
                        },
                        {
                            Label: 'Breakpoint Serial No',
                            Type: 'INPUT',
                            PhaseName: 'Long-Term Problem Correction',
                            NodeName: 'PreventReocurrance_BreakpointSerialNo',
                            ColumnDefinition: 'BreakPointSerialNo',
                            IsDynamic: 1,
                            DynamicNodeName: 'SystemProblemPreventionUsage',
                        },
                        {
                            Label: 'Recurrence Date',
                            Type: 'DATE_PICKER',
                            PhaseName: 'Long-Term Problem Correction',
                            NodeName: 'PreventReocurrance_Breakpoint',
                            ColumnDefinition: 'Breakpoint',
                            IsDynamic: 1,
                            DynamicNodeName: 'SystemProblemPreventionUsage',
                        },
                    ],
                    Static: [],
                },
            },
            {
                Title: 'Comment(s)',
                Identifier: 'Comment(s)',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'Description',
                            Type: 'RICH_EDITOR',
                            PhaseName: 'Comment(s)',
                            NodeName: 'SupplierComment_Description',
                            ColumnDefinition: 'SupplierComment',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                    ],
                },
            },
            {
                Title: 'FollowUp Verification',
                Identifier: 'FollowUp Verification',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: '1',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay1',
                            ColumnDefinition: 'FollowupDay1',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '2',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay2',
                            ColumnDefinition: 'FollowupDay2',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '3',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay3',
                            ColumnDefinition: 'FollowupDay3',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '4',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay4',
                            ColumnDefinition: 'FollowupDay4',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '5',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay5',
                            ColumnDefinition: 'FollowupDay5',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '6',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay6',
                            ColumnDefinition: 'FollowupDay6',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '7',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay7',
                            ColumnDefinition: 'FollowupDay7',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '8',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay8',
                            ColumnDefinition: 'FollowupDay8',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '9',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay9',
                            ColumnDefinition: 'FollowupDay9',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '10',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay10',
                            ColumnDefinition: 'FollowupDay10',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '11',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay11',
                            ColumnDefinition: 'FollowupDay11',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '12',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay12',
                            ColumnDefinition: 'FollowupDay12',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '13',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay13',
                            ColumnDefinition: 'FollowupDay13',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '14',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay14',
                            ColumnDefinition: 'FollowupDay14',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '15',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay15',
                            ColumnDefinition: 'FollowupDay15',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '16',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay16',
                            ColumnDefinition: 'FollowupDay16',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '17',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay17',
                            ColumnDefinition: 'FollowupDay17',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '18',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay18',
                            ColumnDefinition: 'FollowupDay18',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '19',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay19',
                            ColumnDefinition: 'FollowupDay19',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: '20',
                            Type: 'FOLLOWUP_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'FollowUp Verification_FollowupDay20',
                            ColumnDefinition: 'FollowupDay20',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'Is SatisfactorilyClosed',
                            Type: 'CHECKBOX',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'Satisfactory_IsSatisfactorilyClosed',
                            ColumnDefinition: 'StatisfactoryClosed',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'Closure Date:',
                            Type: 'DATE_PICKER',
                            PhaseName: 'FollowUp Verification',
                            NodeName: 'Satisfactory_ClosureDate',
                            ColumnDefinition: 'StatisfactoryCloseDate',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                    ],
                },
            },
            {
                Title: 'Describe escalation below',
                Identifier: 'Describe escalation below',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'Description',
                            Type: 'INPUT',
                            PhaseName: 'Describe escalation below',
                            NodeName: 'SatisfcatoryUsage_Description',
                            ColumnDefinition: 'Description',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                    ],
                },
            },
            {
                Title: 'Verification',
                Identifier: 'Verification',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: "Have PFMEA's been completed/updated & Failure mode comprehended?",
                            Type: 'CHECKBOX',
                            PhaseName: 'Verification',
                            NodeName: 'StandardizationProcess_PFMEAUPDATE',
                            ColumnDefinition: 'PFMEAUPDATE',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'YES',
                                    Value: 1,
                                },
                                {
                                    Label: 'NO',
                                    Value: 0,
                                },
                                {
                                    Label: 'NA',
                                    Value: 2,
                                },
                            ],
                        },
                        {
                            Label: 'Standardized Work Instruction updated?',
                            Type: 'CHECKBOX',
                            PhaseName: 'Verification',
                            NodeName: 'StandardizationProcess_WORKINSTRUCTIONUPDATE',
                            ColumnDefinition: 'WORKINSTRUCTIONUPDATE',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'YES',
                                    Value: 1,
                                },
                                {
                                    Label: 'NO',
                                    Value: 0,
                                },
                                {
                                    Label: 'NA',
                                    Value: 2,
                                },
                            ],
                        },
                        {
                            Label: 'Product Quality Standards updated?',
                            Type: 'CHECKBOX',
                            PhaseName: 'Verification',
                            NodeName: 'StandardizationProcess_PRODUCTQUALITYSTANDARDSUPDATE',
                            ColumnDefinition: 'PRODUCTQUALITYSTANDARDSUPDATE',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'YES',
                                    Value: 1,
                                },
                                {
                                    Label: 'NO',
                                    Value: 0,
                                },
                                {
                                    Label: 'NA',
                                    Value: 2,
                                },
                            ],
                        },
                        {
                            Label: 'Process Control Plan revised/updated?',
                            Type: 'CHECKBOX',
                            PhaseName: 'Verification',
                            NodeName: 'StandardizationProcess_PROCESSCONTROLPLANUPDATE',
                            ColumnDefinition: 'PROCESSCONTROLPLANUPDATE',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'YES',
                                    Value: 1,
                                },
                                {
                                    Label: 'NO',
                                    Value: 0,
                                },
                                {
                                    Label: 'NA',
                                    Value: 2,
                                },
                            ],
                        },
                        {
                            Label: 'Read-across performed on Duplicate (same or similar equipment)?',
                            Type: 'CHECKBOX',
                            PhaseName: 'Verification',
                            NodeName: 'StandardizationProcess_READACROSSPERFORMEDONDUPLICATE',
                            ColumnDefinition: 'READACROSSPERFORMEDONDUPLICATE',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'YES',
                                    Value: 1,
                                },
                                {
                                    Label: 'NO',
                                    Value: 0,
                                },
                                {
                                    Label: 'NA',
                                    Value: 2,
                                },
                            ],
                        },
                        {
                            Label: 'Communicated results/changes to team members,other groups and plants as needed?',
                            Type: 'CHECKBOX',
                            PhaseName: 'Verification',
                            NodeName: 'StandardizationProcess_CHANGESCOMMUNICATED',
                            ColumnDefinition: 'CHANGESCOMMUNICATED',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'YES',
                                    Value: 1,
                                },
                                {
                                    Label: 'NO',
                                    Value: 0,
                                },
                                {
                                    Label: 'NA',
                                    Value: 2,
                                },
                            ],
                        },
                        {
                            Label: 'PM Schedule updated?',
                            Type: 'CHECKBOX',
                            PhaseName: 'Verification',
                            NodeName: 'StandardizationProcess_PMSCHEDULEUPDATE',
                            ColumnDefinition: 'PMSCHEDULEUPDATE',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: [
                                {
                                    Label: 'YES',
                                    Value: 1,
                                },
                                {
                                    Label: 'NO',
                                    Value: 0,
                                },
                                {
                                    Label: 'NA',
                                    Value: 2,
                                },
                            ],
                        },
                    ],
                },
            },
            {
                Title: 'RPN Details',
                Identifier: 'RPN Details',
                CanAdd: false,
                ResponseByPhaseName: {
                    Dynamic: [],
                    Static: [
                        {
                            Label: 'S',
                            Type: 'INPUT',
                            PhaseName: 'RPN Details',
                            NodeName: 'RPNBEFORE_SEVERITY',
                            ColumnDefinition: 'RPNBeforeSev',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'O',
                            Type: 'INPUT',
                            PhaseName: 'RPN Details',
                            NodeName: 'RPNBEFORE_OCCURENCE',
                            ColumnDefinition: 'RPNBeforeOcc',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'D',
                            Type: 'INPUT',
                            PhaseName: 'RPN Details',
                            NodeName: 'RPNBEFORE_DETECTION',
                            ColumnDefinition: 'RPNBeforeDet',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'RPN BEFORE',
                            Type: 'TEXT_INPUT',
                            PhaseName: 'RPN Details',
                            NodeName: 'RPNBEFORE',
                            ColumnDefinition: 'RPNBefore',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                        {
                            Label: 'RPN AFTER',
                            Type: 'TEXT_INPUT',
                            PhaseName: 'RPN Details',
                            NodeName: 'RPNAFTER',
                            ColumnDefinition: 'RPNAfter',
                            IsDynamic: 0,
                            DynamicNodeName: '',
                            Options: null,
                        },
                    ],
                },
            },
            {
                Title: 'Evidence',
                Identifier: 'Evidence',
                CanAdd: true,
                ResponseByPhaseName: {
                    Dynamic: [
                        {
                            Label: 'Attachment',
                            Type: 'FILE_UPLOAD',
                            PhaseName: 'Evidence',
                            NodeName: 'EvidenceAttachmentUsage_Attachment',
                            ColumnDefinition: 'Attachment',
                            IsDynamic: 1,
                            DynamicNodeName: 'EvidenceAttachmentUsage',
                        },
                    ],
                    Static: [],
                },
            },
        ],
        FormValueData: [
            {
                Title: 'Title',
                Identifier: 'Title',
                ConcernTitle: 'PSD Concern',
                ProblemDescription: null,
                FRAAttachment: null,
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'Problem Definition',
                Identifier: 'Problem Definition',
                ConcernTitle: null,
                ProblemDescription: '<p>PSD Concern</p>',
                FRAAttachment: '',
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'Point of Cause',
                Identifier: 'Point of Cause',
                ConcernTitle: null,
                ProblemDescription: null,
                FRAAttachment: null,
                Department: '',
                Area: '',
                Shift: '',
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: [],
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'CORRECT PROCESS',
                Identifier: 'CORRECT PROCESS',
                ConcernTitle: null,
                ProblemDescription: null,
                FRAAttachment: null,
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: '',
                PROPERLYTRAINED: '',
                CNTRLPLANFOLLOW: '',
                MANDATORYSEQ: '',
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'CORRECT TOOLS',
                Identifier: 'CORRECT TOOLS',
                ConcernTitle: null,
                ProblemDescription: null,
                FRAAttachment: null,
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: '',
                ERRORPROOFED: '',
                FUNCPROPERLY: '',
                PMCURRENTCOMPLETED: '',
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'CORRECT PARTS',
                Identifier: 'CORRECT PARTS',
                ConcernTitle: null,
                ProblemDescription: null,
                FRAAttachment: null,
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: '',
                IDENTIFIEDPROPERLY: '',
                INCORRECTLOCATION: '',
                CPERRORPROOFED: '',
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'PARTS CHANGED',
                Identifier: 'PARTS CHANGED',
                ConcernTitle: null,
                ProblemDescription: null,
                FRAAttachment: null,
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: '',
                PARTSCHANGED: '',
                PARTSDIFF: '',
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'Comment(s)',
                Identifier: 'Comment(s)',
                ConcernTitle: null,
                ProblemDescription: null,
                FRAAttachment: null,
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: '',
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'FollowUp Verification',
                Identifier: 'FollowUp Verification',
                ConcernTitle: null,
                ProblemDescription: null,
                FRAAttachment: null,
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: 'Fail',
                FollowupDay2: '',
                FollowupDay3: '',
                FollowupDay4: 'Fail',
                FollowupDay5: '',
                FollowupDay6: '',
                FollowupDay7: 'Pass',
                FollowupDay8: '',
                FollowupDay9: '',
                FollowupDay10: '',
                FollowupDay11: '',
                FollowupDay12: 'Pass',
                FollowupDay13: '',
                FollowupDay14: 'Pass',
                FollowupDay15: '',
                FollowupDay16: 'Fail',
                FollowupDay17: '',
                FollowupDay18: '',
                FollowupDay19: '',
                FollowupDay20: '',
                IsSatisfactorilyClosed: 'No',
                ClosureDate: '',
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'Verification',
                Identifier: 'Verification',
                ConcernTitle: null,
                ProblemDescription: null,
                FRAAttachment: null,
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: '',
                WORKINSTRUCTIONUPDATE: '',
                PRODUCTQUALITYSTANDARDSUPDATE: '',
                PROCESSCONTROLPLANUPDATE: '',
                READACROSSPERFORMEDONDUPLICATE: '',
                CHANGESCOMMUNICATED: '',
                PMSCHEDULEUPDATE: '',
                RPNBeforeSev: null,
                RPNBeforeOcc: null,
                RPNBeforeDet: null,
                RPNBefore: null,
                RPNAfterSev: null,
                RPNAfterOcc: null,
                RPNAfterDet: null,
                RPNAfter: null,
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
            {
                Title: 'RPN Details',
                Identifier: 'RPN Details',
                ConcernTitle: null,
                ProblemDescription: null,
                FRAAttachment: null,
                Department: null,
                Area: null,
                Shift: null,
                STDWRKFOLLOW: null,
                PROPERLYTRAINED: null,
                CNTRLPLANFOLLOW: null,
                MANDATORYSEQ: null,
                CORRECTTOOLS: null,
                ERRORPROOFED: null,
                FUNCPROPERLY: null,
                PMCURRENTCOMPLETED: null,
                PARTSCORRECT: null,
                IDENTIFIEDPROPERLY: null,
                INCORRECTLOCATION: null,
                CPERRORPROOFED: null,
                WITHINSPEC: null,
                PARTSCHANGED: null,
                PARTSDIFF: null,
                DirectCause: null,
                Why1Dec: null,
                Why2Dec: null,
                Why3Dec: null,
                Why4Dec: null,
                Why5Dec: null,
                RootCause: null,
                Description: null,
                FollowupDay1: null,
                FollowupDay2: null,
                FollowupDay3: null,
                FollowupDay4: null,
                FollowupDay5: null,
                FollowupDay6: null,
                FollowupDay7: null,
                FollowupDay8: null,
                FollowupDay9: null,
                FollowupDay10: null,
                FollowupDay11: null,
                FollowupDay12: null,
                FollowupDay13: null,
                FollowupDay14: null,
                FollowupDay15: null,
                FollowupDay16: null,
                FollowupDay17: null,
                FollowupDay18: null,
                FollowupDay19: null,
                FollowupDay20: null,
                IsSatisfactorilyClosed: null,
                ClosureDate: null,
                PFMEAUpdate: null,
                WORKINSTRUCTIONUPDATE: null,
                PRODUCTQUALITYSTANDARDSUPDATE: null,
                PROCESSCONTROLPLANUPDATE: null,
                READACROSSPERFORMEDONDUPLICATE: null,
                CHANGESCOMMUNICATED: null,
                PMSCHEDULEUPDATE: null,
                RPNBeforeSev: '0',
                RPNBeforeOcc: '0',
                RPNBeforeDet: '0',
                RPNBefore: '0',
                RPNAfterSev: '0',
                RPNAfterOcc: '0',
                RPNAfterDet: '0',
                RPNAfter: '0',
                ERActionUsage: null,
                SystemProblemPreventionUsage: null,
                EvidenceAttachmentUsage: null,
            },
        ],
    },
    Success: true,
    Message: 'Success',
    Status: 200,
};

const DISABLED_FIELDS = [INPUTS_CONSTANTS.TREE_PICKER, INPUTS_CONSTANTS.ROOT_CAUSE_CATEGORY_PICKER];

const EightDDynamicPage = ({}) => {
    const navigation = useNavigation();
    const { ConcernID, formName } = useRoute().params;
    const modalizeRef = React.useRef(null);
    const [adding, setAdding] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { theme } = useTheme();
    const [selectedData, setSelectedData] = useState(null);
    console.log('🚀 ~ selectedData:', selectedData);
    const [selectedDataForDelete, setSelectedDataForDelete] = useState(null);
    const [activeSections, setActiveSections] = useState([]);
    const [eightDData, setEightDData] = useState({
        loading: true,
        data: null,
        sections: [],
    });
    const bottomSheetRef = useRef(null);

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
            setEightDData({
                loading: false,
                data: PSD_RESPONSE,
                // data: MACHELIN_RESPONSE,
                sections: PSD_RESPONSE.Data.FormData.filter(phase => phase.ResponseByPhaseName.Dynamic !== null),
            });
            console.log('🚀 ~ getDynamicFormData ~ RESPONSE.Data.FormData:', response.Data.FormData);
            // console.log(
            //     '🚀 ~ file: eightd-dynamic-form.js:318 ~ getDynamicFormData ~ response:',
            //     MACHELIN_RESPONSE.Data.FormData.filter(phase => phase.ResponseByPhaseName.Dynamic !== null),
            // );
        } catch (err) {
            showErrorMessage('Sorry, Error while loading the Dropdown List!!');
            console.log('🚀 ~ file: concern-initial-evaluation-functional.js:71 ~ getConcern ~ err', err);
            setEightDData({
                loading: false,
                data: null,
            });
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const response = await postAPI(
                `${selectedDataForDelete?.DeleteAPIEndPoint}`,
                formReq({
                    ActionUsageID: selectedDataForDelete?.UsageID,
                    ConcernID,
                }),
            );
            if (response?.Success) {
                getDynamicFormData();
                setSelectedDataForDelete(null);
            }
            setDeleting(false);
        } catch (error) {
            setDeleting(false);
        }
    };

    const handleAddRow = async DynamicNodeName => {
        try {
            setAdding(true);
            const response = await postAPI(
                API_URL.ADD_EIGHTD_FORM_ROW,
                formReq({
                    [APP_VARIABLES.CONCERN_ID]: ConcernID,
                    UsageType: DynamicNodeName,
                }),
            );
            if (response?.Success) {
                getDynamicFormData();
                setSelectedDataForDelete(null);
            }
            setAdding(false);
        } catch (error) {
            setAdding(false);
        }
    };

    useEffect(() => {
        getDynamicFormData();
    }, []);

    useEffect(() => {
        selectedDataForDelete ? modalizeRef.current?.open() : modalizeRef.current?.close();
    }, [modalizeRef, selectedDataForDelete]);

    const renderHeader = (section, index) => {
        const isSelected = activeSections?.[0] === index;
        return (
            <View style={{ paddingBottom: SPACING.SMALL, backgroundColor: theme.mode.backgroundColor }}>
                <View
                    style={[
                        styles.header,
                        {
                            backgroundColor: theme.mode.backgroundColor,
                            borderBottomWidth: 1,
                            borderColor: theme.mode.borderColor,
                        },
                    ]}>
                    <TextComponent type={FONT_TYPE.BOLD}>{section?.title}</TextComponent>
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
        return (
            <View
                style={[
                    styles.content,
                    {
                        backgroundColor: theme.mode.backgroundColor,
                    },
                ]}>
                {ViewComponent}
            </View>
        );
    };
    const updateSections = activeSections => {
        setActiveSections(activeSections);
    };

    const SECTIONS = useMemo(() => {
        return eightDData?.sections?.map((data, parentIndex) => {
            const FieldName = data?.ResponseByPhaseName?.Dynamic?.[0]?.DynamicNodeName;
            const FormDataValueIndex = (eightDData?.data?.Data.FormValueData || [])?.findIndex(x => x.Title === data?.Title);
            const FormDataValue = eightDData?.data?.Data.FormValueData?.[FormDataValueIndex]?.[FieldName];
            const StaticFormDataValue = eightDData?.data?.Data.FormValueData?.[FormDataValueIndex];
            const ColumnNames = data?.ResponseByPhaseName?.Dynamic?.map(dynamic => ({
                Label: dynamic?.Label,
                ColumnDefinition: dynamic?.ColumnDefinition,
                DynamicNodeName: dynamic?.DynamicNodeName,
                Type: dynamic?.Type,
            }));
            const CanAdd = data?.CanAdd;

            console.log(
                '🚀 ~ returneightDData?.data?.Data?.FormData.map ~ FormDataValue:',
                data?.CanAdd,
                // eightDData?.data?.Data.FormValueData?.[parentIndex],
                // FieldName,
                // parentIndex,
                // FormDataValueIndex,
            );

            if (parentIndex < 0) {
                return null;
            }
            return {
                title: data?.Title,
                name: data?.Title,
                Component: (
                    <View
                        key={parentIndex}
                        style={{
                            backgroundColor: theme.mode.backgroundColor,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                paddingHorizontal: SPACING.NORMAL,
                                marginBottom: SPACING.SMALL,
                            }}>
                            {data?.ResponseByPhaseName?.Static?.map((staticObj, index) => {
                                const isHTMLContent = staticObj?.ColumnDefinition === 'ContainmentActions';
                                console.log(
                                    '🚀 ~ {data?.ResponseByPhaseName?.Static?.map ~ staticObj:',
                                    staticObj?.Type === INPUTS_CONSTANTS.FOLLOWUP_PICKER,
                                    FOLLOWUP_PICKER_STATUS.PASS,
                                    StaticFormDataValue?.[staticObj?.ColumnDefinition],
                                );
                                // isHTMLContent &&
                                //     console.log(
                                //         '🚀 ~ {data?.ResponseByPhaseName?.Static?.map ~ isHTMLContent:',
                                //         isHTMLContent,
                                //         StaticFormDataValue?.[staticObj?.ColumnDefinition],
                                //     );

                                return (
                                    <View
                                        key={index}
                                        style={{
                                            width: isHTMLContent ? '100%' : '50%',
                                            paddingBottom: SPACING.SMALL,
                                            backgroundColor: theme.mode.backgroundColor,
                                            ...(staticObj?.Type === INPUTS_CONSTANTS.FOLLOWUP_PICKER && {
                                                backgroundColor:
                                                    StaticFormDataValue?.[staticObj?.ColumnDefinition] === FOLLOWUP_PICKER_STATUS.PASS
                                                        ? COLORS.SUCCESS
                                                        : StaticFormDataValue?.[staticObj?.ColumnDefinition] === FOLLOWUP_PICKER_STATUS.FAIL
                                                        ? COLORS.ERROR
                                                        : COLORS.white,
                                                borderWidth: 1,
                                                paddingTop: SPACING.SMALL,
                                                marginTop: SPACING.XX_SMALL,
                                            }),
                                        }}>
                                        <TextComponent
                                            numberOfLines={5}
                                            fontSize={FONT_SIZE.SMALL}
                                            color={COLORS.textDark}
                                            style={{
                                                ...(staticObj?.Type === INPUTS_CONSTANTS.FOLLOWUP_PICKER && {
                                                    textAlign: 'center',
                                                }),
                                            }}
                                            // style={{ textAlign: index % 2 === 0 ? 'left' : 'right' }}
                                        >
                                            {staticObj?.Label}
                                        </TextComponent>
                                        <TouchableOpacity
                                            disabled={staticObj?.Type === INPUTS_CONSTANTS.LABEL}
                                            onPress={() => {
                                                setSelectedData({
                                                    ...staticObj,
                                                    type: EIGHTD_FORM_VALUE_TYPE.STATIC,
                                                    Value: StaticFormDataValue?.[staticObj?.ColumnDefinition],
                                                    rowData: {
                                                        SaveAPIEndPoint: '/PhaseAction/Update8DMichelinStaticFields',
                                                    },
                                                });
                                            }}>
                                            <ScrollView
                                                scrollEnabled={false}
                                                showsVerticalScrollIndicator={false}
                                                showsHorizontalScrollIndicator={false}>
                                                {isHTMLContent ? (
                                                    <RichEditor
                                                        disabled
                                                        initialContentHTML={StaticFormDataValue?.[staticObj?.ColumnDefinition] || 'No Data'}
                                                        // initialContentHTML={convertStringToHTML(StaticFormDataValue?.[staticObj?.ColumnDefinition])}
                                                    />
                                                ) : null}
                                            </ScrollView>
                                            <View>
                                                {!isHTMLContent ? (
                                                    <TextComponent
                                                        style={{
                                                            ...(staticObj?.Type === INPUTS_CONSTANTS.FOLLOWUP_PICKER && {
                                                                textAlign: 'center',
                                                            }),
                                                        }}
                                                        numberOfLines={8}
                                                        type={FONT_TYPE.BOLD}
                                                        fontSize={FONT_SIZE.SMALL}>
                                                        {StaticFormDataValue?.[staticObj?.ColumnDefinition]?.replace(/(<([^>]+)>)/gi, '') ||
                                                            'No Data'}
                                                    </TextComponent>
                                                ) : null}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                        {FieldName && CanAdd && (
                            <View
                                style={{
                                    paddingHorizontal: SPACING.NORMAL,
                                    alignItems: 'flex-start',
                                    backgroundColor: theme.mode.backgroundColor,
                                }}>
                                <TouchableOpacity
                                    disabled={adding}
                                    onPress={() => handleAddRow(FieldName)}
                                    style={{
                                        padding: SPACING.NORMAL,
                                        paddingVertical: SPACING.X_SMALL,
                                        borderRadius: 8,
                                        marginBottom: SPACING.NORMAL,
                                        backgroundColor: theme.colors.primaryThemeColor,
                                    }}>
                                    <TextComponent color={COLORS.white}>Add</TextComponent>
                                </TouchableOpacity>
                            </View>
                        )}
                        <ScrollView
                            horizontal
                            style={{
                                borderBottomWidth: 1,
                                borderColor: theme.mode.borderColor,
                                paddingBottom: SPACING.NORMAL,
                            }}>
                            <View
                                style={{
                                    backgroundColor: theme.mode.backgroundColor,
                                }}>
                                {FormDataValue?.map((rowData, parentIndex) => {
                                    console.log('🚀 ~ {FormDataValue?.map ~ rowData:', rowData);
                                    return (
                                        <View
                                            key={parentIndex}
                                            style={{ padding: SPACING.NORMAL, paddingTop: 0, paddingBottom: SPACING.SMALL, flexDirection: 'row' }}>
                                            <View
                                                style={{
                                                    paddingRight: SPACING.SMALL,
                                                    borderBottomWidth: 1,
                                                    paddingBottom: SPACING.X_SMALL,
                                                    borderColor: COLORS.accordionBorderColor,
                                                    // maxWidth: RFPercentage(25),
                                                    // minWidth: RFPercentage(10),
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center',
                                                }}>
                                                <TouchableOpacity
                                                    style={{
                                                        paddingVertical: SPACING.SMALL,
                                                    }}
                                                    onPress={() => {
                                                        // modalizeRef.current?.open();
                                                        setSelectedDataForDelete(rowData);
                                                    }}
                                                    // onPress={() =>
                                                    //     setSelectedData({
                                                    //         ...(columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER && {
                                                    //             Value: rowData[columnData?.ColumnDefinition]
                                                    //                 ? moment(rowData[columnData?.ColumnDefinition])
                                                    //                 : moment(),
                                                    //         }),
                                                    //         title: data?.Title,
                                                    //         Type: columnData?.Type,
                                                    //         UsageID: rowData?.UsageID,
                                                    //         PhaseId: rowData?.PhaseId,
                                                    //         rowData,
                                                    //         ColumnNames,
                                                    //         ...columnData,
                                                    //     })
                                                    // }
                                                >
                                                    <IconComponent name="delete" type={ICON_TYPE.AntDesign} />
                                                </TouchableOpacity>
                                            </View>
                                            {ColumnNames?.map((columnData, index) => (
                                                <View
                                                    key={index}
                                                    style={{
                                                        paddingRight: SPACING.SMALL,
                                                        borderBottomWidth: 1,
                                                        paddingBottom: SPACING.X_SMALL,
                                                        borderColor: COLORS.accordionBorderColor,
                                                        maxWidth: RFPercentage(40),
                                                        minWidth: RFPercentage(10),
                                                        overflow: 'hidden',
                                                        justifyContent: 'space-between',
                                                        flex: 1,
                                                        backgroundColor: theme.mode.backgroundColor,
                                                    }}>
                                                    <TextComponent
                                                        style={{
                                                            marginBottom: SPACING.X_SMALL,
                                                            ...(parentIndex !== 0 && {
                                                                height: 0,
                                                                opacity: 0,
                                                                marginBottom: 0,
                                                            }),
                                                        }}
                                                        type={FONT_TYPE.BOLD}
                                                        fontSize={FONT_SIZE.X_SMALL}>
                                                        {columnData.Label}
                                                    </TextComponent>
                                                    <TouchableOpacity
                                                        style={{
                                                            paddingVertical: SPACING.SMALL,
                                                            maxWidth: RFPercentage(25),
                                                            flex: 1,
                                                        }}
                                                        onPress={() =>
                                                            setSelectedData({
                                                                // rowData,
                                                                // ...data,
                                                                // ...columnData,
                                                                ...(columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER && {
                                                                    Value: rowData[columnData?.ColumnDefinition]
                                                                        ? moment(rowData[columnData?.ColumnDefinition], DATE_FORMAT.MM_DD_YYYY)
                                                                        : moment(),
                                                                }),
                                                                title: data?.Title,
                                                                Type: columnData?.Type,
                                                                UsageID: rowData?.UsageID,
                                                                PhaseId: rowData?.PhaseId,
                                                                WhysID: rowData?.WhysID,
                                                                PSActionID: rowData?.PSActionID,
                                                                RootCauseID: rowData?.RootCauseID,
                                                                DynamicNodeName: columnData,
                                                                rowData,
                                                                ColumnNames,
                                                                ...columnData,
                                                                // allFields,
                                                            })
                                                        }>
                                                        <TextComponent
                                                            numberOfLines={3}
                                                            style={{
                                                                maxWidth: RFPercentage(25),
                                                                minWidth: RFPercentage(15),
                                                            }}>
                                                            {columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER
                                                                ? rowData[columnData?.ColumnDefinition]
                                                                    ? rowData[columnData?.ColumnDefinition]
                                                                    : '---'
                                                                : rowData[columnData?.ColumnDefinition] || '---'}
                                                            {/* {columnData?.Type === INPUTS_CONSTANTS.DATE_PICKER
                                                                ? rowData[columnData?.ColumnDefinition]
                                                                    ? moment(rowData[columnData?.ColumnDefinition]).format('DD-MM-YYYY')
                                                                    : '---'
                                                                : rowData[columnData?.ColumnDefinition] || '---'} */}
                                                        </TextComponent>
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                ),
            };
        });
    }, [eightDData]);

    const CARApprovalStatus = eightDData?.data?.Data?.CARApprovalStatus;
    const StatusId = eightDData?.data?.Data?.CARApprovalStatus?.StatusId;
    const ViewLogCount = eightDData?.data?.Data?.CARApprovalStatus?.ViewLogCount;

    return (
        <Content noPadding>
            <EightDDynamicInputModal
                {...{
                    selectedData,
                    setSelectedData,
                    ConcernID: ConcernID,
                    getDynamicFormData,
                }}
            />
            <Header title={formName} />
            <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                {eightDData?.loading && (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: -SPACING.XX_LARGE,
                            right: 0,
                            left: 0,
                            bottom: 0,
                            zIndex: 100,
                        }}>
                        <ActivityIndicator size="large" color={theme.colors.primaryThemeColor} />
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE} style={{ paddingTop: SPACING.NORMAL }}>
                            Loading form data...
                        </TextComponent>
                        <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.LARGE}>
                            Please Wait...
                        </TextComponent>
                    </View>
                )}
                <ScrollView
                    style={{
                        backgroundColor: theme.mode.backgroundColor,
                    }}
                    contentContainerStyle={{ backgroundColor: theme.mode.backgroundColor }}>
                    <View
                        style={{
                            backgroundColor: theme.mode.backgroundColor,
                            padding: SPACING.NORMAL,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingBottom: SPACING.NORMAL,
                                flexWrap: 'wrap',
                                flex: 1,
                            }}>
                            {eightDData?.data?.Data?.FormConcernDetails?.map((formConcern, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={{
                                            alignItems:
                                                formConcern?.Type === INPUTS_CONSTANTS.RICH_EDITOR
                                                    ? 'flex-start'
                                                    : index % 2 === 0
                                                    ? 'flex-start'
                                                    : 'flex-end',
                                            width: formConcern?.Type !== INPUTS_CONSTANTS.RICH_EDITOR ? '50%' : '100%',
                                            paddingBottom: SPACING.SMALL,
                                        }}>
                                        <TextComponent
                                            numberOfLines={5}
                                            fontSize={FONT_SIZE.X_SMALL}
                                            color={COLORS.searchText}
                                            type={FONT_TYPE.BOLD}
                                            style={{ textAlign: index % 2 === 0 ? 'left' : 'right' }}>
                                            {formConcern?.Label}
                                        </TextComponent>

                                        {/* Static Values Area */}
                                        {formConcern?.Type !== INPUTS_CONSTANTS.RICH_EDITOR ? (
                                            <TextComponent type={FONT_TYPE.BOLD}>
                                                {(formConcern?.Value || '')?.replace(/(<([^>]+)>)/gi, '') || 'No Data'}
                                            </TextComponent>
                                        ) : (
                                            <TextComponent type={FONT_TYPE.BOLD} numberOfLines={2000}>
                                                {(formConcern?.Value || '')?.replace(/(<([^>]+)>)/gi, '') || 'No Data'}
                                            </TextComponent>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    {eightDData?.sections?.length > 0 && (
                        <Accordion
                            touchableComponent={Pressable}
                            sections={SECTIONS}
                            {...{ activeSections, renderHeader, renderContent, onChange: updateSections }}
                        />
                    )}
                </ScrollView>
                {ViewLogCount > 0 && (
                    <FAB
                        onPress={() => {
                            navigation.navigate(ROUTES.VIEW_LOGS, {
                                ConcernID,
                            });
                        }}
                        iconName="document-text-outline"
                        iconType={ICON_TYPE.Ionicons}
                        text="Logs"
                    />
                )}
                {StatusId === 1 || StatusId === 4 || StatusId === 7 || StatusId === 10 || StatusId === 13 ? (
                    <ApproveRejectComponent
                        ApproveButtonId={CARApprovalStatus?.ApproveButtonId}
                        RejectButtonId={CARApprovalStatus?.RejectButtonId}
                        ConcernID={ConcernID}
                        refreshData={getDynamicFormData}
                    />
                ) : null}
            </View>
            <Modalize
                withHandle={false}
                onOpen={() => {
                    // if (Platform.OS === 'android') {
                    StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.65)', true);
                    StatusBar.setBarStyle('light-content');
                    // }
                }}
                onClose={() => {
                    // if (Platform.OS === 'android') {
                    StatusBar.setBackgroundColor(COLORS.white, true);
                    StatusBar.setBarStyle('dark-content');
                    // }
                }}
                ref={modalizeRef}
                // adjustToContentHeight
                scrollViewProps={{
                    // scrollEnabled: false,
                    style: {
                        flex: 1,
                        flexGrow: 1,
                    },
                }}
                modalHeight={RFPercentage(20)}
                HeaderComponent={
                    <View
                        style={{
                            paddingHorizontal: SPACING.NORMAL,
                            borderBottomWidth: 1,
                            borderColor: COLORS.accDividerColor,
                            backgroundColor: theme.mode.backgroundColor,
                            borderTopLeftRadius: SPACING.SMALL,
                            borderTopRightRadius: SPACING.SMALL,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                flex: 1,
                            }}>
                            <TextComponent type={FONT_TYPE.BOLD} fontSize={FONT_SIZE.NORMAL}>
                                Are you want to delete? (This can't be revert)
                            </TextComponent>
                        </View>
                        <View
                            style={{
                                padding: SPACING.NORMAL,
                                paddingRight: 0,
                            }}>
                            <TouchableOpacity
                                onPress={() => modalizeRef?.current?.close()}
                                style={{
                                    padding: SPACING.SMALL,
                                    alignSelf: 'flex-end',
                                    borderRadius: SPACING.SMALL,
                                    backgroundColor: theme.colors.primaryThemeColor,
                                }}>
                                <IconComponent color={COLORS.white} name="close" type={ICON_TYPE.AntDesign} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                    </View>
                }>
                <View style={{ flex: 1, backgroundColor: theme.mode.backgroundColor }}>
                    <View style={{ padding: SPACING.SMALL, alignItems: 'center', flex: 1 }}>
                        <ButtonComponent
                            loading={deleting}
                            disabled={deleting}
                            onPress={handleDelete}
                            style={{
                                backgroundColor: COLORS.red,
                            }}>
                            Proceed to Delete
                        </ButtonComponent>
                    </View>
                </View>
            </Modalize>
        </Content>
    );
};

export default EightDDynamicPage;

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
