import * as _ from 'lodash';
import { Option } from './option';

type Diagnosis = {
    id: number,
    code: string,
    nameEn: string,
    nameChi: string
}

type ExtraMed = {
    code: string,
    price: number
}

type Doctor = {
    code: number,
    nameEn: string,
    nameChi: string
}

export type Record = {
    id: number,
    voucher: string,
    insurerId: number,
    benefitCode: string,
    token: string,
    memberId: string,
    verifyTime: string,
    transactionTime: string,
    refundTime: string,
    doctor: Option,
    serviceType: Option,
    doctorFee: string,
    diagnosis: Diagnosis[],
    feeSum: string,
    extraMed: ExtraMed[],
    extraMedFee: string,
    extraMedFromNetwork: string,
    extraMedLimit: string,
    copaymentFee: string,
    status: number,
    signature: string,
    verifyType: number,
}
export function newRecord(data?: Partial<Record>): Record {
    return _.assign({
        id: 0,
        voucher: '',
        insurerId: 0,
        benefitCode: '',
        token: '',
        memberId: '',
        verifyTime: '',
        transactionTime: '',
        refundTime: '',
        doctor: {
            code: 0,
            nameEn: '',
            nameChi: ''
        },
        doctorFee: '',
        serviceType: '',
        diagnosis: _.get(data, 'diagnosis', []),
        feeSum: '',
        extraMed: _.get(data, 'extraMed', []),
        extraMedFee: '',
        extraMedFromNetwork: '',
        extraMedLimit: '',
        copaymentFee: '',
        status: 0,
        signature: '',
        verifyType: 0,
    }, data);
}
