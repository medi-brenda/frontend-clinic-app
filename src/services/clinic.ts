import {newOption, Option} from "../models/option";
import { request, requestPhp } from "../utils/request"
import * as _ from 'lodash';
import { newMethod, Setting } from "../models/setting";
import { newRecord } from "../models/record";
import moment from 'moment';
import { newPersonalProfile } from "../models/personalProfile";
import { newClinic } from "../models/clinic";
import { Schedule, Period } from "../models/schedule";
import { DoctorProfile, newDoctorProfile } from "../models/doctor";
import { i18n } from "i18next";
import Config from '../utils/config';
import { Diagnosis } from "../models/diagnosis";
import { Insurer, newInsurer } from "../models/insurer";
import {PendingItem} from "../models/pendingItem";

type GetDoctors = {
    token: string,
    clinicId: string,
    benefitCode: string
}

type GetDoctorsByClinicInsurerBenefit = {
    token: string,
    clinicId: string,
    insurerId: string,
    benefitCode: string
}

type GetSettings = {
    token: string,
    clinicId: string,
    i18n: i18n
}

type GetDiagnosis = {
    insurer?: Insurer,
    payToken?: string,
    token: string,
    search: string,
    i18n: i18n
}

type GetInsurers = {
    token: string,
    i18n: i18n
}

type GetInsurersByClinic = {
    token: string,
    clinicId: string
}

type GetRecords = {
    token: string,
    clinicId: string,
    startDate?: Date,
    endDate?: Date,
    i18n: i18n
}

type GetRecord = {
    token: string,
    clinicId: string,
    recordId: number,
    i18n: i18n
}

type DownloadReport = {
    token: string,
    clinicId: string,
    year: number,
    month: number
}

type GetProfile = {
    token: string,
    clinicId: string,
}

type GetDoctorProfile = {
    token: string,
    clinicId: string,
    doctor: DoctorProfile
}

type SaveSettings = {
    token: string,
    clinicId: string,
    settings: Setting,
    i18n: i18n
}

type ChangePassword ={
    token: string,
    clinicId: string,
    oldPassword: string,
    newPassword: string,
    i18n: i18n

}

type GetDoctorInsurers = {
    token: string,
    doctorId: string,
    i18n: i18n
}

export const getDoctors = async ({ token, clinicId, benefitCode }: GetDoctors): Promise<Option[]> => {
    const resp = await requestPhp({
        url: 'api/getDoctorsWithBenefitsInClinic.php',
        data: {
            token,
            clinic_id: clinicId,
            benefit: benefitCode
        }
    });

    return _.map(resp.data, option => ({
        code: option.doctor_id,
        nameEn: option.name_en,
        nameChi: option.name_cn
    }));
}

export const getDoctorsByClinicInsurerBenefit = async ({ token, clinicId, insurerId, benefitCode }: GetDoctorsByClinicInsurerBenefit): Promise<Option[]> => {
    const resp = await requestPhp({
        url: 'api/getDoctorsByClinicInsurerBenefit.php',
        data: {
            token,
            clinic_id: clinicId,
            insurer_id: insurerId,
            benefit_code: benefitCode
        }
    });

    return _.map(resp.data, option => ({
        code: option.doctor_id,
        nameEn: option.name_en,
        nameChi: option.name_cn
    }));
}

export const getSettings = async ({ token, clinicId, i18n }: GetSettings) => {
    const resp = await request({
        url: 'settings',
        data: {
            clinic_id: Number(clinicId)
        },
        token,
        i18n
    });

    return {
        method: newMethod({
            physicalCard: Number(resp.card_status) === 1 && Config.method.physicalCard
        }),
        displayIncome: Number(resp.display_income_from_network) === 1
    };
}

export const getDiagnosis = async ({ token, payToken, search, i18n, insurer }: GetDiagnosis): Promise<Diagnosis[]> => {
    const icd = _.get(insurer, 'icd', _.startsWith(payToken, 'PCLL') ? 10 : 9);
    const data = await request({
        url: 'getDiagnosis',
        data: {
            icd,
            search
        },
        token,
        i18n
    });

    return _.map(data.diagnosis, diagnosis => ({
        id: diagnosis.diagnosis_id,
        code: diagnosis.code,
        nameChi: diagnosis.name_cn,
        nameEn: diagnosis.name_en
    }));
}

export const getInsurers = async ({ token, i18n }: GetInsurers): Promise<Insurer[]> => {
    let { insurers } = await request({
        url: 'insurers',
        token,
        i18n
    });

    return _.map(insurers, option => newInsurer({
        code: option.insurer_id,
        icd: option.icd,
        name: option.name,
        physicalCard: option.support_medical_card === 'T',
        physicalCardImg: `${Config.publicUrl}admin-portal/${option.physical_card_image}`,
        physicalCardDesc: {
            nameChi: _.get(option, 'physical_card_description_cn', ''),
            nameEn: _.get(option, 'physical_card_description_en', '')
        },
        nameEn: option.description_en,
        nameChi: option.description_cn,
        shouldInputPayToken:option.should_input_pay_token
    }));
}

export const getInsurersByClinic = async ({ token, clinicId }: GetInsurersByClinic): Promise<Insurer[]> => {
    let { data } = await requestPhp({
        url: 'api/getInsurersByClinic.php',
        data: {
            token,
            //i18n, //requestPhp doesnt need i18n
            clinic_id: clinicId
        }
    });


    return _.map(data, option => newInsurer({
        code: option.insurer_id,
        icd: option.icd,
        name: option.name,
        physicalCard: option.support_medical_card === 'T',
        physicalCardImg: `${Config.publicUrl}admin-portal/${option.physical_card_image}`,
        physicalCardDesc: {
            nameChi: _.get(option, 'physical_card_description_cn', ''),
            nameEn: _.get(option, 'physical_card_description_en', '')
        },
        nameEn: option.description_en,
        nameChi: option.description_cn,
        shouldInputPayToken:option.should_input_pay_token
    }));
}

export const getRecords = async ({ token, clinicId, startDate, endDate, i18n }: GetRecords) => {
    const resp = await request({
        url: startDate ? 'records/getByDate' : 'records/getAll',
        data: {
            clinicId,
            startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : undefined,
            endDate: startDate ? moment(endDate).format('YYYY-MM-DD') : undefined
        },
        token,
        i18n
    });

    return _.map(resp.data, data => newRecord(data)).sort((a, b) => moment(a.transactionTime).diff(moment(b.transactionTime)));
}

export const getRecord = async ({ token, clinicId, recordId, i18n }: GetRecord) => {
    const resp = await request({
        url: 'records/getById',
        data: {
            token,
            clinicId,
            recordId
        },
        token,
        i18n
    });

    return newRecord(resp.data);
}

export const downloadReport = async ({ token, clinicId, year, month }: DownloadReport) => {
    const resp = await requestPhp({
        url: 'api/getReport.php',
        data: {
            clinic_id: clinicId,
            token,
            type: 'email',
            year,
            month
        }
    });
}

export const getPersonalProfile = async ({ token, clinicId }: GetProfile) => {
    const { data } = await requestPhp({
        url: 'api/getPersonalProfile.php',
        data: {
            clinic_id: clinicId,
            token
        }
    });

    return newPersonalProfile({
        email: data.email,
        cantactPerson: data.contact_person,
        phone: data.contact_phone,
        bankCode: data.bank_code,
        bankAccount: data.bank_account
    })
}

const formatHm = (date: string): Period => {
    if (date.length !== 3 && date.length !== 4) {
        return { h: 0, m: 0 };
    }
    const hourEndPosition = date.length === 3 ? 1 : 2;
    return {
        h: Number(date.substring(0, hourEndPosition)),
        m: Number(date.slice(hourEndPosition)),
    }
}

const formatSchedule = (data: any[]): Schedule[] => {
    const resp: Schedule[] = [
        {
            workingHours: [],
            closed: true
        },
        {
            workingHours: [],
            closed: true
        },
        {
            workingHours: [],
            closed: true
        },
        {
            workingHours: [],
            closed: true
        },
        {
            workingHours: [],
            closed: true
        },
        {
            workingHours: [],
            closed: true
        },
        {
            workingHours: [],
            closed: true
        },
        {
            workingHours: [],
            closed: true
        }
    ];

    _.forEach(data, obj => {
        resp[obj.day_code].workingHours.push({
            from: formatHm(obj.time_begin),
            to: formatHm(obj.time_end)
        });
    });

    _.forEach(resp, obj => {
        obj.closed = obj.workingHours.length ? false : true
    });

    return resp;
}

export const getClinicProfile = async ({ token, clinicId }: GetProfile) => {
    const { data } = await requestPhp({
        url: 'api/getClinicProfile.php',
        data: {
            clinic_id: clinicId,
            token
        }
    });

    return newClinic({
        clinicNameEn: data.clinic_name_en,
        clinicNameChi: data.clinic_name_cn,
        addressEn: data.address_en,
        addressChi: data.address_cn,
        districtNameEn: data.district_name_en,
        districtNameChi: data.district_name_cn,
        regionNameEn: data.region_name_en,
        regionNameChi: data.region_name_cn,
        phone: data.clinic_phone_1,
        phone2: data.clinic_phone_2 || 'N/A',
        fax: data.clinic_fax_1 || 'N/A',
        schedules: formatSchedule(data.service_hour)
    })
}

export const getAllDoctors=async({token,clinicId}:GetProfile):Promise<Option[]>=>{
    const { data } = await requestPhp({
        url: 'api/getClinicDoctor.php',
        data: {
            clinic_id: clinicId,
            token
        }
    });

    return _.map(data,obj=>{
        return newOption({
            code:obj.doctor_id,
            nameEn: obj.name_en,
            nameChi: obj.name_cn,
        })
    });
}


export const getDoctorList = async ({ token, clinicId }: GetProfile) => {
    const { data } = await requestPhp({
        url: 'api/getClinicDoctor.php',
        data: {
            clinic_id: clinicId,
            token
        }
    });

    return _.map(data, obj => newDoctorProfile({
        id: obj.doctor_id,
        nameEn: obj.name_en,
        nameChi: obj.name_cn,
        gender: obj.gender,
        speciality: _.map(obj.speciality, obj2 => ({
            code: obj2.benefit_code,
            nameEn: obj2.name_en,
            nameChi: obj2.name_cn
        })),
        authorityEn: obj.authority_name_en,
        authorityChi: obj.authority_name_cn,
        schedules: formatSchedule(obj.service_hour),
        status: obj.active_status
    }))
}

export const getDoctorProfile = async ({ token, clinicId, doctor }: GetDoctorProfile): Promise<DoctorProfile> => {
    const { data } = await requestPhp({
        url: 'api/getDoctorDetail.php',
        data: {
            token,
            doctor_id: doctor.id,
            clinic_id: clinicId
        }
    });

    const benefits = _.map(data.benefits, benefit => ({
        benefitCode: benefit.benefit_code,
        insurerId: benefit.insurer_id,
        doctorCode: benefit.doctor_code,
        doctorFee: benefit.doctor_fee,
        location: benefit.location_code,
        insurer: {
            nameChi: benefit.description_cn,
            nameEn: benefit.description_en
        }
    }));
    return newDoctorProfile(_.assign(doctor, { benefits }));
}

export const saveSettings = async ({ token, clinicId, i18n, settings }: SaveSettings) => {
    const { data } = await request({
        url: 'settings/update',
        data: {
            clinic_id: Number(clinicId),
            display_income_from_network: settings.displayIncome ? 1 : 0,
            card_status: settings.method.physicalCard ? 1 : 0
        },
        token,
        i18n
    });
}

export const changePassword = async ({ clinicId, oldPassword, newPassword,token,i18n }: ChangePassword) => {
    const resp= await request({
        url: 'changePassword',
        data: {
            clinic_id : clinicId,
            oldPassword: oldPassword,
            newPassword: newPassword,
        },
        token,
        i18n
    });
    return resp.data;
}



export const getDoctorInsurers = async ({ token, doctorId, i18n }: GetDoctorInsurers): Promise<string[]> => {
    let { insurers } = await request({
        url: 'insurers',
        data: {
            doctor_id: doctorId
        },
        token,
        i18n
    });
    return _.map(insurers, 'insurer_id');
}


