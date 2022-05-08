import { observer } from 'mobx-react';
import { Body, Container, Icon, View, Text, Item, Input, Form } from 'native-base';
import React, { useState } from 'react';
import { Alert, StatusBar, StyleSheet } from 'react-native';
import { useStores } from '../../stores';
import Spinner from 'react-native-loading-spinner-overlay';
import AppHeader from '../../components/appHeader';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from "expo-web-browser";
import ImageComponent from '../../components/image';
import styles from '../../styles';
import { Ionicons } from '@expo/vector-icons';
import MCCButton from '../../components/mccButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { forgetPassword } from '../../actions/auth';
import InsurerLogos from '../../components/insurerLogos';


const ForgetPasswordPage = observer(() => {
    const stores = useStores();
    const { authState } = stores.authStore;
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');

    const onEmailChange = (value: string) => {
        setEmail(value)
    }

    const onForgetPassword = async () => {
        const resp = await forgetPassword({
            navigation, 
            email, stores
        });
        
        Alert.alert(
            resp.success ? t('Common.Success') : t('Common.Error'),
            t(resp.message)
        );
    }

    return (
        <Container style={styleSheet.container}>
            <Spinner
                visible={authState === 'progress'}
                color={'red'}
                size={'large'}
                overlayColor={'rgba(0, 0, 0, 0.25)'}
            />
            <AppHeader
                title={t('Auth.ForgetPassword')}
                onBack={navigation.goBack}
            />
            <View style={styleSheet.view}>
                <ImageComponent
                    image={require('../../assets/images/mcc-black-medium.png')}
                    style={styleSheet.mccLogo}
                />
                <View>
                    <Text style={styleSheet.title}>{t('Common.trust_parter')}</Text>
                </View>
                <InsurerLogos />
                <StatusBar backgroundColor='#ff8566' />
                <Form style={styles.form}>
                    <Item rounded style={styles.inputLogin}>
                        <Ionicons
                            name='md-mail'
                            style={styleSheet.icon}
                        />
                        <Input
                            onChangeText={onEmailChange}
                            placeholder={t('Common.Email')}
                            placeholderTextColor='#a4a4a4'
                            style={styleSheet.input}
                            autoCapitalize='none'
                        />
                    </Item>
                    
                    <MCCButton onPress={onForgetPassword} text={t('Common.Confirm')} />    
                </Form>
                
            </View>
        </Container >
    );
});

const styleSheet = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    header: {
        backgroundColor: '#fff',
        borderBottomWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
    view: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        marginTop: 0,
    },
    logoContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    mccLogo: {
        width: '100%',
        height: '25%'
    },
    logo: {
        width: '40%',
        height: 48,
        marginRight: '2%',
        marginLeft: '2%'
    },
    title: {
        color: '#f95e56',
        fontSize: 14
    },
    form: {
        marginTop: 24
    },
    input: {
        fontSize: 16
    },
    icon: {
        fontSize: 18,
        marginLeft: 18,
        marginRight: 5,
        color: "#a4a4a4",
    },
    term: {
        marginBottom: 20
    },
    termDescription: {
        color: 'grey'
    },
    hyperlink: {
        color: '#0066cc'
    }
})

export default ForgetPasswordPage;