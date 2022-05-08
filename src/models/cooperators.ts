import * as _ from 'lodash';

export type Cooperators = {
    descriptionChi: string,
    descriptionEn: string,
    insurerId: string,
    logo: string,
    physicalCardImage: string,
    physicalCard: string,
    supportMedicalCard: string,
    supportQrcode: string,
    userGuide: string
}

export function newCooperators(data: Partial<Cooperators>) {
    return _.assign({
        descriptionChi: '',
        descriptionEn: '',
        insurerId: '',
        logo: '',
        physicalCardImage: '',
        physicalCard: '',
        supportMedicalCard: '',
        supportQrcode: '',
        userGuide: ''
    }, data);
}