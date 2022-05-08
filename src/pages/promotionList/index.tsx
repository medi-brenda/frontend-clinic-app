import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { goPromotion, initPromotionList } from '../../actions/app';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import { ListItem } from 'react-native-elements';
import { Promotion } from '../../models/promotion';
import PhoneCall from "../../components/phoneCall";

const PromotionListPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { promotionList } = stores.appStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        setError('');
        const errorMsg = await initPromotionList({ stores, navigation, i18n });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg);
        }
    }

    const onSelectItem = (item: Promotion) => {
        goPromotion({
            stores,
            navigation,
            promotion: item
        });
    }

    return (
        <Container>
            <TitleBar
                title={t('Common.Cooperators')}
                onBack={() => { navigation.goBack(); }}
            />
            {
                loading ? <Loading /> :
                    error ? <ErrorPage title={error} onRetry={init} /> :
                        (
                            <ScrollView>
                                <Container style={styleSheet.background}>
                                    {
                                        promotionList.length ? promotionList.map((promotion, index) => (
                                            <TouchableOpacity
                                                key={`promotion-list-${index}`}
                                                onPress={() => onSelectItem(promotion)}
                                            >
                                                <View style={styleSheet.row}>
                                                    <Text style={styleSheet.header}>
                                                        {promotion.lastUpdate}
                                                    </Text>
                                                    <ListItem
                                                        title={i18n.language === 'en' ? promotion.titleEn : promotion.titleChi}
                                                        bottomDivider
                                                        chevron
                                                    />
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
    }
});

export default PromotionListPage;
