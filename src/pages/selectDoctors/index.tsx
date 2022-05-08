import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Alert, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { goSelectMethod } from '../../actions/app';
import { getDoctorsByClinicInsurerBenefit } from '../../actions/config';
import List from '../../components/list';
import TitleBar from '../../components/titleBar';
import i18n from '../../i18n';
import { Option } from '../../models/option';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import ErrorPage from '../error';
import Loading from '../loading';
import PhoneCall from "../../components/phoneCall";
import styles from '../../styles';

const SelectDoctorPage = observer(() => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const stores = useStores();

    const [inited, setInited] = useState(false);
    const [error, setError] = useState('');
    const [spinner, setSpinner] = useState(false);

    const { currentTab } = stores.appStore;
    const { doctors } = stores.configStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const errMsg = await getDoctorsByClinicInsurerBenefit({ stores });
        if (errMsg) {
            return setError(errMsg);
        }
        return setInited(true);
    }

    const onItemSelect = async (item: Option) => {
        setSpinner(true);
        const errorMsg = await goSelectMethod({
            stores,
            doctorId: item.code,
            navigation,
            i18n
        });

        if (errorMsg) {
            Alert.alert(
                t('Common.Error'),
                errorMsg,
                [{
                    text: t('Common.Confirm'),
                    onPress: () => {
                        setSpinner(false);
                    }
                }]
            );
        }
        else {
            setSpinner(false);
        }
    }

    return (
        <Container>
            <TitleBar
                title={t(`${currentTab}.SelectDoctor`)}
                onBack={() => {
                    navigation.goBack();
                }}
            />
            <Spinner
                visible={spinner}
                color={"red"}
                size={"large"}
                overlayColor={"rgba(0, 0, 0, 0.25)"}
            />
            {
                error ?
                    <ErrorPage title={error} onRetry={init} /> :
                    !inited ? <Loading /> :
                    <>
                        <Text style={styleSheet.breadcrumb}>{t(`${currentTab}.Selected`)+': '+stores.dataStore.values.insurerName + ' / '+stores.dataStore.values.benefitName }</Text>
                        <List
                            data={doctors}
                            icon='ios-arrow-forward'
                            onPress={onItemSelect}
                            formatText={(item) => translate(item, i18n)}
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

export default SelectDoctorPage;
