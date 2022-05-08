import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Button, Container, Icon, View, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ImageBackground, StyleSheet } from 'react-native';

const { height, width } = Dimensions.get('screen');

const TransactionSuccessPage = observer(() => {

    const { t } = useTranslation();
    const navigation = useNavigation();

    const onNextPayment = () => {
        navigation.navigate('ModifyMain');
    }

    const onGoBack = () => {
        navigation.navigate('Record');
    }

    return (
        <Container>
            <ImageBackground
                source={require('../../assets/images/background/homeBG.png')}
                style={styleSheet.background}
            >
                <View style={styleSheet.context}>
                    <View style={styleSheet.header}>
                        <View>
                            <Icon name='check-all' type='MaterialCommunityIcons' style={styleSheet.leftIcon} />
                        </View>
                        <Text style={styleSheet.headerTitle}>{t('Modify.TransactionComplete')}</Text>
                    </View>
                    <Button style={styleSheet.button} onPress={onNextPayment}>
                        <Text>{t('Modify.NextPayment')}</Text>
                    </Button>
                    <Button style={[styleSheet.button, styleSheet.marginBottom]} onPress={onGoBack}>
                        <Text>{t('Modify.Back')}</Text>
                    </Button>
                </View>
            </ImageBackground>
        </Container>
    );
});

const styleSheet = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
    },
    context: {
        height: height * 0.9,
        width,
        display: 'flex',
        alignItems: 'center'
    },
    header: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftIcon: {
        fontSize: 98,
        color: '#FFF'
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 24
    },
    button: {
        width: '80%',
        backgroundColor: 'transparent',
        borderWidth: 0.4,
        borderColor: '#FFF',
        borderRadius: 16,
        height: 48,
        justifyContent: 'center',
        marginBottom: 24,
        alignSelf: 'center'
    },
    marginBottom: {
        marginBottom: 64
    }
});

export default TransactionSuccessPage