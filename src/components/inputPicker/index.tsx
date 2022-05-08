import React from 'react';
import { StyleSheet } from 'react-native';
import { Input, Item, Label, Text, Icon, View, Picker } from 'native-base';
import styles from '../../styles';
import { Option } from '../../models/option';
import { useTranslation } from 'react-i18next';

type InputPickerProp = {
    id: string,
    title: string,
    placeholder: string,
    values: any,
    warning?: string,
    options: Option[],
    defaultTitle: string,
    validate: (value: any) => boolean,
    onChange: (id: string, value: any) => void
}

const InputPicker = ({ id, title, values, placeholder, defaultTitle, warning, options, validate, onChange }: InputPickerProp) => {
    const { i18n } = useTranslation();
    const handleChange = (input: any) => {
        onChange(id, input);
    }
    const isError = !validate(values[id]);
    const label = i18n.language === 'en' ? 'nameEn' : 'nameChi';

    return (
        <View style={{ marginBottom: 25 }}>
            <Label style={styles.reg_field_title}>{title}</Label>
            <Item picker>
                <Picker
                    mode='dropdown'
                    style={{ width: undefined }}
                    iosIcon={<Icon name='arrow-down' />}
                    placeholder={placeholder}
                    placeholderStyle={{ color: '#bfc6ea' }}
                    selectedValue={values[id]}
                    onValueChange={handleChange}
                >
                    <Picker.Item
                        label={defaultTitle}
                        value={false}
                    />
                    {
                        options.map((option) => (
                            <Picker.Item
                                label={option[label]}
                                value={option.code}
                                key={`option-${option.code}`}
                            />
                        ))
                    }
                </Picker>
            </Item>
            {
                isError && (
                    <Text style={styleSheet.error}>
                        {warning}
                    </Text>
                )
            }
        </View>
    )
}

const styleSheet = StyleSheet.create({
    error: {
        fontSize: 14,
        marginTop: 8,
        marginLeft: 10,
        marginRight: 5,
        color: "red",
    },
});

export default InputPicker;