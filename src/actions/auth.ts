import {
    validateDoctor, validateStep1Data, validateStep2Data, validateStep3Data, register as registerApi,
    forgetPassword as forgetPasswordApi, checkOperationPassword as checkOperationPasswordApi, login as loginApi
} from "../services/auth";
import { getDistinct, getBanks, getSpecialities, getAuthorities, getInsurers, getAllBenefits, updateNotificationToken } from "../services/app";
import { Stores } from "../stores"
import { newRegistrationForm } from "../models/registrationForm";
import { newDoctor } from "../models/doctor";
import { StackActions } from '@react-navigation/native';
import { i18n } from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { request } from "../utils/request";
import { Platform } from "react-native";

type SwapSwiper = {
    index: number,
    stores: Stores
}

type InitRegister = {
    stores: Stores
}

type GoRegisterNextStep = {
    stores: Stores,
    data: any,
    navigation: any
}

type StartRegister = {
    stores: Stores,
    navigation: any
}

type SelectServiceHour = {
    stores: Stores,
    type: string,
    navigation: any
}

type GoDoctorDetail = {
    stores: Stores,
    navigation: any,
    type: string,
    index?: number
}

type BackPage = {
    navigation: any,
    index: number
}

type ReviewDoctor = {
    stores: Stores,
    navigation: any,
    index: number
}

type Register = {
    stores: Stores,
    navigation: any
}

type GoLogin = {
    stores: Stores,
    navigation: any
}

type ForgetEmail = {
    stores: Stores,
    email: string,
    navigation: any
}

type CheckOperationPassword = {
    password: string,
    stores: Stores
}

type Login = {
    i18n: i18n,
    stores: Stores,
    navigation: any,
    username: string,
    password: string
}

export const swapSwiper = ({ index, stores }: SwapSwiper) => {
    stores.authStore.setSelectedSlide(index);
}

export const initRegister = async ({ stores }: InitRegister) => {
    try {
        const banks = await getBanks();
        const distincts = await getDistinct();
        const specialities = await getSpecialities();
        const authorities = await getAuthorities();
        const benefits = await getAllBenefits();
        const insurers = await getInsurers();

        stores.configStore.setBanks(banks);
        stores.configStore.setDistricts(distincts);
        stores.configStore.setSpecialities(specialities);
        stores.configStore.setAuthorities(authorities);
        stores.configStore.setInsurers(insurers);
        stores.configStore.setBenefits(benefits);
    } catch (error) {
        console.error(error);
    }
}

export const startRegister = ({ stores, navigation }: StartRegister) => {
    stores.authStore.setRegisterData(newRegistrationForm());
    navigation.navigate('RegisterStepOne');
}

export const goRegisterStep2 = ({ stores, data, navigation }: GoRegisterNextStep) => {
    const valid = validateStep1Data(data);
    if (!valid) {
        return false;
    }

    stores.authStore.setRegisterData(data);
    navigation.navigate('RegisterStepTwo');
    return true;
}

export const goRegisterStep3 = ({ stores, data, navigation }: GoRegisterNextStep) => {
    const valid = validateStep2Data(data);
    if (!valid) {
        return false;
    }

    stores.authStore.setRegisterData(data);
    navigation.navigate('RegisterStepThree');
    return true;
}

export const selectServiceHour = ({ stores, type, navigation }: SelectServiceHour) => {
    const { setScheduleType, registerData, setSchedules, doctor } = stores.authStore;
    setScheduleType(type);
    switch (type) {
        case 'doctor':
            setSchedules(doctor.schedules);
            break;
        default:
            setSchedules(registerData.schedules);
    }
    navigation.navigate('ServiceHour');
}

export const saveServiceHours = ({ stores, data, navigation }: GoRegisterNextStep) => {
    const { registerData, scheduleType, doctor, setRegisterData, setDoctor } = stores.authStore;
    switch (scheduleType) {
        case 'doctor':
            doctor.schedules = data;
            setDoctor(doctor);
            break;
        default:
            registerData.schedules = data;
            setRegisterData(registerData);
    }

    navigation.goBack();
}

export const goDoctorDetail = ({ stores, type, index = 0, navigation }: GoDoctorDetail) => {
    const { registerData, setDoctor, setDoctorType, setDoctorIndex } = stores.authStore;
    setDoctorType(type);
    switch (type) {
        case 'new':
            setDoctor(newDoctor());
            break;
        default:
            setDoctor(registerData.doctors[index]);
            setDoctorIndex(index);
    }
    navigation.navigate('DoctorDetail');
}

export const saveDoctor = ({ stores, data, navigation }: GoRegisterNextStep) => {
    const valid = validateDoctor(data);
    if (!valid) {
        return false;
    }

    const { doctorType, registerData, doctorIndex, setRegisterData } = stores.authStore;
    switch (doctorType) {
        case 'new':
            registerData.doctors.push(data);
            break;
        default:
            registerData.doctors[doctorIndex] = data;
    }

    setRegisterData(registerData);
    navigation.goBack();
    return true;
};

export const goRegisterStep4 = ({ stores, data, navigation }: GoRegisterNextStep) => {
    const valid = validateStep3Data(data);
    if (!valid) {
        return false;
    }

    stores.authStore.setRegisterData(data);
    navigation.navigate('RegisterStepFour');
    return true;
}

export const backPage = ({ navigation, index }: BackPage) => {
    const resetAction = StackActions.pop(4 - index);
    navigation.dispatch(resetAction);
}

export const reviewDoctor = ({ navigation, stores, index }: ReviewDoctor) => {
    const { registerData, setDoctorType, setDoctor, setDoctorIndex } = stores.authStore;

    setDoctorIndex(index);
    setDoctorType('modify');
    setDoctor(registerData.doctors[index]);

    navigation.pop(1);
    navigation.navigate('DoctorDetail');
}

export const register = async ({ navigation, stores }: Register) => {
    const { registerData, setAuthState } = stores.authStore;

    setAuthState('progress');
    try {
        await registerApi(registerData);
        setAuthState('success');
    } catch (error) {
        setAuthState('failure');
        return error.message;
    }
}

export const goLogin = ({ navigation, stores }: GoLogin) => {
    navigation.navigate('Login');
}

export const forgetPassword = async ({ navigation, email, stores }: ForgetEmail) => {
    const { setAuthState } = stores.authStore;
    setAuthState('progress');
    try {
        const result = await forgetPasswordApi(email);
        setAuthState('success');
        return {
            success: result,
            message: result ? 'Auth.ForgetPasswordEmail' : 'Common.UnknownSystemError'
        }
    } catch (error) {
        setAuthState('failure');
        return {
            success: false,
            message: error.message
        };
    }
}

export const checkOperationPassword = async ({ password, stores }: CheckOperationPassword) => {
    try {
        const { clinicId, token } = stores.appStore;
        await checkOperationPasswordApi({
            clinicId,
            token,
            password
        });
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error.IncorrectOPPassword'
        }
    }
}

export const login = async ({ stores, navigation, password, username, i18n }: Login) => {
    try {
        const { setAuthData, notificationToken } = stores.appStore;
        const { clinicId, token } = await loginApi({ username, password });
        await updateNotificationToken({ notificationToken, clinicId, token, i18n });

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("clinic_id", clinicId);
        setAuthData(token, clinicId);
    } catch (error) {


        console.log("error message", error);

        switch (error.message) {
            case '0002':
                return i18n.t('Auth.IncorrectCredential');
            case '0009':
                return i18n.t('Auth.AccountPendingApproval');
            case '0010':
                return i18n.t('Auth.AccountDisabled');
            default:
                return i18n.t('Auth.NetworkError');
        }
    }
}