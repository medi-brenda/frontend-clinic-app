import { observer } from 'mobx-react';
import { Body, Container, Icon, View, Text, Item, Input, Form } from 'native-base';
import React, { useState } from 'react';
import { Alert, Button, Keyboard, Platform, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { login } from '../../actions/auth';
import InsurerLogos from '../../components/insurerLogos';

const LoginPage = observer(() => {
    const stores = useStores();
    const { authState } = stores.authStore;
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [spinner, setSpinner] = useState(false);

    const onEmailChange = (value: string) => {
        setEmail(value)
    }

    const onPasswordChange = (value: string) => {
        setPassword(value)
    }

    const onLogin = async () => {
        setSpinner(true);
        const errorMsg = await login({ stores, navigation, password, username: email, i18n });

        if (errorMsg) {
            Alert.alert(
                t('Common.Error'),
                errorMsg,
                [
                    {
                        text: t('Common.Confirm'),
                        onPress: () => {
                            setSpinner(false);
                        }
                    }
                ]
            )
        }
        else {
            setSpinner(false);
        }
    }

    const onForgetPassword = () => {
        navigation.navigate('ForgetPassword');
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
                title={t('Common.Login')}
                onBack={navigation.goBack}
            />
            <ScrollView>
            <KeyboardAwareScrollView contentContainerStyle={{flex: 1, width: "100%", flexDirection: 'column', alignItems: 'center', height: Dimensions.get('window').height}} extraScrollHeight={0} enableOnAndroid={false} > 
        
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styleSheet.view}>
                        <ImageComponent
                            image={require('../../assets/images/mcc-black-medium.png')}
                            style={styleSheet.mccLogo}
                        />
                        <View>
                            <Text style={styleSheet.title}>{t('Common.trust_parter')}</Text>
                        </View>
                        <InsurerLogos />
                        <Form style={styles.form}>
                            <Item rounded style={styles.inputLogin}>
                                <Icon
                                    name='email'
                                    type='MaterialCommunityIcons'
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
                            <Item rounded style={styles.inputLogin}>
                                <Icon
                                    name='lock'
                                    type='MaterialCommunityIcons'
                                    style={styleSheet.icon}
                                />
                                <Input
                                    onChangeText={onPasswordChange}
                                    placeholder={t('Common.Password')}
                                    placeholderTextColor='#a4a4a4'
                                    style={styleSheet.input}
                                    secureTextEntry={true}
                                    autoCapitalize='none'
                                />
                            </Item>
                        </Form>
                        <View style={styleSheet.term}>
                            <Text style={styleSheet.termDescription}>
                                {t('Auth.Term_00')}
                                <Text
                                    onPress={() => {
                                        WebBrowser.openBrowserAsync(
                                            "https://web2.prod.mediconcen.com/m-term_and_agreement.php"
                                        )
                                    }}
                                    style={styleSheet.hyperlink}
                                >
                                    {t('Auth.Term_01')}
                                </Text>
                                {t('Auth.Term_02')}
                                <Text
                                    onPress={() => {
                                        WebBrowser.openBrowserAsync(
                                            "https://web2.prod.mediconcen.com/m-service_agreement.php"
                                        )
                                    }}
                                    style={styleSheet.hyperlink}
                                >
                                    {t('Auth.Term_03')}
                                </Text>
                                {t('Auth.Term_04')}
                                <Text
                                    onPress={() => {
                                        WebBrowser.openBrowserAsync(
                                            "https://web2.prod.mediconcen.com/m-pics.php"
                                        )
                                    }}
                                    style={styleSheet.hyperlink}
                                >
                                    {t('Auth.Term_05')}
                                </Text>
                                {t('Auth.Term_06')}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styleSheet.loginContainer}>
                    <MCCButton onPress={onLogin} text={t('Common.Login')} />
                    <TouchableOpacity
                            onPress={onForgetPassword}
                            style={styles.text_auth}
                            activeOpacity={1}
                        >
                            <Text style={styles.text_auth}>{t('Auth.ST4')}</Text>
                        </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
            </ScrollView>
        </Container >
    );
});

const styleSheet = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
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
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        marginTop: 0,
    },
    mccLogo: {
        width: '100%',
        height:'20%',
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
        marginBottom: 0
    },
    termDescription: {
        color: 'grey'
    },
    hyperlink: {
        color: '#0066cc'
    },
    loginContainer: {
        width: '80%',
    }
})

export default LoginPage;