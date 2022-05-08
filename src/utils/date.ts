import moment from 'moment';

export const getDateMoment = (date: Date = new Date()): moment.Moment => {
    return moment([date.getFullYear(), date.getMonth(), date.getDate()]);
}

export const dateDiff = (date1: Date, date2: Date) => {
    const moment1 = getDateMoment(date1);
    const moment2 = getDateMoment(date2);
    return moment1.diff(moment2, 'days');
}

export const getFirtMonthDate = (date: Date): Date => {
    return moment(date).set('day', 1).toDate();
}

export const getLastMonthDate = (date: Date): Date => {
    return moment(getFirtMonthDate(date)).add('month', 1).add('day', -1).toDate();
}