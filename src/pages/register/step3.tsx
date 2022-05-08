import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Button, Container, Text, View } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { goDoctorDetail, goRegisterStep4 } from '../../actions/auth';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import styles from '../../styles';

const RegisterStep3 = observer(() => {
    const stores = useStores();
    const { t } = useTranslation();
    const { registerData } = stores.authStore;
    const [values, setValues] = useState<any>(registerData);
    const navigation = useNavigation();

    const addDoctor = () => {
        goDoctorDetail({
            stores,
            navigation,
            type: 'new'
        });
    }

    const onNext = () => {
        const result = goRegisterStep4({
            stores,
            data: values,
            navigation
        });

        if (!result) {
            Alert.alert(t('Common.Error'), t('Register.AddDoctorAlert'));
        }
    }

    const updateDoctor = (index: number) => {
        goDoctorDetail({
            stores,
            navigation,
            type: 'modify',
            index
        });
    }

    return (
        <Container style={styleSheet.container}>
            <TitleBar
                title={t('Register.Title')}
                onBack={navigation.goBack}
            />
            <View style={styleSheet.context}>
                <KeyboardAwareScrollView contentContainerStyle={{flex: 1, width: "100%", flexDirection: 'column'}} extraScrollHeight={0} enableOnAndroid={false} > 
                    <ScrollView style={{ flex: 1, paddingHorizontal: 25 }}>
                        <Text style={styles.reg_topic_text}>
                            3/4 {t('Register.StepThreeTopic')}
                        </Text>
                        <Text style={[styles.reg_field_title, styleSheet.title]}>
                            {t('Register.DoctorList')}
                        </Text>

                        {
                            values.doctors.map((doctor: any, index: number) => (
                                <TouchableOpacity key={`doctor-${index}`} onPress={() => updateDoctor(index)}>
                                    <View style={styleSheet.doctor}>
                                        <Text>
                                            {`${doctor.nameEn}/${doctor.nameChi}`}
                                        </Text>
                                        <Text>{'>'}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }

                        <Button
                            rounded
                            block
                            style={styles.button_auth}
                            onPress={addDoctor}
                        >
                            <Text>{t('Register.AddNewDoctor')}</Text>
                        </Button>
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
    )
})

const styleSheet = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    context: {
        flex: 1
    },
    keyboard: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 25
    },
    title: {
        marginTop: 15,
        marginBottom: 10
    },
    doctor: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 15,
    }
})

export default RegisterStep3;