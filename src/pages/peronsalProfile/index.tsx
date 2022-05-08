import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { initPersonalProfile } from '../../actions/app';
import ReadOnlyField from '../../components/readOnlyField/infex';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import styles from '../../styles';
import ErrorPage from '../error';
import Loading from '../loading';
import PhoneCall from "../../components/phoneCall";

const PersonalProfilePage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { personalProfile } = stores.dataStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        const errorMsg = await initPersonalProfile({ stores, navigation, i18n });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg);
        }
    }

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
                                    title={t('Profile.ST3')}
                                    value={personalProfile.email}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST4')}
                                    value={'******'}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST5')}
                                    value={'******'}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST6')}
                                    value={personalProfile.cantactPerson}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST7')}
                                    value={personalProfile.phone}
                                />
                                <ReadOnlyField
                                    title={t('Profile.ST8')}
                                    value={`${personalProfile.bankCode}-${personalProfile.bankAccount}`}
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

export default PersonalProfilePage;
