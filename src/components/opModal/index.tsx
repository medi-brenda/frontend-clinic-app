import { Input, Item, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import { checkOperationPassword } from '../../actions/auth';
import { useStores } from '../../stores';
import MCCButton from '../mccButton';

type OPModalProp = {
    show: boolean,
    onDismiss: (result: string) => void
}

const OPModal = ({ show, onDismiss }: OPModalProp) => {
    const { t } = useTranslation();
    const stores = useStores();
    const [password, setPassword] = useState('');
    const [spinner, setSpinner] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setPassword('');
        setError('');
    }, [show]);

    const onPasswordChange = (password: string) => {
        setPassword(password);
    }

    const onSubmit = (password: string) => {
        setPassword(password);
    }

    const onCancel = () => {
        onDismiss('');
    }

    const onConfirm = async () => {
        setSpinner(true);
        const { success, message } = await checkOperationPassword({ stores, password });
        setSpinner(false);
        if (success) {
            onDismiss(password);
        }
        else {
            setError(t(message || 'Error.IncorrectOPPassword'));
        }
    }
    return (
        <Modal isVisible={show}>
            <Spinner
                visible={spinner}
                color={'red'}
                size={'large'}
                overlayColor={'rgba(0, 0, 0, 0.25)'}
            />
            <View style={styleSheet.view}>
                <Text style={styleSheet.title}>{t('Record.ST8')}</Text>
                <Item
                    style={styleSheet.item}
                >
                    <Input
                        autoFocus={true}
                        placeholder={t('Record.ST9')}
                        secureTextEntry={true}
                        style={styleSheet.input}
                        onChangeText={onPasswordChange}
                        value={password}
                        onSubmitEditing={(e) => {
                            onSubmit(e.nativeEvent.text);
                        }}
                    />
                </Item>
                {
                    error ? (
                        <View style={styleSheet.errorContainer}>
                            <Text style={styleSheet.errorText}>{error}</Text>
                        </View>
                    ) : undefined
                }
                <View
                    style={styleSheet.actionContainer}
                >
                    <View style={styleSheet.button}>
                        <MCCButton
                            onPress={onCancel}
                            color='grey'
                            text={t('Common.Cancel')}
                        />
                    </View>
                    <View style={styleSheet.button}>
                        <MCCButton
                            onPress={onConfirm}
                            text={t('Common.Confirm')}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
};

const styleSheet = StyleSheet.create({
    view: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    button: {
        justifyContent: 'center',
        marginHorizontal: 5,
        flex: 1,
    },
    title: {
        marginVertical: 10,
        fontSize: 24
    },
    text: {
        fontSize: 20
    },
    item: {
        borderColor: 'rgba(0,0,0,0.5)',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
    },
    input: {
        textAlign: 'center',
        fontSize: 22
    },
    errorContainer: {
        marginBottom: 10
    },
    errorText: {
        color: 'red'
    },
    actionContainer: {
        flexDirection: 'row',
        marginTop: 5,
    }
});

export default OPModal;