import * as _ from 'lodash';

export type News = {
    id: string,
    titleEn: string,
    titleChi: string,
    createdAt: string,
    descriptionEn: string,
    descriptionChi: string,
    important: boolean
}

export function newNews(data?: Partial<News>): News {
    return _.assign({
        id: '',
        titleEn: '',
        titleChi: '',
        createdAt: '',
        descriptionEn: '',
        descriptionChi: '',
        important: false
    }, data);
}