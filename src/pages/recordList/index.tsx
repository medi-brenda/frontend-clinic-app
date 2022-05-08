import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, Icon, View, Text, Tabs, Tab, TabHeading } from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import moment from 'moment';
import { getRecords } from '../../actions/transaction';
import RecordTab from './tab';
import { dateDiff, getDateMoment } from '../../utils/date';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { action } from 'mobx';
import OPModal from '../../components/opModal';
import Loading from '../loading';
import ErrorPage from '../error';
import PhoneCall from '../../components/phoneCall';

const RecordListPage = observer(() => {
    const { t, i18n } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [date, setDate] = useState(getDateMoment().toDate());
    const [marker, setMarker] = useState(false);
    const [authed, setAuthed] = useState(false);
    const [authAction, setAuthAction] = useState('');
    const [showOpModal, setShowOpModal] = useState(false);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { records } = stores.dataStore;

    useEffect(() => {
        getData();
    }, [date]);

    const getData = async () => {
        setLoading(true);
        const errorMsg = await getRecords({ stores, navigation, i18n, startDate: date, endDate: date });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        const errorMsg = await getRecords({ stores, navigation, i18n, startDate: date, endDate: date });
        if (errorMsg) {
            Alert.alert(
                t('Common.Error'),
                errorMsg,
                [{
                    text: t('Common.Confirm'),
                    onPress: () => {
                        setRefreshing(false);
                    }
                }]
            )
        }
        else {
            setRefreshing(false);
        }

    }

    const onPreviousDate = () => {
        onDateDiff(-1);
    }

    const onNextDate = () => {
        onDateDiff(1);
    }

    const onDateDiff = (diff: number) => {
        setDate(moment(date).add(diff, 'days').toDate());
    }

    const onDateChange = (date: Date) => {
        setShowDateTimePicker(false);
        setDate(date);
    }

    const onShowDateTimePicker = () => {
        setShowDateTimePicker(true);
    };

    const onHideDateTimePicker = () => {
        setShowDateTimePicker(false);
    };

    const onTabChange = () => {
        setMarker(!marker);
    };

    const checkAuth = (action: string) => {
        if (!authed) {
            setAuthAction(action);
            setShowOpModal(true);
            return;
        }

        onAuthAction(action);
    }

    const onAuthAction = (action = authAction) => {
        switch (action) {
            case 'onPreviousDate':
                return onPreviousDate();
            case 'onNextDate':
                return onNextDate();
            case 'onShowDateTimePicker':
                return onShowDateTimePicker();
        }
    }

    const onOpModalDismiss = (password: string) => {
        setShowOpModal(false);
        if (password) {
            setAuthed(true);
            onAuthAction();
        }
    }

    return (
        <Container>
            <TitleBar
                title={t('Record.ST0')}
                onBack={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }]
                    });
                }}
            />
            <View style={styleSheet.header}>
                <TouchableOpacity
                    onPress={() => checkAuth('onPreviousDate')}
                    style={styleSheet.leftArrow}
                >
                    <View>
                        <Icon
                            name="arrow-left-drop-circle"
                            style={styleSheet.arrowIcon}
                            type="MaterialCommunityIcons"
                        />
                    </View>
                </TouchableOpacity>
                <Text
                    style={styleSheet.dateText}
                    onPress={() => checkAuth('onShowDateTimePicker')}
                >
                    {moment(date).format('DD/MM/YYYY')}
                </Text>
                <TouchableOpacity
                    onPress={() => checkAuth('onNextDate')}
                    style={styleSheet.rightArrow}
                >
                    <View>
                        <Icon
                            name="arrow-right-drop-circle"
                            style={styleSheet.arrowIcon}
                            type="MaterialCommunityIcons"
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <Tabs
                tabBarUnderlineStyle={styleSheet.tabsUnderline}
                tabContainerStyle={styleSheet.tabsContainer}
                onChangeTab={onTabChange}
            >
                <Tab
                    heading={
                        <TabHeading style={styleSheet.tab}>
                            <Text style={styleSheet.tabText}>{t('Record.ST1')}</Text>
                        </TabHeading>
                    }
                >
                    {
                        loading ?
                            <Loading /> :
                            error ?
                                <ErrorPage title={error} onRetry={getData} /> :
                                <RecordTab
                                    records={records}
                                    onRefresh={onRefresh}
                                    refreshing={refreshing}
                                />
                    }
                </Tab>
                <Tab
                    heading={
                        <TabHeading style={styleSheet.tab}>
                            <Text style={styleSheet.tabText}>{t('Record.ST2')}</Text>
                        </TabHeading>
                    }
                >
                    {
                        loading ?
                            <Loading /> :
                            error ?
                                <ErrorPage title={error} onRetry={getData} /> :
                                <RecordTab
                                    records={records.filter(record => Number(record.status) === 1)}
                                    onRefresh={onRefresh}
                                    refreshing={refreshing}
                                />
                    }
                </Tab>
                <Tab
                    heading={
                        <TabHeading style={styleSheet.tab}>
                            <Text style={styleSheet.tabText}>{t('Record.ST3')}</Text>
                        </TabHeading>
                    }
                >
                    {
                        loading ?
                            <Loading /> :
                            error ?
                                <ErrorPage title={error} onRetry={getData} /> :
                                <RecordTab
                                    records={records.filter(record => Number(record.status) !== 1)}
                                    onRefresh={onRefresh}
                                    refreshing={refreshing}
                                />
                    }
                </Tab>
            </Tabs>
            <DateTimePickerModal
                isVisible={showDateTimePicker}
                date={date}
                mode="date"
                onConfirm={onDateChange}
                onCancel={onHideDateTimePicker}
                cancelTextIOS={t('Common.Cancel')}
                confirmTextIOS={t('Common.Confirm')}
                headerTextIOS={t('Record.PickDate')}
            />
            <OPModal
                show={showOpModal}
                onDismiss={onOpModalDismiss}
            />
            
            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
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
    tabsUnderline: {
        backgroundColor: '#F65555'
    },
    tabsContainer: {
        elevation: 0,
        backgroundColor: '#FFF'
    },
    tab: {
        backgroundColor: '#FFF'
    },
    tabText: {
        color: 'black'
    }
});

export default RecordListPage;