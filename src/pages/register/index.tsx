import { Button, Container, Form, Icon, Item, Picker, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native-gesture-handler';
import { goRegisterStep2, initRegister } from '../../actions/auth';
import InputField from '../../components/inputField';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import Loading from '../loading';
import * as _ from 'lodash';

import styles from '../../styles';
import InputImage from '../../components/inputImage';
import {
    validateEmail,
    validatePass,
    validateName,
    validatePhone,
    validateBankAccountNumber
} from '../../utils/validate';
import { useNavigation } from '@react-navigation/native';



const RegisterPage = () => {
    const stores = useStores();
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();
    const [inited, setInited] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const { registerData } = stores.authStore;
    const { banks } = stores.configStore;
    const [values, setValues] = useState<any>(registerData);

    useEffect(() => {
        initRegister({ stores })
            .then(() => setInited(true));
    }, []);

    const { language } = i18n;

    if (!inited) {
        return (
            <Loading />
        );
    }

    const bankList = [
        <Picker.Item
            label={t('Auth.BankCodeInvalid')}
            value={false}
            key={'000'}
        />,
        ...banks
            .map((bank) => (
                <Picker.Item
                    label={`${bank.code}-${language === 'en' ? bank.nameEn : bank.nameChi}`}
                    value={bank.code}
                    key={bank.code}
                />
            ))
    ];

    const onChange = (id: string, value: any) => {
        values[id] = value;
        setValues(values);
        setRefresh(!refresh);
    }

    const onNext = async () => {
        const success = await goRegisterStep2({ stores, data: values, navigation });
        if (!success) {
            Alert.alert(t('Common.Error'), t('Register.InvalidInputs'));
        }
    }

    return (
        <>
            <TitleBar
                title={t('Register.Title')}
                onBack={() => {
                    navigation.goBack();
                }}
            />
            <Container
                style={{
                    backgroundColor: '#fff',
                }}
            >
                <View style={{ flex: 1 }}>
                    <KeyboardAwareScrollView contentContainerStyle={{flex: 1, width: "100%", flexDirection: 'column'}} extraScrollHeight={0} enableOnAndroid={false} > 
                        <ScrollView style={{ paddingHorizontal: 25 }}>
                            <Form>
                                <Text style={styles.reg_topic_text}>
                                    1/4 {t('Register.ST50')}
                                </Text>
                                <InputField
                                    id={'email'}
                                    title={t('Register.ST45')}
                                    validate={validateEmail}
                                    warning={t('Register.ST51')}
                                    icon='md-mail'
                                    values={values}
                                    onChange={onChange}
                                />
                                <InputField
                                    id={'password'}
                                    title={t('Auth.LoginPassword')}
                                    validate={validatePass}
                                    warning={t('Register.ST52')}
                                    icon='lock'
                                    iconType='MaterialCommunityIcons'
                                    isPassword={true}
                                    values={values}
                                    onChange={onChange}
                                />
                                <InputField
                                    id={'operationPassword'}
                                    title={t('Auth.OperationPassword')}
                                    validate={validatePass}
                                    warning={t('Register.ST52')}
                                    icon='lock'
                                    iconType='MaterialCommunityIcons'
                                    isPassword={true}
                                    values={values}
                                    onChange={onChange}
                                />
                                <InputField
                                    id={'name'}
                                    title={t('Register.ST46')}
                                    validate={validateName}
                                    warning={t('Register.ST53')}
                                    icon='md-person'
                                    values={values}
                                    onChange={onChange}
                                />
                                <InputField
                                    id={'phoneNumber'}
                                    title={t('Register.ST47')}
                                    validate={validatePhone}
                                    warning={t('Register.ST54')}
                                    icon='md-call'
                                    prefix='+852-'
                                    numberic={true}
                                    values={values}
                                    onChange={onChange}
                                />

                                <Text style={styles.reg_field_title}>
                                    {t('Register.BankCode')}
                                </Text>

                                <Picker
                                    mode='dropdown'
                                    style={{ width: undefined }}
                                    iosIcon={<Icon name='arrow-down' />}
                                    placeholder={t('Register.SelectBank')}
                                    placeholderStyle={{ color: '#bfc6ea' }}
                                    selectedValue={values.bankID}
                                    onValueChange={(value) => {
                                        onChange('bankID', value);
                                    }}
                                >
                                    {bankList}
                                </Picker>

                                {
                                    !values.bankID && (
                                        <Text
                                            style={styleSheet.bankText}
                                        >
                                            {t('Register.BankCodeInvalid')}
                                        </Text>
                                    )
                                }
                                <View style={{ marginBottom: 15 }} />

                                <InputField
                                    id={'accountNumber'}
                                    title={t('Register.ST48')}
                                    validate={validateBankAccountNumber}
                                    warning={t('Register.ST55')}
                                    icon='md-card'
                                    values={values}
                                    onChange={onChange}
                                />

                                <InputField
                                    id={'bankAccountName'}
                                    title={t('Register.BankAccountUserName')}
                                    validate={validateName}
                                    warning={t('Register.bankAccountUserNameNotValid')}
                                    icon='md-person'
                                    values={values}
                                    onChange={onChange}
                                />
                                
                                <InputImage
                                    id='comCert'
                                    title={t('Register.BusinessRegistrationCertificate')}
                                    warning={t('Register.BusinessCertMissing')}
                                    values={values}
                                    validate={(value) => !!value}
                                    onChange={onChange}
                                />
                                                                
                            </Form>
                            <Button
                                rounded
                                block
                                style={styles.button_auth}
                                onPress={onNext}
                            >
                                <Text>{t('Register.ST49')}</Text>
                            </Button>
                        </ScrollView>
                    </KeyboardAwareScrollView>
                </View>
            </Container>
        </>
    )
}

const styleSheet = StyleSheet.create({
    keyboard: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    bankText: {
        fontSize: 14,
        marginTop: 8,
        marginLeft: 10,
        marginRight: 5,
        color: 'red',
    }
})

export default RegisterPage;