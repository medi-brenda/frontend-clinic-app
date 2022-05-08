import { Text, View } from 'native-base';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

type SearchInputProp = {
    placeholder: string,
    disabled?: boolean,
    onSubmit: (value: string) => void
}

const SearchInput = ({ placeholder, onSubmit, disabled }: SearchInputProp) => {
    return (
        <View style={styleSheet.view}>
            <Image
                source={require('../../assets/images/UI/searchSmall.png')}
                resizeMode={"contain"}
                style={styleSheet.icon}
            />
            <TextInput
                enabled={!disabled}
                placeholder={placeholder}
                textAlign={"left"}
                style={styleSheet.input}
                onSubmitEditing={e => {
                    onSubmit(e.nativeEvent.text);
                }}
            >
                <Text style={styleSheet.text}></Text>
            </TextInput>
        </View>
    );
}

const styleSheet = StyleSheet.create({
    view: {
        height: 40,
        marginBottom: 10,
        backgroundColor: "white",
        borderRadius: 20,
        margin: 10,
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        flex: 1,
        width: "100%"
    },
    text: {
        fontSize: 20
    },
    icon: {
        left: 15,
        height: "100%",
        position: "absolute"
    }
});

export default SearchInput;