import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Button, Container, Form, Icon, Item, Label, Picker, Text, View } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import styles from '../../styles';
import InputField from '../../components/inputField';
import { useStores } from '../../stores';
import { Regions } from '../../utils/static';

import {
    validateClinicName,
    validateRegion,
    validateDistrict,
    validatePhone,
    validatePhoneAllowEmpty
} from '../../utils/validate';
import { goRegisterStep3, selectServiceHour } from '../../actions/auth';
import { formatTime } from '../../utils/formatter';
import InputPicker from '../../components/inputPicker';
import ScheduleComponent from './schedules';

const RegisterStep2 = observer(() => {
    const navigation = useNavigation();
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const { registerData } = stores.authStore;
    const { districts } = stores.configStore;
    const { schedules } = registerData;
    const [values, setValues] = useState<any>(registerData);
    const [refresh, setRefresh] = useState(false);

    const onChange = (id: string, value: any) => {
        values[id] = value;
        setValues(values);
        setRefresh(!refresh);
    }

    const setServiceHours = () => {
        selectServiceHour({
            type: 'clinic',
            stores,
            navigation
        });
    };

    const onNext = async () => {
        const success = await goRegisterStep3({ stores, data: values, navigation });
        if (!success) {
            Alert.alert(t('Common.Error'), t('Register.InvalidInputs'));
        }
    }

    return (
        <Container style={{ backgroundColor: '#fff' }}>
            <TitleBar
                onBack={() => navigation.goBack()}
                title={t('Register.Title')}
            />
            <View style={{ flex: 1 }}>
            <KeyboardAwareScrollView contentContainerStyle={{flex: 1, width: "100%", flexDirection: 'column'}} extraScrollHeight={0} enableOnAndroid={false} > 
                    <ScrollView style={{ flex: 1, paddingHorizontal: 25 }}>
                        <Form>
                            <Text style={styles.reg_topic_text}>
                                2/4 {t('Register.StepTwoTopic')}
                            </Text>

                            <InputField
                                id={'clinicNameEn'}
                                title={t('Register.ST56')}
                                validate={validateClinicName}
                                warning={t('Register.ST57')}
                                icon='md-business'
                                values={values}
                                onChange={onChange}
                            />

                            <InputField
                                id={'clinicNameChi'}
                                title={t('Register.ST58')}
                                validate={validateClinicName}
                                warning={t('Register.ST57')}
                                icon='md-business'
                                values={values}
                                onChange={onChange}
                            />

                            <InputField
                                id={'clinicAddressEn'}
                                title={t('Register.ST60')}
                                validate={validateClinicName}
                                warning={t('Register.ST61')}
                                icon='md-locate'
                                values={values}
                                onChange={onChange}
                            />

                            <InputField
                                id={'clinicAddressChi'}
                                title={t('Register.ST62')}
                                validate={validateClinicName}
                                warning={t('Register.ST61')}
                                icon='md-locate'
                                values={values}
                                onChange={onChange}
                            />

                            <InputPicker
                                id={'region'}
                                title={t('Register.ST64')}
                                placeholder={t('Register.SelectRegion')}
                                values={values}
                                warning={t('Register.RegionHint')}
                                options={Regions}
                                defaultTitle={t('Register.RegionHint')}
                                validate={validateRegion}
                                onChange={onChange}
                            />

                            <InputPicker
                                id={'district'}
                                title={t('Register.ST63')}
                                placeholder={t('Register.SelectDistrict')}
                                values={values}
                                warning={t('Register.DistrictHint')}
                                options={districts}
                                defaultTitle={t('Register.DistrictHint')}
                                validate={validateDistrict}
                                onChange={onChange}
                            />

                            <InputField
                                id={'clinicPhone'}
                                title={t('Register.ST67')}
                                validate={validatePhone}
                                warning={t('Register.phoneOrFaxNumberNotValid')}
                                icon='md-call'
                                values={values}
                                prefix='+852-'
                                numberic={true}
                                onChange={onChange}
                            />

                            <InputField
                                id={'clinicPhone2'}
                                title={t('Register.ST68')}
                                validate={validatePhoneAllowEmpty}
                                warning={t('Register.phoneOrFaxNumberNotValid')}
                                icon='md-call'
                                prefix='+852-'
                                numberic={true}
                                values={values}
                                onChange={onChange}
                            />

                            <InputField
                                id={'clinicFax'}
                                title={t('Register.ST69')}
                                validate={validatePhoneAllowEmpty}
                                warning={t('Register.phoneOrFaxNumberNotValid')}
                                icon='print'
                                iconType='MaterialIcons'
                                prefix='+852-'
                                numberic={true}
                                values={values}
                                onChange={onChange}
                            />

                            <Label style={styles.reg_field_title}>
                                {t('Register.ST78')}
                            </Label>
                            <ScheduleComponent
                                values={schedules}
                                onUpdate={setServiceHours}
                            />
                        </Form>
                        <Button
                            rounded
                            block
                            style={[styles.button_auth, { marginTop: 10 }]}
                            onPress={onNext}
                        >
                            <Text>{t('Register.ST49')}</Text>
                        </Button>
                    </ScrollView>
                </KeyboardAwareScrollView> 
            </View>
        </Container>
    )

});

const styleSheet = StyleSheet.create({
    schedule: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scheduleRow: {
        flex: 1,
        alignSelf: "stretch",
        flexDirection: "row",
        marginTop: 0,
        marginBottom: 2,
    },
    scheduleTitle: {
        flex: 1,
        alignSelf: "stretch",
        marginTop: 5
    },
    scheduleTitleText: {
        fontSize: 18
    },
    workingHour: {
        flexDirection: "column"
    },
    closeText: {
        marginTop: 5,
        fontSize: 18
    }
})

export default RegisterStep2;