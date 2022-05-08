import { observer } from 'mobx-react';
import { Container, Item, Label, Switch, Text, View } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import * as _ from 'lodash';
import WorkingHourComponent from './workingHour';
import { StyleSheet } from 'react-native';
import { saveServiceHours } from '../../actions/auth';
import { useNavigation } from '@react-navigation/native';

const ServiceHour = observer(() => {
    const stores = useStores();
    const { t } = useTranslation();
    const navigation = useNavigation();


    const [schedules] = useState(_.cloneDeep(stores.authStore.schedules));
    const [refresh, setRefresh] = useState(false);

    const onWorkingHourChange = () => {
        setRefresh(!refresh);
    }


    const onSave = () => {
        saveServiceHours({
            stores,
            data: schedules,
            navigation
        });
    }

    return (
        <Container>
            <TitleBar
                title={t('Register.Title')}
                onNext={onSave}
                onNextTitle={t('Common.Save')}
                noReturn={true}
            />
            <ScrollView
                style={{
                    marginTop: 8,
                    paddingHorizontal: 25,
                }}
            >
                <View style={{ flex: 1 }}>
                    {
                        _.map(schedules, (schedule, index) => (
                            <View key={`schedules-${index}`} style={styleSheet.scheduleContainer}>
                                <View style={styleSheet.status}>
                                    <Text style={styleSheet.index}>
                                        {t(`ServiceTimes.${index}`)}
                                    </Text>
                                    <Switch
                                        style={styleSheet.switch}
                                        value={!schedule.closed}
                                        onValueChange={() => {
                                            schedule.closed = !schedule.closed;
                                            onWorkingHourChange();
                                        }}
                                    />

                                    <Text style={{ fontSize: 18 }}>
                                        {schedule.closed ? t('Clinic.Closed') : t('Clinic.Open')}
                                    </Text>
                                </View>

                                {schedule.closed ? (
                                    <View style={{ marginTop: 15 }} />
                                ) : (
                                        <>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    alignSelf: 'stretch',
                                                    flexDirection: 'row',
                                                    marginBottom: 2,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        flex: 2,
                                                        alignSelf: 'stretch',
                                                        flexDirection: 'column',
                                                        marginBottom: 2,
                                                    }}
                                                >
                                                    {
                                                        _.map(schedule.workingHours, (workingHour, index) => (
                                                            <WorkingHourComponent
                                                                key={`working-hour-${index}`}
                                                                value={workingHour}
                                                                index={Number(index)}
                                                                onChange={(value) => {
                                                                    onWorkingHourChange();
                                                                }}
                                                                onRemove={() => {
                                                                    schedule.workingHours.splice(index, 1);
                                                                    onWorkingHourChange();
                                                                }}
                                                            />
                                                        ))
                                                    }
                                                </View>
                                            </View>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <TouchableOpacity
                                                    style={{
                                                        marginTop: 10,
                                                        marginLeft: 5,
                                                    }}
                                                    onPress={(e) => {
                                                        schedule.workingHours.push({
                                                            from: { h: 10, m: 0 },
                                                            to: { h: 18, m: 30 }
                                                        });
                                                        onWorkingHourChange();
                                                    }}
                                                >
                                                    <Text style={{ color: 'red' }}>
                                                        {t('Clinic.AddServiceHour')}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </>
                                    )}
                            </View>

                        ))
                    }
                </View>
            </ScrollView>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    scheduleContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    status: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    index: {
        flex: 1,
        fontSize: 18
    },
    switch: {
        right: 60,
        position: 'absolute',
    }
})

export default ServiceHour;