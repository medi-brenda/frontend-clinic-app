import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "native-base";
import QrCodeIcon from '../../icons/QrCodeIcon';
import CardIcon from '../../icons/CardIcon';

const switchCase = (iamge: string) => {
    switch (iamge) {
        case "qrimg":
            return <QrCodeIcon />;
        case "physicalimg":
            return <CardIcon />;
    }
}

type MethodButtonType = {
    image: string,
    title: string,
    buttonStyle?: any,
    iconStyle?: any,
    textStyle?: any,
    onPress: () => void
}

const MethodButton = (props: MethodButtonType) => {
    const icon = switchCase(props.image);

    return (
        <Button
            block
            onPress={props.onPress}
            style={{ ...styleSheet.buttonStyle, ...props.buttonStyle }}
        >
            <View style={{ ...styleSheet.iconStyle, ...props.iconStyle }}>
                {icon}
            </View>
            <Text style={{ ...styleSheet.textStyle, ...props.textStyle }}>
                {props.title}
            </Text>
        </Button>
    );
};

export default MethodButton;

const styleSheet = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#ff8566',
        borderRadius: 8,
        height: 84,
        width: 240,
        marginTop: 36,
        alignSelf: 'center'
    },
    iconStyle: {
        width: '40%',
        alignItems: 'flex-end'
    },
    textStyle: {
        color: '#ffffff',
        fontWeight: '400',
        fontSize: 28,
    },
});