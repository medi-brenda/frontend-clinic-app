import { Icon, Input, Picker, View, Text, Button } from 'native-base';
import { Divider } from 'react-native-elements';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Option } from '../../models/option';
import styles from '../../styles';
import { observer } from 'mobx-react';
import { useStores } from '../../stores';

type InsurerFlatListProp = {
    id: string,
    values: any,
    validate: (value: any) => boolean,
    onChange: (id: string, value: any) => void
}

const InsurerFlatList = observer(({ id, values, validate, onChange }: InsurerFlatListProp) => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const { benefits, insurers } = stores.configStore;
    const label = i18n.language === 'en' ? 'nameEn' : 'nameChi';

    const onBenefitChange = (value: any, index: number) => {
        values[id][index].benefit = value;
        onChange(id, values[id]);
    }

    const onInsurerChange = (value: any, index: number) => {
        values[id][index].insurer = value;
        onChange(id, values[id]);
    }

    const onPriceChange = (value: string, index: number) => {
        values[id][index].price = value;
        onChange(id, values[id]);
    }

    const onRemove = (index: number) => {
        values[id].splice(index, 1);
        onChange(id, values[id]);
    }

    const onAdd = () => {
        values[id].push({
            id: '',
            insurer: ''
        });
        onChange(id, values[id]);
    }

    return (
        <>
            <FlatList
                data={values[id]}
                refreshing={false}
                keyExtractor={(item, index) => `${id}-${index}`}
                renderItem={({ item, index }) => (
                    <View style={styleSheet.listItem}>
                        <View style={styleSheet.header}>
                            <Text style={{ fontSize: 18 }}>
                                {t('Register.InsurerOptions')}
                            </Text>
                            {
                                index ? (
                                    <TouchableOpacity onPress={() => onRemove(index)}>
                                        <Icon name='close' style={styleSheet.close} />
                                    </TouchableOpacity>
                                ) : null
                            }
                            <Divider style={styles.divider} />
                        </View>
                        <View style={styleSheet.picker}>
                            <View style={styleSheet.border} >
                                <Picker
                                    style={styleSheet.pickerContainer}
                                    mode='dropdown'
                                    iosIcon={<Icon name='arrow-down' />}
                                    placeholderStyle={styleSheet.placeholder}
                                    placeholder={t('Register.BenefitHint')}
                                    placeholderIconColor='#007aff'
                                    selectedValue={values[id][index].benefit}
                                    onValueChange={(val, pIndex) => { onBenefitChange(val, index) }}
                                >
                                    <Picker.Item
                                        label={t('Register.BenefitHint')}
                                        value={false}
                                    />
                                    {
                                        benefits.map((benefit, index) => (
                                            <Picker.Item
                                                key={`${id}-benefit-${index}`}
                                                label={benefit[label]}
                                                value={benefit.code}
                                            />
                                        ))
                                    }
                                </Picker>
                            </View>

                            <View style={[styleSheet.border, styleSheet.marginLeft]} >
                                <Picker
                                    style={styleSheet.pickerContainer}
                                    mode='dropdown'
                                    iosIcon={<Icon name='arrow-down' />}
                                    placeholderStyle={styleSheet.placeholder}
                                    placeholder={t('Register.insurerHint')}
                                    placeholderIconColor='#007aff'
                                    selectedValue={values[id][index].insurer}
                                    onValueChange={(val, pIndex) => { onInsurerChange(val, index) }}
                                >
                                    <Picker.Item
                                        label={t('Register.insurerHint')}
                                        value={false}
                                    />
                                    {
                                        insurers.map((insurer, index) => (
                                            <Picker.Item
                                                key={`${id}-insurer-${index}`}
                                                label={insurer[label]}
                                                value={insurer.code}
                                            />
                                        ))
                                    }
                                </Picker>
                            </View>
                            <Input
                                onChangeText={(value) => { onPriceChange(value, index) }}
                                value={values[id][index].price}
                                placeholder={t('Register.Price')}
                                style={styleSheet.price}
                                autoCapitalize='none'
                                keyboardType='numeric'
                            />
                        </View>
                    </View>
                )}
            />
            {
                !validate(values[id]) ?
                    (
                        <Text style={styleSheet.warning}>{t('Register.IncorrectInsurerOptions')}</Text>
                    ) : null
            }
            <Button
                full
                bordered
                onPress={onAdd}
                style={styles.reg_add_btn}
            >
                <Text style={{ color: "#ed5b5c" }}>
                    {`+ ${t('Common.Add')}`}
                </Text>
            </Button>
        </>
    )
})

const styleSheet = StyleSheet.create({
    listItem: {
        marginBottom: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    close: {
        color: 'red',
        marginRight: 5,
        fontSize: 32,
    },
    style: {
        borderColor: 'black',
        marginBottom: 10,
        borderWidth: 0.2,
    },
    picker: {
        flex: 5,
        justifyContent: 'center'
    },
    border: {
        borderWidth: 0.5,
        borderRadius: 5,
        marginBottom: 10,
        borderColor: '#888888',
    },
    pickerContainer: {
        width: undefined
    },
    placeholder: {
        color: '#bfc6ea'
    },
    marginLeft: {
        marginLeft: 20
    },
    price: {
        fontSize: 16,
        borderColor: '#888888',
        borderWidth: 0.5,
        borderRadius: 5,
        marginLeft: 20,
        paddingLeft: 10,
    },
    warning: {
        fontSize: 14,
        marginLeft: 10,
        marginRight: 5,
        color: "red",
        marginBottom: 20,
    }
})

export default InsurerFlatList;