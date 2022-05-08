import { i18n } from "i18next";
import * as AppService from "../services/app";
import * as ClinicService from '../services/clinic';
import * as ModifyService from '../services/modify'
import { Stores } from "../stores"
import { findInsurer } from "../utils/common";
import { PendingItem } from '../models/pendingItem';
import { Insurer } from "../models/insurer";
import { toJS } from 'mobx'


type GetOptions = {
    stores: Stores
}

type GetDiagnosis = {
    stores: Stores,
    search: string,
    i18n: i18n
}

type GetInsurers = {
    i18n: i18n,
    stores: Stores,
}

type GetPendingListItems={
    i18n: i18n,
    stores: Stores,
};

type deletePendingListItem={
    i18n: i18n,
    stores: Stores,
    pendingItemId:number
};

export const getDiagnosis = async ({ stores, search, i18n }: GetDiagnosis) => {
    try {
        const { token } = stores.appStore;
        const { values } = stores.dataStore;
        const { insurers } = stores.configStore;
        const insurer = findInsurer(insurers, values.insurerId);

        const diagnosis = await ClinicService.getDiagnosis({
            token,
            search,
            insurer,
            payToken: values.token,
            i18n
        });
        stores.configStore.setDiagnosis(diagnosis);
    } catch (error) {
        return error.message;
    }
}

export const getBenefits = async ({ stores }: GetOptions) => {
    try {
        const { token, clinicId } = stores.appStore;
        const benefits = await AppService.getBenefits({
            token,
            clinicId
        });
        stores.configStore.setBenefits(benefits);
    } catch (error) {
        return 'Common.UnknownSystemError';
    }
}

export const getBenefitsByClinicInsurer = async ({ stores }: GetOptions) => {
    try {
        const { token, clinicId } = stores.appStore;
        const { values } = stores.dataStore;
        const benefits = await AppService.getBenefitsByClinicInsurer({
            token,
            clinicId,
            insurerId: values.insurerId?values.insurerId:""
        });
        stores.configStore.setBenefits(benefits);
    } catch (error) {
        return 'Common.UnknownSystemError';
    }
}


export const getDoctors = async ({ stores }: GetOptions) => {
    try {
        const { token, clinicId } = stores.appStore;
        const { setDoctors } = stores.configStore;
        const { values } = stores.dataStore;
        const doctors = await ClinicService.getDoctors({
            token,
            clinicId,
            benefitCode: values.benefitCode
        });
        setDoctors(doctors);
    } catch (error) {
        return 'Common.UnknownSystemError';
    }
}

export const getDoctorsByClinicInsurerBenefit = async ({ stores }: GetOptions) => {
    try {
        const { token, clinicId } = stores.appStore;
        const { setDoctors } = stores.configStore;
        const { values } = stores.dataStore;
        const doctors = await ClinicService.getDoctorsByClinicInsurerBenefit({
            token,
            clinicId,
            insurerId: values.insurerId?values.insurerId:"",
            benefitCode: values.benefitCode
        });
        setDoctors(doctors);
    } catch (error) {
        return 'Common.UnknownSystemError';
    }
}

export const getAllDoctors=async ({stores}:GetOptions)=>{
    try {
        const { token, clinicId } = stores.appStore;
        const { setDoctors } = stores.configStore;
        const doctors =await ClinicService.getAllDoctors({
            token,
            clinicId
        })
        setDoctors(doctors);
    }catch (e) {
        return 'Common.UnknownSystemError';
    }
}

export const getInsurers = async ({ stores, i18n }: GetInsurers) => {
    try {
        const { token } = stores.appStore;
        const { setInsurers } = stores.configStore;
        const insurers = await  ClinicService.getInsurers({
            token,
            i18n
        });

        
        setInsurers(insurers);
    } catch (error) {
        return 'Common.UnknownSystemError';
    }
}

export const getInsurersByClinic = async ({ stores, i18n }: GetInsurers) => {
    try {
        const { token, clinicId } = stores.appStore;
        const { setInsurers } = stores.configStore;
        const insurers = await  ClinicService.getInsurersByClinic({
            token,
            //i18n,
            clinicId
        });

        const insurer_order = {
            '24':1, //ZA
            '5':2, //FWD
            '4':3, //BOC
            '1':4, //BC
            '2':5, //BT
            '6':6, //CL-GM
            '7':7, //CLMP
            '23':8, //CTP
            '3':9, //HKL
            '8':10, //AVO
            '20':11, //MCC
        };

        insurers.sort((insurer1:Insurer, insurer2:Insurer)=>{return insurer_order[insurer1.code]-insurer_order[insurer2.code]});

        setInsurers(insurers);        

        
    } catch (error) {
        return 'Common.UnknownSystemError';
    }
}

export const getPendingListItems=async ({stores,i18n}:GetPendingListItems):Promise<string|void> => {
  try{
     const {token,clinicId}=stores.appStore;
     const {setPendingItems}=stores.dataStore;
     const pendingItems=await ModifyService.getPendingListItems({
         clinicId,
         token,
         i18n
     });
     setPendingItems(pendingItems);
  }  catch{
      return 'Common.UnknownSystemError';
  }
};

export const deletePendingItem=async({stores,i18n,pendingItemId}:deletePendingListItem)=>{
    try {
        const {token,clinicId}=stores.appStore;
        const {pendingItems,setPendingItems}=stores.dataStore;

        await ModifyService.deletePendingListItem({
            token,
            clinicId,
            i18n,
            pendingItemId
        });


        const remainingPendingItems=pendingItems.filter(e=>e.id!==pendingItemId);
        setPendingItems(remainingPendingItems);
    }catch (e) {
        return 'Common.UnknownSystemError';
    }
}
