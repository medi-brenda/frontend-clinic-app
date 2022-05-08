import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container } from 'native-base';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { initModify } from '../../actions/app';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import * as Notifications from 'expo-notifications';

const ModifyPage = observer(() => {
    const stores = useStores();
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();

    const [error, setError] = useState('');
    const [inited, setInited] = useState(false);

    useFocusEffect(() => {
        if (inited) {
            return;
        }
        init();
    });

    const init = async () => {
        setInited(true);
        setError('');
        const errorMsg = await initModify({ stores, navigation, i18n });
        if (errorMsg) {
            setError(errorMsg);
        }

        const notificationListener: any = useRef<any>();
        const responseListener: any = useRef<any>();
    
        const handlerNotificationReceived = (notification:any) => {
            if(notification.origin === 'selected'){
            }
        };
        
        useEffect(() => {
            init();
    
            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                const page:any = response.notification.request.content.data.page;
                navigation.navigate("Home", {screen: page});
            });
    
            notificationListener.current = Notifications.addNotificationReceivedListener(handlerNotificationReceived);
    
            return () => {
                Notifications.removeNotificationSubscription(responseListener);
            };
    
        }, []);
    }

    return (
        <Container>
            <TitleBar
                title={t('Common.PendingList')}
                onBack={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }]
                    });
                }}
            />
            {
                error ?
                    <ErrorPage title={error} onRetry={init} /> :
                    <Loading />
            }
        </Container>
    )
});

export default ModifyPage;
