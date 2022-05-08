import React from 'react';
import AppStore from './app';
import AuthStore from './auth';
import ConfigStore from './config';
import DataStore from './data';

const stores = {
    authStore: new AuthStore(),
    appStore: new AppStore(),
    configStore: new ConfigStore(),
    dataStore: new DataStore()
};

export const storesContext = React.createContext(stores);

export const useStores = () => React.useContext(storesContext);

export type Stores = typeof stores;