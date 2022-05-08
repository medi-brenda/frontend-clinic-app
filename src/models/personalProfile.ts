import * as _ from 'lodash';
export type PersonalProfile = {
    email: string,
    cantactPerson: string,
    phone: string,
    title: string,
    bankCode: string,
    bankAccount: string
};

export function newPersonalProfile(data?: Partial<PersonalProfile>): PersonalProfile {
    return _.assign({
        email: '',
        cantactPerson: '',
        phone: '',
        title: '',
        bankCode: '',
        bankAccount: ''
    }, data);
}