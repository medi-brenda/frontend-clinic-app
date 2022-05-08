import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { initNewsDetail } from '../../actions/app';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import WebView from 'react-native-webview';
import PhoneCall from "../../components/phoneCall";

const NewsDetailPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { news } = stores.appStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        setError('');
        const errorMsg = await initNewsDetail({ stores, navigation, i18n });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg);
        }
    }

    const onShouldStartLoadWithRequest = ({ url }: any) => {
        const isLocal = url === 'about:blank';
        if (!isLocal) {
            Linking.openURL(url);
        }
        return isLocal;
    };

    const isEng = i18n.language === 'en';

    return (
        <Container style={{flex: 1}}>
            <TitleBar
                title={t('Common.Updates')}
                onBack={() => { navigation.goBack(); }}
            />
            {
                loading ? <Loading /> :
                    error ? <ErrorPage title={error} onRetry={init} /> :
                        <View style={styleSheet.screen}>
                            <Text style={styleSheet.title}>{isEng ? news.titleEn : news.titleChi}</Text>
                            <WebView
                                containerStyle={styleSheet.webViewContainer}
                                source={{ html: isEng ? news.descriptionEn : news.descriptionChi }}
                                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                            />
                        </View>
            }

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    screen: {
        flex: 1
    },
    background: {
        backgroundColor: '#fafafa',
        flex: 1
    },
    row: {
        marginBottom: 15,
        backgroundColor: 'white'
    },
    header: {
        paddingLeft: 16,
        paddingTop: 4,
        color: '#e2a045',
    },
    createdAt: {
        paddingLeft: 16
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        fontSize: 20
    },
    title: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textAlign: 'center',
        fontSize: 18,
        paddingTop: 10,
        paddingBottom: 20,
    },
    webViewContainer: {
        margin: 10,
    },
});

export default NewsDetailPage;
