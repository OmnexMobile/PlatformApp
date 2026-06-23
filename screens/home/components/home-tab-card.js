import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    LogBox,
    Modal,
    ActivityIndicator,
    TextInput,
} from 'react-native';
// import { Card, IconButton } from 'react-native-paper';
import { SPACING } from 'constants/theme-constants';
import strings from 'config/localization';
import { ImageComponent, NoRecordFound } from 'components';
import IconComponent from 'components/icon-component';
import { IMAGES } from 'assets/images';
import FastImage from 'react-native-fast-image';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { LOCAL_STORAGE_VARIABLES, ROUTES, APP_VARIABLES, STATUS_CODES, ICON_TYPE } from 'constants/app-constant';
import { RFPercentage } from 'helpers/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { useAppContext } from 'contexts/app-context';
import localStorage from 'global/localStorage';
import auditproAuth from '../../../services/Auditpro-Auth';
import apqpAuth from '../../../services/APQP-Auth';
import supplierAuth from '../../../services/SupplierMgnt-Auth';
import CryptoJS from 'react-native-crypto-js';
import { postAPI } from 'global/api-helpers';
import ApiUrl from 'global/ApiUrl';
import { Bubbles } from 'react-native-loader';
import { useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { Images } from 'theme/Apqp';
import { APQP_URL, AUDITPRO_URL, GLOBAL_BASE_URL, PROBLEMSOLVING_URL, IC_URL, ensureTrailingSlash } from 'screens/globalConstant/globalURL';
import { AuditColors, AuditLayout, AuditShadows, AuditTypography, getAuditMetricTheme, InterFont, interText } from 'constants/audit-hub-design';

const GRID_COLUMNS = 2;

const chunkIntoRows = (items, columns = GRID_COLUMNS) => {
    const rows = [];
    for (let i = 0; i < items.length; i += columns) {
        rows.push(items.slice(i, i + columns));
    }
    return rows;
};

const getMetricSubtitle = (category = '') => {
    const key = category.toLowerCase().replace(/\n/g, ' ');
    if (key.includes('scheduled')) return 'Upcoming';
    if (key.includes('completed') && !key.includes('deadline')) return 'Successfully completed';
    if (key.includes('deadline') && key.includes('violated') && !key.includes('closed')) return 'Require attention';
    if (key.includes('closed')) return 'Audits closed';
    if (key.includes('open')) return 'Awaiting action';
    if (key.includes('progress')) return 'In progress';
    if (key.includes('concern')) return 'Total concerns';
    if (key.includes('reject')) return 'Rejected items';
    if (key.includes('draft')) return 'Draft items';
    if (key.includes('rework')) return 'Rework items';
    if (key.includes('cancel')) return 'Cancelled items';
    if (key.includes('inspection')) return 'Scheduled items';
    if (key.includes('operator')) return 'Active worksheets';
    if (key.includes('project') || key.includes('apqp') || key.includes('ppap')) return 'Active items';
    if (key.includes('risk')) return 'Open risks';
    if (key.includes('meeting')) return 'Scheduled meetings';
    if (key.includes('action')) return 'Pending actions';
    return 'View details';
};

const getModuleIcon = (title = '') => {
    const key = title.toLowerCase();
    if (key.includes('audit')) return IMAGES.scheduledAudit;
    if (key.includes('supplier')) return IMAGES.completedAudit;
    if (key.includes('problem') || key.includes('concern')) return IMAGES.concerns;
    if (key.includes('inspection')) return IMAGES.ICIS;
    if (key.includes('apqp') || key.includes('ppap') || key.includes('project')) return IMAGES.projects;
    return IMAGES.scheduledAudit;
};

const getTotalBadgeLabel = (title = '', total = 0) => {
    const key = title.toLowerCase();
    if (key.includes('problem') || key.includes('concern')) return `${total} Total Concerns`;
    if (key.includes('inspection')) return `${total} Total Items`;
    if (key.includes('apqp') || key.includes('ppap') || key.includes('project')) return `${total} Total Items`;
    return `${total} Total Audits`;
};

const sumMetricTotal = items =>
    (items || []).reduce((total, item) => {
        const value = Number(item?.status);
        return total + (Number.isFinite(value) ? value : 0);
    }, 0);

const TabsCard = ({ countDetails, tabIndex, currentUser, isSupplier }) => {
    const navigations = useNavigation();
    const [currentUserData, setCurrentUserData] = useState([]);
    // This hook returns `true` if the screen is focused, `false` otherwise
    const isFocused = useIsFocused();
    const [isRegister, setIsRegister] = useState(null);
    const [loading, setLoading] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [isPSCount, setIsPSCount] = useState(null);
    const [apqpCount, setApqpCount] = useState(null);
    const [auditStats, setAuditStats] = useState(null);
    const { handleGlobalURL, globalDeviceDetails } = useAppContext();
    const [assessmentStats, setAssessmentStats] = useState(null);
    const [routineStats, setRoutineStats] = useState(null);
    const [detail, setDetail] = useState([]);
    const { icSettings } = useSelector(state => state.inspection);
    const [icCount, setIcCount] = useState(null);
    const [moduleLicenses, setModuleLicenses] = useState(null);
    const [filterText, setFilterText] = useState('');
    const filterInputRef = React.useRef(null);
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = sectionKey => {
        setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
    };

    const isSectionExpanded = sectionKey => expandedSections[sectionKey] === true;

    const [showDatePicker, setShowDatePicker] = useState(false);

    const psCounts = useSelector(state => state?.homeRedux?.dashboardConcernCounts?.countDetails ?? null);
    // console.log('PS Counts:', psCounts);
    const data = [
        {
            id: 1,
            title: tabIndex === 0 ? strings.ppapProjects : strings.apqp_ppapManager,
            detail: [
                { images: tabIndex === 0 ? IMAGES.actions : null, category: tabIndex === 0 ? strings.Actions : null, status: 0 },
                {
                    images: IMAGES.projects,
                    category: tabIndex === 0 ? strings.projects : strings.apap_ppap,
                    status: tabIndex === 0 ? 0 : apqpCount ? apqpCount?.APQPPPAP ?? 0 : undefined,
                },
                {
                    images: tabIndex === 0 ? null : IMAGES.risk,
                    category: tabIndex === 0 ? null : strings.risk,
                    status: tabIndex === 0 ? 0 : apqpCount ? apqpCount?.Risk ?? 0 : undefined,
                },
                {
                    images: tabIndex === 0 ? null : IMAGES.meeting,
                    category: tabIndex === 0 ? null : strings.meeting,
                    status: tabIndex === 0 ? 0 : apqpCount ? apqpCount?.Meetings ?? 0 : undefined,
                },
                { images: tabIndex === 0 ? IMAGES.todayTask : null, category: tabIndex === 0 ? strings.todayTask : null, status: 0 },
                { images: tabIndex === 0 ? IMAGES.dailyTask : null, category: tabIndex === 0 ? strings.dailyTask : null, status: 0 },
            ],
        },
        {
            id: 2,
            title: tabIndex === 0 ? strings.auditPro : null,
            detail:
                tabIndex === 0
                    ? [
                          {
                              images: IMAGES.scheduledAudit,
                              category: strings.scheduledAudit,
                              status: auditStats ? auditStats?.Scheduled ?? 0 : undefined,
                              navStatus: 2,
                              auditTitle: strings.scheduled,
                          },
                          {
                              images: IMAGES.completedAudit,
                              category: strings.completedAudit,
                              status: auditStats ? auditStats?.Completed ?? 0 : undefined,
                              navStatus: 3,
                              auditTitle: strings.completed,
                          },
                          {
                              images: IMAGES.deadlineViolated,
                              category: strings.deadlineViolated,
                              status: auditStats ? auditStats?.DeadlineViolated ?? 0 : undefined,
                              navStatus: 4,
                              auditTitle: strings.deadlineviolated,
                          },
                          {
                              images: IMAGES.closedOut,
                              category: strings.closedOut,
                              status: auditStats ? auditStats?.CompletedDeadlineViolated ?? 0 : undefined,
                              navStatus: 5,
                              auditTitle: strings.abb_deadlineviolatedandcompleted,
                          },
                      ]
                    : [],
        },
        {
            id: 3,
            title: tabIndex === 0 ? strings.problemSolver : null,
            detail:
                tabIndex === 0
                    ? [
                          // { images: tabIndex === 0 ? IMAGES.supplierConcerns : IMAGES.concerns, category: tabIndex === 0 ? strings.supplierConcerns : strings.concerns, status: 0 },
                          {
                              images: IMAGES.concerns,
                              category: strings.concerns,
                              status: psCounts ? Number(psCounts?.TotalConcern ?? 0) : undefined,
                          },
                          {
                              images: IMAGES.openConcerns,
                              category: strings.openConcerns,
                              status: psCounts ? Number(psCounts?.OpenConcern ?? 0) : undefined,
                          },
                          {
                              images: IMAGES.inProgressConcerns,
                              category: strings.inProgressConcerns,
                              status: psCounts ? Number(psCounts?.InprogressConcern ?? 0) : undefined,
                          },
                          {
                              images: IMAGES.closedOut,
                              category: strings.closed,
                              status: psCounts ? Number(psCounts?.CloseConcern ?? 0) : undefined,
                          },
                          {
                              images: IMAGES.ICOS,
                              category: strings.rejected,
                              status: psCounts ? Number(psCounts?.RejectConcern ?? 0) : undefined,
                          },
                          {
                              images: IMAGES.deadlineViolated,
                              category: strings.draft,
                              status: psCounts ? Number(psCounts?.DraftConcern ?? 0) : undefined,
                          },
                          {
                              images: IMAGES.todayTask,
                              category: strings.rework,
                              status: psCounts ? Number(psCounts?.ReworkConcern ?? 0) : undefined,
                          },
                          {
                              images: IMAGES.risk,
                              category: strings.cancelled,
                              status: psCounts ? Number(psCounts?.CancelledConcern ?? 0) : undefined,
                          },
                      ]
                    : [],
        },
        // {
        //   id: 4,
        //   title: tabIndex === 0 ? strings.documentPro : null,
        //   detail: tabIndex === 0 ? [
        //     { images: IMAGES.inProgressConcerns, category: strings.documentLevels, status: 0 },
        //     { images: IMAGES.inProgressConcerns, category: strings.actionList, status: 0 },
        //     { images: IMAGES.inProgressConcerns, category: strings.adminActions, status: 0 }
        //   ] : [],
        // },
        {
            id: 5,
            title: tabIndex === 0 ? strings.inspectionControl : null,
            detail:
                tabIndex === 0
                    ? [
                          {
                              images: IMAGES.ICIS,
                              category: strings.inspectionSchedule,
                              status: icCount ? Number(icCount?.inspection ?? 0) : undefined,
                              routeName: ROUTES.INSPECTION_SCHEDULE,
                              icid: 1,
                          },
                          {
                              images: IMAGES.ICOS,
                              category: strings.operatorWorksheet,
                              status: icCount ? Number(icCount?.operatorList ?? 0) : undefined,
                              routeName: ROUTES.OPERATOR_WORKSHEET,
                              icid: 2,
                          },
                          {
                              images: IMAGES.ICCI,
                              category: strings.completedInspection,
                              status: icCount ? Number(icCount?.completed ?? 0) : undefined,
                              routeName: ROUTES.COMPLETED_INSPECTION,
                              icid: 3,
                          },
                        //   {
                        //       images: IMAGES.ICSS,
                        //       category: strings.supervisorSchedule,
                        //       status: icCount ? Number(icCount?.supervisor ?? 0) : undefined,
                        //       routeName: ROUTES.SUPERVISOR_SCHEDULE,
                        //       icid: 4,
                        //   },
                      ]
                    : [],
        },
        // {
        //   id: 6,
        //   title: tabIndex === 0 ? null : strings.supplierMgnt,
        //   detail: tabIndex === 0 ? [] :
        //   [
        //     { images: IMAGES.scheduledAudit, category: strings.supplierInitialAssessment, status: 20 },
        //     { images: IMAGES.completedAudit, category: strings.supplierRoutineAudit, status: 15 },
        //   ]
        // },
        {
            id: 6,
            title: tabIndex === 0 ? null : strings.supplierMgnt,
            detail:
                tabIndex === 0
                    ? []
                    : [
                          {
                              groupTitle: strings.supplierInitialAssessment, // Supplier Assessment Audits
                              audits: [
                                  {
                                      images: IMAGES.scheduledAudit,
                                      category: strings.scheduledAudit,
                                      status: assessmentStats ? assessmentStats?.Scheduled ?? 0 : undefined,
                                      navStatus: 2,
                                  },
                                  {
                                      images: IMAGES.completedAudit,
                                      category: strings.completedAudit,
                                      status: assessmentStats ? assessmentStats?.Completed ?? 0 : undefined,
                                      navStatus: 3,
                                  },
                                  {
                                      images: IMAGES.deadlineViolated,
                                      category: strings.deadlineViolated,
                                      status: assessmentStats ? assessmentStats?.DeadlineViolated ?? 0 : undefined,
                                      navStatus: 4,
                                  },
                                  {
                                      images: IMAGES.closedOut,
                                      category: strings.closedOut,
                                      status: assessmentStats ? assessmentStats?.CompletedDeadlineViolated ?? 0 : undefined,
                                      navStatus: 5,
                                  },
                              ],
                          },
                          {
                              groupTitle: strings.supplierRoutineAudit, // Supplier Routine Audits
                              audits: [
                                  {
                                      images: IMAGES.scheduledAudit,
                                      category: strings.scheduledAudit,
                                      status: routineStats ? routineStats?.Scheduled ?? 0 : undefined,
                                      navStatus: 2,
                                  },
                                  {
                                      images: IMAGES.completedAudit,
                                      category: strings.completedAudit,
                                      status: routineStats ? routineStats?.Completed ?? 0 : undefined,
                                      navStatus: 3,
                                  },
                                  {
                                      images: IMAGES.deadlineViolated,
                                      category: strings.deadlineViolated,
                                      status: routineStats ? routineStats?.DeadlineViolated ?? 0 : undefined,
                                      navStatus: 4,
                                  },
                                  {
                                      images: IMAGES.closedOut,
                                      category: strings.closedOut,
                                      status: routineStats ? routineStats?.CompletedDeadlineViolated ?? 0 : undefined,
                                      navStatus: 5,
                                  },
                              ],
                          },
                      ],
        },
    ];

    // Convert ModuleLicense string into array of { id, name }
    const parseModuleLicenseString = str => {
        if (!str || typeof str !== 'string') return [];

        // Example: "[1, AQuA Pro]"
        const items = str.split('],').map(item => {
            const clean = item.replace(/[\[\]]/g, '').trim();
            const parts = clean.split(',');

            if (parts.length < 2) return null;

            return {
                id: Number(parts[0].trim()),
                name: parts[1].trim().toLowerCase(),
            };
        });

        return items.filter(Boolean);
    };

    useEffect(() => {
        const loadLicenses = async () => {
            const stored = await AsyncStorage.getItem('moduleLicenses');
            console.log('stored licenses', stored);
            if (stored) {
                setModuleLicenses(JSON.parse(stored));
            }
        };
        loadLicenses();
    }, []);
    console.log('moduleLicenses ', moduleLicenses);

    console.log('Supplier:', moduleLicenses?.hasSupplierManagementLicense);
    console.log('Audit:', moduleLicenses?.hasAuditProLicense);
    console.log('APQP:', moduleLicenses?.hasApqpPpapLicense);
    console.log('ProblemSolver:', moduleLicenses?.hasProblemSolverLicense);
    console.log('Inspection:', moduleLicenses?.hasInspectionControlLicense);
    console.log('Document:', moduleLicenses?.hasDocumentProLicense);

    const dataSet = React.useMemo(() => {
        // const inspectionIndex = data.findIndex(item => item.id === 5);
        // data[inspectionIndex].detail = data[inspectionIndex].detail.filter(item => {
        //     // Hide Supervisor Schedule if all supervisor flags false
        //     if (
        //         item?.icid === 4 &&
        //         !icSettings?.TabReceivingSupervisorNeeded &&
        //         !icSettings?.TabInprocessSupervisorNeeded &&
        //         !icSettings?.TabFinalSupervisorNeeded
        //     ) {
        //         return false;
        //     }

        //     // Hide Inspection Schedule if receiving/inprocess both false
        //     if (
        //         item?.icid === 1 &&
        //         !icSettings?.TabReceivingLotScheduleNeeded &&
        //         !icSettings?.TabInprocessLotScheduleNeeded &&
        //         !icSettings?.TabFinalLotScheduleNeeded
        //     ) {
        //         return false;
        //     }
        //     return true;
        // });
        let tabData = data;
        // if (icSettings?.SearchInspectionNeeded && icSettings?.TabSearchInspectionNeeded) {
        //     if (inspectionIndex !== -1) {
        //         const detail = data[inspectionIndex].detail;
        //         const indexOfStatus1 = detail.findIndex(d => d.status === 1 || d.category === strings.inspectionSchedule);
        //         const newItem = {
        //             images: IMAGES.ICIS,
        //             category: strings.searchInspection,
        //             status: icCount ? Number(icCount?.search ?? 0) : undefined,
        //             routeName: ROUTES.SEARCH_INSPECTION,
        //             icid: 1,
        //         };
        //         if (indexOfStatus1 !== -1) {
        //             // Replace existing inspectionSchedule
        //             detail[indexOfStatus1] = newItem;
        //         } else {
        //             // Add searchInspection if not present
        //             detail.unshift(newItem); // add at the top
        //         }
        //         data[inspectionIndex].detail = detail;
        //     }
        //     tabData = data;
        // } else {
        //     tabData = data;
        // }
        //  data is used for show app based on license
        if (!tabData || tabData.length === 0) return [];
        const licensedIds = [];
        if (moduleLicenses?.hasApqpPpapLicense) licensedIds.push(1);
        if (moduleLicenses?.hasAuditProLicense) licensedIds.push(2);
        if (moduleLicenses?.hasProblemSolverLicense) licensedIds.push(3);
        if (moduleLicenses?.hasInspectionControlLicense) licensedIds.push(5);
        if (moduleLicenses?.hasSupplierManagementLicense) licensedIds.push(6);
        if (moduleLicenses?.hasDocumentProLicense) licensedIds.push(4);
        if (licensedIds.length === 0) return tabData;
        console.log(
            'licensedIds--->',
            licensedIds,
            'item.id--->',
            tabData.map(item => item.id),
        );
        console.log(
            'tabData--->',
            tabData.filter(item => licensedIds.includes(item.id)),
        );
        return tabData.filter(item => licensedIds.includes(item.id));
    }, [
        data,
        currentUser,
        icSettings?.SearchInspectionNeeded,
        moduleLicenses?.hasSupplierManagementLicense,
        moduleLicenses?.hasAuditProLicense,
        moduleLicenses?.hasApqpPpapLicense,
        moduleLicenses?.hasProblemSolverLicense,
        moduleLicenses?.hasInspectionControlLicense,
        moduleLicenses?.hasDocumentProLicense,
    ]);

    const filteredDataSet = React.useMemo(() => {
        const query = filterText.trim().toLowerCase();
        const applyTextFilter = section => {
            if (!query) return section.detail;
            return section?.detail?.filter(
                item => (item?.category || '').toLowerCase().includes(query) || (section?.title || '').toLowerCase().includes(query),
            );
        };

        return dataSet
            .map(section => {
                const filteredDetail = applyTextFilter(section);
                return { ...section, detail: filteredDetail };
            })
            .filter(section => section.detail && section.detail.length > 0);
    }, [dataSet, filterText]);

    const redirectToPage = async (title, status, category, countValue) => {
        // Reset supplier index to default whenever redirecting from this card
        try {
            await AsyncStorage.setItem('supplierIndex', JSON.stringify(1));
        } catch (error) {
            console.log('Error setting supplierIndex', error);
        }

        const navStatus = Number(status);
        (navStatus || navStatus === 0) && title === strings.auditPro
            ? navigations.navigate(ROUTES.AUDIT_DASHBOARD_LISTING, {
                  projectTitle: title,
                  status: navStatus,
                  filterId: navStatus,
                  category: category.replace(/\n/g, ' '),
                  countValue,
              })
            : null;
    };

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        async function getUserDetails() {
            try {
                const stringifiedUserDetails = await AsyncStorage.getItem('userDetails');
                const value = JSON.parse(stringifiedUserDetails);
                console.log('checkinguserSiteselection', value);

                // console.log('current userdata--->', value)
                getAuditStatusDetails(value);
                // getAuditProStats(value);
                if (value !== null) {
                    // console.log('current token2 Auditpro--->', value?.accessToken)
                    setCurrentUserData(value);
                } else {
                    // console.log('current token3 Auditpro--->', value?.accessToken)
                    setCurrentUserData('');
                }
            } catch (e) {
                // error reading value
                console.log('currentUserData error--->', e);
            }
        }
        getUserDetails();
    }, [currentUserData?.siteId]);

    useEffect(() => {
        if (assessmentStats && routineStats) {
            setDetail([
                {
                    groupTitle: 'Supplier Assessment Audits',
                    audits: [
                        { category: 'Scheduled Audit', value: assessmentStats.Scheduled },
                        { category: 'Completed Audit', value: assessmentStats.Completed },
                        { category: 'Deadline Violated', value: assessmentStats.DeadlineViolated },
                        { category: 'Closed Out', value: assessmentStats.CompletedDeadlineViolated },
                    ],
                },
                {
                    groupTitle: 'Supplier Routine Audits',
                    audits: [
                        { category: 'Scheduled Audit', value: routineStats.Scheduled },
                        { category: 'Completed Audit', value: routineStats.Completed },
                        { category: 'Deadline Violated', value: routineStats.DeadlineViolated },
                        { category: 'Closed Out', value: routineStats.CompletedDeadlineViolated },
                    ],
                },
            ]);
        }
    }, [assessmentStats, routineStats]);

    useEffect(() => {
        async function getdeviceRegisterStatus() {
            try {
                const value = await AsyncStorage.getItem('isdeviceregistered');
                if (value !== null) {
                    // value previously stored
                    // console.log('current isRegister app--->', value)
                    setIsRegister(value);
                }
            } catch (e) {
                // error reading value
                console.log('isRegister error--->', e);
            }
        }
        getdeviceRegisterStatus();
    }, [isRegister, isFocused]);

    useEffect(() => {
        const loadCountData = async () => {
            const countPS = await AsyncStorage.getItem('countPS');
            if (countPS) {
                const parsedData = JSON.parse(countPS);
                console.log('countPS parsedData------------', parsedData);
                setIsPSCount(parsedData);
            }
            const countAPQP = await AsyncStorage.getItem('countAPQP');
            if (countAPQP) {
                const parsedData = JSON.parse(countAPQP);
                console.log('countAPQP parsedData------------', parsedData);
                setApqpCount(parsedData);
            }
            const countIC = await AsyncStorage.getItem('countIC');
            if (countIC) {
                const parsedData = JSON.parse(countIC);
                console.log('countIC parsedData------------1', parsedData);
                setIcCount(parsedData);
            }
        };
        loadCountData();
    }, [isFocused]);

    const getAuditStatusDetails = async value => {
        console.log('checkgetuserDetailsss------', value);
        // Ensure Supplier Mgmt API base URL is configured before fetching stats.
        const storedServerUrl = await AsyncStorage.getItem('storedserverrul');
        const currentGlobalURL = ensureTrailingSlash(globalDeviceDetails?.deviceDetails?.AuditProURL || storedServerUrl || AUDITPRO_URL);
        if (currentGlobalURL) {
            supplierAuth.setServerUrl(currentGlobalURL);
        } else {
            console.log('getAuditStatusDetails skipped: missing AuditPro URL');
            return;
        }
        supplierAuth.getStat(
            value?.accessToken,
            value?.userId,
            value?.siteId,
            1, //Auditpro
            (response, data) => {
                const stats = data?.data?.Data;
                console.log('checkdetailsrresponseAuditpro', data + 'responseeeee' + response);

                if (stats) {
                    const counts = {
                        Scheduled: Number(stats.Scheduled ?? 0),
                        Completed: Number(stats.Completed ?? 0),
                        DeadlineViolated: Number(stats.DeadlineViolated ?? 0),
                        CompletedDeadlineViolated: Number(stats.CompletedDeadlineViolated ?? 0),
                    };
                    setAuditStats(counts);
                }
            },
        );
        if (!value?.accessToken || !value?.userId || !value?.siteId) {
            console.log('getAuditStatusDetails skipped: missing auth/site info');
            return;
        }

        supplierAuth.getStat(
            value?.accessToken,
            value?.userId,
            value?.siteId,
            2, // Assessment
            (response, data) => {
                console.log('inside1', data);
                if (data?.data?.Data) {
                    const auditsCount = {
                        Scheduled: Number(data.data.Data.Scheduled ?? 0),
                        Completed: Number(data.data.Data.Completed ?? 0),
                        DeadlineViolated: Number(data.data.Data.DeadlineViolated ?? 0),
                        CompletedDeadlineViolated: Number(data.data.Data.CompletedDeadlineViolated ?? 0),
                    };
                    setAssessmentStats(auditsCount);
                    console.log('Assessment Stats Stored:', auditsCount);
                }
            },
        );

        supplierAuth.getStat(
            value?.accessToken,
            value?.userId,
            value?.siteId,
            3, // Routine
            (response2, data2) => {
                console.log('inside2', response2, data2);
                if (data2?.data?.Data) {
                    const auditsCount = {
                        Scheduled: Number(data2.data.Data.Scheduled ?? 0),
                        Completed: Number(data2.data.Data.Completed ?? 0),
                        DeadlineViolated: Number(data2.data.Data.DeadlineViolated ?? 0),
                        CompletedDeadlineViolated: Number(data2.data.Data.CompletedDeadlineViolated ?? 0),
                    };
                    setRoutineStats(auditsCount);
                    console.log('✅ Routine Stats Stored:', auditsCount);
                }
            },
        );
    };

    useEffect(() => {
        if (!isFocused) return;
        if (!currentUserData?.accessToken) return;
        getAuditStatusDetails(currentUserData);
    }, [isFocused, currentUserData?.accessToken, currentUserData?.userId, currentUserData?.siteId]);

    const getAuditProStats = async value => {
        if (!value?.accessToken) return;
        auditproAuth.getStat(value?.accessToken, value?.userId, value?.siteId, 1, (response, data) => {
            const stats = data?.data?.Data;
            if (stats) {
                const counts = {
                    Scheduled: Number(stats.Scheduled ?? 0),
                    Completed: Number(stats.Completed ?? 0),
                    DeadlineViolated: Number(stats.DeadlineViolated ?? 0),
                    CompletedDeadlineViolated: Number(stats.CompletedDeadlineViolated ?? 0),
                };
                setAuditStats(counts);
            }
        });
    };

    // console.log('TotalConcern', isPSCount?.TotalConcern, 'OpenConcern', isPSCount?.OpenConcern, 'InprogressConcern', isPSCount?.InprogressConcern);

    // Store the last-used app and server without overwriting the global registration URL.
    const storeUrl = async (url, recentApp) => {
        console.log('reach storeUrl--->', url, 'recentApp', recentApp);
        await AsyncStorage.setItem('storedserverrul', url);
        localStorage.storeData('CurrentApp', recentApp);
    };

    const handleNavigation = async (title, status, category, auditTitle, routeName, index, subTitle, countValue) => {
        console.log(
            'handleNavigation currentUserData?.accessToken--->',
            currentUserData,
            globalDeviceDetails?.deviceDetails,
            'token',
            currentUserData?.accessToken,
        );
        let currentGlobalURL;
        // AUDITPRO //
        if (currentUserData?.accessToken?.length && currentUserData?.accessToken) {
            console.log('handleNavigation reach here1', title);
            if (title === strings.auditPro) {
                currentGlobalURL = globalDeviceDetails?.deviceDetails?.AuditProURL ? globalDeviceDetails?.deviceDetails?.AuditProURL : AUDITPRO_URL;
                auditproAuth.setServerUrl(currentGlobalURL);
                storeUrl(currentGlobalURL, strings.auditPro);
                const projectDetails = {
                    projectTitle: title,
                    projectStatus: status,
                    projectCategory: category.replace(/\n/g, ' '),
                    auditTitle: auditTitle,
                };
                const stringifiedProjectDetails = JSON.stringify(projectDetails);
                AsyncStorage.setItem('projectDetails', stringifiedProjectDetails);
                redirectToPage(title, status, category, countValue);
                // PROBLEMSOLVER //
            } else if (title === strings.problemSolver) {
                // const psUrl = globalDeviceDetails?.deviceDetails?.PSApiURL || PROBLEMSOLVING_URL;
                // const psBase =
                //     GLOBAL_BASE_URL ||
                //     (psUrl ? psUrl.replace(/^(https?:\/\/[^/]+).*/, '$1') : '');
                // const normalizedPs = psBase ? `${psBase}/ProblemSolverAPI/` : psUrl;
                // currentGlobalURL = ensureTrailingSlash(normalizedPs);
                console.log('current click--->', strings.problemSolver, '--', category.replace(/\n/g, ' '), '--', category, '--');
                currentGlobalURL = globalDeviceDetails?.deviceDetails?.PSApiURL ? globalDeviceDetails?.deviceDetails?.PSApiURL : PROBLEMSOLVING_URL;
                localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentGlobalURL);
                storeUrl(currentGlobalURL, strings.problemSolver);
                navigateToStatusCount(category.replace(/\n/g, ' '));
                // APQP //
            } else if (title === strings.apqp_ppapManager) {
                console.log('apqp_ppapManager handleNavigation 1--->', title, status, category, globalDeviceDetails?.deviceDetails?.APQPApiURL);
                currentGlobalURL = globalDeviceDetails?.deviceDetails?.APQPApiURL ? globalDeviceDetails?.deviceDetails?.APQPApiURL : APQP_URL;
                apqpAuth.setServerUrl(currentGlobalURL);
                storeUrl(currentGlobalURL, strings.apqp_ppapManager);
                globalAPQPLogin(category, title, currentGlobalURL);
                // SUPPLIER MANAGEMENT //
            } else if (title === strings.supplierMgnt) {
                console.log('sm_ current click--->', strings.supplierMgnt);
                console.log('sm_ current category--->', category);
                const normalizedSubTitle = (subTitle || '').replace(/\n/g, ' ').trim();
                let supplierIndex = normalizedSubTitle === 'Supplier Initial Assessment' ? 2 : 3;

                if (category == 'Scheduled\nAudit') {
                    await AsyncStorage.setItem('FILTERIDLIST', JSON.stringify(2));
                } else if (category == 'Completed\nAudit') {
                    await AsyncStorage.setItem('FILTERIDLIST', JSON.stringify(3));
                } else if (category == 'Deadline\nViolated') {
                    await AsyncStorage.setItem('FILTERIDLIST', JSON.stringify(4));
                } else if (category == 'Closed\nOut') {
                    await AsyncStorage.setItem('FILTERIDLIST', JSON.stringify(5));
                }
                console.log('checksmdataonpress', supplierIndex);

                await AsyncStorage.setItem('supplierIndex', JSON.stringify(supplierIndex));
                currentGlobalURL = globalDeviceDetails?.deviceDetails?.AuditProURL ? globalDeviceDetails?.deviceDetails?.AuditProURL : AUDITPRO_URL;
                supplierAuth.setServerUrl(currentGlobalURL);
                auditproAuth.setServerUrl(currentGlobalURL);
                storeUrl(currentGlobalURL, strings.supplierMgnt);
                navigations.navigate(ROUTES.AUDIT_DASHBOARD_LISTING_SM, {
                    currentUserData: currentUserData, // pass the array here
                });
                // DOCUMENT PRO //
            }
            //  else if (title === strings.documentPro) {
            //   if (category == 'Document\nLevels') {
            //     navigations.navigate(ROUTES.DOCPRO_DOCUMENTFOLDER);
            //   } else if (category == 'Actions\nList') {
            //     navigations.navigate(ROUTES.DOCPRO_ACTION);
            //   }
            // // INSPECTION CONTROL //
            // }
            else if (title === strings.inspectionControl) {
                console.log('IC API URL--->', globalDeviceDetails?.deviceDetails?.ICApiURL, IC_URL);
                currentGlobalURL = globalDeviceDetails?.deviceDetails?.ICApiURL ? globalDeviceDetails?.deviceDetails?.ICApiURL : IC_URL;
                localStorage.storeData(LOCAL_STORAGE_VARIABLES.GLOBAL_SERVER_URL, currentGlobalURL);
                storeUrl(currentGlobalURL, strings.inspectionControl);
                setLoading(true);
                navigations.navigate(routeName);
                setLoading(false);
            } else {
                // console.log('current click--->')
            }
        } else {
            // Reach ELSE when Token is null or empty
            if (isRegister === 'yes') {
                console.log('else handleNavigation 2--->', currentUserData?.accessToken);
                navigations.navigate(ROUTES.GLOBAL_LOGIN);
            } else {
                console.log('else handleNavigation 3--->', currentUserData?.accessToken);
                navigations.navigate(ROUTES.GLOBAL_REGISTER);
            }
        }
    };

    //APQP API Changes

    const globalAPQPLogin = async (category, title, currentGlobalURL) => {
        console.log('globalAPQPLogin', currentUserData?.accessToken, currentUserData?.siteId, currentUserData?.userId);
        const API_URL = currentGlobalURL;
        console.log('globalAPQPLogin API_URL--->', API_URL);
        const loginData = currentUserData;
        console.log('globalAPQPLogin loginData--->', loginData, 'loginData?.userId', loginData?.userId, 'loginData?.siteId', loginData?.siteId);
        console.log('globalAPQPLogin loginData1111--->', loginData?.accessToken, loginData?.userFullName, loginData, category, title);

        // Call  webAPQPLogin
        if (loginData != '') {
            const UserName = await AsyncStorage.getItem('loginUserName');
            const Password = await AsyncStorage.getItem('loginPassword');
            console.log('APQPWebTokenCheck---->urldoc--->' + API_URL, 'name', UserName, 'pawd', Password, loginData);
            var key = CryptoJS.enc.Utf8.parse('8080808080808080');
            var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
            var encryptedpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(Password), key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });
            apqpAuth.getapqpweblogindata(GLOBAL_BASE_URL, UserName, encryptedpassword.toString(), async (res, data) => {
                console.log('webToken', data.data);
                if (data != '') {
                    const userDataApqp = {
                        userId: loginData?.userId,
                        siteId: loginData?.siteId,
                        accessToken: loginData?.accessToken,
                        userFullName: loginData?.userFullName,
                        // email: loginData?.Email.toString(), //need to add
                        email: null, //need to add
                        docattachurl: GLOBAL_BASE_URL, //need to add
                        webToken: data?.data, //need to add
                        currentServerUrl: API_URL,
                        isDeviceRegistered: true,
                        Address: '1/807A Pillaiyar Kovil Street, Thoraipakkam, Chennai - 600097',
                        CompanyName: 'Omnex Software Solutions',
                        CompanyUrl: 'http://www.omnexsystems.com',
                        Logo: Images.topLogo,
                        Phone: '044248634566',
                        loginuser: loginData,
                        category: category,
                        title: title,
                    };
                    console.log('userDataApqp global-->', userDataApqp);
                    const stringifiedUserDetails = JSON.stringify(userDataApqp);
                    AsyncStorage.setItem('userDataApqp', stringifiedUserDetails);
                    console.log('Set Async userDataApqp ', stringifiedUserDetails);

                    if (category === 'APQP/PPAP') {
                        console.log('reach APQP/PPAP');
                        navigations.navigate(ROUTES.APQP_PPAP_MANAGER_SCREEN, {
                            filterId: 2,
                            title: strings.projects,
                            todayn: 1,
                            allprojects: null,
                            // this.state.projects + this.state.risks + this.state.meetings,
                        });
                    } else if (category === 'Risk') {
                        console.log('reach Risk');
                        navigations.navigate(ROUTES.RISK_SCREEN, {
                            filterId: 3,
                            title: strings.risks,
                        });
                    } else if (category === 'Meeting') {
                        console.log('reach Meeting');
                        navigations.navigate(ROUTES.MEETING_SCREEN, {
                            filterId: 4,
                            title: strings.meetings,
                            recentActivity: null,
                            // this.props.data.projects.recentActivity,
                        });
                    } else {
                        console.log('reach Today Task');
                    }
                }
            });
        }
    };

    //PROBLEM SOLVER

    const navigateToStatusCount = concerns => {
        console.log('navigateToStatusCount---->', concerns);
        if (concerns == 'Supplier Concerns') {
            const field = 'TotalConcern';
            const title = 'All';
            navigations.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            });
        } else if (concerns == 'Open Concerns') {
            const field = 'OpenConcern';
            const title = 'Open';
            navigations.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            });
        } else if (concerns == 'In Progress Concerns') {
            const field = 'InprogressConcern';
            const title = 'In-Progress';
            navigations.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            });
        } else if (concerns == 'Closed ') {
            const field = 'CloseConcern';
            const title = 'Closed';
            navigations.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            });
        } else if (concerns == 'Rejected ') {
            const field = 'RejectConcern';
            const title = 'Rejected';
            navigations.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            });
        } else if (concerns == 'Draft ') {
            const field = 'DraftConcern';
            const title = 'Draft';
            navigations.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            });
        } else if (concerns == 'Rework ') {
            const field = 'ReworkConcern';
            const title = 'Rework';
            navigations.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            });
        } else if (concerns == 'Cancelled ') {
            const field = 'CancelledConcern';
            const title = 'Cancelled';
            navigations.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            });
        } else {
            const field = 'TotalConcern';
            const title = 'All';
            navigations.navigate(ROUTES.LIST_SCREEN_PS, {
                [APP_VARIABLES.CONCERN_STATUS_ID]: STATUS_CODES[field],
                title,
            });
        }
    };

    // IC Login

    // const loginCallIC = async routeName => {
    //     let Password = 'a1';
    //     var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    //     var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    //     var encryptedpassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(Password), key, {
    //         keySize: 128 / 8,
    //         iv: iv,
    //         mode: CryptoJS.mode.CBC,
    //         padding: CryptoJS.pad.Pkcs7,
    //     });
    //     const formData = new FormData();
    //     formData.append('UserName', 'swetha');
    //     formData.append('RegisteredDeviceId', 'testdevice');
    //     formData.append('Password', encryptedpassword.toString());
    //     formData.append('LoginFlag', 1);
    //     const response = await postAPI(`${ApiUrl.IC_LOGIN}`, formData);
    //     if (response?.Success) {
    //         let icUserData = {
    //             userData: response?.Data[0] || {},
    //             token: response?.Token || '',
    //         };
    //         dispatch({ type: 'IC_USER_DATA', icUserData: icUserData });
    //         const settingsRes=await postAPI(`${ApiUrl.IC_SETTINGS}`)
    //         if(settingsRes.Success){
    //             dispatch({ type: 'IC_SETTINGS', icSettings: settingsRes?.Data[0] || {} });
    //             navigations.navigate(routeName);
    //         }
    //     } else {
    //         showMessage({
    //             message: `${response.Message}`,
    //             backgroundColor: COLORS.ERROR,
    //             color: COLORS.white,
    //             duration: 1500,
    //              style: { height: 150, alignItems: 'flex-end' },
    //         });
    //     }
    //     setLoading(false);
    // };

    const renderMetricCard = (cardItem, index, sectionTitle, onPress) => {
        const theme = getAuditMetricTheme(cardItem?.category);
        const subtitle = getMetricSubtitle(cardItem?.category);

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                key={`${sectionTitle}-${index}`}
                onPress={onPress}
                style={[styles.metricCard, AuditShadows.metric]}>
                <View style={styles.metricCardBody}>
                    <View style={styles.metricTopRow}>
                        {!!cardItem.images && (
                            <View style={[styles.iconContainer, { backgroundColor: theme.iconBg }]}>
                                <ImageComponent
                                    style={styles.metricIconImage}
                                    source={cardItem.images}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            </View>
                        )}
                        <Text numberOfLines={1} style={styles.metricTitle}>
                            {cardItem.category?.replace(/\n/g, ' ')}
                        </Text>
                    </View>

                    {cardItem?.status === undefined || cardItem?.status === null ? (
                        <ActivityIndicator size="small" color={theme.accent} style={styles.metricLoader} />
                    ) : (
                        <Text numberOfLines={1} style={[styles.metricValue, { color: theme.accent }]}>
                            {cardItem?.status}
                        </Text>
                    )}

                    <Text numberOfLines={1} style={styles.metricSubtitle}>
                        {subtitle}
                    </Text>
                </View>

                <View style={[styles.metricAccentBar, { backgroundColor: theme.borderColor }]} />
            </TouchableOpacity>
        );
    };

    const renderModuleSection = ({ sectionKey, title, items, onMetricPress }) => {
        const visibleItems = (items || []).filter(item => item?.category?.length);
        if (!visibleItems.length) return null;

        const expanded = isSectionExpanded(sectionKey);
        const total = sumMetricTotal(visibleItems);

        return (
            <View key={sectionKey} style={[styles.moduleCard, AuditShadows.card]}>
                <TouchableOpacity activeOpacity={0.85} style={styles.moduleCardHeader} onPress={() => toggleSection(sectionKey)}>
                    <View style={styles.moduleIconCircle}>
                        <ImageComponent
                            style={styles.moduleIconImage}
                            source={getModuleIcon(title)}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>
                    <View style={styles.moduleHeaderText}>
                        <Text numberOfLines={2} style={styles.moduleTitle}>
                            {title?.replace(/\n/g, ' ')}
                        </Text>
                        <Text style={styles.totalBadgeText}>{getTotalBadgeLabel(title, total)}</Text>
                    </View>
                    <IconComponent
                        name={expanded ? 'down' : 'right'}
                        type={ICON_TYPE.AntDesign}
                        size={RFPercentage(2.2)}
                        color={AuditColors.textSecondary}
                    />
                </TouchableOpacity>

                {expanded ? (
                    <View style={styles.statsGrid}>
                        {chunkIntoRows(visibleItems, GRID_COLUMNS).map((row, rowIndex) => (
                            <View
                                key={`${sectionKey}-row-${rowIndex}`}
                                style={[styles.metricsRow, rowIndex > 0 && styles.metricsRowSpacing]}>
                                {row.map((item, index) =>
                                    renderMetricCard(item, rowIndex * GRID_COLUMNS + index, sectionKey, () =>
                                        onMetricPress(item, rowIndex * GRID_COLUMNS + index),
                                    ),
                                )}
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>
        );
    };

    const Item = ({ title, detail }) => {
        if (title === strings.supplierMgnt) {
            const filtered = detail?.filter(group => {
                const cleanTitle = group.groupTitle?.replace(/\n/g, ' ').trim();
                return ['Supplier Initial Assessment', 'Supplier Routine Audit'].includes(cleanTitle);
            });

            return (
                <View>
                    {filtered?.map((group, idx) =>
                        renderModuleSection({
                            sectionKey: `${title}-${idx}`,
                            title: group.groupTitle,
                            items: group.audits,
                            onMetricPress: audit =>
                                handleNavigation(
                                    title,
                                    audit?.navStatus ?? audit?.status,
                                    audit?.category,
                                    audit?.auditTitle,
                                    audit?.routeName,
                                    undefined,
                                    group?.groupTitle,
                                ),
                        }),
                    )}
                </View>
            );
        }

        return renderModuleSection({
            sectionKey: title,
            title,
            items: detail,
            onMetricPress: items =>
                handleNavigation(
                    title,
                    items?.navStatus ?? items?.status,
                    items?.category,
                    items?.auditTitle,
                    items?.routeName,
                    undefined,
                    undefined,
                    items?.status,
                ),
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {loading ? (
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={loading}
                    onRequestClose={() => {
                        console.log('close modal');
                    }}>
                    <View style={styles.modalBackground}>
                        <Bubbles size={10} color="#12C0CF" />
                    </View>
                </Modal>
            ) : null}

            <View style={[styles.searchContainer, AuditShadows.search]}>
                <TouchableOpacity activeOpacity={0.8} style={styles.filterSearchIconButton} onPress={() => filterInputRef?.current?.focus?.()}>
                    <IconComponent type={ICON_TYPE.FontAwesome} name="search" size={RFPercentage(2.9)} color={AuditColors.primary} />
                </TouchableOpacity>
                <TextInput
                    ref={filterInputRef}
                    value={filterText}
                    onChangeText={setFilterText}
                    placeholder="Search modules (e.g., audit, concern)"
                    style={styles.filterInput}
                    placeholderTextColor={AuditColors.textSecondary}
                />
                {filterText.length > 0 && (
                    <TouchableOpacity style={styles.filterClearBtn} onPress={() => setFilterText('')}>
                        <IconComponent type={ICON_TYPE.FontAwesome} name="times-circle" size={RFPercentage(1.9)} color={AuditColors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {filteredDataSet?.length > 0 ? (
                <FlatList
                    data={filteredDataSet}
                    renderItem={({ item }) => (item?.title === null ? null : <Item detail={item?.detail} title={item?.title} />)}
                    keyExtractor={item => String(item?.id)}
                    contentContainerStyle={styles.listContentContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <NoRecordFound />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AuditColors.background,
        position: 'relative',
    },
    moduleCard: {
        backgroundColor: AuditColors.white,
        borderRadius: AuditLayout.moduleCardRadius,
        padding: AuditLayout.moduleCardPadding,
        marginHorizontal: AuditLayout.screenHorizontal,
        marginTop: AuditLayout.sectionGap,
    },
    moduleCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moduleIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    moduleIconImage: {
        width: 24,
        height: 24,
    },
    moduleHeaderText: {
        flex: 1,
        paddingRight: 12,
    },
    moduleTitle: {
        ...AuditTypography.title,
        color: AuditColors.textPrimary,
    },
    totalBadgeText: {
        ...interText(InterFont.medium),
        marginTop: 4,
        fontSize: 15,
        color: '#123C95',
        fontWeight:'bold'
    },
    statsGrid: {
        marginTop: 20,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: AuditLayout.cardGap,
    },
    metricsRowSpacing: {
        marginTop: AuditLayout.cardGap,
    },
    metricCard: {
        flex: 1,
        flexBasis: 0,
        backgroundColor: AuditColors.white,
        borderRadius: AuditLayout.metricCardRadius,
        minHeight: AuditLayout.metricCardMinHeight,
        overflow: 'hidden',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: AuditColors.border,
    },
    metricCardBody: {
        flex: 1,
        padding: AuditLayout.metricCardPadding,
        paddingBottom: 10,
    },
    metricTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: AuditLayout.metricIconCircle,
    },
    metricAccentBar: {
        width: '100%',
        height: AuditLayout.metricCardBottomBorder,
    },
    iconContainer: {
        width: AuditLayout.metricIconCircle,
        height: AuditLayout.metricIconCircle,
        borderRadius: AuditLayout.metricIconCircle / 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        flexShrink: 0,
    },
    metricIconImage: {
        width: 16,
        height: 16,
    },
    metricTitle: {
        ...AuditTypography.metricTitle,
        color: AuditColors.textPrimary,
        flex: 1,
        minWidth: 0,
        textAlign: 'left',
    },
    metricLoader: {
        alignSelf: 'flex-start',
        marginTop: 10,
    },
    metricValue: {
        ...AuditTypography.metricValue,
        marginTop: 8,
        textAlign: 'left',
        alignSelf: 'flex-start',
        includeFontPadding: false,
    },
    metricSubtitle: {
        ...AuditTypography.metricSubtitle,
        color: AuditColors.textPrimary,
        marginTop: 4,
        textAlign: 'left',
        alignSelf: 'flex-start',
        includeFontPadding: false,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        height: '50%',
    },
    listContentContainer: {
        paddingBottom: SPACING.XX_LARGE,
    },
    searchContainer: {
        minHeight: 66,
        borderRadius: 34,
        backgroundColor: AuditColors.white,
        marginHorizontal: AuditLayout.screenHorizontal,
        marginTop: AuditLayout.sectionGap,
        paddingLeft: 10,
        paddingRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEF2F8',
    },
    filterSearchIconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF4FF',
        marginRight: 12,
    },
    filterInput: {
        ...interText(InterFont.regular),
        flex: 1,
        height: 58,
        fontSize: 16,
        color: AuditColors.textSecondary,
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    filterClearBtn: {
        paddingHorizontal: 8,
        paddingVertical: SPACING.SMALL,
    },
});

export default TabsCard;
