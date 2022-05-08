import { View, Text, Button, Icon } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Schedule } from '../../models/schedule';
import { formatTime } from '../../utils/formatter';

type ScheduleComponentProp = {
    values: Schedule[],
    onUpdate?: () => void,
    readonly?: boolean
}

const ScheduleComponent = ({ values = [], readonly, onUpdate }: ScheduleComponentProp) => {
    const { t } = useTranslation();
    return (
        <>
            {
                readonly ? null : (
                    <Button
                        iconRight
                        block
                        bordered
                        dark
                        onPress={onUpdate}
                    >
                        <Text>{t('Register.ST79')}</Text>
                        <Icon name='arrow-forward' />
                    </Button>
                )
            }

            <View style={styleSheet.schedule}>
                {
                    values.map((schedule, index) => (
                        <View key={`schedule-${index}`} style={styleSheet.scheduleRow}>
                            <View style={styleSheet.scheduleTitle}>
                                <Text style={styleSheet.scheduleTitleText}> {t(`ServiceTimes.${index}`)}</Text>
                            </View>
                            <View style={styleSheet.workingHour}>
                                {
                                    schedule.closed ? (
                                        <Text style={styleSheet.closeText}>
                                            {t('Clinic.Closed')}
                                        </Text>
                                    ) : (
                                            schedule.workingHours.map((workingHour, wIndex) => (
                                                <View key={`working-hour-${wIndex}`} style={styleSheet.scheduleTitle}>
                                                    <Text style={styleSheet.scheduleTitleText}>{
                                                        `${formatTime(workingHour.from.h, workingHour.from.m)}-${formatTime(workingHour.to.h, workingHour.to.m)}`
                                                    }</Text>
                                                </View>
                                            ))
                                        )
                                }
                            </View>
                        </View>
                    ))
                }
            </View>
        </>
    )
};

const styleSheet = StyleSheet.create({
    schedule: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scheduleRow: {
        flex: 1,
        alignSelf: "stretch",
        flexDirection: "row",
        marginTop: 0,
        marginBottom: 2,
    },
    scheduleTitle: {
        flex: 1,
        alignSelf: "stretch",
        marginTop: 5,
        fontSize: 14,
        color: 'rgba(0,0,0,0.4)'
    },
    scheduleTitleText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.4)'
    },
    workingHour: {
        flexDirection: "column"
    },
    closeText: {
        marginTop: 5,
        fontSize: 14,
        color: 'rgba(0,0,0,0.4)'
    }
})

export default ScheduleComponent;