import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Icon, View } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageBackground, StyleSheet, Dimensions, Text, Linking, Modal, StatusBar, Platform, Alert } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
const SwiperFlatList = require('react-native-swiper-flatlist').default;
import GridItem from '../../components/gridItem';
import styles from '../../styles';
import { useStores } from '../../stores';
import { getReminders, goTab as goTabAction, readReminders, checkCodePush } from '../../actions/app';

import * as _ from 'lodash';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OPModal from '../../components/opModal';
import ReminderModal from './reminderModal';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Notifications from 'expo-notifications';

const dimension = Dimensions.get('window');

const HomePage = observer(() => {
    const navigation = useNavigation();
    const stores = useStores();
    const { t, i18n } = useTranslation();

    const [showReminders, setShowReminders] = useState(false);
    const [showOpModal, setShowOpModal] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const notificationListener: any = useRef<any>();
    const responseListener: any = useRef<any>();

    // const navigation = useNavigation();
    const handlerNotificationReceived = (notification:any) => {
        if(notification.origin === 'selected'){
        }
    };


    useEffect(() => {
        init();

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const page:any = response.notification.request.content.data.page;
            navigation.navigate(page);
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(handlerNotificationReceived);

        return () => {
            Notifications.removeNotificationSubscription(responseListener);
        };

    }, []);

    const init = async () => {
        if (stores.appStore.readReminders) {
            return;
        }
        setSpinner(true);
        await checkCodePush();
        await getReminders({ stores, navigation, i18n, platform: Platform.OS });
        await checkCodePush();
        setSpinner(false);

        if (stores.appStore.reminders.length) {
            setTimeout(() => {
                setShowReminders(true);
            }, 300);
        }
    }

    const { banners, version, newsList } = stores.appStore;

    const goTab = (tabName: string) => {
        goTabAction({ navigation, tabName })
    }

    const goPage = (pageName: string) => {
        navigation.navigate(pageName);
    }

    const onReadReminder = () => {
        setShowReminders(false);
        readReminders({ stores });
    }

    const openOpModal = () => {
        setShowOpModal(true);
    }

    const onOpModalDismiss = (password: string) => {
        setShowOpModal(false);
        if (password) {
            goPage('Report');
        }
    }

    const onSupport = () => {
        Alert.alert(
            t('SupportCall.SupportTitle'),
            t('SupportCall.SupportDescription'),
            [
                {
                    text: t('Common.Cancel'),
                    style: 'cancel'
                },
                {
                    text: t('Common.Confirm'),
                    onPress: () => {
                        Linking.openURL('tel:95316485');
                    }
                }
            ]
        )
    }

    return (
        <ImageBackground
            source={require('../../assets/images/background/homeBG.png')}
            style={styleSheet.background}
        >
            <StatusBar translucent={true} backgroundColor='transparent' />
            <SafeAreaView style={styles.safeViewArea}>
                <View style={styleSheet.appbar}>
                    <Image
                        source={require('../../assets/images/logo/mccLogo.png')}
                        style={styleSheet.homeIcon}
                    />
                    <View style={styleSheet.info}>
                        <View style={styleSheet.clinicTitle}>
                            <Text style={styleSheet.appbarTitle}>{t('Home.ST6')}</Text>
                            <Text style={styleSheet.version}>v{version}</Text>
                        </View>
                        <TouchableOpacity onPress={onSupport}>
                            <Text style={styleSheet.contactUs}>{t('SupportCall.SupportHotline')}</Text>
                            <View style={styleSheet.supportTitle}>
                                <Icon name='phone' type='MaterialCommunityIcons' style={styleSheet.phoneIcon} />
                                <Text style={styleSheet.contactUsTel}>9531 6485</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
            <ScrollView contentContainerStyle={styleSheet.scrollView}>
                <Spinner
                    visible={spinner}
                    color={'red'}
                    size={'large'}
                    overlayColor={'rgba(0, 0, 0, 0.25)'}
                />
                <View style={styleSheet.content}>
                    <View style={styleSheet.row}>
                        <GridItem
                            image='verify'
                            title={t('Common.Verify')}
                            onPress={() => { goTab('Verify') }}
                        />
                        <GridItem
                            image='modify'
                            title={t('Common.PendingList')}
                            onPress={() => { goTab('Modify') }}
                        />
                    </View>
                    <View style={styleSheet.row}>
                        <GridItem
                            image='record'
                            title={t('Common.Records')}
                            onPress={() => { goTab('Record') }}
                        />
                        <GridItem
                            image='report'
                            title={t('Common.Reports')}
                            onPress={openOpModal}
                        />
                    </View>
                    <View style={styleSheet.row}>
                        <GridItem
                            image='cooperators'
                            title={t('Common.Cooperators')}
                            onPress={() => { goPage('Cooperators') }}
                            selfDefinedWidth = {60}
                            selfDefinedHeight = {60}
                            marginTop = {10}
                        />
                        <GridItem
                            image='update'
                            title={t('Common.More')}
                            onPress={() => { goPage('More') }}
                            custom={
                                newsList.find(news => news.important) ? (
                                    <MaterialCommunityIcons
                                        name='alert-circle'
                                        style={styleSheet.gridAlert}
                                    />
                                ) : undefined
                            }
                            selfDefinedWidth = {60}
                            selfDefinedHeight = {60}
                            marginTop = {10}
                        />
                    </View>
                    <View style={styleSheet.banner}>
                        <SwiperFlatList
                            autoplay
                            autoplayDelay={5}
                            autoplayLoop
                            autoplayInvertDirection
                            index={0}
                            showPagination
                            data={banners}
                            renderItem={({ item }: any) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            item.url && Linking.openURL(item.url);
                                        }}
                                    >
                                        <Image
                                            source={{ uri: item.source }}
                                            style={styleSheet.bannerImg}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </View>
                <ReminderModal
                    show={showReminders}
                    onDismiss={onReadReminder}
                />
                <OPModal
                    show={showOpModal}
                    onDismiss={onOpModalDismiss}
                />
            </ScrollView>
        </ImageBackground >
    )
});

const styleSheet = StyleSheet.create({
    clinicTitle: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    supportTitle: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    background: {
        width: '100%',
        height: '100%',
    },
    appbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16
    },
    phoneIcon: {
        fontSize: 16,
        marginRight: 8
    },
    homeIcon: {
        resizeMode: 'contain',
        marginLeft: 20,
        height: dimension.height * 0.08,
        width: (dimension.height * 0.08 * 14) / 5,
    },
    appbarTitle: {
        paddingRight: 8,
        fontSize: 20,
        alignSelf: 'flex-end'
    },
    contactUs: {
        marginTop: 8,
        fontSize: 16,
        alignSelf: 'flex-end',
        marginRight: 24
    },
    contactUsTel: {
        fontSize: 14,
        alignSelf: 'flex-end',
        marginRight: 24
    },
    scrollView: {
        flexGrow: 1
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 15,
        marginHorizontal: 10,
        width: '100%',
    },
    banner: {
        justifyContent: 'center',
        marginHorizontal: 10,
        borderRadius: 10,
        height: ((dimension.width - 40) * 230) / 700,
        width: dimension.width - 40,
        marginBottom: 16
    },
    bannerImg: {
        height: ((dimension.width - 40) * 230) / 700,
        width: dimension.width - 40,
        justifyContent: 'center',
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridAlert: {
        fontSize: 34,
        position: 'absolute',
        top: 4,
        right: 4,
        color: '#f00',
    },
    version: {
        fontSize: 12,
        marginRight: 24,
        marginBottom: 2,
        alignSelf: 'flex-end'
    },
    info: {
        flexDirection: 'column'
    }
})

export default HomePage;
