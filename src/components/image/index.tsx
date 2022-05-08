import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

type ImageProp = {
    image: any,
    style?: StyleProp<ImageStyle>
}

const ImageComponent = ({ image, style }: ImageProp) => {
    return (
        <Image
            source={image}
            style={style}
            resizeMode="contain"
        />
    )
}

export default ImageComponent;