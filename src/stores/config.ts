import {extendObservable, runInAction} from 'mobx';
import {Authority} from '../models/authorities';
import {Bank} from '../models/bank';
import {Benefit} from '../models/benefit';
import {District} from '../models/district';
import {Insurer} from '../models/insurer';
import {Option} from '../models/option';
import {newSetting} from '../models/setting';
import {Specialities} from '../models/specialities';

export class ConfigStore {
    // registers
    banks: Bank[] = [];
    districts: District[] = [];
    specialities: Specialities[] = [];
    authorities: Authority[] = [];
    insurers: Insurer[] = [];
    benefits: Benefit[] = [];
    doctors: Option[] = [];
    diagnosis: Option[] = [];

    constructor() {
        extendObservable(this, {
            banks: [],
            districts: [],
            specialities: [],
            authorities: [],
            benefits: [],
            insurers: [],
            doctor: [],
            diagnosis: [],
            setting: newSetting()
        });
    }

    setBanks = (banks: Bank[]) => {
        runInAction(() => {
            this.banks = banks;
        })
    }

    setDistricts = (districts: District[]) => {
        runInAction(() => {
            this.districts = districts;
        })
    }

    setSpecialities = (specialities: Specialities[]) => {
        runInAction(() => {
            this.specialities = specialities;
        })
    }

    setAuthorities = (authorities: Authority[]) => {
        runInAction(() => {
            this.authorities = authorities;
        })
    }

    setBenefits = (benefits: Benefit[]) => {
        runInAction(() => {
            this.benefits = benefits;
        })
    }

    setInsurers = (insurers: Insurer[]) => {
        runInAction(() => {
            this.insurers = insurers;
        })
    }

    setDoctors = (doctors: Option[]) => {
        runInAction(() => {
            this.doctors = doctors;
        })
    }

    setDiagnosis = (diagnosis: Option[]) => {
        runInAction(() => {
            this.diagnosis = diagnosis;
        })
    }

}

export default ConfigStore;
