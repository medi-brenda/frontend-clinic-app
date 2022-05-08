import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { initAboutUs } from '../../actions/app';
import PhoneCall from '../../components/phoneCall';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import ErrorPage from '../error';
import Loading from '../loading';

const AboutUsPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        const errorMsg = await initAboutUs({ stores, navigation, i18n });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg)
        }
    }

    return (
        <Container>
            <TitleBar
                title={t('Others.ST2')}
                onBack={() => { navigation.goBack(); }}
            />
            <ScrollView>
                {
                    loading ? <Loading /> :
                        error ? <ErrorPage title={error} onRetry={init} /> :
                            <View style={styleSheet.container}>
                                <Image
                                    source={require("../../assets/images/logo_dark.png")}
                                    style={styleSheet.image}
                                />
                                <Text style={styleSheet.title}>{t('Others.ST2')}</Text>
                                <Text style={styleSheet.context}>{translate(stores.appStore.aboutUs, i18n)}</Text>
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
    image: {
        width: 200,
        height: 200,
        marginTop: 10,
        alignSelf: 'center'
    },
    title: {
        paddingLeft: 0,
        paddingBottom: 10,
        marginBottom: 5,
        marginTop: 0,
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
    },
    context: {
        paddingLeft: 15,
        paddingRight: 10,
        color: "rgba(0,0,0,0.4)",
        fontSize: 14,
        textAlign: "left",
    }
});

export default AboutUsPage;