import { Doctor } from "./doctor"
import { newSchedules, Schedule } from "./schedule"

export type RegistrationForm = {
    schedules: Schedule[],
    email: string,
    password: string,
    operationPassword: string,
    name: string,
    phoneNumber: string,
    bankID: string,
    accountNumber: string,
    bankAccountName: string,
    comCert: string,
    clinicNameEn: string,
    clinicNameChi: string,
    clinicAddressEn: string,
    clinicAddressChi: string,
    clinicPhone: string,
    clinicPhone2: string,
    clinicFax: string,
    region: string,
    district: string,
    doctors: Doctor[]
}

export function newRegistrationForm(): RegistrationForm {
    return {
        email: '',
        password: '',
        operationPassword: '',
        name: '',
        phoneNumber: '',
        bankID: '',
        accountNumber: '',
        bankAccountName: '',
        comCert: '',
        schedules: newSchedules(),
        clinicNameEn: '',
        clinicNameChi: '',
        clinicAddressEn: '',
        clinicAddressChi: '',
        clinicPhone: '',
        clinicPhone2: '',
        clinicFax: '',
        region: '',
        district: '',
        doctors: []
    }
}
