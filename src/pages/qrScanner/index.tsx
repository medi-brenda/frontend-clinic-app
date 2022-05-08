import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import { observer } from 'mobx-react';
import { Container, View, Text } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Image } from "react-native";
import { TextInput } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { scanQrCode } from '../../actions/transaction';
import Scanner from '../../components/scanner';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import * as _ from 'lodash';
import { findBenefit, findDoctorOption } from '../../utils/common';
import PhoneCall from "../../components/phoneCall";

const QrScannerPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const { currentTab } = stores.appStore;

    const { values } = stores.dataStore;
    const { doctorId, benefitCode } = values;
    const { doctors, benefits } = stores.configStore

    // get doctor information
    const doctor = findDoctorOption(doctors, doctorId);
    const doctorName = translate(doctor, i18n);

    // get benefit information
    const benefit = findBenefit(benefits, benefitCode);
    const benefitName = translate(benefit, i18n);

    const [spinning, setSpinning] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [scanning, setScanning] = useState(false);
    const [permission, setPermission] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        checkCameraPermission();
    }, []);
    
    if (scanning && !isFocused) {
        setScanning(false);
    }

    const checkCameraPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        if (status === "granted") {
            setPermission(true);
        } else {
            setPermission(false);
            Alert.alert(t('Common.Error'), t('Error.CameraPermission'));
        }
    };

    const onChange = useCallback((text: string) => {
        setQrCode(_.toUpper(text));
    }, []);

    const onSubmit = useCallback(async (qrCode: string) => {
        // avoid use scan again
        if (scanning) {
            return;
        }
        setSpinning(true);
        setScanning(true);
        const errorMsg = await scanQrCode({ stores, navigation, qrCode: _.toUpper(qrCode), i18n });

        if (errorMsg) {
            Alert.alert(
                t('Common.Error'),
                errorMsg,
                [
                    {
                        text: t('Common.Confirm'),
                        onPress: () => {
                            setSpinning(false);
                            setScanning(false);
                        }
                    }
                ]
            )
        } else {
            setSpinning(false);
        }
    }, [scanning]);

    return (
        <Container>
            <Spinner
                visible={spinning}
                color={'red'}
                size={'large'}
                overlayColor={'rgba(0, 0, 0, 0.25)'}
            />
            <TitleBar
                title={t(`${currentTab}.ScanQrCode`)}
                onBack={() => {
                    navigation.goBack();
                }}
            />
            <View style={styleSheet.header}>
                <Image
                    source={require('../../assets/images/UI/searchSmall.png')}
                    resizeMode={"contain"}
                    style={styleSheet.searchIcon}
                />
                <TextInput
                    style={{
                        width: "100%",
                        height: "100%",
                        fontSize: 17,
                    }}
                    onChangeText={onChange}
                    placeholder={t(`${currentTab}.EnterQrCode`)}
                    value={qrCode}
                    autoCapitalize="characters"
                    textAlign="center"
                    maxLength={ stores.appStore.currentTab === 'Verify' ? 14 : 12}
                    onSubmitEditing={(e) => onSubmit(e.nativeEvent.text)}
                />
            </View>
            {
                permission === false && (
                    <View style={styleSheet.errorContainer}>
                        <Text style={styleSheet.errorText}>{t('Error.PleaseEnableCameraPermission')}</Text>
                    </View>
                )
            }

            {
                isFocused && permission && (
                    <Scanner
                        onScan={scanning ? undefined : onSubmit}
                        doctor={`${doctorName}/${benefitName}`}
                        button={t(`Verify.ST16`)}
                        onBack={() => {
                            navigation.goBack()
                        }}
                    />
                )
            }
            <PhoneCall />

        </Container>
    )
});

const styleSheet = StyleSheet.create({
    header: {
        height: 40,
        marginBottom: 10,
        backgroundColor: "white",
        borderRadius: 20,
        marginHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    searchIcon: {
        left: 15,
        height: "100%",
        position: "absolute",
    },
    errorContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        fontSize: 28,
        textAlign: "center"
    }
});

export default QrScannerPage
