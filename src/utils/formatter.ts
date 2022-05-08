import * as _ from 'lodash';
import { Schedule } from "../models/schedule";

export function formatNumber(value: number, digits: number) {
    let result = '';
    for (let i = 0; i < digits; i++) {
        result += '0';
    }
    return (`${result}${value}`).slice(digits * -1);
}

export function formatTime(hour: number, minute: number) {
    return `${hour}:${formatNumber(minute, 2)}`;
}