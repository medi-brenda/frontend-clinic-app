import { View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Image, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const window = Dimensions.get('window');

type GridItemType = {
    image: string,
    title: string,
    onPress: () => void,
    custom?: React.ReactNode
    selfDefinedWidth?: number,
    selfDefinedHeight?: number,
    marginTop?: number,
}

const getImage = (image: string) => {
    switch (image) {
        case 'verify':
            return require('../../assets/images/homeIcon/verify.png');
        case 'modify':
            return require('../../assets/images/homeIcon/modify.png');
        case 'record':
            return require('../../assets/images/homeIcon/record.png');
        case 'report':
            return require('../../assets/images/homeIcon/report.png');
        case 'cooperators':
            return require('../../assets/images/homeIcon/cooperators.png');
        case 'update':
            return require('../../assets/images/homeIcon/more.png');
    }
}

const GridItem = ({ image, title, onPress, custom, selfDefinedWidth = 0, selfDefinedHeight = 0, marginTop = 0 }: GridItemType) => {
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [length, setLength] = useState<number>(width > height ? height * 0.6 : width * 0.6);

    useEffect(() => {
        let tempWidth = selfDefinedWidth !== 0 ? selfDefinedWidth: width;
        if(selfDefinedWidth !== 0)
        {
            tempWidth = selfDefinedWidth
        }
        else 
        {
            tempWidth = width > height ? height * 0.6 : width * 0.6
        }
        setLength(tempWidth);
    });

    return (
        <View
            style={styleSheet.gridItem}
            onLayout={(event) => {
                const { layout } = event.nativeEvent;
                if (!width) {
                    setWidth(layout.width);
                    setHeight(layout.height);
                }
            }}
        >
            <TouchableOpacity
                style={styleSheet.touchable}
                onPress={onPress}

            >
                <Image
                    style={{
                        width: length,
                        height: length,
                        opacity: 1,
                    }}
                    source={getImage(image)}
                />

                <Text
                    numberOfLines={1}
                    style={[styleSheet.text, {marginTop: marginTop,}]}
                >
                    {title}
                </Text>
                {custom}
            </TouchableOpacity>

        </View>
    )
}

const styleSheet = StyleSheet.create({
    gridItem: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row'
    },
    touchable: {
        flex: 1,
        width: window.width / 2 - 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        paddingBottom: 10,
    },
    text: {
        color: "#fb6060",
        fontSize: 20,
        fontWeight: "bold",
    }
});

export default GridItem;