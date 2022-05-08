import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, View, Dimensions, Alert, Linking, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MCCButton from '../../components/mccButton';
import { useStores } from '../../stores';
import Swiper from 'react-native-swiper';
import * as _ from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay';
import { restartApp, updateApp } from '../../actions/app';
const dimension = Dimensions.get('window');

type ReminderModalType = {
    show: boolean,
    onDismiss: () => void
}

const ReminderModal = ({ show, onDismiss }: ReminderModalType) => {
    const stores = useStores();
    const { i18n, t } = useTranslation();

    const [index, setIndex] = useState(0);
    const [spinner, setSpinner] = useState(false);

    const { reminders } = stores.appStore;

    const changeSlider = (index: number) => {
        setIndex(index);
    }

    const onUpdate = async () => {
        setSpinner(true);
        const errorMsg = await updateApp({ i18n });
        if (errorMsg) {
            Alert.alert(
                t('Common.Error'),
                errorMsg,
                [
                    {
                        text: t('Common.Confirm'),
                        onPress: () => {
                            setSpinner(false);
                        }
                    }
                ]
            )
        }
        else {
            Alert.alert(
                t('Common.Success'),
                t('App.SystemUpdateSuccess'),
                [
                    {
                        text: t('Common.Confirm'),
                        onPress: () => {
                            setSpinner(false);
                            restartApp();
                        }
                    }
                ]
            )
        }
    }

    const onInstall = async () => {
        Linking.openURL(
            Platform.OS === 'android' ?
                'market://details?id=com.mediconcen.clinic' :
                'itms-apps://itunes.apple.com/us/app/apple-store/id1520154033?mt=8'
        );
    }

    return (
        <>
            <Spinner
                visible={spinner}
                color={'red'}
                size={'large'}
                overlayColor={'rgba(0, 0, 0, 0.25)'}
            />
            <Modal
                animationType='fade'
                transparent={true}
                visible={show}
            >
                <View style={styleSheet.modalContainer}>
                    <View style={styleSheet.modalContent}>
                        <View style={styleSheet.swiperContainer}>
                            <Swiper
                                loop={false}
                                activeDotColor='#ffffff'
                                onIndexChanged={changeSlider}
                                index={stores.authStore.selectedSlide}
                            >
                                {
                                    reminders.map(reminder => (

                                        <View style={styleSheet.modalContent}>
                                            <View style={styleSheet.padding}>
                                                <Text style={styleSheet.reminderTitle}>
                                                    {i18n.language === 'en' ? reminder?.titleEn : reminder?.titleChi}
                                                </Text>

                                                <ScrollView contentContainerStyle={styleSheet.reminderScollView}>
                                                    {(i18n.language === 'en' ? reminder?.descriptionEn : reminder?.descriptionChi)
                                                        ?.split('\\n').map((description: string, index: number) => {
                                                            return (
                                                                <Text
                                                                    key={`reminder-${reminder?.id}-${index}`}
                                                                    style={styleSheet.reminderContent}
                                                                >
                                                                    {description}
                                                                </Text>
                                                            );
                                                        })}
                                                </ScrollView>
                                            </View>

                                        </View>
                                    ))
                                }
                            </Swiper>
                        </View>
                        <View style={styleSheet.actionsContainer}>
                            {
                                _.get(reminders, `[${index}].id`) === 'updated' ? (
                                    <View style={styleSheet.action}>
                                        <MCCButton
                                            text={t('Common.Upgrade')}
                                            onPress={() => {
                                                onDismiss();
                                                setTimeout(onUpdate, 300);
                                            }}
                                        />
                                    </View>
                                ) : undefined
                            }
                            {
                                _.get(reminders, `[${index}].id`) === 'install' ? (
                                    <View style={styleSheet.action}>
                                        <MCCButton
                                            text={t('Common.Upgrade')}
                                            onPress={onInstall}
                                        />
                                    </View>
                                ) : undefined
                            }
                            <View style={styleSheet.action}>
                                <MCCButton
                                    text={t('Common.Confirm')}
                                    onPress={onDismiss}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styleSheet = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: dimension.width * 0.8,
        height: dimension.height * 0.5,
        borderRadius: 10,
        padding: 0,
        overflow: 'hidden',
        backgroundColor: '#FFF'
    },
    padding: {
        padding: 20,
        flexDirection: 'column'
    },
    swiperContainer: {
        flex: 1
    },
    reminderTitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
        backgroundColor: '#FFF'
    },
    reminderScollView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    reminderContent: {
        width: '100%',
        fontSize: 14,
    },
    actionsContainer: {
        flexDirection: 'row',
        padding: 10,
        paddingTop: 0
    },
    action: {
        flex: 1,
    }
});

export default ReminderModal;