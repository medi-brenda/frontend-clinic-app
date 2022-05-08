import { Container } from 'native-base';
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import TitleBar from '../../components/titleBar';
import PhoneCall from "../../components/phoneCall";

const More = () => {
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();

    const goPage = (pageName: string) => {
        navigation.navigate(pageName);
    }

    return (
        <Container>
            <TitleBar
                title={t('Common.More')}
                onBack={() => { navigation.goBack(); }}
            />
            <View style={styleSheet.resourceCenterContainer}>
                <TouchableOpacity onPress={()=>{goPage('ResourceCenter')}}>
                    <View style={styleSheet.touchableOpacity}>
                        <Image style={[styleSheet.image, {width: 50, height: 50}]} source={require("../../assets/images/resourceCenter.png")}/>
                        <Text style={styleSheet.text}>{t('ResourceCenter.resourceCenter')}</Text>
                        <Image style={styleSheet.lessThan} source={require("../../assets/images/right.png")}/>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styleSheet.container}>
                <TouchableOpacity onPress={()=>{goPage('NewsList')}}>
                    <View style={styleSheet.touchableOpacity}>
                        <Image style={styleSheet.image} source={require('../../assets/images/homeIcon/update.png')}/>
                        <Text style={styleSheet.text}>{t('Common.Updates')}</Text>
                        <Image style={styleSheet.lessThan} source={require("../../assets/images/right.png")}/>
                    </View>
                </TouchableOpacity>
            </View>

            <PhoneCall/>
        </Container>
    );
};

const styleSheet = StyleSheet.create({
    resourceCenterContainer: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingVertical: 10,
    },
    container: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    image: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        flex: 3,
        marginVertical: 10,
    },
    text: {
        flex: 3,
        fontSize: 30,
        color: '#fb6060'
    },
    touchableOpacity: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    lessThan: {
        flex: 1,
        height: 20,
        resizeMode: 'contain'
    }
});

export default More;
