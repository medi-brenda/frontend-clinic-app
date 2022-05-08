import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { Divider } from 'react-native-elements';
import { Schedule } from '../../models/schedule';
import ScheduleComponent from '../../pages/register/schedules';
import styles from '../../styles';

type ReadOnlyFieldProp = {
    title: string,
    value: any,
    type?: 'string' | 'stringArray' | 'schedule'
    titleStyle?: StyleProp<TextStyle>
    valueStyle?: StyleProp<TextStyle>
}

const ReadOnlyField = ({ title, value, titleStyle, valueStyle, type = 'string' }: ReadOnlyFieldProp) => {
    return (
        <>
            <Text style={[styles.title_topic, styleSheet.title, titleStyle]}>
                {title}
            </Text>
            {
                type === 'schedule' ?
                    <ScheduleComponent values={value} readonly={true} /> :
                    type === 'stringArray' ? (
                        value.map((text: string, index: number) => (
                            <Text key={`text-${index}`} style={[styles.title_content, styleSheet.content, valueStyle]}>
                                {`- ${text}`}
                            </Text>
                        ))
                    ) : (
                            <Text style={[styles.title_content, styleSheet.content, valueStyle]}>
                                {value}
                            </Text>
                        )

            }
            <Divider style={[styleSheet.divider, type === 'schedule' ? styleSheet.marginTop : undefined]} />
        </>
    )
}
const styleSheet = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20
    },
    title: {
        fontSize: 16
    },
    content: {
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14
    },
    divider: {
        backgroundColor: "grey"
    },
    marginTop: {
        marginTop: 16
    }
});
export default ReadOnlyField;