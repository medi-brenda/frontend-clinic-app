import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'native-base';

type MCCButtonType = {
    text: string
    onPress: () => void,
    color?: string,
    bold?: boolean,
    buttonStyle?: any,
    textStyle?: any,
    disabled?: boolean
}

const createStyle = (color?: string, bold = false) => {
    let buttonColor, textColor;
    const fontWeight = bold ? 'bold' : 'normal';
    switch (color) {
        case 'white':
            buttonColor = '#ffffff';
            textColor = '#f95e56';
            break;
        case 'grey':
            buttonColor = 'grey';
            textColor = '#000000';
            break;
        default:
            buttonColor = '#f95e56';
            textColor = '#ffffff';
            break;
    }

    const styles = StyleSheet.create({
        buttonStyle: {
            backgroundColor: buttonColor,
            height: 50,
        },
        textStyle: {
            color: textColor,
            fontWeight: fontWeight,
            fontSize: 20,
        },
    });
    return styles;
};


const MCCButton = ({ color, bold, onPress, buttonStyle, textStyle, text, disabled }: MCCButtonType) => {
    const styles = createStyle(disabled ? 'grey' : color, bold);

    return (
        <Button
            rounded
            block
            onPress={onPress}
            disabled={disabled}
            style={{ ...styles.buttonStyle, ...buttonStyle }}
        >
            <Text style={{ ...styles.textStyle, ...textStyle }}>
                {text}
            </Text>
        </Button>
    );
};

export default MCCButton;