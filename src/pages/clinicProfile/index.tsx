import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { initClinicProfile } from '../../actions/app';
import ReadOnlyField from '../../components/readOnlyField/infex';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import PhoneCall from "../../components/phoneCall";

const ClinicProfilePage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { clinic } = stores.dataStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        const errorMsg = await initClinicProfile({ stores, navigation, i18n });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg)
        }
    }

    const isEng = i18n.language === 'en';

    return (
        <Container>
            <TitleBar
                title={t('Profile.ST0')}
                onBack={() => { navigation.goBack(); }}
            />
            <ScrollView>
                {
                    loading ? <Loading /> :
                        error ? <ErrorPage title={error} onRetry={init} /> :
                            <View style={styleSheet.container}>
                                <ReadOnlyField
                                    title={t('Profile.ST11')}
                                    value={clinic.clinicNameEn}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST12')}
                                    value={clinic.clinicNameChi}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST13')}
                                    value={clinic.addressEn}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST14')}
                                    value={clinic.addressChi}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST15')}
                                    value={isEng ? clinic.districtNameEn : clinic.districtNameChi}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST16')}
                                    value={isEng ? clinic.regionNameEn : clinic.regionNameChi}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST17')}
                                    value={clinic.phone}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST18')}
                                    value={clinic.phone2}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST19')}
                                    value={clinic.fax}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST20')}
                                    value={clinic.schedules}
                                    type='schedule'
                                />
                            </View>
                }

            </ScrollView>

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20
    },
    divider: {
        backgroundColor: "grey"
    }
});

export default ClinicProfilePage;
