import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Button, Container, Text, View } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native-gesture-handler';
import FlatListPicker from '../../components/flatListPicker';
import InputField from '../../components/inputField';
import InputImage from '../../components/inputImage';
import InputPicker from '../../components/inputPicker';
import TitleBar from '../../components/titleBar';
import InsurerFlatList from '../../components/insurerFlatList';
import { useStores } from '../../stores';
import styles from '../../styles';
import { validateName, validateGender, validateMedicalServices, validateAuthority, validateDocCert, validateConsulatation } from '../../utils/validate';
import ScheduleComponent from './schedules';
import { saveDoctor, selectServiceHour } from '../../actions/auth';

const DoctorDetail = observer(() => {
    const stores = useStores();
    const { i18n, t } = useTranslation();
    const { doctor } = stores.authStore;
    const { specialities, authorities } = stores.configStore;
    const [values, setValues] = useState<any>(doctor);
    const [refresh, setRefresh] = useState(false);
    const navigation = useNavigation();

    const label = i18n.language === 'en' ? 'nameEn' : 'nameChi';

    const onChange = (id: string, value: any) => {
        values[id] = value;
        setValues(values);
        setRefresh(!refresh);
    }

    const setServiceHours = () => {
        selectServiceHour({
            type: 'doctor',
            stores,
            navigation
        });
    };

    const onSave = () => {
        const result = saveDoctor({
            stores, 
            data: values,
            navigation
        });

        if (!result) {
            Alert.alert(t('Common.Error'), t('Register.InvalidInputs'));
        }
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
                        <InputField
                            id={'nameEn'}
                            title={t('Register.DoctorNameEn')}
                            validate={validateName}
                            warning={t('Register.doctorNameNotValid')}
                            icon='md-person'
                            values={values}
                            onChange={onChange}
                        />

                        <InputField
                            id={'nameChi'}
                            title={t('Register.DoctorNameCn')}
                            validate={validateName}
                            warning={t('Register.doctorNameNotValid')}
                            icon='md-person'
                            values={values}
                            onChange={onChange}
                        />

                        <InputPicker
                            id={'gender'}
                            title={t('Register.Gender')}
                            placeholder={t('Register.Gender')}
                            defaultTitle={t('Register.genderHint')}
                            warning={t('Register.genderHint')}
                            options={[
                                {
                                    code: 'M',
                                    nameChi: t('Register.Male'),
                                    nameEn: t('Register.Male'),
                                },
                                {
                                    code: 'F',
                                    nameChi: t('Register.Female'),
                                    nameEn: t('Register.Female'),
                                }
                            ]}
                            validate={validateGender}
                            values={values}
                            onChange={onChange}
                        />

                        <FlatListPicker
                            id={'medicalServices'}
                            values={values}
                            title={t('Register.MedicalServices')}
                            warning={t('Register.SelectMedicalService')}
                            options={specialities}
                            validate={validateMedicalServices}
                            onChange={onChange}
                        />

                        <InputPicker
                            id={'authority'}
                            title={t('Register.RegistrationAuthority')}
                            placeholder={t('Register.AuthorityHint')}
                            defaultTitle={t('Register.AuthorityHint')}
                            warning={t('Register.AuthorityHint')}
                            options={authorities}
                            validate={validateAuthority}
                            values={values}
                            onChange={onChange}
                        />

                        <InputImage
                            id={'docCert'}
                            title={t('Register.PracticingCertificate')}
                            warning={t('Register.DoctorCertMissing')}
                            values={values}
                            validate={validateDocCert}
                            onChange={onChange}
                        />

                        <InsurerFlatList
                            id={'consultations'}
                            values={values}
                            validate={validateConsulatation}
                            onChange={onChange}
                        />
                        <ScheduleComponent
                            values={doctor.schedules}
                            onUpdate={setServiceHours}
                        />
                        <Button
                            rounded
                            block
                            style={styles.button_auth}
                            onPress={onSave}
                        >
                            <Text>{t('Register.SaveCurrentDoctor')}</Text>
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
    }
})

export default DoctorDetail;