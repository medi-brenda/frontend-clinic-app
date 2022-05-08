import * as _ from 'lodash';

export type Resources = {
    documentId: string,
    titleEn: string,
    titleChi: string,
    contentEn: string,
    contentChi: string,
    format: string,
    linkEn: string,
    linkChi: string,
    iconLink: string
}

export function newResources(data: Partial<Resources>) {
    return _.assign({
        documentId: '',
        titleEn: '',
        titleChi: '',
        contentEn: '',
        contentChi: '',
        format: '',
        linkEn: '',
        linkChi: '',
        iconLink: ''
    }, data);
}