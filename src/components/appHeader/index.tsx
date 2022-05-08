import React from 'react';
import { Body, Header, Left, Title, Button, Right } from "native-base";
import { SimpleLineIcons } from "@expo/vector-icons";
import { StatusBar, StyleSheet } from 'react-native';

type AppHeaderProp = {
    title: string,
    onBack: () => void,
    noReturn?: boolean
}

const AppHeader = ({ title, onBack, noReturn }: AppHeaderProp) => {
    return (
        <>
            <StatusBar backgroundColor='#ff8566' />
            <Header style={styleSheet.header}>
                <Left style={styleSheet.left}>
                    {
                        noReturn ? undefined : (
                            <Button transparent>
                                <SimpleLineIcons
                                    name="arrow-left"
                                    style={styleSheet.leftIcon}
                                    onPress={onBack}
                                />
                            </Button>
                        )
                    }
                </Left>
                <Body style={styleSheet.body}>
                    <Title style={styleSheet.title}>{title}</Title>
                </Body>
                <Right style={styleSheet.right} />
            </Header>
        </>
    );
}

const styleSheet = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
    left: {
        flex: 1
    },
    leftIcon: {
        fontSize: 24,
        padding: 10
    },
    body: {
        flex: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        color: "#000000"
    },
    right: {
        flex: 1
    }
})

export default AppHeader;