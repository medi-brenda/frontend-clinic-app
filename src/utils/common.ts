import { Doctor } from "../models/doctor";
import { Insurer } from "../models/insurer";
import * as _ from 'lodash';
import { Option } from "../models/option";
import { Benefit } from "../models/benefit";

export const findDoctorOption = (doctors: Option[], doctorId: any) => {
    return _.find(doctors, doctor => _.toNumber(doctor.code) === _.toNumber(doctorId));
}

export const findInsurer = (insurers: Insurer[], insurerId: any) => {
    return _.find(insurers, insurer => _.toNumber(insurer.code) === _.toNumber(insurerId));
}

export const findBenefit = (benefits: Benefit[], benefitCode: string) => {
    return _.find(benefits, benefit => benefit.code === benefitCode);
}
