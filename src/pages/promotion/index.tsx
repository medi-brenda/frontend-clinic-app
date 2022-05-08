import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Body, Card, CardItem, Container, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import PhoneCall from "../../components/phoneCall";
const window = Dimensions.get('window');

const PromotionPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const { promotion } = stores.appStore;
    const isEng = i18n.language === 'en';

    return (
        <Container>
            <TitleBar
                title={t('Promotion.Detail')}
                onBack={() => { navigation.goBack(); }}
            />
            <ScrollView>
                <Card transparent>
                    <CardItem header bordered>
                        <Text style={styleSheet.title}>
                            {isEng ? promotion.titleEn : promotion.titleChi}
                        </Text>
                    </CardItem>
                    <CardItem>
                        <Body>
                            {
                                promotion.contentImg ? (
                                    <Image
                                        resizeMode={'center'}
                                        source={{ uri: promotion.contentImg }}
                                        style={styleSheet.image}
                                    />
                                ) : undefined
                            }
                            <Text>{isEng ? promotion.contentEn : promotion.contentChi}</Text>
                        </Body>
                    </CardItem>
                    <CardItem footer bordered>
                        <Text style={styleSheet.footer}>
                            {promotion.lastUpdate}
                        </Text>
                    </CardItem>
                </Card>
            </ScrollView>

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    image: {
        flex: 1,
        alignSelf: 'stretch',
        width: window.width / 1.5,
        height: window.height / 3,
    },
    footer: {
        fontWeight: 'bold',
        fontSize: 14
    }
});

export default PromotionPage;
