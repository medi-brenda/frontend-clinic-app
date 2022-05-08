import * as _ from 'lodash';

export type Reminder = {
    id: string,
    newsId: string,
    descriptionEn: string,
    descriptionChi: string,
    titleEn: string,
    titleChi: string
}

export function newReminder(data: Partial<Reminder>) {
    return _.assign({
        id: '',
        newsId: '',
        descriptionEn: '',
        descriptionChi: '',
        titleEn: '',
        titleChi: ''
    }, data);
}