import { extendObservable, runInAction } from 'mobx';
import { Authority } from '../models/authorities';
import { Bank } from '../models/bank';
import { Benefit } from '../models/benefit';
import { ActionState } from '../models/common';
import { District } from '../models/district';
import { Doctor, newDoctor } from '../models/doctor';
import { Insurer } from '../models/insurer';
import { RegistrationForm, newRegistrationForm } from '../models/registrationForm';
import { Schedule } from '../models/schedule';
import { Specialities } from '../models/specialities';

export class AuthStore {
    bannerSeen: boolean = false;
    selectedSlide: number = 0;

    // registers
    registerData: RegistrationForm = newRegistrationForm();
    authState: ActionState = 'init';

    // doctor detail page
    doctorType: string = '';
    doctorIndex: number = 0;
    doctor: Doctor = newDoctor();

    // service hour page
    scheduleType: string = '';
    schedules: Schedule[] = [];

    constructor() {
        extendObservable(this, {
            bannerSeen: false,
            selectedSlide: 0,
            banks: [],
            districts: [],
            specialities: [],
            authorities: [],
            benefits: [],
            insurers: [],
            registerData: newRegistrationForm(),
            authState: 'init',
            doctorType: '',
            doctorIndex: 0,
            doctor: newDoctor(),
            scheduleType: '',
            schedules: []
        });
    }

    setSelectedSlide = (index: number) => {
        runInAction(() => {
            if (index === 3) {
                this.bannerSeen = true;
            }
            this.selectedSlide = this.bannerSeen ? 3 : index;
        })
    }

    setRegisterData = (registerData: RegistrationForm) => {
        runInAction(() => {
            this.registerData = registerData;
        })
    }

    setDoctorType = (doctorType: string) => {
        runInAction(() => {
            this.doctorType = doctorType;
        })
    }

    setDoctorIndex = (doctorIndex: number) => {
        runInAction(() => {
            this.doctorIndex = doctorIndex;
        })
    }

    setDoctor = (doctor: Doctor) => {
        runInAction(() => {
            this.doctor = doctor;
        })
    }

    setScheduleType = (scheduleType: string) => {
        runInAction(() => {
            this.scheduleType = scheduleType;
        })
    }

    setSchedules = (schedules: Schedule[]) => {
        runInAction(() => {
            this.schedules = schedules;
        })
    }

    setAuthState = (authState: ActionState) => {
        runInAction(() => {
            this.authState = authState;
        })
    }
}

export default AuthStore;