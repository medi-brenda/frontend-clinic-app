import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        lng: 'en',
        resources: {
            en: {
                translation: require('./locales/en').default
            },
            chi: {
                translation: require('./locales/chi').default
            }
        }
    });


export default i18n;