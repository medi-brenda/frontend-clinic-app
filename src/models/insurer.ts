import * as _ from 'lodash';
import LangObj from './langObj';

export type Insurer = {
    code: string,
    name: string,
    nameEn: string,
    nameChi: string,
    physicalCard?: boolean,
    physicalCardImg?: string
    physicalCardDesc?: LangObj,
    icd?: number,
    shouldInputPayToken?:number
}

export function newInsurer(data?: Partial<Insurer>) {
    return _.assign({
        code: '',
        name: '',
        nameEn: '',
        nameChi: '',
        physicalCard: false,
        physicalCardImg: '',
        icd: 0,
        physicalCardDesc: {
            nameEn: '',
            nameChi: ''
        },
        shouldInputPayToken:1
    }, data);
}