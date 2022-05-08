import React, { useEffect, useRef, useState } from 'react';
import { Platform, StatusBar, AppState } from "react-native";
import CustomErrorBoundary from './errors';
import AuthNavigator from './routers/auth';
import { observer } from 'mobx-react';
import { initApp, checkCodePush } from './actions/app';
import { useStores } from './stores';
import { useTranslation } from 'react-i18next';
import Loading from './pages/loading';
import MainNavigator from './routers/main';
import ErrorPage from './pages/error';
import * as Notifications from 'expo-notifications';
import * as _ from 'lodash';
import { useNavigation } from '@react-navigation/native';
// import { useNavigation } from '@react-navigation/native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const App = observer(() => {
    const stores = useStores();
    const { i18n, t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [appState, setAppState] = useState('');

    useEffect(() => {
        StatusBar.setBarStyle("light-content");
        init();

        // AppState.addEventListener('change', handleAppStateChange);

        // // returned function will be called on component unmount 
        // return () => {
        //     AppState.removeEventListener('change', handleAppStateChange);
        // }
    }, []);

    // const handleAppStateChange = async (nextAppState: string) => {
    //     if (appState.match(/inactive|background/) && nextAppState === 'active') {
    //         console.log('App has come to the foreground!')
    //     }
    //     else {
    //         await checkCodePush();
    //     }
    //     setAppState(nextAppState);
    // };

    const init = async () => {
        setLoading(true);
        const errorMsg = await initApp({ stores, i18n, platform: Platform.OS });
        setLoading(false);
        console.log('errorMsg in App.tsx:', errorMsg);

        if (errorMsg) {
            setError(errorMsg);
        }
    }

    if (loading) {
        return (
            <CustomErrorBoundary>
                <Loading />
            </CustomErrorBoundary>
        );
    }

    if (error) {
        return (
            <CustomErrorBoundary>
                <ErrorPage title={error} onRetry={init} />
            </CustomErrorBoundary>
        );
    }

    if (!stores.appStore.token) {
        return (
            <CustomErrorBoundary>
                <AuthNavigator />
            </CustomErrorBoundary>
        )
    }

    return (
        <CustomErrorBoundary>
            <MainNavigator />
        </CustomErrorBoundary>
    )
});

export default App;