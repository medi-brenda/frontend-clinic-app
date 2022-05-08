import Bugsnag from '@bugsnag/expo';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Axios from 'axios';
import { i18n } from 'i18next';
import * as _ from 'lodash';
import Config from '../utils/config';
const TIMEOUT = 25000

const instance = Axios.create({
    baseURL: Config.nodeUrl,
    timeout: TIMEOUT
});

const phpInstance = Axios.create({
    baseURL: Config.phpUrl,
    timeout: TIMEOUT
});

type Request = {
    url: string,
    data?: any,
    token?: string,
    i18n: i18n,
    method?: any,
    isPublic?: boolean, // for some api without token,
    queryString?: string,
}

type PostRequest = {
    url: string,
    data?: any,
    token?: string,
    method?: any,
    isPublic?: boolean, // for some api without token,
}

type GetRequest = {
    url: string,
    data?: any,
    token?: string,
    method?: any,
    isPublic?: boolean, // for some api without token,
    queryString?: string,
}

type RequestPhp = {
    url: string,
    data?: any
}

type AuthData = {
    token: string;
    clinicId: string;
}

const postRequest = async ({ url, data, token, isPublic, method = 'post' }: PostRequest) => {
    const { data: resp } = await instance({
        url: url,
        method: method,
        data: isPublic ? data : {
            data,
            token
        }
    }).catch(error => {
        console.error('error calling api ',error);
        Bugsnag.notify(error, (event) => {
            event.addMetadata('info', {
                token,
                url: `${Config.nodeUrl}${url}`,
                data
            });
        });
        throw error;
    });
    return resp;
}

const getRequest = async ({ url, data, token, isPublic, method = 'get', queryString = '' }: GetRequest) => {
    const { data: resp } = await instance({
        baseURL: `${Config.nodeUrl}`,
        url: url+queryString,
        method: method,
        headers: {'Authorization': token},
    }).catch(error => {
        Bugsnag.notify(error, (event) => {
            event.addMetadata('info', {
                token,
                url: `${Config.nodeUrl}${url}`,
                data
            });
        });
        throw error;
    });
    return resp;
}

export const request = async ({ url, data, token, i18n, isPublic, method = 'post', queryString = '' }: Request) => {    
    let resp = null;

    switch (method)
    {
         case 'post':
            resp = await postRequest({ url, data, token, isPublic, method: 'post'});
            break;
        case 'get':
            resp = await getRequest({ url, data, token, isPublic, method: 'get', queryString});
            break;
        default:
            break;
    }

    if (!resp || resp.errCode !== 'E-00000') {
        const message = _.get(
            resp,
            i18n.language === 'en' ? 'msg_en' : 'msg_chi',
            i18n.t('Common.UnknownSystemError')
        );
        throw new Error(`${message}\n${i18n.t('Error.MediconcenCode')}: ${_.get(resp, 'errCode', 'N\\A')}\n${i18n.t('Error.InsurerCode')}: ${_.get(resp, 'responseCode', 'N\\A')}`);
    }
    return resp.msg_remark;
}

export const requestPhp = async ({ url, data }: RequestPhp) => {

    const resp = await phpInstance.post(
        url,
        JSON.stringify(data)
    ).catch(error => {
        
        Bugsnag.notify(error, (event) => {
            event.addMetadata('info', {
                url: `${Config.phpUrl}${url}`,
                data
            });
        });
        throw error;
    });

    if (!resp.data || resp.data.result !== '0000') {
        if (resp.data && url === 'api/authenticateToken.php') {
            return resp.data;
        }
        else if (resp.data && url === 'api/authenticate.php') {
            throw new Error(resp.data.result)
        }
        throw new Error('Common.UnknownSystemError');
    }

    return resp.data;
}

export const getAuthData = async (): Promise<AuthData> => {
    const token = await AsyncStorage.getItem('token');

    const emptyResult: AuthData = {
        token: '',
        clinicId: ''
    };


    //return emptyResult;

    if (!token) {
        return emptyResult;
    }

    const response = await requestPhp({
        url: 'api/authenticateToken.php',
        data: {
            token
        }
    });

    if (response.result !== '0000') {
        // dont remove first
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('clinic_id');

        return emptyResult;
    }

    return {
        token: response.token,
        clinicId: response.clinic_id
    };
}
