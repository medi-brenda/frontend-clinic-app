import { Banner } from "../models/banner";
import { request, requestPhp } from "../utils/request";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as _ from 'lodash';
import { i18n } from "i18next";
import { Bank } from "../models/bank";
import { District } from '../models/district';
import { Specialities } from "../models/specialities";
import { Authority } from "../models/authorities";
import { Insurer } from "../models/insurer";
import { Benefit } from '../models/benefit';
import { newReminder } from "../models/reminder";
import { newNews } from "../models/news";
import { newPromotion } from "../models/promotion";
import { Name } from "../models/common";
import { Cooperators, newCooperators } from "../models/cooperators";
import { NewProducts, newnewProducts } from "../models/newProducts";
import { Resources, newResources } from "../models/resources";
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { Platform } from "react-native";
const axios = require('axios');

type GetBenefits = {
    clinicId: string,
    token: string
}

type GetBenefitsByClinicInsurer = {
    clinicId: string,
    token: string,
    insurerId: string 
}

type GetReminders = {
    clinicId: string,
    token: string,
    i18n: i18n
}

type GetNewsList = {
    token: string,
    i18n: i18n
}

type GetNewsDetail = {
    token: string,
    i18n: i18n
    newsId: string
}

type GetPromotionList = {
    token: string,
    clinicId: string
}

type GetVersion = {
    platform: string,
    i18n: i18n
}

type UpdateNotificationToken = {
    i18n: i18n,
    token: string,
    clinicId: string,
    notificationToken: string
}

type GetCooperators = {
    clinicId: string,
    token: string,
    i18n: i18n
}

type GetNewProducts = {
    clinicId: string,
    token: string,
    i18n: i18n
}

type GetResources = {
    clinicId: string,
    token: string,
    i18n: i18n
}

type GetFavoriteDiagnosis = {
    clinicId: string,
    token: string,
    i18n: i18n
}

type toggleFavoriteDiagnosis = {
    clinicId: string,
    token: string,
    i18n: i18n,
    diagnosisId: string,
    type: string
}

export const getBanners = async () => {
    const bannelUrls = await requestPhp({
        url: `api/getBanner.php`,
        data: {}
    });

    const banners: Banner[] = _.map(bannelUrls.data, (banner: any) => ({
        source: banner.img_path,
        url: banner.url
    }));
    return banners;
}

export const getLocalLang = async () => {
    try {
        const lang = await AsyncStorage.getItem('lang');
        return lang || 'chi';
    } catch (error) {
        return 'chi';
    }
}

export const changeLang = async (i18n: i18n) => {
    const lang = await getLocalLang();
    const newLang = lang === 'en' ? 'chi' : 'en';
    i18n.changeLanguage(newLang);
    await AsyncStorage.setItem('lang', newLang);
}

export const getBanks = async (): Promise<Bank[]> => {
    const resp = await requestPhp({
        url: 'api/getBanks.php'
    });

    return _.map(resp.data, (bank) => (
        {
            code: bank.code,
            nameChi: bank.name_cn,
            nameEn: bank.name_en
        }
    ));
}

export const getDistinct = async (): Promise<District[]> => {
    const resp = await requestPhp({
        url: 'api/getDistricts.php'
    });

    return _.map(resp.data, (district) => (
        {
            code: district.district_id,
            nameChi: district.name_cn,
            nameEn: district.name_en
        }
    ));
}

export const getSpecialities = async (): Promise<Specialities[]> => {
    const resp = await requestPhp({
        url: 'api/getSpecialities.php'
    });

    return _.map(resp.data, (item) => (
        {
            code: item.id,
            nameChi: item.name_cn,
            nameEn: item.name_en
        }
    ));
}

export const getAuthorities = async (): Promise<Authority[]> => {
    const resp = await requestPhp({
        url: 'api/getAuthorities.php'
    });

    return _.map(resp.data, (item) => (
        {
            code: item.id,
            nameChi: item.name_cn,
            nameEn: item.name_en
        }
    ));
}

export const getAllBenefits = async (): Promise<Benefit[]> => {
    const resp = await requestPhp({
        url: 'api/getAllBenefits.php'
    });

    return _.map(resp.data, (item) => (
        {
            code: item.benefit_code,
            nameChi: item.name_cn,
            nameEn: item.name_en
        }
    ));
}

export const getBenefits = async ({ token, clinicId }: GetBenefits): Promise<Benefit[]> => {
    const resp = await requestPhp({
        url: 'api/getBenefits.php',
        data: {
            token,
            clinic_id: clinicId
        }
    });

    return _.map(resp.data, (item) => (
        {
            code: item.benefit_code,
            nameChi: item.name_cn,
            nameEn: item.name_en
        }
    ));
}

export const getBenefitsByClinicInsurer = async ({ token, clinicId, insurerId }: GetBenefitsByClinicInsurer): Promise<Benefit[]> => {
    const resp = await requestPhp({
        url: 'api/getBenefitsByClinicInsurer.php',
        data: {
            token,
            clinic_id: clinicId,
            insurer_id: insurerId
        }
    });

    return _.map(resp.data, (item) => (
        {
            code: item.benefit_code,
            nameChi: item.name_cn,
            nameEn: item.name_en
        }
    ));
}


export const getInsurers = async (): Promise<Insurer[]> => {
    const resp = await requestPhp({
        url: 'api/getInsurers.php'
    });

    return _.map(resp.data, (item) => (
        {
            code: item.insurer_id,
            name: item.name,
            nameChi: item.description_cn,
            nameEn: item.description_en
        }
    ));
}

export const getReminders = async ({ clinicId, i18n, token }: GetReminders) => {

    const resp = await request({
        url: 'getReminders',
        data: {
            clinic_id: clinicId
        },
        token,
        i18n
    });

    return _.map(resp.reminders, (reminder) => newReminder({
        id: reminder.id,
        newsId: reminder.news_id,
        titleEn: reminder.title_en,
        titleChi: reminder.title_cn,
        descriptionChi: reminder.description_cn,
        descriptionEn: reminder.description_en
    }));
}

export const getNewsList = async ({ i18n, token }: GetNewsList) => {
    const resp = await request({
        url: 'getNewsList',
        token,
        i18n
    });

    return _.map(resp.news, news => newNews({
        id: news.id,
        titleEn: news.title_en,
        titleChi: news.title_cn,
        descriptionEn: news.description_en,
        descriptionChi: news.description_cn,
        createdAt: news.createdAt,
        important: news.important === 1
    }));
}

export const getNewsDetail = async ({ i18n, token, newsId }: GetNewsDetail) => {
    const resp = await request({
        url: 'getNews',
        data: {
            news_id: newsId
        },
        token,
        i18n
    });
    
    return newNews({
        id: resp.id,
        titleEn: resp.title_en,
        titleChi: resp.title_cn,
        descriptionEn: resp.description_en,
        descriptionChi: resp.description_cn,
        createdAt: resp.createdAt
    });
}

export const getPromotionList = async ({ token, clinicId }: GetPromotionList) => {
    const resp = await requestPhp({
        url: 'api/getPromotion.php',
        data: {
            token,
            clinic_id: clinicId
        }
    });

    return _.map(resp.data, (promotion) => newPromotion({
        id: promotion.id,
        titleEn: promotion.title_en,
        titleChi: promotion.title_chi,
        contentEn: promotion.content,
        contentChi: promotion.content_chi,
        thumbImg: promotion.thumb_img,
        contentImg: promotion.content_img,
        lastUpdate: promotion.last_update,
        modifyTime: promotion.modified_time,
        status: promotion.status
    }));
}

export const getAboutUs = async (): Promise<Name> => {
    const resp = await requestPhp({
        url: 'api/aboutUs.php'
    });

    return {
        nameEn: resp.data.content,
        nameChi: resp.data.content_chi
    };
}

export const getVersion = async ({ i18n, platform }: GetVersion) => {
    const newVersion = Constants.manifest.version;
    const oldVersion = await AsyncStorage.getItem('version').catch(error => null);
        
    const resp = await request({
        url: 'versions',
        data: {
            platform,
            oldVersion: oldVersion || newVersion,
            newVersion
        },
        i18n,
        isPublic: true
    });

    return resp.data;
}

export const checkVersion = async ({ i18n, platform }: GetVersion) => {
    const oldVersion = await AsyncStorage.getItem('version');
    const { updated } = await getVersion({ i18n, platform });
    const { version } = Constants.manifest;
    const [currentMajor, currentMinor, currentPatch] = (version as string).split('.').map(Number);

    _.forEach(updated, ver => {
        ver.descriptionChi = `v${ver.version}: ${ver.descriptionChi}`;
        ver.descriptionEn = `v${ver.version}: ${ver.descriptionEn}`;
    });

    const newerVersions = _.filter(updated, ({ version }) => {
        const [major, minor, patch] = version.split('.').map(Number);

        if (major < currentMajor) {
            return false;
        }
        if (minor < currentMinor) {
            return major > currentMajor;
        }
        if (patch < currentPatch) {
            return minor > currentMinor;
        }

        return patch > currentPatch;
    });
    const mandatoryVersion = _.find(newerVersions, ver => ver.mandatory);
    const resp = await Updates.checkForUpdateAsync();
    const newestVersion = _.get(resp, 'manifest.version');

    await AsyncStorage.setItem('version', version || '');
    
    return {
        version,
        installVersion: _.get(mandatoryVersion, 'version'),
        updateVersion: newerVersions.length > 0 ? newestVersion : '',
        updated: oldVersion && oldVersion === version ? [] : newerVersions
    };
}

export const registerNofiticationToken = async (): Promise<string> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        return '';
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            description: 'Mediconcen - 醫結',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

export const updateNotificationToken = async ({ clinicId, notificationToken, token, i18n }: UpdateNotificationToken) => {
    try {
        // update notification token
        console.log({
            clinic_id: Number(clinicId),
            platform: Platform.OS,
            token: notificationToken
        })
        await request({
            url: 'notifications/token',
            data: {
                clinicId: Number(clinicId),
                platform: Platform.OS,
                token: notificationToken
            },
            token,
            i18n
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCooperators = async ({ clinicId, i18n, token }: GetCooperators): Promise<Cooperators[]> => {
    const resp = await request({
        url: '/insurers/supported',
        token: "Bearer " + token,
        i18n,
        isPublic: false,
        method: 'get',
        queryString: '?clinicId='+clinicId
    });

    const insurers = resp.insurers;
        return _.map(insurers, (insurer) => newCooperators({
            descriptionChi: insurer.description_cn,
            descriptionEn: insurer.description_en,
            insurerId: insurer.insurer_id,
            logo: insurer.logo,
            physicalCardImage: insurer.physical_card_image,
            physicalCard: insurer.physical_card,
            supportMedicalCard: insurer.support_medical_card,
            supportQrcode: insurer.support_qrcode,
            userGuide: insurer.user_guide,
    }));
}

export const getNewProducts = async ({ clinicId, i18n, token }: GetNewProducts): Promise<NewProducts[]> => {
    const resp = await request({
        url: '/insurers/new-products',
        token: "Bearer " + token,
        i18n,
        isPublic: false,
        method: 'get',
        queryString: '?clinicId='+clinicId
    });


    const insurers = resp.items;
        return _.map(insurers, (insurer) => newnewProducts({
            id: insurer.id,
            insurerId: insurer.insurer_id,
            nameEn: insurer.name_en,
            nameChi: insurer.name_cn,
            launchDate: insurer.launch_date,
    }));
}

export const getResources = async ({ clinicId, i18n, token }: GetResources): Promise<Resources[]> => {
    const resp = await request({
        url: '/resource',
        token: "Bearer " + token,
        i18n,
        isPublic: false,
        method: 'get',
        queryString: ''
    });
    const resources = resp.resources;
    return _.map(resources, (resource) => newResources({
        documentId: resource.document_id,
        titleEn: resource.title_en,
        titleChi: resource.title_cn,
        contentEn: resource.content_en,
        contentChi: resource.content_cn,
        format: resource.format,
        linkEn: resource.link_en,
        linkChi: resource.link_cn,
        iconLink: resource.icon_link
    }));
}

export const getFavoriteDiagnosis = async ({ clinicId, i18n, token }: GetFavoriteDiagnosis): Promise<any> => {
    try{
        const resp = await request({
            url: '/favoriteDiagnosis/getFavoriteDiagnosis',
            token: "Bearer " + token,
            i18n,
            isPublic: false,
            method: 'get',
            queryString: '?clinicId='+clinicId
        });
        return resp;
    } catch (error) {
        throw error;
    }
}

export const toggleFavoriteDiagnosis = async ({ clinicId, i18n, token, diagnosisId, type }: toggleFavoriteDiagnosis): Promise<any> => {
    try{
        const resp = await request({
            url: '/favoriteDiagnosis/toggleFavoriteDiagnosis',
            data: {
                clinic_id: clinicId,
                diagnosis_id: diagnosisId,
                type: type,
            },
            token: token,
            i18n,
        });
        return resp;
    } catch (error) {
        throw error;
    }
}