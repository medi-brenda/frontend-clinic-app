import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Body, Text, View } from 'native-base';
import Swiper from 'react-native-swiper';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../stores';
import { goLogin, startRegister, swapSwiper } from '../../actions/auth';
import { changeLang } from '../../actions/app';
import BackgroundImage from '../../components/backgroundImage';
import MCCButton from '../../components/mccButton';
import ImageSlide from './imageSlide';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = observer(() => {
    const stores = useStores();
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();

    const changeSlider = (index: number) => {
        swapSwiper({
            index,
            stores
        });
    }

    const onLogin = () => {
        goLogin({ stores, navigation });
    }

    const onRegister = () => {
        startRegister({ stores, navigation });
    }

    const onChangeLang = () => {
        changeLang(i18n);
    }

    return (
        <Swiper
            style={styleSheet.wrapper}
            loop={false}
            activeDotColor='#ffffff'
            onIndexChanged={changeSlider}
            index={stores.authStore.selectedSlide}
        >
            <ImageSlide
                image={require('../../assets/images/swiper1.png')}
                header={t('Auth.Swiper0Header')}
                subHeader={t('Auth.Swiper0SubHeader')}
            />
            <ImageSlide
                image={require('../../assets/images/swiper2.png')}
                header={t('Auth.Swiper1Header')}
                subHeader={t('Auth.Swiper1SubHeader')}
            />
            <ImageSlide
                image={require('../../assets/images/swiper3.png')}
                header={t('Auth.Swiper2Header')}
                subHeader={t('Auth.Swiper2SubHeader')}
            />
            <BackgroundImage source={require('../../assets/images/background/homeBG.png')}>
                <Body>
                    <View style={styleSheet.body}>
                        <View>
                            <Image
                                source={require('../../assets/images/mcc-black-medium.png')}
                                style={{
                                    height: 300,
                                    width: 300,
                                }}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={{ height: 30 }} />

                        <MCCButton
                            onPress={onLogin}
                            text={t('Auth.Login').toUpperCase()}
                        />
                        <MCCButton
                            onPress={onRegister}
                            text={t('Auth.Register').toUpperCase()}
                            color='white'
                            buttonStyle={{ marginTop: 15 }}
                        />
                    </View>
                </Body>
                <TouchableOpacity
                    onPress={onChangeLang}
                    style={styleSheet.touch}
                >
                    <Text style={styleSheet.lang}>
                        {i18n.language === 'en' ? '中' : 'Eng'}
                    </Text>
                </TouchableOpacity>
                <View style={styleSheet.versionContainer}>
                <Text style={styleSheet.version}>
                    v{stores.appStore.version}
                </Text>
                </View>
            </BackgroundImage>
        </Swiper >
    )
});

const styleSheet = StyleSheet.create({
    wrapper: {},
    body: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    touch: {
        position: 'absolute',
        top: 40,
        left: 40
    },
    lang: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    versionContainer: {
        position: 'absolute',
        top: 40,
        right: 40
    },
    version: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    }
});

export default SplashScreen;
