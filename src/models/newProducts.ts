import * as _ from 'lodash';

export type NewProducts = {
    id: string,
    insurerId: string,
    nameEn: string,
    nameChi: string,
    launchDate: string,
}

export function newnewProducts(data: Partial<NewProducts>) {
    return _.assign({
        id: '',
        insurerId: '',
        nameEn: '',
        nameChi: '',
        launchDate: '',
    }, data);
}