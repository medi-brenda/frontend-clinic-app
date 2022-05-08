import { View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

type CamearBorderOverlayProps = {
    width: number | string
}

const CamearBorderOverlay = ({ width }: CamearBorderOverlayProps) => {
    return (
        <View style={{
            width,
            height: width,
            ...styleSheet.container
        }}>
            <View
                style={styleSheet.context}
            >
                <View
                    style={[styleSheet.border, styleSheet.borderLeftTop]}
                />
                <View
                    style={[styleSheet.border, styleSheet.borderRigtTop]}
                />
            </View>
            <View
                style={styleSheet.context}
            >
                <View
                    style={[styleSheet.border, styleSheet.borderLeftBottom]}
                />
                <View
                    style={[styleSheet.border, styleSheet.borderRightBottom]}
                />
            </View>
        </View>
    );
};

const styleSheet = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "space-between",
    },
    context: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    border: {
        borderColor: "red",
        height: 50,
        width: 50,
    },
    borderLeftTop: {
        borderTopWidth: 3,
        borderLeftWidth: 3
    },
    borderRigtTop: {
        borderTopWidth: 3,
        borderRightWidth: 3,
    },
    borderLeftBottom: {
        borderBottomWidth: 3,
        borderLeftWidth: 3,
    },
    borderRightBottom: {
        borderBottomWidth: 3,
        borderRightWidth: 3
    }
});

export default CamearBorderOverlay;