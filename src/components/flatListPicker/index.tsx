import { Icon, Label, Picker, View, Text, Button } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Option } from '../../models/option';
import styles from '../../styles';

type FlatListPickerProp = {
    id: string,
    values: any,
    title: string,
    warning: string,
    options: Option[],
    validate: (value: any) => boolean,
    onChange: (id: string, value: any) => void
}

const FlatListPicker = ({ id, values, title, options, warning, validate, onChange }: FlatListPickerProp) => {
    const { i18n, t } = useTranslation();
    const label = i18n.language === 'en' ? 'nameEn' : 'nameChi';

    const onItemChange = (value: any, index: number) => {
        values[id][index] = value;
        onChange(id, values[id]);
    }

    const onRemove = (index: number) => {
        values[id].splice(index, 1);
        onChange(id, values[id]);
    }

    const onAdd = () => {
        values[id].push('');
        onChange(id, values[id]);
    }

    return (
        <>
            <Label style={styles.reg_field_title}>{title}</Label>
            <FlatList
                data={values[id]}
                refreshing={false}
                keyExtractor={(item, index) => `${id}-${index}`}
                renderItem={({ item, index }) => (
                    <View style={styleSheet.listItem}>
                        <View style={styleSheet.picker}>
                            <Picker
                                style={{
                                    width: undefined,
                                }}
                                mode='dropdown'
                                iosIcon={<Icon name='arrow-down' />}
                                placeholderStyle={{ color: '#bfc6ea' }}
                                placeholder={t('Register.SelectMedicalService')}
                                placeholderIconColor='#007aff'
                                selectedValue={values.medicalServices[index]}
                                onValueChange={(key, iIndex) => {
                                    onItemChange(key, index);
                                }}
                            >
                                {
                                    options.map((option, index) => (
                                        <Picker.Item
                                            key={`${id}-options-${index}`}
                                            label={option[label]}
                                            value={option.code}
                                        />
                                    ))
                                }
                            </Picker>
                        </View>
                        {
                            index ? (
                                <TouchableOpacity
                                    style={styleSheet.touchable}
                                    onPress={() => { onRemove(index) }}
                                >
                                    <Icon
                                        name='close'
                                        style={styleSheet.close}
                                    />
                                </TouchableOpacity>
                            ) : null
                        }
                    </View>
                )}
            />
            {
                !validate(values[id]) ?
                    (
                        <Text style={styleSheet.warning}>{warning}</Text>
                    ) : null
            }

            <Button
                full
                bordered
                onPress={onAdd}
                style={styles.reg_add_btn}
            >
                <Text style={styleSheet.button}>
                    {`+ ${t('Common.Add')}`}
                </Text>
            </Button>
        </>
    )
}

const styleSheet = StyleSheet.create({
    listItem: {
        flex: 5,
        justifyContent: 'center',
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: '#888888',
    },
    picker: {
        flex: 5,
        justifyContent: 'center',
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: '#888888',
    },
    touchable: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 7,
    },
    close: {
        color: 'red',
        fontSize: 35,
    },
    warning: {
        fontSize: 14,
        marginLeft: 10,
        marginRight: 5,
        color: "red",
    },
    button: {
        color: "#ed5b5c"
    }
})

export default FlatListPicker;