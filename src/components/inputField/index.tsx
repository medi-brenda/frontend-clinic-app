import React from 'react';
import { StyleSheet } from 'react-native';
import { Input, Item, Label, Text, Icon, View } from 'native-base';
import styles from '../../styles';

type InputFieldProp = {
    id: string,
    title: string,
    values: any,
    icon: string,
    iconType?: "AntDesign" | "Entypo" | "EvilIcons" | "Feather" | "FontAwesome" | "FontAwesome5" | "Foundation" | "Ionicons" | "MaterialCommunityIcons" | "MaterialIcons" | "Octicons" | "SimpleLineIcons" | "Zocial",
    prefix?: string,
    numberic?: boolean,
    isPassword?: boolean,
    warning?: string,
    validate: (value: any) => boolean,
    onChange: (id: string, value: any) => void
}

function numericOnly(text: string) {
    let newText = '';
    let numbers = '0123456789';

    for (var i = 0; i < text?.length; i++) {
        if (numbers.indexOf(text[i]) > -1) {
            newText = newText + text[i];
        }
    }
    return newText;
}

const InputField = ({ id, title, values, icon, iconType = 'Ionicons', prefix, numberic, isPassword, warning, validate, onChange }: InputFieldProp) => {

    const handleChange = (input: any) => {
        onChange(id, numberic ? numericOnly(input) : input);
    }
    const isError = !validate(values[id]);

    return (
        <View style={{ marginBottom: 25 }}>
            <Label style={styles.reg_field_title}>{title}</Label>
            <Item
                error={isError}
                rounded
                style={customStyles.inputLogin}
            >
                <Icon
                    name={icon}
                    type={iconType}
                    style={{
                        fontSize: 25,
                        marginLeft: 18,
                        marginRight: 0,
                        color: '#a4a4a4',
                    }}
                />
                {prefix == null ? (
                    <View />
                ) : (
                        <Label style={{ marginRight: -10, fontSize: 18 }}>{prefix}</Label>
                    )}
                <Input
                    onChangeText={handleChange}
                    value={values[id]}
                    autoCapitalize='none'
                    style={{
                        marginRight: -10,
                        fontSize: 18,
                        textAlignVertical: 'center',
                    }}
                    secureTextEntry={isPassword}
                    keyboardType={numberic ? 'numeric' : 'default'}
                />
            </Item>
            {
                isError && (
                    <Text
                        style={{
                            fontSize: 14,
                            marginTop: 8,
                            marginLeft: 10,
                            marginRight: 5,
                            color: "red",
                        }}
                    >
                        {warning}
                    </Text>
                )
            }
        </View>
    )
}

const customStyles = StyleSheet.create({
    inputLogin: {
        backgroundColor: '#FFFFFF',
        shadowRadius: 5,
        marginBottom: 0,
        borderColor: '#a4a4a4',
        color: '#a4a4a4',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default InputField;