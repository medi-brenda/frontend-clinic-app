import { i18n } from "i18next";
import { Stores } from "../stores";
import * as Font from "expo-font";
import * as _ from 'lodash';
import {
    getBanners, changeLang as changeAppLang, getLocalLang, getBenefits,
    getReminders as getRemindersApi, getNewsList as getNewsListApi, getNewsDetail, getPromotionList, getAboutUs, getVersion, checkVersion, registerNofiticationToken, updateNotificationToken,
    getCooperators as getCooperatorsApi, getNewProducts as getNewProductsApi, getResources as getResourcesApi, getFavoriteDiagnosis as getFavoriteDiagnosisApi, toggleFavoriteDiagnosis as toggleFavoriteDiagnosisApi
} from "../services/app";
import * as ClinicService from '../services/clinic';
import { getAuthData } from "../utils/request";
import { validateDiagnosis, validateExtraMed } from "../utils/validate";
import { ExtraMed } from "../models/extraMed";
import { Diagnosis } from "../models/diagnosis";
import { Record } from "../models/record";
import { News } from "../models/news";
import { Promotion } from "../models/promotion";
import { DoctorProfile } from "../models/doctor";
import { Setting } from "../models/setting";
import Config from "../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reminder } from "../models/reminder";
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import {PendingItem} from "../models/pendingItem";
import { findInsurer } from "../utils/common";

type UpdateApp = {
    i18n: i18n
}

type InitApp = {
    stores: Stores,
    i18n: i18n,
    platform: string
}

type GoSelectBenefit = {
    insurer: string,
    insurerName: string,
    stores: Stores,
    navigation: any
}

type GoSelectDoctor = {
    benefit: string,
    benefitName: string,
    stores: Stores,
    navigation: any
}

type GoSelectMethod = {
    doctorId: string,
    stores: Stores,
    navigation: any,
    i18n: i18n
}

type GoSelectExtraMed = {
    diagnosis: Diagnosis[],
    stores: Stores,
    navigation: any
}

type GoPage = {
    stores: Stores,
    navigation: any
}

type GoTab = {
    tabName: string,
    navigation: any
}

type GetReminders = {
    stores: Stores,
    navigation: any,
    i18n: i18n,
    platform: string
}

type InitPage = {
    stores: Stores,
    navigation: any,
    i18n: i18n
}

type ReadReminders = {
    stores: Stores
}

type GoDetailPage = {
    stores: Stores,
    navigation: any,
    extraMed: ExtraMed[]
}

type GoConfirmPayPage = {
    stores: Stores,
    navigation: any,
    signature: string
}

type GoRecord = {
    stores: Stores,
    navigation: any,
    record: Record
}

type GoNews = {
    stores: Stores,
    navigation: any,
    news: News
}

type GoPromotion = {
    stores: Stores,
    navigation: any,
    promotion: Promotion
}

type DownloadReport = {
    stores: Stores,
    navigation: any,
    year: number,
    month: number
}

type GoDoctorProfile = {
    stores: Stores,
    navigation: any,
    doctorProfile: DoctorProfile
}

type SaveSettings = {
    stores: Stores,
    navigation: any,
    settings: Setting,
    i18n: i18n
}

type Logout = {
    stores: Stores,
    navigation: any,
    i18n: i18n
}

type InitCooperators = {
    stores: Stores,
    navigation: any,
    i18n: i18n,
    platform: string
}

type ChangePassword ={
    stores: Stores,
    token: string,
    clinicId: string,
    oldPassword: string,
    newPassword: string,
    i18n: i18n

}


type InitResourceCenter = {
    stores: Stores,
    navigation: any,
    i18n: i18n,
    platform: string
}

type GoNextAfterSelectingPendingItem={
    stores:Stores,
    navigation:any,
    pendingItem:PendingItem
}

type InitFavoriteDiagnosis = {
    stores: Stores,
    navigation: any,
    i18n: i18n,
    platform: string
}

type ToggleFavoriteDiagnosis = {
    stores: Stores,
    navigation: any,
    i18n: i18n,
    platform: string,
    diagnosisId: string,
    type: string,
}

export const changeLang = (i18n: i18n) => {
    changeAppLang(i18n);
}

export const checkCodePush = async () => {
    if(Constants.manifest.releaseChannel === 'prod' || Constants.manifest.releaseChannel === 'testing' || Constants.manifest.releaseChannel === 'staging') {
        // check update
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
        await Updates.fetchUpdateAsync().catch((error: Error) => {
            return error.message;
        })
        // ... notify user of update ...
        await Updates.reloadAsync().catch((error: Error) => {
            return error.message;
        })
        }
    }
}

export const initApp = async ({ stores, i18n, platform }: InitApp) => {
    try {
        await checkCodePush();
        const { setBanners, setAuthData, setVersion, setInited, setNotificationToken } = stores.appStore;
        // load resources
        await Font
            .loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
                "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
                '"Times New Roman"': require("../assets/fonts/times-new-roman.ttf"),
                "'Times New Roman'": require("../assets/fonts/times-new-roman.ttf"),
                '"Calibri",sans-serif': require("../assets/fonts/calibri.ttf"),
                "'Calibri',sans-serif": require("../assets/fonts/calibri.ttf"),
            });

        const banners = await getBanners();
        setBanners(banners);

        const localLang = await getLocalLang();
        i18n.changeLanguage(localLang);

        
        const { clinicId, token } = await getAuthData();

        console.log( 'clinic id: ', clinicId, 'token: ', token);

        if (token && clinicId) {
            setAuthData(token, clinicId);
        }

        const notificationToken = await registerNofiticationToken();
        setNotificationToken(notificationToken);
        console.log(notificationToken);

        setVersion(Constants.manifest.version);

        setInited();
    }
    catch (error) {

        console.log('error in side initApp', error.message);
        return error.message;
    }
}

export const initVerify = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { clinicId, token, setSetting, setCurrentTab } = stores.appStore;
        const { resetData } = stores.dataStore;
        const { setInsurers } = stores.configStore;

        setCurrentTab('Verify');
        resetData();

        const insurers = await ClinicService.getInsurers({ token, i18n });
        setInsurers(insurers);

        const setting = await ClinicService.getSettings({ clinicId, token, i18n });
        setSetting(setting);

        console.log('inside initVerify, about to navigation reset to verifyInsurer');

        navigation.reset({
            index: 0,
            routes: [{ name: 'VerifyInsurer' }]
        })
        // navigation.navigate('VerifyBenefit');
    } catch (error) {
        return error.message
    }
}

export const initModify = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { clinicId, token, setSetting, setCurrentTab } = stores.appStore;
        const { resetData } = stores.dataStore;
        const { setInsurers } = stores.configStore;

        setCurrentTab('Modify');
        resetData();

        const insurers = await ClinicService.getInsurers({ token, i18n });
        setInsurers(insurers);

        const setting = await ClinicService.getSettings({ clinicId, token, i18n });
        setSetting(setting);

        navigation.reset({
            index: 0,
            routes: [{ name: 'ModifyPendingList' }]
        });
    } catch (error) {
        return error.message
    }
}

export const initRecords = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { clinicId, token } = stores.appStore;
        const { setInsurers, setBenefits } = stores.configStore;

        const insurers = await ClinicService.getInsurers({ token, i18n });
        setInsurers(insurers);

        const benefits = await getBenefits({ token, clinicId });
        setBenefits(benefits);
        navigation.reset({
            index: 0,
            routes: [{ name: 'RecordList' }]
        });
    } catch (error) {
        return error.message;
    }
}

export const initSetting = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { clinicId, token, setSetting } = stores.appStore;
        const setting = await ClinicService.getSettings({ clinicId, token, i18n });
        setSetting(setting);
    }
    catch (error) {
        return error.message;
    }
}

export const goSelectBenefit = async ({ stores, insurer, insurerName, navigation }: GoSelectBenefit) => {
    const { currentTab } = stores.appStore;
    const { values, setValues } = stores.dataStore;
    values.insurerId = insurer;
    values.insurerName = insurerName;
    setValues(values);
    navigation.navigate(`${currentTab}Benefit`);
}

export const goSelectDoctor = async ({ stores, benefit, benefitName, navigation }: GoSelectDoctor) => {
    const { currentTab } = stores.appStore;
    const { values, setValues } = stores.dataStore;
    values.benefitCode = benefit;
    values.benefitName = benefitName;
    setValues(values);
    navigation.navigate(`${currentTab}Doctor`);
}

export const goSelectMethod = async ({ stores, doctorId, navigation, i18n }: GoSelectMethod) => {
    try {
        // get doctor insurer list first
        const { currentTab, setting, token } = stores.appStore;
        const { values, setValues, setMethod, setDoctorInsurerIds } = stores.dataStore;

        const insurerIds = await ClinicService.getDoctorInsurers({ token, doctorId, i18n });
        setDoctorInsurerIds(insurerIds);

        values.doctorId = doctorId;
        setValues(values);

        if (Config.method.physicalCard && setting.method.physicalCard) {
            navigation.navigate(`${currentTab}Method`);
        }
        else {
            setMethod('QrCode');
            navigation.navigate(`${currentTab}QrScan`);
        }
    } catch (error) {
        return error.message
    }
}

export const goQrScanner = async ({ stores, navigation }: GoPage) => {
    const { currentTab } = stores.appStore;
    const { setMethod } = stores.dataStore;
    setMethod('QrCode');
    navigation.navigate(`${currentTab}QrScan`);
}

export const goPhysicalCard = async ({ stores, navigation }: GoPage) => {
    const { currentTab } = stores.appStore;
    const { setMethod } = stores.dataStore;
    setMethod('PhysicalCard');
    navigation.navigate(`${currentTab}PhysicalCard`);
}

export const goSelectExtraMed = ({ stores, navigation, diagnosis }: GoSelectExtraMed) => {
    const valid = validateDiagnosis(diagnosis);
    if (!valid) {
        return 'Modify.InvalidNumberOfDiagnosis';
    }

    const { values, setValues } = stores.dataStore;
    values.diagnosis = diagnosis;
    setValues(values);
    navigation.navigate('SelectExtraMed');
}

export const goDetailPage = ({ stores, navigation, extraMed }: GoDetailPage) => {
    const valid = validateExtraMed(extraMed);
    if (!valid) {
        return 'Modify.InvalidExtraMedFields';
    }

    const { setting } = stores.appStore;
    const { method, values, setValues } = stores.dataStore;

    setValues({
        ...values,
        extraMed
    });

    if (setting.method.physicalCard && method === 'PhysicalCard') {
        navigation.navigate('PatientDetail');
    }
    else {
        navigation.navigate('ConfirmPay');
    }
}

export const goConfirmPayPage = ({ stores, navigation, signature }: GoConfirmPayPage) => {
    const { values, setValues } = stores.dataStore;
    values.signature = signature;
    setValues(values);
    navigation.navigate('ConfirmPay');
}

export const goTab = ({ navigation, tabName }: GoTab) => {
    const state = navigation.dangerouslyGetState();
    const tab = state.routes.find((route: any) => route.name === tabName);
    const routeName = _.get(tab, 'state.routes[0].name', tabName);
    navigation.navigate(routeName);
}

export const goTransactionSuccess = ({ stores, navigation }: GoPage) => {
    const { method } = stores.dataStore;
    if (method === 'PhysicalCard') {
        return navigation.navigate('TransactionSuccess');
    }

    return navigation.navigate('Record');
}

export const goRecord = ({ stores, navigation, record }: GoRecord) => {
    const { setRecord } = stores.dataStore;
    setRecord(record);
    navigation.navigate('RecordDetail');
}

export const goNews = ({ stores, navigation, news }: GoNews) => {
    const { setNews } = stores.appStore;
    setNews(news);
    navigation.navigate('NewsDetail');
}

export const goPromotion = ({ stores, navigation, promotion }: GoPromotion) => {
    const { setPromotion } = stores.appStore;
    setPromotion(promotion);
    navigation.navigate('PromotionDetail');
}

export const getReminders = async ({ stores, navigation, i18n, platform }: GetReminders) => {
    try {
        const { clinicId, token, setReminders, setVersion, setNewsList } = stores.appStore;

        const { version, updateVersion, installVersion, updated } = await checkVersion({ i18n, platform });
        setVersion(version);
        let versionReminders: Reminder[] = [];

        if (installVersion) {
            versionReminders = [{
                id: 'install',
                newsId: '',
                descriptionEn: `Here is a updated version(v${installVersion}) published to app store, it is advised to install the latest version.`,
                descriptionChi: `最新版本(v${installVersion})已上線，建議前往下戴最新版本`,
                titleEn: 'System Update',
                titleChi: '系統更新'
            }];
        }
        else if (updateVersion) {
            versionReminders = [{
                id: 'updated',
                newsId: '',
                descriptionEn: `Here is a updated version(v${updateVersion}), Are you want to updated?`,
                descriptionChi: `最新版本(v${updateVersion})已上線，是否更新`,
                titleEn: 'System Update',
                titleChi: '系統更新'
            }];
        }
        else if (updated.length) {
            versionReminders = [{
                id: 'updatedDetail',
                newsId: '',
                descriptionEn: _.map(updated, 'descriptionEn').join('\n'),
                descriptionChi: _.map(updated, 'descriptionChi').join('\n'),
                titleEn: 'System Update',
                titleChi: '系統更新'
            }];
        }

        const reminders = await getRemindersApi({ clinicId, token, i18n });
        setReminders(_.concat(versionReminders, reminders));

        const news = await getNewsListApi({ i18n, token });
        setNewsList(news);

    } catch (error) {
        // do nothing
        console.error(error);
    }
}

export const readReminders = ({ stores }: ReadReminders) => {
    stores.appStore.setReadReminders(true);
}

export const initNewsList = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { token, setNewsList } = stores.appStore;
        const newsList = await getNewsListApi({ i18n, token });
        setNewsList(newsList);
    } catch (error) {
        return error.message
    }
}

export const initNewsDetail = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { token, news, setNews } = stores.appStore;
        const newNews = await getNewsDetail({ i18n, token, newsId: news.id });
        setNews(newNews);
    } catch (error) {
        return error.message
    }
}

export const initPersonalProfile = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { token, clinicId } = stores.appStore;
        const { setPersonalProfile } = stores.dataStore;
        const profile = await ClinicService.getPersonalProfile({ clinicId, token });
        setPersonalProfile(profile);
    } catch (error) {
        return error.message
    }
}

export const initClinicProfile = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { token, clinicId } = stores.appStore;
        const { setClinic } = stores.dataStore;
        const clinic = await ClinicService.getClinicProfile({ clinicId, token });
        setClinic(clinic);
    } catch (error) {
        return error.message
    }
}

export const initAboutUs = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { setAboutUs } = stores.appStore;
        const aboutUs = await getAboutUs();
        setAboutUs(aboutUs);
    } catch (error) {
        return error.message
    }
}

export const initDoctorProfile = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { token, clinicId } = stores.appStore;
        const { setDoctorProfileList } = stores.dataStore;
        const doctorProfileList = await ClinicService.getDoctorList({ clinicId, token });
        setDoctorProfileList(doctorProfileList);
    } catch (error) {
        return error.message
    }
}

export const initDoctorProfileDetail = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { token, clinicId } = stores.appStore;
        const { doctorProfile, setDoctorProfile } = stores.dataStore;
        const newDoctorProfile = await ClinicService.getDoctorProfile({ clinicId, token, doctor: doctorProfile });
        setDoctorProfile(newDoctorProfile);
    } catch (error) {
        return error.message
    }
}

export const initPromotionList = async ({ stores, navigation, i18n }: InitPage) => {
    try {
        const { token, clinicId, setPromotionList } = stores.appStore;
        const promotionList = await getPromotionList({ clinicId, token });
        setPromotionList(promotionList);
    } catch (error) {
        return error.message
    }
}

export const downloadReport = async ({ stores, navigation, year, month }: DownloadReport) => {
    try {
        const { token, clinicId } = stores.appStore;
        await ClinicService.downloadReport({ token, clinicId, year, month });
    } catch (error) {
        return error.message
    }
}

export const goDoctorProfile = async ({ stores, navigation, doctorProfile }: GoDoctorProfile) => {
    const { setDoctorProfile } = stores.dataStore;
    setDoctorProfile(doctorProfile);
    navigation.navigate('DoctorProfile');
}

export const saveSettings = async ({ stores, navigation, settings, i18n }: SaveSettings) => {
    try {
        const { token, clinicId } = stores.appStore;
        await ClinicService.saveSettings({ token, clinicId, settings, i18n });
    } catch (error) {
        return error.message
    }
}

export const changePassword = async ({ stores, oldPassword, newPassword,token, i18n }: ChangePassword) => {
    try {
        const { token, clinicId } = stores.appStore;
        await ClinicService.changePassword({ clinicId, oldPassword, newPassword, token,i18n });
    } catch (error) {
        return error.message
    }
}



export const logout = async ({ stores, navigation, i18n }: Logout) => {
    const { resetData, notificationToken, token, clinicId } = stores.appStore;
    await updateNotificationToken({ notificationToken, token, clinicId, i18n });
    resetData();
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('clinic_id');
}

export const updateApp = async ({ i18n }: UpdateApp) => {
    try {
        // check again ensure it can update first
        const { updateVersion } = await checkVersion({ i18n, platform: 'android' });
        if (!updateVersion) {
            throw new Error('Common.UnknownSystemError');
        }

        await Updates.fetchUpdateAsync();
    } catch (error) {
        return error.message;
    }
}

export const restartApp = () => {
    Updates.reloadAsync();
}

export const initCooperators = async ({ stores, navigation, i18n, platform }: InitCooperators) => {
    try {
        const { clinicId, token, setCooperators, setNewProducts } = stores.appStore;
        const cooperators = await getCooperatorsApi({ clinicId, token, i18n });
        const newProducts = await getNewProductsApi({ clinicId, token, i18n });

        setCooperators(cooperators);
        setNewProducts(newProducts);
    } catch (error) {
        return error.message;
    }
}

export const initResourceCenter = async ({ stores, navigation, i18n, platform }: InitResourceCenter) => {
    try {
        const { clinicId, token, setNewResources } = stores.appStore;
        const resources = await getResourcesApi({ clinicId, token, i18n });
        setNewResources(resources);
    } catch (error) {
        return error.message;
    }
}


export const goNextAfterSelectingPendingItem=({ stores, navigation,pendingItem}:GoNextAfterSelectingPendingItem)=>{
    const {
        benefitCode,
        doctor,
        insurerId,
        extraMed,
        extraMedLimit,
        copayment,
        patientName,
        patientId
    } = pendingItem;
    

    const {values,setValues,setMethod}=stores.dataStore;
    const { insurers } = stores.configStore;
    const {setPendingItem} = stores.dataStore;


    setValues({
        ...values,
        benefitCode,
        doctorId:doctor.code,
        insurerId:insurerId.toString(), //cater for legacy problem when store 's insurer id is defined as string
        extraMed,
        extraMedLimit,
        copayment,
        patientName,
        member:patientId
    });


    setPendingItem(pendingItem);
    const isQR = pendingItem.verifyType === 1;

    const insurer = findInsurer(insurers, insurerId) !;

    if (isQR && !insurer.shouldInputPayToken){
        setMethod('QrCode');
        navigation.navigate('SelectDiagnosis');
        return;
    }
    if (isQR) {
        setMethod('QrCode');
        navigation.navigate('ModifyQrScan');
        return;
    } else {
        setMethod('PhysicalCard');
        navigation.navigate('SelectDiagnosis');
        return;
    }
}

export const initFavoriteDiagnosis = async ({ stores, navigation, i18n, platform }: InitFavoriteDiagnosis) => {
    try {
        const { clinicId, token, setNewFavoriteDiagnosis} = stores.appStore;
        const favoriteDiagnosis = await getFavoriteDiagnosisApi({ clinicId, token, i18n });
        setNewFavoriteDiagnosis(favoriteDiagnosis);
    } catch (error) {
        return error.message;
    }
}

export const toggleFavoriteDiagnosis = async ({ stores, navigation, i18n, platform, diagnosisId, type }: ToggleFavoriteDiagnosis) => {
    try {
        const { clinicId, token, setNewFavoriteDiagnosis} = stores.appStore;
        const favoriteDiagnosis = await toggleFavoriteDiagnosisApi({ clinicId, token, i18n, diagnosisId, type });
        setNewFavoriteDiagnosis(favoriteDiagnosis);
        return favoriteDiagnosis;
    } catch (error) {
        return error.message;
    }
}