import * as _ from 'lodash';
export type Setting = {
    method: Method,
    displayIncome: boolean
}

export type Method = {
    physicalCard: boolean
}

export function newSetting(data?: Partial<Setting>): Setting {
    return _.assign({
        method: newMethod(),
        displayIncome: false
    }, data);
}

export function newMethod(data?: Partial<Method>): Method {
    return _.assign({
        physicalCard: false
    }, data);
}