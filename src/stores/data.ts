import {extendObservable, runInAction} from 'mobx';
import {Clinic, newClinic} from '../models/clinic';
import {DoctorProfile, newDoctorProfile} from '../models/doctor';
import {newPersonalProfile, PersonalProfile} from '../models/personalProfile';
import {newRecord, Record} from '../models/record';
import {newTransaction, Transaction} from '../models/transaction';
import {newPendingItem, PendingItem} from "../models/pendingItem";

export class DataStore {
    values: Transaction = newTransaction();
    method: string = '';
    records: Record[] = [];
    record: Record = newRecord();
    personalProfile: PersonalProfile = newPersonalProfile();
    clinic: Clinic = newClinic();
    doctorProfileList: DoctorProfile[] = [];
    doctorProfile: DoctorProfile = newDoctorProfile();
    doctorInsurerIds: string[] = [];
    pendingItems: PendingItem[] = [];
    pendingItem: PendingItem = newPendingItem();

    constructor() {
        extendObservable(this, {
            values: newTransaction(),
            method: '',
            records: [],
            record: newRecord(),
            personalProfile: newPersonalProfile(),
            clinic: newClinic(),
            doctorProfileList: [],
            doctorProfile: newDoctorProfile(),
            doctorInsurerIds: [],
            pendingItems: [],
            pendingItem: newPendingItem(),
        });
    }

    setValues = (values: Transaction) => {
        runInAction(() => {
            this.values = values;
        });
    }

    resetData = () => {
        runInAction(() => {
            this.values = newTransaction()
        });
    }

    setMethod = (method: string) => {
        runInAction(() => {
            this.method = method;
        });
    }

    setRecords = (records: Record[]) => {
        runInAction(() => {
            this.records = records;
        });
    }

    setRecord = (record: Record) => {
        runInAction(() => {
            this.record = record;
        });
    }

    setPersonalProfile = (personalProfile: PersonalProfile) => {
        runInAction(() => {
            this.personalProfile = personalProfile;
        });
    }

    setClinic = (clinic: Clinic) => {
        runInAction(() => {
            this.clinic = clinic;
        });
    }

    setDoctorProfileList = (doctorProfileList: DoctorProfile[]) => {
        runInAction(() => {
            this.doctorProfileList = doctorProfileList;
        });
    }

    setDoctorProfile = (doctorProfile: DoctorProfile) => {
        runInAction(() => {
            this.doctorProfile = doctorProfile;
        });
    }

    setDoctorInsurerIds = (doctorInsurerIds: string[]) => {
        runInAction(() => {
            this.doctorInsurerIds = doctorInsurerIds;
        });
    }

    setPendingItem = (pendingItem: PendingItem) => {
        runInAction(() => {
            this.pendingItem = pendingItem;
        });
    };

    setPendingItems = (pendingItemList: PendingItem[]) => {
        runInAction(() => {
            this.pendingItems = pendingItemList;
        });
    };
}

export default DataStore;
