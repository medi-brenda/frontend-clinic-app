import * as _ from 'lodash';

export type Option = {
    code: string,
    nameEn: string,
    nameChi: string
}

export function newOption(data?: Partial<Option>): Option {
    return _.assign({
        code: '',
        nameEn: '',
        nameChi: ''
    },data);
}
