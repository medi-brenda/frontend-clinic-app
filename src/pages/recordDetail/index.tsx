import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Card, CardItem, Container, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Image, Alert } from 'react-native';
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
import { getRecord, refund } from '../../actions/transaction';
import TitleBar from '../../components/titleBar';
import { dateDiff } from '../../utils/date';
import moment from 'moment';
import Loading from '../loading';
import ErrorPage from '../error';
import OPModal from '../../components/opModal';
import Spinner from 'react-native-loading-spinner-overlay';
import { findBenefit, findInsurer } from '../../utils/common';
import PhoneCall from '../../components/phoneCall';

const RecordDetailPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [spinner, setSpinner] = useState(false);
    const [showOpModal, setShowOpModal] = useState(false);

    const { record } = stores.dataStore;
    const { setting } = stores.appStore;
    const { benefits, insurers } = stores.configStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        const errorMsg = await getRecord({ stores, i18n, recordId: record.id });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg);
        }
    }

    const openOpModal = () => {
        setShowOpModal(true);
    }

    const onOpModalDismiss = (password: string) => {
        setShowOpModal(false);
        if (password) {
            setTimeout(() => onRefund(password), 300)
        }
    }

    const onRefund = async (password: string) => {
        setSpinner(true);
        const errorMsg = await refund({ stores, i18n, navigation, password });
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
            Alert.alert(
                t('Record.RefundSuccess'),
                undefined,
                [
                    {
                        text: t('Common.Confirm'),
                        onPress: () => {
                            setSpinner(false);
                            navigation.goBack();
                        }
                    }
                ]
            )
        }
    }

    const benefit = findBenefit(benefits, record.benefitCode);
    const insurer = findInsurer(insurers, record.insurerId);
    const displayIncome = (Number(record.doctorFee || 0)) - Number(record.copaymentFee || 0) + Number(record.extraMedFromNetwork || 0);
    const allowRefund = dateDiff(new Date(), moment(record.transactionTime).toDate()) === 0;

    return (
        <Container>
            <TitleBar
                onBack={() => { navigation.goBack() }}
                title={Number(record.status) === 1 ? t('Record.ST2') : t('Record.ST3')}
            />
            <Spinner
                visible={spinner}
                color={'red'}
                size={'large'}
                overlayColor={'rgba(0, 0, 0, 0.25)'}
            />
            {
                loading ? <Loading /> :
                    error ? <ErrorPage title={error} onRetry={init} /> :
                        (
                            <ScrollView contentContainerStyle={styleSheet.background}>

                                <LinearGradient
                                    start={[0, 0]}
                                    end={[1, 0]}
                                    colors={['#ef6666', '#f5b076']}
                                    style={styleSheet.linearGradient}
                                >
                                    <SafeAreaView style={styles.safeViewArea}>
                                        <View style={styleSheet.context}>
                                            <Text style={styleSheet.headerText}>{t('PaymentInfo.CollectFromClient')}</Text>
                                            <Text style={styleSheet.dataText}>{`HKD $${record.feeSum}`}</Text>
                                        </View>
                                        <View style={[styleSheet.row, styleSheet.marginBottom]}>
                                            <View style={styleSheet.row}>
                                                <View style={styleSheet.rowContext}>
                                                    <Text style={styleSheet.rowHeaderText}>{t('Common.Copayment')}</Text>
                                                    <Text style={styleSheet.rowDataText}>{`HKD $${record.copaymentFee || '0.00'}`}</Text>
                                                </View>
                                            </View>

                                            <View style={styleSheet.leftBorder} />

                                            <View style={styleSheet.row}>
                                                <View style={styleSheet.rowContext}>
                                                    <Text style={styleSheet.rowHeaderText}>{t('Common.ExtraMed')}</Text>
                                                    <Text style={styleSheet.rowDataText}>{`HKD $${record.extraMedFee}`}</Text>
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
                                            {`${translate(record.doctor, i18n)} (${record.doctor.code})`}
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
                                                {record.memberId}
                                            </Text>
                                        </View>
                                    </CardItem>
                                    <CardItem>
                                        <View style={styleSheet.center}>
                                            <Text style={styles.text_20}>{t('Modify.ST25')}</Text>
                                            {
                                                record.diagnosis.map((d, index) => (
                                                    <Text key={`disgnosis-${index}`} style={styleSheet.diagnosis}>
                                                        {`${d.code} - ${translate(d, i18n)}`}
                                                    </Text>
                                                ))
                                            }
                                        </View>
                                    </CardItem>

                                    {
                                        record.signature ? (
                                            <CardItem>
                                                <View style={styleSheet.center}>
                                                    <Text style={styles.text_20}>{t('Modify.Signature')}</Text>
                                                    <Image
                                                        style={styleSheet.image}
                                                        source={{ uri: `${IMAGE_PREFLX}${record.signature}` }} />

                                                </View>
                                            </CardItem>
                                        ) : null
                                    }

                                    <CardItem>
                                        <View style={styleSheet.center}>
                                            <Text style={styles.text_20}>{t('Modify.ST26')}</Text>
                                            <Text style={styleSheet.columnDataText}>
                                                {translate(record.serviceType, i18n)}
                                            </Text>
                                        </View>
                                    </CardItem>

                                    <CardItem>
                                        <View style={styleSheet.center}>
                                            <Text style={styles.text_20}>{t('Modify.ST27')}</Text>
                                            {
                                                record.extraMed.length ? (
                                                    record.extraMed.map((e, index) => (
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
                                                {record.transactionTime}
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
                                                {record.voucher}
                                            </Text>
                                        </View>
                                    </CardItem>
                                </Card>
                                <View style={styleSheet.action}>
                                    <MCCButton
                                        disabled={Number(record.status) !== 1 || !allowRefund}
                                        onPress={openOpModal}
                                        text={t('Record.Refund')}
                                    />
                                </View>
                            </ScrollView >
                        )
            }
            <OPModal
                show={showOpModal}
                onDismiss={onOpModalDismiss}
            />
            
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
    },
    headerText: {
        fontSize: 20,
        color: 'white'
    },
    dataText: {
        fontSize: 36,
        color: 'white',
        fontWeight: 'bold',
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

export default RecordDetailPage;