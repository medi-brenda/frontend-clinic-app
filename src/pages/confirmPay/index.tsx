import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, Text, View } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ImageBackground, StyleSheet } from 'react-native';
import Spinner from "react-native-loading-spinner-overlay";
import { ScrollView } from 'react-native-gesture-handler';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import * as _ from 'lodash';
import MCCButton from '../../components/mccButton';
import { pay } from '../../actions/transaction';
import PhoneCall from '../../components/phoneCall';
import { findInsurer } from '../../utils/common';
import ZaReminderBanner from "../../components/zaReminderBanner";

const ConfirmPayPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [spinner, setSpinner] = useState(false);

    const { method, values, pendingItem } = stores.dataStore;
    const { insurers } = stores.configStore;

    const onPaymentSuccess = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'PaymentInfo' }]
        });
    }

    const onPay = async () => {
        setSpinner(true);
        const result = await pay({ stores, navigation, i18n });

        if (result.success) {
            Alert.alert(
                t('Common.Confirm'),
                t('Modify.PaymentSuccess'),
                [
                    {
                        text: t('Common.Confirm'),
                        onPress: () => {
                            setSpinner(false);
                            onPaymentSuccess();
                        }
                    }
                ]
            )
        }
        else {
            Alert.alert(
                t('Common.Error'),
                result.message,
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




    const shouldShowToken = ()=>{
        return (
            method !== 'PhysicalCard' ? (
            <View style={styleSheet.row}>
                <Text style={styleSheet.subtitle}>{t('ExtraMed.QRCode')}</Text>
                <Text style={styleSheet.content}>{values.token}</Text>
            </View>
            ) : null
        )
    }

    const shouldShowZaBanner = ()=>{
        const predicate = ()=>{
            const {insurerId} = pendingItem;
            const insurerZaName = 'ZA';
            const foundInsurer = findInsurer(insurers,insurerId);
            return foundInsurer?.name === insurerZaName;
        };

        return predicate() && <ZaReminderBanner/>
    };


    return (
        <Container>
            <ImageBackground
                source={require('../../assets/images/background/homeBG.png')}
                style={styleSheet.background}
            >
                <Spinner
                    visible={spinner}
                    color={"red"}
                    size={"large"}
                    overlayColor={"rgba(0, 0, 0, 0.25)"}
                />
                <ScrollView contentContainerStyle={styleSheet.scrollView}>
                    <View>
                        <Text style={styleSheet.header}>$</Text>
                        <View>
                            <Text style={styleSheet.titleText}> {t('Payment.ConfirmPay')}</Text>
                        </View>
                    </View>

                    {
                        shouldShowToken()
                    }
                    {
                        shouldShowZaBanner()
                    }

                    <View style={styleSheet.row}>
                        <Text style={styleSheet.subtitle}>{t('ExtraMed.ServiceType')}</Text>
                        <Text style={styleSheet.content}>{t('ExtraMed.Notice')}</Text>
                    </View>

                    <View style={styleSheet.row}>
                        <Text style={styleSheet.subtitle}>{t('Common.Diagnosis')}</Text>
                        {
                            values.diagnosis.map((d, index) => (
                                <Text key={`diagnosis-${index}`} style={styleSheet.content}>
                                    {`${d.code} - ${translate(d, i18n)}`}
                                </Text>
                            ))
                        }
                    </View>

                    <View style={styleSheet.row}>
                        <Text style={styleSheet.subtitle}>
                            {t('Modify.ExtraMedTotal')}
                        </Text>
                        <Text style={styleSheet.content}>HKD ${_.sumBy(values.extraMed, d => Number(d.price)).toFixed(1)}</Text>
                    </View>

                    <View style={styleSheet.row}>
                        <Text style={styleSheet.subtitle}> {t('Common.ExtraMed')} </Text>
                        {
                            !values.extraMed.length ? (
                                <Text style={styleSheet.content}>-</Text>
                            ) : (
                                    values.extraMed.map((item, index) => (
                                        <Text key={`extraMed-${index}`} style={styleSheet.content}>
                                            HKD ${item.price} - {item.code}
                                        </Text>
                                    ))
                                )
                        }
                    </View>

                    <View>
                        <Text
                            ellipsizeMode="tail"
                            style={styleSheet.warning}
                        >
                            {t('Modify.ConfirmWarning')}
                        </Text>
                    </View>
                </ScrollView>
                <View style={styleSheet.action}>
                    <View style={styleSheet.buttonContainer}>
                        <MCCButton
                            onPress={() => {
                                navigation.goBack();
                            }}
                            text={t('Modify.Back')}
                            color="grey"
                        />
                    </View>
                    <View style={styleSheet.buttonContainer}>
                        <MCCButton
                            onPress={onPay}
                            text={t('Modify.Submit')}
                        />
                    </View>
                </View>
            </ImageBackground>

            <PhoneCall style={styleSheet.hotline}/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
    },
    scrollView: {
        justifyContent: "space-between",
        alignItems: "center",
        flexGrow: 1,
    },
    header: {
        fontSize: 175,
        textAlign: "center",
        color: "white",
    },
    titleText: {
        fontSize: 30,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 22,
        color: "white",
        textAlign: "center",
    },
    content: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    row: {
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    warning: {
        fontSize: 16,
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    action: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 5,
    },
    buttonContainer: {
        flex: 1,
        paddingHorizontal: 10
    },
    hotline:{
        bottom:80
    }
});

export default ConfirmPayPage;
