import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text } from 'react-native';
import { goSelectDoctor } from '../../actions/app';
import { getBenefitsByClinicInsurer } from '../../actions/config';
import List from '../../components/list';
import TitleBar from '../../components/titleBar';
import { Option } from '../../models/option';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import ErrorPage from '../error';
import Loading from '../loading';
import PhoneCall from "../../components/phoneCall";
import styles from '../../styles';
import { I18nManager } from 'react-native';

const SelectBenefitPage = observer(() => {
    const stores = useStores();
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();

    const [error, setError] = useState('');
    const [inited, setInited] = useState(false);

    const { currentTab } = stores.appStore;
    const { benefits } = stores.configStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const errMsg = await getBenefitsByClinicInsurer({ stores });
        if (errMsg) {
            return setError(errMsg);
        }
        return setInited(true);
    }    

    const onItemSelect = (item: Option) => {
        goSelectDoctor({
            stores,
            navigation,
            benefit: item.code,
            benefitName: i18n.language=='chi'?item.nameChi:item.nameEn            
        });
    }
    return (
        <Container>
            <TitleBar
                title={t(`${currentTab}.SelectBenefit`)}
                onBack={() => {
                    navigation.goBack();
                }}
            />
            {
                error ?
                    <ErrorPage title={error} onRetry={init} /> :
                    !inited ? <Loading /> :
                    <>
                        <Text style={styleSheet.breadcrumb}>{t(`${currentTab}.Selected`)+': '+stores.dataStore.values.insurerName}</Text>
                        <List
                            data={benefits}
                            icon='ios-arrow-forward'
                            onPress={onItemSelect}
                            formatText={(item) => `${translate(item, i18n)}(${item.code})`}
                        />
                    </>
            }

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    breadcrumb:{
        marginLeft: 20,
        marginTop: 5,
        color: "#777777"
    }
});

export default SelectBenefitPage;
