import { call, put } from 'redux-saga/effects';
import CommonServices from './api-services';
import {
    getCommonDataFailure,
    getCommonDataSuccess,
    getCommonServices,
    getCommonServicesFailure,
    getCommonServicesSuccess,
    getCommonTimings,
    getCommonTimingsFailure,
    getCommonTimingsSuccess,
    getOrganizationsFailure,
    getOrganizationsSuccess,
    getSaloonDetailsFailure,
    getSaloonDetailsSuccess,
    updateProfileStatusFailure,
    updateProfileStatusSuccess,
} from './action';
import { getTimingsSuccess } from 'screens/salon-timings/timing.action';
import { DAY_SLOTS } from 'constants/data';
import { getServicesSuccess } from 'screens/salon-services/services.action';
import { getStaffs } from 'screens/salon-staffs/staff.action';
// import SalonServices from 'screens/salon-services/services.serviceAPI';

export function* getCommonDataSaga({ saloonId }) {
    try {
        const res1 = yield put(getCommonServices());
        const res2 = yield put(getCommonTimings());
        const res4 = yield put(getStaffs(saloonId));
        const res3 = yield call(SalonServices.getServices, { saloonId });
        const services =
            (res3?.data || []).map(service => {
                return {
                    ...service,
                    services: (service?.services || []).filter(service => service?.status !== 'deleted'),
                };
            }) || [];
        yield put(getServicesSuccess(services || []));
        yield put(getCommonDataSuccess({ res1, res2, res3, res4 }));
    } catch (e) {
        yield put(getCommonDataFailure(e));
    }
}

export function* getCommonServicesSaga() {
    try {
        const response = yield call(CommonServices.getCommonServices, {});
        yield put(getCommonServicesSuccess(response?.data || []));
    } catch (e) {
        yield put(getCommonServicesFailure(e));
    }
}

export function* getCommonTimingsSaga() {
    try {
        const response = yield call(CommonServices.getCommonTimings, {});
        const type = {
            M: 'Morning',
            A: 'Afternoon',
            E: 'Evening',
        };
        const timingsListTemp = DAY_SLOTS.map(day => {
            return {
                ...day,
                timings: response?.data?.map(timing => {
                    return {
                        ...timing,
                        name: type[timing.type],
                        slots: timing.slots.map(data => {
                            return {
                                ...data,
                                isSelected: false,
                            };
                        }),
                    };
                }),
            };
        });
        yield put(getCommonTimingsSuccess(timingsListTemp || []));
        yield put(getTimingsSuccess(timingsListTemp || []));
    } catch (e) {
        yield put(getCommonTimingsFailure(e));
    }
}

export function* getSaloonDetailsServiceSaga() {
    try {
        const response = yield call(CommonServices.getSaloonDetailsService, {});
        yield put(getSaloonDetailsSuccess(response?.saloon || {}));
    } catch (e) {
        yield put(getSaloonDetailsFailure(e));
    }
}

export function* getOrganizationsSaga() {
    try {
        const { data } = yield call(CommonServices.getOrganizationServices, {});
        yield put(getOrganizationsSuccess(data));
    } catch (e) {
        yield put(getOrganizationsFailure(e));
    }
}

export function* updateProfileStatusSaga({ data }) {
    try {
        yield call(CommonServices.updateProfileStatusService, data);
        yield put(updateProfileStatusSuccess());
    } catch (err) {
        yield put(updateProfileStatusFailure(err));
    }
}
