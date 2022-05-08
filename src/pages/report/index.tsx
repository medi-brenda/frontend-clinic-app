import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Col, Container, Grid, Icon, Row, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getRecords } from '../../actions/transaction';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import * as _ from 'lodash';
import moment from 'moment';
import { Record } from '../../models/record';
import { getLastMonthDate } from '../../utils/date';
import MCCButton from '../../components/mccButton';
import { downloadReport } from '../../actions/app';
import Spinner from 'react-native-loading-spinner-overlay';
import PhoneCall from "../../components/phoneCall";
const PureChart = require('react-native-pure-chart/examples/pure-chart').default;

const ReportPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [chartData, setChartData] = useState<any>();
    const [data, setData] = useState<any>({})
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        const errorMsg = await getRecords({ stores, navigation, i18n });
        setLoading(false);

        if (errorMsg) {
            setError(errorMsg);
        }
        else {
            const { records } = stores.dataStore;
            const tempData: any = {};
            records.forEach(record => {
                const date = moment(record.transactionTime).toDate();
                const key = `${date.getFullYear()}${date.getMonth()}`;
                if (!tempData[key]) {
                    tempData[key] = [];
                }

                tempData[key].push(record)
            });

            const newData: any = {};
            _.keys(tempData).forEach(key => {
                let income = 0;
                tempData[key].forEach((record: Record) => {
                    income += parseInt(record.feeSum, 10) +
                        parseInt(record.doctorFee, 10) -
                        parseInt(record.copaymentFee, 10) +
                        parseInt(record.extraMedFromNetwork, 10);
                });

                const monthDate = getLastMonthDate(new Date(tempData[key][0].transactionTime)).getDate();


                newData[key] = {
                    customers: _.size(tempData[key]),
                    income,
                    average: (_.size(tempData[key]) / monthDate).toFixed(2)
                }
            });

            const charKeys = [
                moment(today).add('month', -5),
                moment(today).add('month', -4),
                moment(today).add('month', -3),
                moment(today).add('month', -2),
                moment(today).add('month', -1),
                moment(today)
            ];

            const newChartData = _.map(charKeys, month => ({
                x: month.format('MM/YYYY'),
                y: _.get(newData, `${month.get('year')}${month.get('month')}.income`, 0)
            }));

            setChartData([{
                seriesName: 'series1',
                data: newChartData,
                color: 'blue'
            }]);
            setData(newData);
        }
    }

    const changeMonth = (diff: number) => {
        const date = moment().set('month', month).set('year', year).add('month', diff).toDate();
        setYear(date.getFullYear());
        setMonth(date.getMonth());
    }

    const onReportDownload = () => {
        Alert.alert(
            t('Report.Confirm_download'),
            undefined,
            [
                {
                    text: t('Common.Confirm'),
                    onPress: async () => {
                        setSpinner(true);
                        const errorMsg = await downloadReport({
                            stores,
                            navigation,
                            year,
                            month: month + 1
                        });

                        if (error) {
                            Alert.alert(
                                t('Common.Error'),
                                t('Report.ReportFail'),
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
                                t('Report.ReportSent'),
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
                    }
                },
                {
                    text: t('Common.Cancel'),
                    style: 'cancel'
                }
            ]
        )
    }

    return (
        <Container>
            <TitleBar
                title={t('Common.Reports')}
                onBack={() => { navigation.goBack(); }}
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
                        <ScrollView>
                            <Container>
                                <Text style={styleSheet.title}>{t('Report.Recent_summary')}</Text>
                                <Text style={styleSheet.income}>{t('Report.Income')}</Text>
                                <View>
                                    {
                                        chartData ? (
                                            <PureChart
                                                showEvenNumberXaxisLabel={false}
                                                data={chartData}
                                                height={150}
                                                type={'bar'}
                                            />
                                        ) : undefined
                                    }
                                </View>
                                <Text style={[styleSheet.income, styleSheet.marginTop]}>
                                    {t('Report.Monthly_income_and_download')}
                                </Text>
                                <View style={styleSheet.monthSelectContatiner}>
                                    <TouchableOpacity
                                        onPress={() => changeMonth(-1)}
                                        style={styleSheet.leftArrow}
                                    >
                                        <View>
                                            <Icon
                                                name='arrow-left-drop-circle'
                                                style={styleSheet.arrowIcon}
                                                type='MaterialCommunityIcons'
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Text
                                        style={styleSheet.dateText}
                                    >
                                        {`${month + 1}/${year}`}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => changeMonth(1)}
                                        style={styleSheet.rightArrow}
                                    >
                                        <View>
                                            <Icon
                                                name='arrow-right-drop-circle'
                                                style={styleSheet.arrowIcon}
                                                type='MaterialCommunityIcons'
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <Grid>
                                    <Row style={styleSheet.row}>
                                        <Col style={styleSheet.col}>
                                            <Text style={styleSheet.colTitle}>
                                                {t('Report.Client_count')}
                                            </Text>
                                            <Text style={styleSheet.textCenter}>
                                                {_.get(data, `${year}${month}.customers`, 0)}
                                            </Text>
                                        </Col>
                                        <Col style={styleSheet.col}>
                                            <Text style={styleSheet.colTitle}>
                                                {t('Report.Total_income')}
                                            </Text>
                                            <Text style={styleSheet.textCenter}>
                                                {`HKD $${_.get(data, `${year}${month}.income`, 0)}`}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row style={styleSheet.secondRow}>
                                        <Col style={styleSheet.col}>
                                            <Text style={styleSheet.colTitle}>
                                                {t('Report.Average_client_count')}
                                            </Text>
                                            <Text style={styleSheet.textCenter}>
                                                {_.get(data, `${year}${month}.average`, 0)}
                                            </Text>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <View style={styleSheet.buttonContainer}>
                                                <MCCButton
                                                    onPress={onReportDownload}
                                                    text={t('Report.Download_text')}
                                                />
                                            </View>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Container>
                        </ScrollView>
            }

            <PhoneCall/>
        </Container >
    )
});

const styleSheet = StyleSheet.create({
    title: {
        paddingLeft: 0,
        paddingBottom: 10,
        marginBottom: 5,
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    income: {
        textAlign: 'center',
        color: '#f39c12',
        fontSize: 22,
        marginBottom: 5,
    },
    marginTop: {
        marginTop: 16
    },
    monthSelectContatiner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderColor: '#f0f0f5',
        borderBottomWidth: 1,
        borderTopWidth: 1
    },
    leftArrow: {
        paddingRight: 15
    },
    rightArrow: {
        paddingLeft: 15
    },
    arrowIcon: {
        fontSize: 28,
        color: '#ed5b5c'
    },
    dateText: {
        fontSize: 28,
        color: '#666'
    },
    row: {
        height: 60
    },
    col: {
        paddingLeft: 0,
        paddingBottom: 10,
        marginBottom: 5,
        marginTop: 10,
    },
    colTitle: {
        textAlign: 'center',
        marginBottom: 5,
    },
    textCenter: {
        textAlign: 'center'
    },
    secondRow: {
        height: 50
    },
    buttonContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 30,
    }
});

export default ReportPage;
