import { View, Text } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

export type DatePickerResp = {
    hour: number,
    minute: number
}

type DatePickerProp = {
    hour: number,
    minute: number,
    onChange: (resp: DatePickerResp) => void,
    onDismiss: () => void
}

const DatePicker = ({ hour, minute, onChange, onDismiss }: DatePickerProp) => {
    const { t } = useTranslation();
    const defaultValue = moment().utcOffset(0);
    defaultValue.set({ hour, minute });
    const [date, setDate] = useState(defaultValue.toDate());

    const handleChange = (value?: Date) => {
        const temp = moment(value);
        onDismiss();
        onChange({
            minute: temp.minute(),
            hour: temp.hour()
        });
    }
/*
    const handleConfirm = () => {
        handleChange(date);
    }
*/

/*visibility handled by workingHour
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
*/
    const handleConfirm = (date:Date) => {
        console.warn("A date has been picked: ", date);
        handleChange(date);
        onDismiss();
    };


    if (Platform.OS === 'ios') {
        return (
            <>
                <TouchableWithoutFeedback onPress={onDismiss}>
                    <View style={styleSheet.touchable} />
                </TouchableWithoutFeedback>
                <View style={styleSheet.iosPicker}>
                    <Text style={styleSheet.iosTitle}>{t('Common.SelectTime')}</Text>
                    <DateTimePickerModal
                        isVisible={true}
                        display="spinner"
                        mode="time"
                        date={date}
                        onConfirm={(date:Date) => {
                            console.log(date);
                            date && handleConfirm(date);
                        }}
                        onCancel={onDismiss}
                        minuteInterval={30}
                    />
                    <View style={styleSheet.iosActions}>

                        <TouchableOpacity
                            style={styleSheet.iosActionTouchable}
                            onPress={onDismiss}
                        >
                            <Text style={{ color: "blue" }}>{t('Common.Cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styleSheet.iosActionTouchable}
                            onPress={handleConfirm}
                        >
                            <Text style={{ color: "blue" }}>{t('Common.Confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        )
    }
    else {
        return (
            <DateTimePickerModal
                isVisible={true}
                mode='time'
                date={date}
                minuteInterval={30}
                onConfirm={(date:Date) => {
                    console.log(date);
                    date && handleConfirm(date);
                }}
                onCancel={onDismiss}
            />
        )
    }
}

const styleSheet = StyleSheet.create({
    touchable: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    iosPicker: {
        position: "absolute",
        width: "80%",
        height: "50%",
        left: "10%",
        top: "25%",
        backgroundColor: "white",
        justifyContent: "space-between",
        borderRadius: 10
    },
    iosTitle: {
        fontSize: 30,
        textAlign: "center",
        marginTop: 10,
    },
    iosActions: {
        justifyContent: "space-around",
        flexDirection: "row",
        marginBottom: 5,
    },
    iosActionTouchable: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }

})

export default DatePicker