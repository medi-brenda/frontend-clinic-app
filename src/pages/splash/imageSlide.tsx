import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

type ImageSlideProp = {
    image: any,
    subHeader: string,
    header: string
}

const ImageSlide = ({ image, subHeader, header }: ImageSlideProp) => {
    return (
        <View
            style={swiperStyles.slide}
        >
            <Image
                source={image}
                style={{
                    width: "100%",
                    height: "70%",
                }}
                resizeMode="cover"
            />
            <LinearGradient
                start={[0, 0]}
                end={[0, 1]}
                colors={["#f78363", "#eb5252"]}
                style={gradientStyles.linearGradient}
            >
                <View style={swiperStyles.view}>
                    <Text style={swiperStyles.SubHeader}>{subHeader}</Text>
                    <Text style={swiperStyles.Header}>{header}</Text>
                </View>
            </LinearGradient>
        </View>
    )
}

const swiperStyles = StyleSheet.create({
    slide: {
        flex: 1,
    },
    Header: {
        textAlign: "center",
        color: "#fff",
        fontSize: 26,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: "10%",
    },
    SubHeader: {
        textAlign: "center",
        color: "#fff",
        fontSize: 22,
    },
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
    }
});

const gradientStyles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
});

export default ImageSlide;