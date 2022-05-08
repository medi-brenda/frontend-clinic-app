import { useNavigation, useNavigationState } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Button, Container, Icon, Text, View } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as WebBrowser from 'expo-web-browser';
import { Divider } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { backPage, register, reviewDoctor } from '../../actions/auth';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import * as _ from 'lodash';
import styles from '../../styles';
import { Regions } from '../../utils/static';
import ScheduleComponent from './schedules';
import Spinner from 'react-native-loading-spinner-overlay';

type DataFieldType = {
    title: string,
    value: string
}

const DataField = ({ title, value }: DataFieldType) => {
    return (
        <View>
            <Text style={styleSheet.dataTitle}>{title}</Text>
            <Text style={styleSheet.dataValue}>{value}</Text>
        </View>
    )
}

const RegisterStep4 = observer(() => {
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();
    const navigationState = useNavigationState(state => state);
    const stores = useStores();
    const { registerData, authState } = stores.authStore;
    const { districts } = stores.configStore;

    const label = i18n.language === 'en' ? 'nameEn' : 'nameChi';
    const district = districts.find(d => d.code === registerData.district);
    const region = Regions.find(r => r.code === registerData.region);

    // agreement
    const [tick1, setTick1] = useState(false);
    const [tick2, setTick2] = useState(false);
    const [tick3, setTick3] = useState(false);

    const onTick1Change = () => {
        setTick1(!tick1);
    }

    const onTick2Change = () => {
        setTick2(!tick2);
    }

    const onTick3Change = () => {
        setTick3(!tick3);
    }

    const checkBox = (
        <Icon
            name='md-checkmark-circle'
            style={styleSheet.checkBox}
        />
    )

    const uncheckBox = (
        <Icon
            name='md-radio-button-off'
            style={styleSheet.uncheckBox}
        />
    )

    const goPage = (index: number) => {
        backPage({
            navigation,
            index
        });
    }

    const onReviewDoctor = (index: number) => {
        reviewDoctor({
            navigation,
            stores,
            index
        });
    }

    const onSubmit = async () => {
        if (!tick1 || !tick2 || !tick3) {
            return Alert.alert(
                t('Common.Error'),
                t('Register.ConsentAlert')
            );
        }

        const errorMessage = await register({ stores, navigation });
        if (errorMessage) {
            Alert.alert(
                t('Common.Error'),
                t(errorMessage)
            );
        }
        else {
            Alert.alert(
                t('Common.Success'),
                t('Register.RegisterSuccess'),
                [
                    {
                        text: t('Common.Confirm'),
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Start' }]
                            })
                        }
                    }
                ]
            )
        }
    }

    return (
        <Container style={styleSheet.container}>
            <Spinner
                visible={authState === 'progress'}
                color={'red'}
                size={'large'}
                overlayColor={'rgba(0, 0, 0, 0.25)'}
            />
            <TitleBar
                title={t('Register.Title')}
                onBack={navigation.goBack}
            />
            <View style={styleSheet.context}>
                <KeyboardAwareScrollView contentContainerStyle={{flex: 1, width: "100%", flexDirection: 'column'}} extraScrollHeight={0} enableOnAndroid={false} > 
                    <ScrollView style={{ flex: 1, paddingHorizontal: 25 }}>
                        <Text style={styles.reg_topic_text}>
                            4/4 {t('Register.StepThreeTopic')}
                        </Text>
                        <Text style={[styles.reg_special_text_color, styleSheet.description]}>
                            {t('Register.Hint')}
                        </Text>
                        <View style={styleSheet.sectionHeader}>
                            <Text style={styleSheet.sectionTitle}>
                                {t('Register.ST50')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => { goPage(1); }}
                            >
                                <Text style={[styles.reg_special_text_color, styleSheet.sectionButton]}>
                                    {t('Register.Edit')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <DataField
                            title={t('Register.ST45')}
                            value={registerData.email}
                        />
                        <DataField
                            title={t('Register.ST44')}
                            value={'*'.repeat(registerData.password.length)}
                        />
                        <DataField
                            title={t('Register.ST46')}
                            value={registerData.name}
                        />
                        <DataField
                            title={t('Register.ST47')}
                            value={registerData.phoneNumber}
                        />
                        <DataField
                            title={t('Register.ST48')}
                            value={registerData.accountNumber}
                        />
                        <Divider style={styleSheet.dividier} />
                        <View style={[styleSheet.sectionHeader, styleSheet.marginTop]}>
                            <Text style={styleSheet.sectionTitle}>
                                {t('Register.StepTwoTopic')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => { goPage(2); }}
                            >
                                <Text style={[styles.reg_special_text_color, styleSheet.sectionButton]}>
                                    {t('Register.Edit')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <DataField
                            title={t('Register.ST56')}
                            value={registerData.clinicNameEn}
                        />
                        <DataField
                            title={t('Register.ST58')}
                            value={registerData.clinicNameChi}
                        />
                        <DataField
                            title={t('Register.ST60')}
                            value={registerData.clinicAddressEn}
                        />
                        <DataField
                            title={t('Register.ST62')}
                            value={registerData.clinicAddressChi}
                        />
                        <DataField
                            title={t('Register.ST63')}
                            value={_.get(district, label, '')}
                        />
                        <DataField
                            title={t('Register.ST64')}
                            value={_.get(region, label, '')}
                        />
                        <DataField
                            title={t('Register.ST67')}
                            value={registerData.clinicPhone}
                        />
                        <DataField
                            title={t('Register.ST68')}
                            value={registerData.clinicPhone2 || '-'}
                        />
                        <DataField
                            title={t('Register.ST69')}
                            value={registerData.clinicFax || '-'}
                        />
                        <Divider style={styleSheet.dividier} />
                        <Text style={styleSheet.dataTitle}>{t('Register.ST78')}</Text>
                        <ScheduleComponent values={registerData.schedules} readonly={true} />
                        <Divider style={styleSheet.dividier} />

                        <View style={[styleSheet.sectionHeader, styleSheet.marginTop]}>
                            <Text style={styleSheet.sectionTitle}>
                                {t('Register.StepThreeTopic')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => { goPage(3); }}
                            >
                                <Text style={[styles.reg_special_text_color, styleSheet.sectionButton]}>
                                    {t('Register.Edit')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {
                            registerData.doctors.map((doctor: any, index: number) => (
                                <TouchableOpacity key={`doctor-${index}`} onPress={() => onReviewDoctor(index)}>
                                    <View style={styleSheet.doctor}>
                                        <Text>
                                            {`${doctor.nameEn}/${doctor.nameChi}`}
                                        </Text>
                                        <Text>{'>'}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                        <Divider style={styleSheet.dividier} />
                        <View style={styleSheet.agreementContainer}>
                            {/* <TouchableOpacity onPress={onTick1Change}> */}
                                <View style={styleSheet.agreementRow}>
                                    <TouchableOpacity onPress={onTick1Change}>
                                        {tick1 ? checkBox : uncheckBox}
                                    </TouchableOpacity>
                                    <View style={styleSheet.agreementDescription}>
                                        <TouchableOpacity onPress={onTick1Change}>
                                            <Text style={{ paddingLeft: 10 }}>
                                                {`${t('Register.tick1_Text00')} `}
                                            </Text>
                                        </TouchableOpacity>
                                        <Text
                                            style={{ color: 'blue' }}
                                            onPress={() => {
                                                WebBrowser.openBrowserAsync(
                                                    'https://web2.prod.mediconcen.com/m-term_and_agreement.php'
                                                );
                                            }}
                                        >
                                            {t('Register.tick1_Text01')}
                                        </Text>
                                    </View>
                                </View>
                            {/* </TouchableOpacity> */}
                        </View>
                        <View style={styleSheet.agreementContainer}>
                            {/* <TouchableOpacity onPress={onTick2Change}> */}
                                <View style={styleSheet.agreementRow}>
                                    <TouchableOpacity onPress={onTick2Change}>
                                        {tick2 ? checkBox : uncheckBox}
                                    </TouchableOpacity>
                                    <View style={styleSheet.agreementDescription}>
                                        <TouchableOpacity onPress={onTick2Change}>
                                            <Text style={{ paddingLeft: 10 }}>
                                                {`${t('Register.tick2_Text00')} `}
                                            </Text>
                                        </TouchableOpacity>
                                        <Text
                                            style={{ color: 'blue' }}
                                            onPress={() => {
                                                WebBrowser.openBrowserAsync(
                                                    'https://web2.prod.mediconcen.com/m-service_agreement.php'
                                                );
                                            }}
                                        >
                                            {t('Register.tick2_Text01')}
                                        </Text>
                                    </View>
                                </View>
                            {/* </TouchableOpacity> */}
                        </View>
                        <View style={styleSheet.agreementContainer}>
                            {/* <TouchableOpacity onPress={onTick3Change}> */}
                                <View style={styleSheet.agreementRow}>
                                    <TouchableOpacity onPress={onTick3Change}>
                                        {tick3 ? checkBox : uncheckBox}
                                    </TouchableOpacity>
                                    <View style={styleSheet.agreementDescription}>
                                        <TouchableOpacity onPress={onTick3Change}>
                                            <Text style={{ paddingLeft: 10 }}>
                                                {`${t('Register.tick3_Text00')} `}
                                            </Text>
                                        </TouchableOpacity>
                                        <Text
                                            style={{ color: 'blue' }}
                                            onPress={() => {
                                                WebBrowser.openBrowserAsync(
                                                    'https://web2.prod.mediconcen.com/m-pics.php'
                                                );
                                            }}
                                        >
                                            {t('Register.tick3_Text01')}
                                        </Text>
                                        <TouchableOpacity onPress={onTick3Change}>
                                            <Text>{t('Register.tick3_Text02')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            {/* </TouchableOpacity> */}
                        </View>
                        <View style={styleSheet.submitButton}>
                            <Button
                                rounded
                                block
                                style={styles.button_auth}
                                onPress={onSubmit}
                            >
                                <Text style={styleSheet.submitText}>{t('Auth.ST1')}</Text>
                            </Button>
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView> 
            </View>
        </Container>
    )
});

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
    description: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: -10,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sectionTitle: {
        fontSize: 23,
        fontWeight: 'bold'
    },
    sectionButton: {
        fontSize: 23
    },
    dataTitle: {
        fontSize: 20,
        marginTop: 15
    },
    dataValue: {
        fontWeight: 'bold',
        marginTop: 15
    },
    dividier: {
        backgroundColor: 'black',
        marginTop: 15
    },
    marginTop: {
        marginTop: 25
    },
    doctor: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 15,
    },
    agreementContainer: {
        marginTop: 15
    },
    agreementRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkBox: {
        color: '#ff8566'
    },
    uncheckBox: {
        color: 'grey'
    },
    agreementDescription: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        paddingLeft: 8
    },
    submitButton: {
        marginVertical: 15
    },
    submitText: {
        fontSize: 22
    }
})

export default RegisterStep4;