import { i18n } from "i18next";
import * as _ from 'lodash';

export function translate(tranObj: any, i18n: i18n) {
    const language = i18n.language === 'en' ? 'nameEn' : 'nameChi';
    return _.get(tranObj, language, '-');
}