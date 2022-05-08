import * as _ from 'lodash';
import { Diagnosis } from './diagnosis';
import { ExtraMed } from './extraMed';
import { InsurerDescription } from './InsurerDescription';

export type Transaction = {
    doctorId: string,
    benefitCode: string,
    benefitName?: string,
    copayment: string,
    extraMedLimit?: number,
    insurerName: string,
    member: string,
    referenceLetter: string,
    token: string,
    payToken?: string, // policy number for physical card
    diagnosis: Diagnosis[]
    extraMed: ExtraMed[],
    policyNumber?: string,
    signature?: string,
    insurerId?: string,
    notice?: string,
    patientId?: string,
    patientName?: string,
    refLetter?: string,
    cardType?: string,
    copaymentFee?: number,
    extraMedFee?: number,
    extraMedFromNetwork?: number,
    feeSum?: number,
    voucher?: string,
    doctorFee?: number,
    transactionTime?: string,
    serviceTypeEn?: string,
    serviceTypeChi?: string,
    memberKey?: string,
    insurerDescription?: InsurerDescription
}

export function newTransaction(transaction?: Partial<Transaction>): Transaction {
    return _.assign({
        doctorId: '',
        benefitCode: '',
        benefitName: '',
        copayment: '',
        insurerName: '',
        member: '',
        referenceLetter: '',
        token: '',
        payToken: '',
        diagnosis: [],
        extraMed: [],
        policyNumber: '',
        signature: '',
        insurerId: '',        
        notice: '',
        patientId: '',
        patientName: '',
        cardType: '',
        copaymentFee: 0,
        extraMedFee: 0,
        extraMedFromNetwork: 0,
        feeSum: 0,
        voucher: '',
        doctorFee: 0,
        transactionTime: '',
        serviceTypeEn: '',
        serviceTypeChi: '',
        memberKey: '',
        insurerDescription:{
            en:'',
            chi:''
        }
    }, transaction);
}
