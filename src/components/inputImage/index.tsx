import React, { useState } from 'react';

import { Dimensions, Image, View, Text, StyleSheet, Alert } from 'react-native';
import { Button, Container } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles';
import { useTranslation } from 'react-i18next';
import * as Permissions from 'expo-permissions';

const { width } = Dimensions.get('window');

const maxImageWidth = (width * 4) / 9;
const maxImageHeight = (width * 4) / 9;

type InputImageProp = {
    id: string,
    title: string,
    values: any,
    warning: string,
    validate: (value: any) => boolean,
    onChange: (id: string, value: any) => void
}

const InputImage = ({ id, title, values, warning, validate, onChange }: InputImageProp) => {
    const [ratio, setRatio] = useState(1);
    const { t } = useTranslation();

    const handleUpload = async () => {

        let permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        if (permission.status !== "granted") permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
        if (permission.status !== "granted") {
            Alert.alert(t('Register.EntitlePermission'));
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            onChange(id, result.uri);
            setRatio(result.width / result.height);
        }
    }

    const handleTakePhoto = async () => {
        let permission = await Permissions.getAsync(Permissions.CAMERA);
        if (permission.status !== "granted") permission = await Permissions.askAsync(Permissions.CAMERA);
        
        if (permission.status !== "granted") {
            Alert.alert(t('Register.EntitlePermission'));
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            onChange(id, result.uri);
            setRatio(result.width / result.height);
        }
    }

    const isError = !validate(values[id]);

    return (
        <>
            <Text style={styles.reg_field_title}>{title}</Text>
            {
                !values[id] ? (
                    <Text style={styleSheet.warning}>{warning}</Text>
                ) : null
            }
            <View style={styleSheet.image}>
                {
                    values && values[id] ? (
                        <Image
                            style={{
                                marginBottom: 15,
                                width: ratio > 1 ? maxImageWidth : maxImageWidth * ratio,
                                height: ratio < 1 ? maxImageHeight : maxImageHeight * ratio
                            }}
                            source={{
                                uri: values[id]
                            }}
                        />
                    ) : null
                }

                
                {/* <Button
                    rounded
                    block
                    style={styles.button_auth}
                    onPress={handleUpload}
                >
                    <Text style={styleSheet.button}>{t('Register.Upload')}</Text>
                </Button> */}
                <Button
                    rounded
                    block
                    style={styles.button_auth}
                    onPress={handleTakePhoto}
                >
                    <Text style={styleSheet.button}>{t('Register.TakePhoto')}</Text>
                </Button>
            </View>
        </>
    )
}

const styleSheet = StyleSheet.create({
    warning: {
        fontSize: 14,
        marginLeft: 10,
        marginRight: 5,
        marginBottom: 25,
        color: 'red',
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        color: 'white',
        fontSize: 16
    }
})

export default InputImage;