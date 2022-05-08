import { request } from "../utils/request";
import * as _ from 'lodash';
import { i18n } from "i18next";

type VerifyQrCode = {
    qrCode: string,
    token: string,
    clinicId: string,
    benefitCode: string,
    doctorId: string,
    i18n: i18n
}

type VerifyPhysicalCard = {
    insurerId: string,
    policyNo: string,
    token: string,
    clinicId: string,
    benefitCode: string,
    doctorId: string,
    i18n: i18n
}

const verifyToken = (qrCode: string) => {
    const prerequisite = _.isString(qrCode) && _.startsWith(qrCode, 'V');
    const appropriateLength = _.startsWith(qrCode, 'VZHP') ? 14 : 12;
    return prerequisite && qrCode.length === appropriateLength
}

export const verifyQrCode = async ({ qrCode, token, clinicId, benefitCode, doctorId, i18n }: VerifyQrCode) => {
    if (!verifyToken(qrCode)) {
        throw new Error(`${i18n.t("Scan.IncorrectCodeFormat")}`);
    }

    const resp = await request({
        url: 'verifyByPendingList',
        data: {
            clinic_id: clinicId,
            doctor_id: doctorId,
            benefit: benefitCode,
            token: qrCode,
            method: {
                verify_type: 'verify_qr'
            }
        },
        token,
        i18n
    });
    return {
        copayment: resp.copayment,
        extraMedLimit: resp.extra_med_limit,
        insurerName: resp.insurer_name,
        member: resp.member,
        referenceLetter: resp.ref_letter,
        token: qrCode,
        insurerDescription:{
            en:resp.insurer_description_en,
            chi:resp.insurer_description_cn
        }
    };
}

export const verifyPhysicalCard = async ({ insurerId, policyNo, token, clinicId, benefitCode, doctorId, i18n }: VerifyPhysicalCard) => {
    const data = await request({
        url: 'verifyByPendingList',
        data: {
            clinic_id: Number(clinicId),
            doctor_id: Number(doctorId),
            benefit: benefitCode,
            insurer_id: Number(insurerId),
            method: {
                verify_type: 'verify_card'
            },
            member_key: policyNo
        },
        token,
        i18n
    });

    return {
        copayment: data.copayment,
        extraMedLimit: data.extra_med_limit,
        member: data.policy_number,
        referenceLetter: data.ref_letter.toString(),
        patientName: data.patient_name,  
        insurerDescription:{
            en: data.insurer_description_en,
            chi: data.insurer_description_cn
        }
    }
}
