import * as _ from 'lodash';
import {Option} from './option';
import {ExtraMed} from "./extraMed";

export type BenefitDesc={
    descChi:string,
    descEn:string
};

export type PendingItem = {
    id: number,
    insurerId: number,
    benefitCode:string,
    benefitDesc:BenefitDesc,
    doctor: Option,
    patientName:string,
    verifyTime: string,
    verifyType: number,
    copayment:string,
    extraMedLimit:number,
    extraMed:ExtraMed[],
    patientId:string
};

export function newPendingItem(data?:Partial<PendingItem>):PendingItem{
    return _.assign({
        id: 0,
        insurerId: 0,
        benefitCode:'',
        benefitDesc: {
            descChi:'',
            descEn:''
        },
        doctor: {
            code: 0,
            nameEn: '',
            nameChi: ''
        },
        patientName:'',
        verifyTime: 'string',
        verifyType: 0,
        copayment:0,
        extraMedLimit:0,
        extraMed:[],
        patientId:''
    },data)
}
