import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, View } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { goPhysicalCard, goQrScanner } from '../../actions/app';
import MethodButton from '../../components/methodButton';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import PhoneCall from "../../components/phoneCall";
import { toJS } from 'mobx'
import { findInsurer } from '../../utils/common';


const SelectMethodPage = observer(() => {
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();
    const stores = useStores();

    const { currentTab } = stores.appStore;

    const { values } = stores.dataStore;
    const { insurers } = stores.configStore;
    const insurer = toJS(findInsurer(insurers, values.insurerId));


    const onQrPress = () => {
        goQrScanner({ stores, navigation });
    }

    const onPhysicalCardPress = () => {
        goPhysicalCard({ stores, navigation });
    }

    return (
        <Container>
            <TitleBar
                title={t(`${currentTab}.SelectVerifyMethod`)}
                onBack={() => {
                    navigation.goBack();
                }}
            />
            <View style={styleSheet.container}>
                <Text style={styleSheet.header}>{t(`Common.${currentTab}`)}</Text>
                <MethodButton
                    title={t('Common.QrCode')}
                    image="qrimg"
                    onPress={onQrPress}
                />
                {insurer?.physicalCard && <MethodButton
                    title={t('Common.PhysicalCard')}
                    image="physicalimg"
                    onPress={onPhysicalCardPress}
                    textStyle={i18n.language === 'en' ? { fontSize: 18 } : null}
                />}
            </View>

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: 24
    },
    header: {
        fontSize: 40
    }
});

export default SelectMethodPage;
