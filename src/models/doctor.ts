import { Consultation, newConsultation } from "./consultation";
import { Option } from "./option";
import { newSchedules, Schedule } from "./schedule";
import * as _ from 'lodash';

export type Doctor = {
    nameEn: string,
    nameChi: string,
    gender: string,
    medicalServices: string[],
    authority: string,
    regNo: number,
    docCert: string,
    consultations: Consultation[],
    schedules: Schedule[],
}

export function newDoctor(data?: Partial<Doctor>) {
    return _.assign({
        nameEn: '',
        nameChi: '',
        gender: '',
        medicalServices: [],
        authority: '',
        regNo: 0,
        docCert: '',
        consultations: [newConsultation()],
        schedules: newSchedules()
    }, data);
}

export type DoctorProfileBenefit = {
    benefitCode: string,
    insurerId: string,
    doctorCode: string,
    doctorFee: string,
    location: string
    insurer: {
        nameChi: string,
        nameEn: string
    }
}

export type DoctorProfile = {
    id: string,
    nameEn: string,
    nameChi: string,
    gender: string,
    authorityEn: string,
    authorityChi: string,
    regNo: number,
    docCert: string,
    consultations: Consultation[],
    schedules: Schedule[],
    speciality?: Option[],
    benefits?: DoctorProfileBenefit[],
    status: string
}

export function newDoctorProfile(data?: Partial<DoctorProfile>): DoctorProfile {
    return _.assign({
        id: '',
        nameEn: '',
        nameChi: '',
        gender: '',
        speciality: [],
        authorityEn: '',
        authorityChi: '',
        regNo: 0,
        docCert: '',
        consultations: [newConsultation()],
        schedules: newSchedules(),
        status: '',
        benefits: []
    }, data);
}