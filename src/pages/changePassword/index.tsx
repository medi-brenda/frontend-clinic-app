import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Spinner from 'react-native-loading-spinner-overlay';
import { Container, Item, Input, View, Text } from 'native-base';
import TitleBar from '../../components/titleBar';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet } from 'react-native';
import styles from '../../styles';
import MCCButton from '../../components/mccButton';
import { useStores } from '../../stores';
import { changePassword } from '../../actions/app';
import { Dimensions } from "react-native";
import PhoneCall from "../../components/phoneCall";

var { height, width } = Dimensions.get('window');

const ChangePasswordPage = observer(() => {
    const stores = useStores();
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();

    const [OldPassword, setOldPassword] = useState('');
    const [NewPassword, setNewPassword] = useState('');
    const [NewPasswordComfirme, setNewPasswordComfirm] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const onOldPasswordChange = (value: string) => {
        setOldPassword(value)
    }

    const onNewPasswordChange = (value: string) => {
        setNewPassword(value)
    }

    const onNewPasswordConfirmChange = (value: string) => {
        setNewPasswordComfirm(value)
    }



    const onChangePassword = async () => {

        if (NewPassword !== NewPasswordComfirme) {
            Alert.alert(t('Others.NewPasswordNotMatch'));
        } else {
            const { clinicId, token } = stores.appStore;
            const message = await changePassword({ stores, clinicId, oldPassword: OldPassword, newPassword: NewPassword, token, i18n });
            if (message === true) {
                Alert.alert(t('Others.PasswordResetSuccess'));
            } else {
                Alert.alert(t('Others.WrongOldPassword'));
            }
        }
    }


    return (
        <Container>
            <TitleBar
                title={t('Others.ST11')}
                onBack={() => { navigation.goBack(); }}
            />
            <Text>  </Text>
            <View style={styleSheet.view}>
                <Item rounded style={styleSheet.textInput}>

                    <Input
                        onChangeText={onOldPasswordChange}
                        placeholder={t('Others.OldPassword')}
                        placeholderTextColor='#a4a4a4'
                        style={styleSheet.input}
                        autoCapitalize='none'
                        secureTextEntry={true}
                    />
                </Item>

                <Item rounded style={styleSheet.textInput}>
                    <Input
                        onChangeText={onNewPasswordChange}
                        placeholder={t('Others.NewPassword')}
                        placeholderTextColor='#a4a4a4'
                        style={styleSheet.input}
                        autoCapitalize='none'
                    />
                </Item>
                <Item rounded style={styleSheet.textInput}>

                    <Input
                        onChangeText={onNewPasswordConfirmChange}
                        placeholder={t('Others.NewPasswordConfirm')}
                        placeholderTextColor='#a4a4a4'
                        style={styleSheet.input}
                        autoCapitalize='none'
                    />
                </Item>

                <MCCButton onPress={onChangePassword} text={t('Others.PasswordReset')} />

            </View>

            <PhoneCall/>
        </Container>)
});

const styleSheet = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    title: {
        color: '#f95e56',
        fontSize: 14
    },
    input: {
        fontSize: 16
    },
    view: {
        alignItems: 'center'
    },
    textInput: {
        backgroundColor: '#FFFFFF',
        width: width * 0.90,
        shadowRadius: 5,
        marginBottom: 20,
        borderColor: '#a4a4a4',
        color: '#a4a4a4'

    }
})

export default ChangePasswordPage;
