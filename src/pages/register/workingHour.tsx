import { Item, Label, Text, View } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker, { DatePickerResp } from '../../components/datePicker';
import { WorkingHour } from '../../models/schedule';

type WorkingHourType = {
    value: WorkingHour,
    index: number,
    onChange: (value: WorkingHour) => void,
    onRemove: () => void
}

const WorkingHourComponent = ({ value, index, onChange, onRemove }: WorkingHourType) => {
    const [showPicker, setShowPicker] = useState(false);
    const [type, setType] = useState('');
    const { from, to } = value;
    const fromMinute = `${from.m < 10 ? '0' : ''}${from.m}`;
    const toMinute = `${to.m < 10 ? '0' : ''}${to.m}`;

    const onShowPicker = (type: 'from' | 'to') => {
        setType(type);
        setShowPicker(true);
    }

    const handleChange = ({ hour, minute }: DatePickerResp) => {
        if (type === 'from') {
            value.from.h = hour;
            value.from.m = minute;
        } else {
            value.to.h = hour;
            value.to.m = minute;
        }

        onChange(value);
    }

    return (
        <View style={[styleSheet.container, index ? undefined : styleSheet.paddingRight]}>
            <View style={styleSheet.from}>
                <Item>
                    <TouchableOpacity
                        style={styleSheet.touchable}
                        onPress={(e) => { onShowPicker('from') }}
                    >
                        <Label>
                            {`${from.h}: ${fromMinute}`}
                        </Label>
                    </TouchableOpacity>
                </Item>
            </View>
            <Text>-</Text>
            <View style={styleSheet.to}>
                <Item>
                    <TouchableOpacity
                        style={styleSheet.touchable}
                        onPress={(e) => { onShowPicker('to') }}
                    >
                        <Label>
                            {`${to.h}: ${toMinute}`}
                        </Label>
                    </TouchableOpacity>
                </Item>
            </View>
            {index > 0 && (
                <TouchableOpacity onPress={onRemove} >
                    <Text
                        style={styleSheet.remove}
                    >X</Text>
                </TouchableOpacity>
            )}
            {
                showPicker &&
                <DatePicker
                    hour={type === 'from' ? from.h : to.h}
                    minute={type === 'from' ? from.m : to.m}
                    onDismiss={() => { setShowPicker(false) }}
                    onChange={handleChange}
                />
            }
        </View>

    )
}

const styleSheet = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20
    },
    paddingRight: {
        paddingRight: 20
    },
    touchable: {
        alignItems: 'center',
        flex: 1,
    },
    from: {
        flex: 1,
        alignSelf: 'stretch',
        paddingRight: 8,
        paddingLeft: 8,
    },
    to: {
        flex: 1,
        alignSelf: 'stretch',
        paddingRight: 4,
        paddingLeft: 4,
    },
    remove: {
        color: 'red',
        textAlign: 'center',
        fontSize: 20,
        width: 20,
        height: 20,
    }
})

export default WorkingHourComponent;