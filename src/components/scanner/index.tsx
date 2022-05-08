import { Camera } from 'expo-camera';
import { View } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MCCButton from '../mccButton';
import CamearBorderOverlay from './cameraOverlay';

type ScannerProps = {
    doctor: string,
    button: string,
    onBack: () => void,
    onScan: ((value: string) => void) | undefined,
}

const Scanner = ({ doctor, button, onScan, onBack }: ScannerProps) => {
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    return (
        <ScrollView
            onLayout={(event) => {
                const { layout } = event.nativeEvent;
                if (!width) {
                    setWidth(layout.width);
                    setHeight(layout.height);
                }
            }}
            keyboardShouldPersistTaps={"never"}
            scrollEnabled={false}
        >
            <View
                style={{
                    justifyContent: "center",
                    flexDirection: "column",
                    height: height || "auto",
                    width: width || "auto",
                }}
            >
                <Camera
                    style={StyleSheet.absoluteFillObject}
                    type={Camera.Constants.Type.back}
                    onBarCodeScanned={({ type, data }) => onScan?.(data)}
                />

                <View style={styleSheet.overlay} />

                <View style={styleSheet.row}>
                    <View style={styleSheet.overlay} />
                    <CamearBorderOverlay width={width ? (width * 0.7 + 2) : 0} />
                    <View style={styleSheet.overlay} />
                </View>

                <View style={styleSheet.info}>
                    <Text style={styleSheet.doctor}>
                        {doctor}
                    </Text>
                </View>
                <View style={styleSheet.overlay} />
            </View>
        </ScrollView>
    )
}

const styleSheet = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "center",
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.7)",
        flexGrow: 1,
    },
    info: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingTop: 30,
    },
    doctor: {
        color: "white",
        fontSize: 25,
        textAlign: "center"
    },
    button: {
        marginHorizontal: 15,
        marginTop: 10
    }
})

export default React.memo(Scanner);
