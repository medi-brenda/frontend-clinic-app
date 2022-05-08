import { extendObservable, runInAction } from 'mobx';
import { Banner } from '../models/banner';
import { Name } from '../models/common';
import { newNews, News } from '../models/news';
import { Promotion, newPromotion } from '../models/promotion';
import { Reminder } from '../models/reminder';
import { newSetting, Setting } from '../models/setting';
import { Cooperators } from '../models/cooperators';
import { NewProducts } from '../models/newProducts';
import { Resources } from '../models/resources';

export class AppStore {
    version: string = '';
    banners: Banner[] = [];
    inited: boolean = false;
    clinicId: string = '';
    token: string = '';
    logined: boolean = false;
    currentTab: string = '';
    setting: Setting = newSetting();
    reminders: Reminder[] = [];
    readReminders: boolean = false;
    newsList: News[] = [];
    news: News = newNews();
    promotionList: Promotion[] = [];
    cooperators: Cooperators[] = [];
    newProducts: NewProducts[] = [];
    newResources: Resources[]=[];
    newFavoriteDiagnosis: string = '';
    promotion: Promotion = newPromotion();
    aboutUs: Name = {
        nameEn: '',
        nameChi: ''
    };
    notificationToken: string = '';

    constructor() {
        extendObservable(this, {
            banners: [],
            inited: false,
            clinicId: '',
            token: '',
            logined: false,
            currentTab: '',
            setting: newSetting(),
            reminders: [],
            readReminders: false,
            newsList: [],
            news: newNews(),
            promotionList: [],
            cooperators: [],
            newProducts: [],
            newResources: [],
            newFavoriteDiagnosis: '',
            promotion: newPromotion(),
            version: '',
            aboutUs: {
                nameEn: '',
                nameChi: ''
            },
            notificationToken: ''
        });
    }

    setBanners = (banners: Banner[]) => {
        runInAction(() => {
            this.banners = banners;
        });
    }

    setInited = () => {
        runInAction(() => {
            this.inited = true;
        });
    }

    setAuthData = (token: string, clinicId: string) => {
        runInAction(() => {
            this.token = token;
            this.clinicId = clinicId;
            this.logined = true;
        });
    }

    setCurrentTab = (tab: string) => {
        runInAction(() => {
            this.currentTab = tab;
        });
    }

    setSetting = (setting: Setting) => {
        runInAction(() => {
            this.setting = setting;
        });
    }

    setReminders = (reminders: Reminder[]) => {
        runInAction(() => {
            this.reminders = reminders;
        });
    }

    setReadReminders = (readReminders: boolean) => {
        runInAction(() => {
            this.readReminders = readReminders;
        });
    }

    setNewsList = (newsList: News[]) => {
        runInAction(() => {
            this.newsList = newsList;
        });
    }

    setNews = (news: News) => {
        runInAction(() => {
            this.news = news;
        });
    }

    setPromotionList = (promotionList: Promotion[]) => {
        runInAction(() => {
            this.promotionList = promotionList;
        });
    }

    setPromotion = (promotion: Promotion) => {
        runInAction(() => {
            this.promotion = promotion;
        });
    }

    setAboutUs = (aboutUs: Name) => {
        runInAction(() => {
            this.aboutUs = aboutUs;
        });
    }

    resetData = () => {
        runInAction(() => {
            this.clinicId = '';
            this.token = '';
            this.logined = false;
            this.setting = newSetting();
        });
    }

    setVersion = (version: string = '') => {
        runInAction(() => {
            this.version = version;
        });
    }

    setNotificationToken = (notificationToken: string = '') => {
        runInAction(() => {
            this.notificationToken = notificationToken;
        });
    }
    
    setCooperators = (cooperators: Cooperators[]) => {
        runInAction(() => {
            this.cooperators = cooperators;
        });
    }

    setNewProducts = (newProducts: NewProducts[]) => {
        runInAction(() => {
            this.newProducts = newProducts;
        });
    }

    setNewResources = (newResources: Resources[]) => {
        runInAction(() => {
            this.newResources = newResources;
        });
    }

    setNewFavoriteDiagnosis = (newFavoriteDiagnosis: string) => {
        runInAction(() => {
            this.newFavoriteDiagnosis = newFavoriteDiagnosis;
        });
    }
}

export default AppStore;