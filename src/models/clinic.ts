import { newSchedules, Schedule } from "./schedule";
import * as _ from 'lodash';

export type Clinic = {
    clinicNameEn: string,
    clinicNameChi: string,
    addressEn: string,
    addressChi: string,
    districtNameEn: string,
    districtNameChi: string,
    regionNameEn: string,
    regionNameChi: string,
    phone: string,
    phone2: string,
    fax: string,
    schedules: Schedule[]
}

export function newClinic(data?: Partial<Clinic>): Clinic {
    return _.assign({
        clinicNameEn: '',
        clinicNameChi: '',
        addressEn: '',
        addressChi: '',
        districtNameEn: '',
        districtNameChi: '',
        regionNameEn: '',
        regionNameChi: '',
        phone: '',
        phone2: '',
        fax: '',
        schedules: newSchedules()
    }, data)
}