import {i18n} from 'i18next';
import * as _ from 'lodash';
import {Transaction} from '../models/transaction';
import {Stores} from '../stores';
import {request} from '../utils/request';
import {translate} from '../utils/string';
import {Diagnosis} from '../models/diagnosis';
import {ExtraMed} from '../models/extraMed';
import {findInsurer} from '../utils/common';
import {PendingItem} from "../models/pendingItem";

type Pay = {
    i18n: i18n,
    token: string,
    stores: Stores,
    values: Transaction
}

type GetPendingListItems = {
    token: string,
    clinicId: string,
    i18n: i18n
};

type DeletePendingListItem = {
    token: string,
    clinicId: string,
    pendingItemId: number,
    i18n: i18n
}

export const checkModifyToken = (qrCode: string, i18n:i18n) => {
    if (!_.isString(qrCode) || !_.startsWith(qrCode, 'P') || qrCode.length !== 12) {
        throw new Error(`${i18n.t("Scan.IncorrectCodeFormat")}`);
    }
}

const formatDiagnosis = (diagnosis: Diagnosis[], i18n: i18n) => {
    const result: any = {};
    diagnosis.forEach(d => {
        result[d.id] = `${d.code} - ${translate(d, i18n)}`;
    });
    return result;
}

const formatExtraMed = (extraMed: ExtraMed[], i18n: i18n) => {
    const result: any = {};
    extraMed.forEach(d => {
        result[d.code] = d.price;
    });
    return result;
}

const formatPaymentResp = (data: any) => {
    return {
        copaymentFee: data.copayment_fee,
        extraMedFee: data.extra_med_fee,
        extraMedFromNetwork: data.extra_med_from_network,
        feeSum: data.fee_sum,
        voucher: data.voucher,
        doctorFee: data.doctor_fee,
        transactionTime: data.transaction_time,
        serviceTypeEn: data.service_type_en,
        serviceTypeChi: data.service_type_cn,
        memberKey: data.patient_id
    };
}

const formatPendingListResp = (data: any): PendingItem[] => {
    return _.map(data, item => {
        const benefit = _.get(item, 'benefit');
        const doctor = _.get(item, 'doctor');
        return <PendingItem>{
            id: item.id,
            insurerId: item.insurer_id,
            benefitCode: benefit.code,
            benefitDesc: {
                descChi: benefit.description_cn,
                descEn: benefit.description_en
            },
            doctor: {
                code: doctor.code,
                nameEn: doctor.name_en,
                nameChi: doctor.name_cn
            },
            patientName: item.patient_name,
            verifyTime: item.verify_time,
            verifyType: item.verify_type,
            copayment: item.copayment,
            extraMedLimit: item.extra_med_limit,
            extraMed: item.extra_med,
            patientId:item.patient_id
        }
    })

}

export const physicalCardPay = async ({stores, values, i18n}: Pay) => {
    const {token, clinicId} = stores.appStore;
    const {pendingItem} = stores.dataStore;
    const resp = await request({
        url: 'payCardByPendingList',
        data: {
            clinic_id: clinicId,
            pending_list_id:pendingItem.id,
            diagnosis: formatDiagnosis(values.diagnosis, i18n),
            extra_med: formatExtraMed(values.extraMed, i18n),
            client_signature: values.signature,
        },
        i18n,
        token
    });

    return formatPaymentResp(resp);
}

export const qrPay = async ({stores, values, i18n}: Pay) => {
    const {token, clinicId} = stores.appStore;
    const {insurers} = stores.configStore;
    const {pendingItem} = stores.dataStore;

    const selectedInsurer = findInsurer(insurers, pendingItem.insurerId) !;

    let resp:any;
    if (!selectedInsurer.shouldInputPayToken){
        resp = await request({
            url: 'paySingleQRByPendingList',
            data: {
                clinic_id: clinicId,
                pending_list_id: pendingItem.id,
                diagnosis: formatDiagnosis(values.diagnosis, i18n),
                extra_med: formatExtraMed(values.extraMed, i18n),
            },
            i18n,
            token
        });
    }else{
        resp = await request({
            url: 'payQRByPendingList',
            data: {
                clinic_id: clinicId,
                pending_list_id: pendingItem.id,
                pay_token: values.token,
                diagnosis: formatDiagnosis(values.diagnosis, i18n),
                extra_med: formatExtraMed(values.extraMed, i18n),
            },
            i18n,
            token
        });
    }

    const insurer = insurers.find(insurer => insurer.name === resp.insurer_name);
    return _.assign(
        formatPaymentResp(resp),
        {
            insurerId: insurer?.code
        }
    );
}


/**
 * there is legacy problem to follow so I added token outside the data field.
 * while there is necessary to put the token in the data field for further authentification
 */
export const getPendingListItems = async ({token, clinicId, i18n}: GetPendingListItems): Promise<PendingItem[]> => {
    const {pendingList} = await request({
        url: 'getPendingList',
        data: {
            clinicId
        },
        token,
        i18n
    });


    return formatPendingListResp(pendingList);
}

export const deletePendingListItem = async ({token, clinicId, i18n, pendingItemId}: DeletePendingListItem) => {
    await request({
        url: 'deletePendingItem',
        data: {
            clinicId,
            pendingItemId
        },
        token,
        i18n
    });
}


