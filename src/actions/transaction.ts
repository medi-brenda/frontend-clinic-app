import { i18n } from "i18next";
import { verifyQrCode, verifyPhysicalCard as verifyPhysicalCardApi } from "../services/verify";
import { checkModifyToken, physicalCardPay, qrPay } from '../services/modify';
import { getRecords as getRecordsApi, getRecord as getRecordApi } from '../services/clinic';
import { refund as refundApi } from '../services/refund';
import { Stores } from "../stores"
import * as _ from 'lodash';
import moment from 'moment';

type ScanQrCode = {
    stores: Stores,
    navigation: any,
    qrCode: string,
    i18n: i18n
}

type Pay = {
    stores: Stores,
    navigation: any,
    i18n: i18n
}

type VerifyPhysicalCard = {
    stores: Stores,
    navigation: any,
    i18n: i18n,
    insurerId: string,
    policyNo: string
}

type GetRecords = {
    stores: Stores,
    navigation: any,
    i18n: i18n,
    startDate?: Date,
    endDate?: Date
}

type GetRecord = {
    stores: Stores,
    i18n: i18n,
    recordId: number
}

type Refund = {
    stores: Stores,
    navigation: any,
    i18n: i18n,
    password: string
}

const scanVerifyQrCode = async ({ stores, navigation, qrCode, i18n }: ScanQrCode) => {
    const { token, clinicId } = stores.appStore;
    const { values, setValues } = stores.dataStore;
    const resp = await verifyQrCode({
        qrCode,
        token,
        clinicId,
        benefitCode: values.benefitCode,
        doctorId: values.doctorId,
        i18n
    });
    setValues(_.assign(values, resp));
    navigation.navigate('VerifyUserDetail')
}

const scanModifyQrCode = async ({ stores, navigation, qrCode, i18n }: ScanQrCode) => {
    const { values, setValues } = stores.dataStore;
    checkModifyToken(qrCode,i18n);
    setValues(_.assign(values, {
        token: qrCode
    }));
    navigation.navigate('SelectDiagnosis')
}

export const scanQrCode = async ({ stores, navigation, qrCode, i18n }: ScanQrCode) => {
    try {
        const { currentTab } = stores.appStore;
        if (currentTab === 'Verify') {
            return await scanVerifyQrCode({ stores, navigation, qrCode, i18n });
        }
        else if (currentTab === 'Modify') {
            return await scanModifyQrCode({ stores, navigation, qrCode, i18n });
        }
    }
    catch (error) {
        return error.message;
    }
}

export const pay = async ({ stores, navigation, i18n }: Pay) => {
    try {
        const { token } = stores.appStore;
        const { method, values, setValues } = stores.dataStore;
        let resp;
        switch (method) {
            case 'PhysicalCard':
                resp = await physicalCardPay({ stores, values, i18n, token });
                break;
            default:
                resp = await qrPay({ stores, values, i18n, token });
        }
        setValues(_.assign(values, resp));
        return {
            success: true
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

export const verifyPhysicalCard = async ({ stores, navigation, i18n, insurerId, policyNo }: VerifyPhysicalCard) => {
    try {
        const { token, clinicId, currentTab } = stores.appStore;
        const { method, values, setValues } = stores.dataStore;

        const resp = await verifyPhysicalCardApi({
            insurerId,
            policyNo,
            clinicId,
            benefitCode: values.benefitCode,
            doctorId: values.doctorId,
            i18n,
            token
        });

        setValues(_.assign(
            values,
            resp,
            {
                insurerId,
                policyNumber: policyNo
            }
        ));

        if (currentTab === 'Verify') {
            navigation.navigate('VerifyUserDetail');
        }
        else {
            navigation.navigate('SelectDiagnosis');
        }
    } catch (error) {
        return error.message;
    }
}

export const getRecords = async ({ stores, navigation, i18n, startDate, endDate }: GetRecords) => {
    try {
        const { clinicId, token } = stores.appStore;
        const { setRecords } = stores.dataStore;
        const records = await getRecordsApi({ clinicId, token, startDate, endDate, i18n });
        setRecords(_.reverse(records));
    } catch (error) {
        return error.message;
    }
}

export const getRecord = async ({ stores, i18n, recordId }: GetRecord) => {
    try {
        const { clinicId, token } = stores.appStore;
        const { setRecord } = stores.dataStore;
        const record = await getRecordApi({ clinicId, token, recordId, i18n });
        setRecord(record);
    } catch (error) {
        return error.message;
    }
}

export const refund = async ({ stores, i18n, navigation, password }: Refund) => {
    try {
        const { clinicId, token } = stores.appStore;
        const { record } = stores.dataStore;
        const { verifyType, voucher, transactionTime } = record;
        await refundApi({
            clinicId,
            token,
            verifyType,
            voucher,
            password,
            i18n
        });

        // update the list
        await getRecords({ stores, navigation, i18n, startDate: moment(transactionTime).toDate(), endDate: moment(transactionTime).toDate() });
    } catch (error) {
        return error.message;
    }
}
