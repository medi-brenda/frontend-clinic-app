import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Card, CardItem, Container, Text, View } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStores } from '../../stores';
import { SafeAreaView } from 'react-navigation';
import styles from '../../styles';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-elements';
import { translate } from '../../utils/string';
import { IMAGE_PREFLX } from '../../utils/constants';
import MCCButton from '../../components/mccButton';
import * as _ from 'lodash';
import { goTransactionSuccess } from '../../actions/app';
import TitleBar from '../../components/titleBar';
import { findBenefit, findDoctorOption, findInsurer } from '../../utils/common';
import PhoneCall from '../../components/phoneCall';

const PaymentInfoPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const { values } = stores.dataStore;
    const { setting } = stores.appStore;
    const { doctors, benefits, insurers } = stores.configStore;

    const insurer = findInsurer(insurers, values.insurerId);
    const doctor = findDoctorOption(doctors, values.doctorId);
    const benefit = findBenefit(benefits, values.benefitCode);

    const displayIncome = Number((values.doctorFee || 0) - (values.copaymentFee || 0) + (values.extraMedFromNetwork || 0));


    const onExit = () => {
        goTransactionSuccess({
            stores,
            navigation
        });
    }

    const headerStyle = i18n.language === 'en' ? styleSheet.headerEnText : styleSheet.headerText;
    const dataStyle = i18n.language === 'en' ? styleSheet.dataEnText : styleSheet.dataText;

    return (
        <Container>
            <TitleBar
                noReturn={true}
                title={t('Common.PaymentInfo')}
            />
            <ScrollView contentContainerStyle={styleSheet.background}>
                <LinearGradient
                    start={[0, 0]}
                    end={[1, 0]}
                    colors={['#ef6666', '#f5b076']}
                    style={styleSheet.linearGradient}
                >
                    <SafeAreaView style={styles.safeViewArea}>
                        <View style={styleSheet.context}>
                            <View style={styleSheet.row}>
                                <Text style={headerStyle}>{t('PaymentInfo.CollectFromClient1')}</Text>
                                <Text style={[headerStyle, styleSheet.red]}>{t('PaymentInfo.CollectFromClient2')}</Text>
                                <Text style={headerStyle}>{t('PaymentInfo.CollectFromClient3')}</Text>
                            </View>
                            <Text style={dataStyle}>{`HKD $${values.feeSum}`}</Text>
                        </View>
                        <View style={[styleSheet.row, styleSheet.marginBottom]}>
                            <View style={styleSheet.row}>
                                <View style={styleSheet.rowContext}>
                                    <Text style={styleSheet.rowHeaderText}>{t('Common.Copayment')}</Text>
                                    <Text style={styleSheet.rowDataText}>{`HKD $${values.copaymentFee}`}</Text>
                                </View>
                            </View>

                            <View style={styleSheet.leftBorder} />

                            <View style={styleSheet.row}>
                                <View style={styleSheet.rowContext}>
                                    <Text style={styleSheet.rowHeaderText}>{t('Common.ExtraMed')}</Text>
                                    <Text style={styleSheet.rowDataText}>{`HKD $${values.extraMedFee}`}</Text>
                                </View>
                            </View>
                        </View>
                        {
                            setting.displayIncome ?
                                (
                                    <>
                                        <Divider style={styleSheet.divider} />
                                        <View style={styleSheet.displayIncome}>
                                            <Text style={styleSheet.rowHeaderText}>{t('Modify.ST18')}</Text>
                                            <Text style={styleSheet.rowDataText}>{`HKD $${displayIncome.toFixed(1)}`}</Text>
                                        </View>
                                    </>
                                ) : null
                        }
                    </SafeAreaView>
                </LinearGradient>

                <Card transparent style={styleSheet.card}>
                    <CardItem header>
                        <Text style={styles.text_20}>{t('Modify.ST19')}</Text>
                    </CardItem>

                    <CardItem style={[styleSheet.center, styleSheet.column]}>
                        <Text style={styles.text_20}>{t('Modify.ST20')}</Text>
                        <Text style={styleSheet.columnDataText}>
                            {translate(doctor, i18n)}
                        </Text>
                    </CardItem>

                    <CardItem style={[styleSheet.center, styleSheet.column]}>
                        <Text style={styles.text_20}>{t('Modify.ST21')}</Text>
                        <Text style={styleSheet.columnDataText}>
                            {translate(benefit, i18n)}
                        </Text>
                    </CardItem>
                </Card>

                <Card transparent style={styleSheet.card2}>
                    <CardItem header>
                        <Text style={styles.text_20}>{t('Modify.ST22')}</Text>
                    </CardItem>
                    <CardItem>
                        <View style={styleSheet.center}>
                            <Text style={styles.text_20}>{t('Modify.ST24')}</Text>
                            <Text style={styleSheet.columnDataText}>
                                {values.memberKey}
                            </Text>
                        </View>
                    </CardItem>
                    <CardItem>
                        <View style={styleSheet.center}>
                            <Text style={styles.text_20}>{t('Modify.ST25')}</Text>
                            {
                                values.diagnosis.map((d, index) => (
                                    <Text key={`disgnosis-${index}`} style={styleSheet.diagnosis}>
                                        {`${d.code} - ${translate(d, i18n)}`}
                                    </Text>
                                ))
                            }
                        </View>
                    </CardItem>
                    {
                        values.signature ? (
                            <CardItem>
                                <View style={styleSheet.center}>
                                    <Text style={styles.text_20}>{t('Modify.Signature')}</Text>
                                    <Image
                                        style={styleSheet.image}
                                        source={{ uri: `${IMAGE_PREFLX}${values.signature}` }}
                                    />
                                </View>
                            </CardItem>
                        ) : undefined
                    }

                    <CardItem>
                        <View style={styleSheet.center}>
                            <Text style={styles.text_20}>{t('Modify.ST26')}</Text>
                            <Text style={styleSheet.columnDataText}>
                                {i18n.language === 'en' ? values.serviceTypeEn : values.serviceTypeChi}
                            </Text>
                        </View>
                    </CardItem>

                    <CardItem>
                        <View style={styleSheet.center}>
                            <Text style={styles.text_20}>{t('Modify.ST27')}</Text>
                            {
                                values.extraMed.length ? (
                                    values.extraMed.map((e, index) => (
                                        <Text key={`extra-med-${index}`} style={styleSheet.columnDataText}>
                                            {`${e.code} - ${e.price}`}
                                        </Text>
                                    ))
                                ) : (
                                        <Text style={styleSheet.columnDataText}>-</Text>
                                    )
                            }
                        </View>
                    </CardItem>
                </Card>
                <Card transparent style={styleSheet.card2}>
                    <CardItem>
                        <View style={styleSheet.center}>
                            <Text style={styles.text_20}>{t('Modify.ST28')}</Text>
                            <Text style={styleSheet.columnDataText}>
                                {values.transactionTime}
                            </Text>
                        </View>
                    </CardItem>

                    <CardItem>
                        <View style={styleSheet.center}>
                            <Text style={styles.text_20}>{t('Verify.Insurer')}</Text>
                            <Text style={styleSheet.columnDataText}>
                                {translate(insurer, i18n)}
                            </Text>
                        </View>
                    </CardItem>

                    <CardItem>
                        <View style={styleSheet.center}>
                            <Text style={styles.text_20}>{t('Modify.ST29')}</Text>
                            <Text style={styleSheet.columnDataText}>
                                {values.voucher}
                            </Text>
                        </View>
                    </CardItem>
                </Card>
                <View style={styleSheet.action}>
                    <MCCButton onPress={onExit} text={t('Common.Confirm')} />
                </View>
            </ScrollView >
            
            <PhoneCall/>
        </Container >
    )
});

const styleSheet = StyleSheet.create({
    background: {
        backgroundColor: '#eeeeee',
    },
    doneButton: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#ff8566',
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    title: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    titleText: {
        fontSize: 24,
        color: 'white'
    },
    context: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'white',
        borderColor: 'red',
        borderWidth: 8,
        borderRadius: 24
    },
    headerEnText: {
        fontSize: 24
    },
    headerText: {
        fontSize: 32,
    },
    red: {
        color: 'red',
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline'
    },
    dataEnText: {
        fontSize: 32,
        color: 'red',
        fontWeight: 'bold'
    },
    dataText: {
        fontSize: 36,
        color: 'red',
        fontWeight: 'bold'
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    rowContext: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowHeaderText: {
        fontSize: 16, color: 'white'
    },
    rowDataText: {
        fontSize: 20, color: 'white'
    },
    leftBorder: {
        borderLeftWidth: 1,
        borderLeftColor: 'white',
    },
    divider: {
        marginTop: 15,
        backgroundColor: 'white',
        height: 1,
    },
    displayIncome: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    card: {
        marginTop: 0,
        marginBottom: 2
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column'
    },
    columnDataText: {
        color: '#ef6666',
        fontSize: 20,
    },
    card2: {
        marginTop: 2,
        marginBottom: 2
    },
    diagnosis: {
        color: '#ef6666',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    image: {
        width: 240,
        height: 180,
        resizeMode: 'contain',
        borderWidth: 0.4,
        borderColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 32
    },
    action: {
        marginVertical: 16
    },
    marginBottom: {
        marginBottom: 16
    }
});

export default PaymentInfoPage;
