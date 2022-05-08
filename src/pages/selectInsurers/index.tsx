import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet } from 'react-native';
import { goSelectBenefit } from '../../actions/app';
import { getInsurersByClinic } from '../../actions/config';
import List from '../../components/list';
import TitleBar from '../../components/titleBar';
import { Insurer } from '../../models/insurer';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import ErrorPage from '../error';
import Loading from '../loading';
import PhoneCall from "../../components/phoneCall";


const SelectInsurerPage = observer(() => {
    const stores = useStores();
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();

    const [error, setError] = useState('');
    const [inited, setInited] = useState(false);

    const { currentTab } = stores.appStore;
    const { insurers } = stores.configStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const errMsg = await getInsurersByClinic({ stores, i18n });
        if (errMsg) {
            return setError(errMsg);
        }
        return setInited(true);
    }

    const onItemSelect = (item: Insurer) => {
        let insurerName;
        if (i18n.language=='chi'){
            if (item.code=='6')
                insurerName='中國人壽 傳統團體'
            else if (item.code=='7')
                insurerName='中國人壽 醫加'
            else
                insurerName=item.nameChi.split('(')[0].trim();
        }else{
            if (item.code=='6')
                insurerName='China Life Group Medical'
            else if (item.code=='7')
                insurerName='China Life MediPlus'
            else
                insurerName=item.name
        }
        goSelectBenefit({
            stores,
            navigation,
            insurer: item.code,
            insurerName
        });
    }
    return (
        <Container>
            <TitleBar
                title={t(`${currentTab}.SelectInsurer`)}
                onBack={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }]
                    });
                }}
            />
            {
                error ?
                    <ErrorPage title={error} onRetry={init} /> :
                    !inited ? <Loading /> :
                        <List
                            data={insurers}
                            icon='ios-arrow-forward'
                            onPress={onItemSelect}
                            formatText={(item) =>
                                {
                                    if (item.code=='6')
                                        return '中國人壽 傳統團體 (China Life Group Medical)'
                                    else if (item.code=='7')
                                        return '中國人壽 醫加 (China Life MediPlus)'
                                    return `${item.nameChi.split('(')[0].trim()} (${item.nameEn.split('(')[0].trim()})`
                                }
                            }
                        />
            }

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
});

export default SelectInsurerPage;
