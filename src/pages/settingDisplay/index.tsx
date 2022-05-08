import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { initSetting, saveSettings } from '../../actions/app';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import * as _ from 'lodash';
import SettingListItem from './listItem';
import ErrorPage from '../error';
import Loading from '../loading';
import MCCButton from '../../components/mccButton';
import Spinner from 'react-native-loading-spinner-overlay';
import Config from '../../utils/config';
import PhoneCall from "../../components/phoneCall";

const SettingDisplayPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const { setting } = stores.appStore;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [values, setValues] = useState(setting);
    const [spinner, setSpinner] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        const errorMsg = await initSetting({ stores, navigation, i18n });
        setLoading(false);
        setValues(_.cloneDeep(stores.appStore.setting));
        if (errorMsg) {
            setError(errorMsg)
        }
    }

    const onDisplayIncomeSwitch = () => {
        values.displayIncome = !values.displayIncome;
        setValues(values);
        setRefresh(!refresh);
    }

    const onPhysicalCardSwitch = () => {
        values.method.physicalCard = !values.method.physicalCard;
        setValues(values);
        setRefresh(!refresh);
    }

    const onSave = async () => {
        setSpinner(true);
        const errorMsg = await saveSettings({ stores, navigation, settings: values, i18n });
        if (!errorMsg) {
            Alert.alert(
                t('Common.Success'),
                t('Settings.saveSettingsSuccessfully'),
                [
                    {
                        text: t('Common.Confirm'),
                        onPress: () => {
                            setSpinner(false);
                        }
                    }
                ]
            );
        }
        else {
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
            );
        }
    }

    return (
        <Container>
            <TitleBar
                title={t('Others.display_settings')}
                onBack={() => { navigation.goBack(); }}
            />
            <ScrollView>
                <Spinner
                    visible={spinner}
                    color={'red'}
                    size={'large'}
                    overlayColor={'rgba(0, 0, 0, 0.25)'}
                />
                {
                    loading ? <Loading /> :
                        error ? <ErrorPage title={error} onRetry={init} /> :
                            <View style={styleSheet.container}>
                                <SettingListItem
                                    icon='cash'
                                    title={t('Settings.DisplayAmountFromNetwork')}
                                    value={values.displayIncome}
                                    onChange={onDisplayIncomeSwitch}
                                />
                                {
                                    Config.method.physicalCard ? (
                                        <SettingListItem
                                            icon='physicalimg'
                                            title={t('PhysicalCard.Card')}
                                            value={values.method.physicalCard}
                                            onChange={onPhysicalCardSwitch}
                                        />
                                    ) : undefined
                                }
                                <View style={styleSheet.padding}>
                                    <MCCButton
                                        onPress={onSave}
                                        text={t('Settings.saveSettings')}
                                    />
                                </View>
                            </View>
                }

            </ScrollView>

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 10,
        alignSelf: 'center'
    },
    title: {
        paddingLeft: 0,
        paddingBottom: 10,
        marginBottom: 5,
        marginTop: 0,
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    context: {
        paddingLeft: 15,
        paddingRight: 10,
        color: "rgba(0,0,0,0.4)",
        fontSize: 14,
        textAlign: "left",
    },
    padding: {
        padding: 25
    }
});

export default SettingDisplayPage;
