import { Consultation } from "../models/consultation";
import { ExtraMed } from "../models/extraMed";
import { Option } from "../models/option";
import * as _ from 'lodash';
import { Item } from "native-base";

export const validateEmail = (email: string) => {
    var reg = /\S+@\S+\.\S+/;
    return reg.test(String(email).toLowerCase());
};

export const validatePass = (password: string) => {
    let PassLength = password?.length;
    return PassLength >= 6;
};

export const validateName = (name: string) => {
    return name?.length > 0;
};

export const validatePhone = (phone: string) => {
    return phone?.length == 8;
};

export const validateBankAccountNumber = (accountNumber: string) => {
    return accountNumber?.length >= 6 && accountNumber?.length <= 12;
};

export const validateClinicName = (name: string) => {
    return name?.length > 0;
};

export const validateRegion = (region: string) => {
    return !!region && region !== 'Select';
};

export const validateDistrict = (district: string) => {
    return !!district;
};

export const validatePhoneAllowEmpty = (phone: string) => {
    return !phone || phone.length === 8;
};

export const validateGender = (gender: string) => {
    return !!gender;
}

export const validateMedicalServices = (medicalServices: string[]) => {
    return medicalServices.length && !medicalServices.find(medi => !medi) ? true : false;
};

export const validateAuthority = (authority: string) => {
    return !!authority;
}

export const validateDocCert = (cert: string) => {
    return !!cert;
}

export const validateConsulatation = (consultations: Consultation[]) => {
    return consultations
        .map(
            (consultation) =>
                consultation.benefit &&
                consultation.insurer &&
                Number.isInteger(parseInt(consultation.price)) &&
                parseInt(consultation.price) >= 0
        )
        .every((i) => i === true);
}

export const validateDiagnosis = (dianosis: Option[]) => {
    return dianosis.length && dianosis.length < 3;
}

export const validateExtraMed = (extraMed: ExtraMed[]) => {
    const reg = /[*|,":<>\[\]{}`';()@&$#%]/;
    if (_.uniq(extraMed.map(med => med.code)).length !== extraMed.length) {
        return false;
    }

    return !_.find(extraMed, (med) => {
        const price = Number(med.price || 0);
        if (isNaN(price)) {
            return true;
        }

        if (!med.code || !price) {
            return true;
        }

        if (med.code && !price) {
            return true;
        }

        if (price && !med.code) {
            return true;
        }

        if (med.code.length > 199) {
            return true;
        }

        if (reg.test(med.code)) {
            return true;
        }
    });
}