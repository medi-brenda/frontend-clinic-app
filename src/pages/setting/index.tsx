import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, Switch, Text, View } from 'native-base';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OPModal from '../../components/opModal';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import { ListItem } from "react-native-elements";
import * as WebBrowser from "expo-web-browser";
import MCCButton from '../../components/mccButton';
import { changeLang, logout } from '../../actions/app';
import * as Notifications from 'expo-notifications';
import PhoneCall from "../../components/phoneCall";

const SettingPage = observer(() => {
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();
    const stores = useStores();

    const [authAction, setAuthoAction] = useState('');
    const [showOpModal, setShowOpModal] = useState(false);

    const notificationListener: any = useRef<any>();
    const responseListener: any = useRef<any>();

    const handlerNotificationReceived = (notification:any) => {
        if(notification.origin === 'selected'){
        }
    };

    useEffect(() => {
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const page:any = response.notification.request.content.data.page;
            navigation.navigate("Home", {screen: page});
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(handlerNotificationReceived);

        return () => {
            Notifications.removeNotificationSubscription(responseListener);
        };

    }, []);

    const openOpModal = (action: string) => {
        setAuthoAction(action);
        setShowOpModal(true);
    }

    const onOpModalDismiss = (password: string) => {
        setShowOpModal(false);
        if (password) {
            switch (authAction) {
                case 'settings':
                    return navigation.navigate('SettingDisplay');
            }
        }
    }

    const onChangeLange = () => {
        changeLang(i18n);
    }

    const onLogout = () => {
        logout({ stores, navigation, i18n });
    }

    return (
        <Container>
            <TitleBar
                title={t('Others.display_settings')}
                onBack={() =>
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }]
                    })
                }
            />
            <OPModal
                show={showOpModal}
                onDismiss={onOpModalDismiss}
            />
            <ScrollView>
                <ListItem
                    title={t('Others.ST1')}
                    leftIcon={{ name: "account-circle" }}
                    onPress={() => {
                        navigation.navigate('Profile');
                    }}
                    bottomDivider
                    chevron
                />
                <ListItem
                    title={t('Others.ST2')}
                    leftIcon={{ name: "info-outline" }}
                    onPress={() => {
                        navigation.navigate('AboutUs');
                    }}
                    bottomDivider
                    chevron
                />
                <ListItem
                    title={t('Others.ST3')}
                    leftIcon={{ name: "people" }}
                    onPress={() => {
                        WebBrowser.openBrowserAsync(
                            "https://web2.prod.mediconcen.com/m-term_and_agreement.php"
                        );
                    }}
                    bottomDivider
                    chevron
                />
                <ListItem
                    title={t('Others.ST10')}
                    leftIcon={{ name: "insert-drive-file" }}
                    onPress={() => {
                        WebBrowser.openBrowserAsync(
                            "https://web2.prod.mediconcen.com/m-service_agreement.php"
                        );
                    }}
                    bottomDivider
                    chevron
                />
                <ListItem
                    title={t('Others.ST4')}
                    leftIcon={{ name: "lock-outline" }}
                    onPress={() => {
                        WebBrowser.openBrowserAsync(
                            "https://web2.prod.mediconcen.com/m-pics.php"
                        );
                    }}
                    bottomDivider
                    chevron
                />

                <ListItem
                    title={t('Others.ST11')}
                    leftIcon={{ name: "lock-outline" }}
                    onPress={() => {
                        navigation.navigate('ChangePassword');
                    }}
                    bottomDivider
                    chevron
                />

                <ListItem
                    title={t('Others.ST7')}
                    leftIcon={{ name: "language" }}
                    bottomDivider
                    rightElement={
                        <>
                            <Text>En</Text>
                            <Switch
                                value={i18n.language !== 'en'}
                                onValueChange={onChangeLange}
                            />
                            <Text>繁</Text>
                        </>
                    }
                />


                <ListItem
                    title={t('Others.display_settings')}
                    leftIcon={{ name: "settings" }}
                    onPress={() => {
                        openOpModal('settings');
                    }}
                    bottomDivider
                    chevron
                />
                <View style={styleSheet.marginTop}>
                    <MCCButton
                        onPress={onLogout}
                        text={t('Others.ST8')}
                    />
                </View>
            </ScrollView>


            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    marginTop: {
        marginTop: 25
    }
});

export default SettingPage;
