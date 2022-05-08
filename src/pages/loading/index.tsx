import React from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator } from "react-native";
const Loading = () => {
    return (
        <View style={[styles.preloader]}>
            <ActivityIndicator style={{ height: 80 }} size="large" color="red" />
        </View>
    )
};

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
    preloader: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: height,
        backgroundColor: "#FFFFFF",
    },
});

export default Loading;