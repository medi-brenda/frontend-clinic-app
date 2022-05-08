import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import ReadOnlyField from '../../components/readOnlyField/infex';
import { initDoctorProfileDetail } from '../../actions/app';
import Loading from '../loading';
import ErrorPage from '../error';
import BenefitItem from './BenefitItem';
import * as _ from 'lodash';
import PhoneCall from "../../components/phoneCall";

const DoctorProfilePage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const { doctorProfile } = stores.dataStore;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { doctorProfileList } = stores.dataStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        const errorMsg = await initDoctorProfileDetail({ stores, navigation, i18n });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg)
        }
    }
    const isEng = i18n.language === 'en';
    const existBenefitCodes = _.uniq(_.map(doctorProfile.benefits, 'benefitCode'));

    return (
        <Container>
            <TitleBar
                title={t('DoctorProfile.Title')}
                onBack={() => { navigation.goBack(); }}
            />
            {
                loading ? <Loading /> :
                    error ? <ErrorPage title={error} onRetry={init} /> :
                        <ScrollView>
                            <View style={styleSheet.container}>
                                <ReadOnlyField
                                    title={t('DoctorProfile.Name_en')}
                                    value={doctorProfile.nameEn}
                                />
                                <ReadOnlyField
                                    title={t('DoctorProfile.Name_cn')}
                                    value={doctorProfile.nameChi}
                                />
                                <ReadOnlyField
                                    title={t('DoctorProfile.Gender')}
                                    value={doctorProfile.gender === 'F' ? t('DoctorProfile.Female') : t('DoctorProfile.Male')}
                                />
                                <ReadOnlyField
                                    title={t('DoctorProfile.Speciality')}
                                    value={doctorProfile.speciality?.map((item) => translate(item, i18n))}
                                    type={'stringArray'}
                                />
                                <ReadOnlyField
                                    title={t('DoctorProfile.Authority')}
                                    value={isEng ? doctorProfile.authorityEn : doctorProfile.authorityChi}
                                />
                                <ReadOnlyField
                                    title={t('DoctorProfile.Service_hour')}
                                    value={doctorProfile.schedules}
                                    type={'schedule'}
                                />
                                <View style={styleSheet.paddingTop}>
                                    {
                                        existBenefitCodes.map((benefitCode, index) => (
                                            <BenefitItem
                                                key={`benefit-${index}`}
                                                benefitCode={benefitCode}
                                                benefits={_.filter(doctorProfile.benefits, benefit => benefit.benefitCode === benefitCode)}
                                            />
                                        ))
                                    }
                                </View>
                            </View>
                        </ScrollView>
            }

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20
    },
    data: {
        color: "black",
        fontWeight: "normal",
    },
    divider: {
        backgroundColor: "grey"
    },
    serviceHour: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    shTitle: {
        fontSize: 18
    },
    paddingTop: {
        paddingTop: 16
    }
});

export default DoctorProfilePage;
