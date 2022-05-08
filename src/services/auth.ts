import { requestPhp } from '../utils/request'
import * as _ from 'lodash';
import { validateEmail, validatePass, validateName, validatePhone, validateBankAccountNumber, validateClinicName, validateRegion, validateDistrict, validateGender, validateMedicalServices, validateAuthority, validateDocCert, validateConsulatation } from '../utils/validate';
import { RegistrationForm } from '../models/registrationForm';
import { Doctor } from '../models/doctor';
import { Schedule } from '../models/schedule';
import { Consultation } from '../models/consultation';
import { Platform } from 'react-native';
import Config from '../utils/config';
import Axios from 'axios';

type CheckOperationPassword = {
    clinicId: string,
    token: string,
    password: string
};

type Login = {
    username: string,
    password: string
}

export const validateStep1Data = (data: RegistrationForm): boolean => {
    return validateEmail(data.email) &&
        validatePass(data.password) &&
        validatePass(data.operationPassword) &&
        validateName(data.name) &&
        validatePhone(data.phoneNumber) &&
        validateBankAccountNumber(data.accountNumber) &&
        validateName(data.bankAccountName) &&
        data.bankID?.length > 0 && data.comCert ? true : false
}

export const validateStep2Data = (data: RegistrationForm): boolean => {
    return validateClinicName(data.clinicNameEn) &&
        validateClinicName(data.clinicNameChi) &&
        validateClinicName(data.clinicAddressEn) &&
        validateClinicName(data.clinicAddressChi) &&
        validateRegion(data.region) &&
        validateDistrict(data.district) &&
        validatePhone(data.clinicPhone) ?  true : false
}

export const validateStep3Data = (data: RegistrationForm): boolean => {
    return data.doctors.length ? true : false
}

export const validateDoctor = (doctor: Doctor): boolean => {
    return validateName(doctor.nameChi) &&
        validateName(doctor.nameEn) &&
        validateGender(doctor.gender) &&
        validateMedicalServices(doctor.medicalServices) &&
        validateAuthority(doctor.authority) &&
        validateDocCert(doctor.docCert) &&
        validateConsulatation(doctor.consultations) ? true : false
}

const scheduleToPostData = (schedules: Schedule[]) => {
    return _.flatten(schedules
        .filter(schedule => !schedule.closed)
        .map((schedule, index) => schedule.workingHours.map((workingHour, wIndex) => ({
            day: index,
            time_begin: `${workingHour.from.h}${workingHour.from.m}`,
            time_end: `${workingHour.to.h}${workingHour.to.m}`,
        }))));
}

const consultationToPostData = (consultations: Consultation[]) => {
    return consultations.map((consultation, index) => ({
        benefit: consultation.benefit,
        insurer: consultation.insurer,
        doctorFee: consultation.price
    }));
}

const doctorsToPostData = (doctors: Doctor[]) => {
    return doctors.map((doctor, index) => ({
        fileId: index,
        doctorNameEn: doctor.nameEn,
        doctorNameChi: doctor.nameChi,
        gender: doctor.gender,
        speciality: doctor.medicalServices,
        registrationAuthority: doctor.authority,
        insurerOptions: consultationToPostData(doctor.consultations),
        doctorServiceHours: scheduleToPostData(doctor.schedules)
    }));
}

const uriToPostData = (uri: string) => {
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    return {
        uri: uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
    };
}

export const register = async (data: RegistrationForm) => {
    const myHeaders = {
        'Content-Type': 'multipart/form-data',
    };

    const formdata = new FormData();
    formdata.append('email', data.email);
    formdata.append('password', data.password);
    formdata.append('operationPassword', data.operationPassword);
    formdata.append('contactPerson', data.name);
    formdata.append('contactPhone', data.phoneNumber);
    formdata.append('bankAccountNumber', data.accountNumber);
    formdata.append('bankAccountName', data.bankAccountName);
    formdata.append('bankCode', data.bankID);
    formdata.append('clinicNameEn', data.clinicNameEn);
    formdata.append('clinicNameChi', data.clinicNameChi);
    formdata.append('clinicAddressEn', data.clinicAddressEn);
    formdata.append('clinicAddressChi', data.clinicAddressChi);
    formdata.append('region', data.region);
    formdata.append('district', data.district);
    formdata.append('clinicPhone1', data.clinicPhone);
    if (data.clinicPhone2) {
        formdata.append('clinicPhone2', data.clinicPhone2);
    }
    if (data.clinicFax) {
        formdata.append('clinicFax1', data.clinicFax);
    }

    formdata.append(
        'clinicServiceHours',
        JSON.stringify(scheduleToPostData(data.schedules))
    );
    formdata.append(
        'doctors',
        JSON.stringify(doctorsToPostData(data.doctors))
    );

    formdata.append('businessCert', uriToPostData(data.comCert));

    data.doctors.forEach((doctor, index) => {
        formdata.append(
            'doctorPracticeCert[]',
            uriToPostData(doctor.docCert)
        );
    });

    let respData: any;
    if (Platform.OS === 'ios') {
        const resp = await fetch(
            `${Config.phpUrl}api/register.php`,
            {
                method: 'POST',
                headers: myHeaders,
                body: formdata
            }
        );
        respData = resp.json();
    }
    else {
        respData = await Axios.post(
            `${Config.phpUrl}api/register.php`,
            formdata,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );
    }

    if (!respData || ['0008', '0000'].indexOf(respData.data.result) === -1) {
        throw new Error('Register.RegisterFail');
    }
    else if (respData.data.result === '0008') {
        throw new Error('Register.EmailRegistered');
    }
}

export const forgetPassword = async (email: string) => {
    if (!validateEmail(email)) {
        throw new Error('Register.ST51');
    }

    const resp = await requestPhp({
        url: 'api/forgetPassword.php',
        data: { email }
    });

    return resp.result === '0000';
}

export const checkOperationPassword = async ({ password, clinicId, token }: CheckOperationPassword) => {
    await requestPhp({
        url: 'api/authenticateOperation.php',
        data: {
            clinic_id: clinicId,
            token,
            operationPassword: password
        }
    });

    return true;
}

export const login = async ({ password, username }: Login) => {
    const resp = await requestPhp({
        url: 'api/authenticate.php',
        data: {
            username,
            password,
        }
    });

    return {
        clinicId: resp.clinic_id,
        token: resp.token
    }
}