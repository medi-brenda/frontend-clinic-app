import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Button, Container, Picker as IosPicker, Input, Item, Text, View, Icon } from 'native-base';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Platform, Picker, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import * as _ from 'lodash';
import Spinner from 'react-native-loading-spinner-overlay';
import { verifyPhysicalCard } from '../../actions/transaction';
import { findBenefit, findDoctorOption, findInsurer } from '../../utils/common';
import ZoomImage from '../../components/zoomImage';
import PhoneCall from "../../components/phoneCall";
import { toJS } from 'mobx'


const SelectPhysicalCardPage = observer(() => {
    const stores = useStores();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const [spinner, setSpinner] = useState(false);
    const [showZoomImage, setShowZoomImage] = useState(false);

    const { doctors, benefits, insurers } = stores.configStore;
    const { values, doctorInsurerIds } = stores.dataStore;

    const doctor = findDoctorOption(doctors, values.doctorId);
    const benefit = findBenefit(benefits, values.benefitCode);

    const insurerId  = values.insurerId;
    /*
    const [insurerId, setInsurerId] = useState('1');

    useEffect(() => {
        // Update the document title using the browser API
        setInsurerId(values.insurerId?values.insurerId:"");
        console.log('state insurerId: ', insurerId);
      }, []);
    */

    const [policyNo, setPolicyNo] = useState('');

    /*
    const onInsurerIdChange = (insurerId: string) => {
        setInsurerId(insurerId);
    }
    */

    const onPolicyChange = (value: string) => {
        setPolicyNo(_.toUpper(value));
    }

    const onPolicyNoBlur = () => {
        setPolicyNo(_.toUpper(policyNo));
    }

    const onSubmit = async () => {
        setSpinner(true);
        const errorMsg = await verifyPhysicalCard({
            insurerId:insurerId?insurerId:"",
            policyNo,
            i18n,
            stores,
            navigation
        });

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
            );
        }
        else {
            setSpinner(false);
        }
    }

    const insurer = toJS(findInsurer(insurers, insurerId));
    //console.log("insurer: ", insurer, "insurer id: ", insurerId);



    return (
        <Container>
            <Spinner
                visible={spinner}
                color={"red"}
                size={"large"}
                overlayColor={"rgba(0, 0, 0, 0.25)"}
            />
            <TitleBar
                title={t('PhysicalCard.Card')}
                onBack={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView contentContainerStyle={styleSheet.scrollView}>
                <View style={styleSheet.padding}>
                    <Text style={styleSheet.title}>
                        {t('PhysicalCard.Title')}
                    </Text>
                    <Text style={styleSheet.description}>
                        {t('PhysicalCard.Description')}
                    </Text>
                    <View style={styleSheet.selectInfo}>
                        <Text>{`${t('PhysicalCard.Selected')} - `}</Text>
                    </View>
                    <Text style={styleSheet.red}>
                        {`${translate(doctor, i18n)} / ${translate(benefit, i18n)}`}
                    </Text>
                    <Text style={styleSheet.card}>
                        {t('PhysicalCard.Card')}
                    </Text>
                    <Text style={styleSheet.red}>
                        {`${translate(insurer, i18n)}`}
                    </Text>
                    

                    <View style={styleSheet.policyNo}>
                        <Item>
                            <Input
                                onChange={e => onPolicyChange(e.nativeEvent.text)}
                                placeholder={t('PhysicalCard.PolicyNo')}
                                placeholderTextColor='#a7a7a7'
                                autoCapitalize='characters'
                                onBlur={onPolicyNoBlur}
                            />
                        </Item>
                    </View>

                    <Button
                        disabled={!policyNo}
                        style={[styleSheet.submitButton, policyNo === '' ? styleSheet.disabled : styleSheet.enabled]}
                        onPress={onSubmit}
                    >
                        <Text style={styleSheet.submitText}>
                            {t('PhysicalCard.Submit')}
                        </Text>
                    </Button>
                    <Text style={styleSheet.exampleText}>{translate(insurer?.physicalCardDesc, i18n)}</Text>
                    <View style={styleSheet.exampleImage}>
                        <TouchableOpacity onPress={() => setShowZoomImage(true)}>
                            <Image
                                style={{ width: 320, height: 180 }}
                                source={{ uri: insurer?.physicalCardImg }}
                            />
                        </TouchableOpacity>

                    </View>
                    <ZoomImage
                        show={showZoomImage}
                        title={t('PhysicalCard.Card')}
                        onDismiss={() => setShowZoomImage(false)}
                        urls={[{
                            url: insurer?.physicalCardImg || ''
                        }]}
                    />
                </View>
            </ScrollView>

            <PhoneCall/>
        </Container >
    )
});

const styleSheet = StyleSheet.create({
    scrollView: {
        flexGrow: 1
    },
    padding: {
        paddingHorizontal: 24,
        paddingBottom: 24
    },
    title: {
        fontSize: 32,
        paddingVertical: 24
    },
    description: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.4)'
    },
    selectInfo: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: 16
    },
    red: {
        color: 'red',
        marginLeft: 16
    },
    card: {
        marginVertical: 12
    },
    pickerContainer: {
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: '#fff'
    },
    picker: {
        flex: 1
    },
    policyNo: {
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 12,
        backgroundColor: '#fff',
        paddingHorizontal: Platform.OS === 'ios' ? 11 : 0
    },
    disabled: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    enabled: {
        backgroundColor: '#ff8566'
    },
    submitButton: {
        marginTop: 12,
        width: 96,
        justifyContent: 'center'
    },
    submitText: {
        color: '#FFF'
    },
    exampleText: {
        marginHorizontal: 8,
        color: '#b61827'
    },
    exampleImage: {
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 12
    }
});

export default SelectPhysicalCardPage;
