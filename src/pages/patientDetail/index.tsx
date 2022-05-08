import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Body, Button, CheckBox, Container, ListItem, Text, View } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import * as _ from 'lodash';
import { IMAGE_PREFLX } from '../../utils/constants';
import SignaturePad from '../../components/signaturePad';
import MCCButton from '../../components/mccButton';
import { goConfirmPayPage } from '../../actions/app';
import numeral from 'numeral';
import { findBenefit, findDoctorOption, findInsurer } from '../../utils/common';
import PhoneCall from "../../components/phoneCall";

const PatientDetailPage = observer(() => {
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();
    const stores = useStores();
    const { insurers, doctors, benefits } = stores.configStore;
    const { values } = stores.dataStore;

    const insurer = findInsurer(insurers, values.insurerId);
    const doctor = findDoctorOption(doctors, values.doctorId);
    const benefit = findBenefit(benefits, values.benefitCode);

    const extraMedSum = values.extraMed.length ? _.sumBy(values.extraMed, (extraMedItem) => _.toNumber(extraMedItem.price)) : 0;
    const patientExtraMed = Math.max(numeral(extraMedSum).subtract(_.toNumber(values.extraMedLimit)).value(), 0);

    const [signature, setSignature] = useState('');
    const [tempSign, setTempSign] = useState('');
    const [confirmSigned, setConfirmSigned] = useState(false);
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [refreshPad, setRefreshPad] = useState(false);

    const allowSubmit = (confirmSigned && signature);

    const onSignatureChange = (sign: string) => {
        setTempSign(sign.substring(IMAGE_PREFLX.length));
    }

    const refreshSignaturePad = () => {
        setTempSign('');
        setRefreshPad(!refreshPad);
    }

    const openSignaturePad = () => {
        setShowSignaturePad(true);
        setTempSign('');
    }

    const onConfirmSignChange = () => {
        setConfirmSigned(!confirmSigned);
    }

    const cancelSignaturePad = () => {
        setShowSignaturePad(false);
        setTempSign('');
    }

    const completeSignaturePad = async () => {
        setSignature(tempSign);
        setShowSignaturePad(false);
    }

    const clearSignature = () => {
        setSignature('');
    }

    const onSubmit = () => {
        goConfirmPayPage({ stores, signature, navigation });
    }

    return (
        <Container>
            <TitleBar
                title={t(`Modify.PatientDetail`)}
                onBack={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView>
                <View style={styleSheet.topView}>
                    <View style={styleSheet.container}>
                        <View style={{ ...styleSheet.column, ...styleSheet.column1 }}>
                            <Text style={styleSheet.columnText}>
                                {t('Verify.Insurer')}
                            </Text>
                        </View>
                        <View style={{ ...styleSheet.column, ...styleSheet.column2 }}>
                            <Text style={styleSheet.columnText}>
                                {translate(insurer, i18n)}
                            </Text>
                        </View>
                    </View>
                    <View style={styleSheet.container}>
                        <View style={{ ...styleSheet.column, ...styleSheet.column1 }}>
                            <Text style={styleSheet.columnText}>
                                {t('Modify.ST20')}
                            </Text>
                        </View>
                        <View style={{ ...styleSheet.column, ...styleSheet.column2 }}>
                            <Text style={styleSheet.columnText}>
                                {translate(doctor, i18n)}
                            </Text>
                            <Text style={styleSheet.columnText}>

                                {translate(benefit, i18n)}
                            </Text>
                        </View>
                    </View>
                    <View style={styleSheet.container}>
                        <View style={{ ...styleSheet.column, ...styleSheet.column1 }}>
                            <Text style={styleSheet.columnText}>
                                {t('Modify.ST33')}
                            </Text>
                        </View>
                        <View style={{ ...styleSheet.column, ...styleSheet.column2 }}>
                            <Text style={styleSheet.columnText}>
                                {values.member}
                            </Text>
                        </View>
                    </View>
                    <View style={styleSheet.container}>
                        <View style={{ ...styleSheet.column, ...styleSheet.column1 }}>
                            <Text style={styleSheet.columnText}>
                                {t('Modify.ST31')}
                            </Text>
                        </View>
                        <View style={{ ...styleSheet.column, ...styleSheet.column2 }}>
                            <Text style={styleSheet.columnText}>
                                {values.patientName}
                            </Text>
                        </View>
                    </View>
                    <View style={styleSheet.container}>
                        <View style={{ ...styleSheet.column, ...styleSheet.column1 }}>
                            <Text style={styleSheet.columnText}>
                                {t('Modify.ST26')}
                            </Text>
                        </View>
                        <View style={{ ...styleSheet.column, ...styleSheet.column2 }}>
                            <Text style={styleSheet.columnText}>
                                {t('ExtraMed.ServiceType')}
                            </Text>
                        </View>
                    </View>
                    <View style={styleSheet.container}>
                        <View style={{ ...styleSheet.column, ...styleSheet.column1 }}>
                            <Text style={styleSheet.columnText}>
                                {t('Common.Diagnosis')}
                            </Text>
                        </View>
                        <View style={{ ...styleSheet.column, ...styleSheet.column2 }}>
                            {
                                values.diagnosis.map((d, index) => (
                                    <View key={`diagnosis-${index}`} style={{ flexDirection: 'row' }}>
                                        <Text style={styleSheet.columnText}>
                                            ({index + 1})
                                            </Text>
                                        <Text style={styleSheet.columnText}>
                                            {' '}
                                        </Text>
                                        <Text style={{ ...styleSheet.columnText, flex: 1 }}>
                                            {`${d.code} - ${translate(d, i18n)}`}
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                    {
                        values.extraMed.length ? (
                            <View style={styleSheet.container}>
                                <View style={{ ...styleSheet.column, ...styleSheet.column1 }}>
                                    <Text style={styleSheet.columnText}>
                                        {t('Modify.ST27')}
                                    </Text>
                                </View>
                                <View style={styleSheet.column2}>
                                    <View style={styleSheet.column}>
                                        {
                                            values.extraMed.map((e, index) => (
                                                <View key={`extraMed-${index}`} style={{ flexDirection: 'row' }}>
                                                    <Text style={styleSheet.columnText}>
                                                        ({index + 1})
                                                        </Text>
                                                    <Text style={styleSheet.columnText}>
                                                        {' '}
                                                    </Text>
                                                    <Text style={{ ...styleSheet.columnText, flex: 1 }}>
                                                        {`${e.code} $${e.price}`}
                                                    </Text>
                                                </View>
                                            ))
                                        }
                                    </View>
                                    <View style={styleSheet.column}>
                                        <Text style={styleSheet.columnText}>
                                            {`${t('Modify.ST35')}: $${extraMedSum.toFixed(2)}`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ) : null
                    } 

                    <View style={styleSheet.border} />

                    <Text style={styleSheet.infoText}>
                        {t('Modify.PleasePaid')}: ${(patientExtraMed + _.toNumber(values.copayment)).toFixed(2)}
                    </Text>
                    <Text style={styleSheet.infoText}>
                        - {t('Common.Copayment')}: ${values.copayment || 0}
                    </Text>
                    <Text style={styleSheet.infoText}>
                        - {t('Modify.ExtraMedFee')}: ${Math.max(extraMedSum - _.toNumber(values.extraMedLimit), 0).toFixed(2)}
                    </Text>
                    <Text style={styleSheet.signatureTitle}>
                        {`${t('Modify.Signature')}\n${t('Modify.SignatureReminder')}`}
                    </Text>
                    <Button transparent={true} style={styleSheet.signatureContainer} onPress={openSignaturePad}>
                        {signature ?
                            (
                                <Image
                                    style={{ width: '100%', height: 320, resizeMode: 'contain' }}
                                    source={{ uri: `${IMAGE_PREFLX}${signature}` }} />
                            ) : null
                        }
                    </Button>
                    <Button
                        onPress={clearSignature}
                        style={styleSheet.clearSignatureButton}
                    >
                        <Text>{t('Modify.ClearSignature')}</Text>
                    </Button>
                    <ListItem style={styleSheet.confirmSignedContainer}>
                        <CheckBox
                            checked={confirmSigned}
                            onPress={onConfirmSignChange}
                            color="#ff8566"
                        />
                        <Body>
                            <TouchableOpacity onPress={onConfirmSignChange} style={{ alignSelf: 'flex-start' }}>
                                <Text style={styleSheet.infoText}>{t('Modify.SigndInvoice')}</Text>
                            </TouchableOpacity>
                        </Body>
                    </ListItem>
                    <MCCButton
                        disabled={!allowSubmit}
                        onPress={onSubmit}
                        text={t('Modify.Submit')}
                    />
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showSignaturePad}
            >
                <View style={styleSheet.signatureModal}>
                    <TitleBar
                        title={t('Modify.Signature')}
                        onBack={cancelSignaturePad}
                    />
                    <SignaturePad
                        key={`signature-pad-${refreshPad}`}
                        onChange={onSignatureChange}
                        style={styleSheet.singaturePad}
                    />
                    <View style={styleSheet.buttonContainer}>
                        <Button
                            style={{ ...styleSheet.signatureButton, borderColor: '#FF886D', backgroundColor: '#FFF', borderWidth: 1 }}
                            onPress={refreshSignaturePad}
                        >
                            <Text style={{ color: '#FF886D' }}>{t('Modify.ClearSignature')}</Text>
                        </Button>
                        <Button
                            style={{ ...styleSheet.signatureButton, backgroundColor: '#FF886D' }}
                            onPress={completeSignaturePad}
                        >
                            <Text style={{ color: '#FFF' }}>{t('Modify.Submit')}</Text>
                        </Button>
                    </View>
                </View>

            </Modal>

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    topView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFF'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#FFF'
    },
    column: {
        paddingBottom: 12
    },
    column1: {
        width: '40%'
    },
    column2: {
        maxWidth: '60%',
        flex: 1
    },
    columnText: {
        color: '#202020',
        fontSize: 16
    },
    border: {
        borderTopWidth: 0.5,
        borderTopColor: '#FF886D',
        width: '100%',
        paddingBottom: 12
    },
    signatureTitle: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#202020',
        paddingTop: 12,
        paddingBottom: 6
    },
    infoText: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#202020',
    },
    signatureContainer: {
        borderWidth: 0.5,
        borderColor: '#ff8566',
        borderRadius: 0,
        width: '100%',
        height: 320
    },
    signatureModal: {
        display: 'flex',
        backgroundColor: '#FFF',
        flex: 1
    },
    signatureButton: {
        width: '40%',
        justifyContent: 'center',
    },
    singaturePad: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    clearSignatureButton: {
        marginTop: 16,
        alignSelf: 'flex-start',
        backgroundColor: '#ff8566',
        borderRadius: 4
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    confirmSignedContainer: {
        alignSelf: 'flex-start',
        marginLeft: 0,
        borderBottomWidth: 0,
        marginVertical: 12
    },
    submitButton: {
        width: '100%',
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    enabledColor: {
        backgroundColor: '#ff8566',
    },
    disabledColor: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    enabledButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    disabledButtonText: {
        fontSize: 16,
        color: '#202020',
    }
})

export default PatientDetailPage;
