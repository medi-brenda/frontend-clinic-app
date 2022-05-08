import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { goNews, initNewsList } from '../../actions/app';
import TitleBar from '../../components/titleBar';
import { News } from '../../models/news';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import { ListItem } from 'react-native-elements';
import PhoneCall from "../../components/phoneCall";

const NewsListPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { newsList } = stores.appStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        setError('');
        const errorMsg = await initNewsList({ stores, navigation, i18n });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg);
        }
    }

    const onSelectItem = (item: News) => {
        goNews({
            stores,
            navigation,
            news: item
        });
    }

    const goPage = (pageName: string) => {
        navigation.navigate(pageName);
    }

    return (
        <Container>
            <TitleBar
                title={t('Common.Updates')}
                onBack={() => { navigation.goBack(); }}
            />
            {
                loading ? <Loading /> :
                    error ? <ErrorPage title={error} onRetry={init} /> :
                        (
                            <ScrollView>
                                <Container style={styleSheet.background}>
                                    {
                                        newsList.length ? newsList.map((news, index) => (
                                            <TouchableOpacity
                                                key={`update-list-${index}`}
                                                onPress={() => onSelectItem(news)}
                                            >
                                                <View style={styleSheet.row}>
                                                    <Text style={styleSheet.header}>
                                                        {t('News.Update')}
                                                    </Text>
                                                    <ListItem
                                                        title={i18n.language === 'en' ? news.titleEn : news.titleChi}
                                                        chevron
                                                    />
                                                    <Text style={styleSheet.createdAt}>{news.createdAt}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )) : (
                                                <View style={styleSheet.emptyContainer}>
                                                    <Text style={styleSheet.emptyText}>{t('Common.NoData')}</Text>
                                                </View>
                                            )

                                    }
                                </Container>
                            </ScrollView>
                        )
            }

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    background: {
        backgroundColor: '#fafafa'
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
});

export default NewsListPage;
