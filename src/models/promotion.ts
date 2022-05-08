import * as _ from 'lodash';

export type Promotion = {
    id: number,
    titleEn: string,
    titleChi: string,
    contentEn: string,
    contentChi: string,
    thumbImg: string,
    contentImg: string,
    lastUpdate: string,
    modifyTime: string,
    status: number
}

export function newPromotion(data?: Partial<Promotion>): Promotion {
    return _.assign({
        id: 0,
        titleEn: '',
        titleChi: '',
        contentEn: '',
        contentChi: '',
        thumbImg: '',
        contentImg: '',
        lastUpdate: '',
        modifyTime: '',
        status: 0
    }, data);
}