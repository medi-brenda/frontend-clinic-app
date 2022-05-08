import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { goDoctorProfile, initDoctorProfile } from '../../actions/app';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import { ListItem } from 'react-native-elements';
import { translate } from '../../utils/string';
import { DoctorProfile } from '../../models/doctor';
import PhoneCall from "../../components/phoneCall";

const DoctorProfileListPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { doctorProfileList } = stores.dataStore;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        const errorMsg = await initDoctorProfile({ stores, navigation, i18n });
        setLoading(false);
        if (errorMsg) {
            setError(errorMsg)
        }
    }

    const onListItemPress = (doctorProfile: DoctorProfile) => {
        goDoctorProfile({ stores, navigation, doctorProfile });
    }

    const isEng = i18n.language === 'en';

    return (
        <Container>
            <TitleBar
                title={t('DoctorProfile.Title')}
                onBack={() => { navigation.goBack(); }}
            />
            <ScrollView>
                {
                    loading ? <Loading /> :
                        error ? <ErrorPage title={error} onRetry={init} /> :
                            <View style={styleSheet.container}>
                                <FlatList
                                    data={doctorProfileList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        const isActive = item.status === '1';
                                        const inActiveColor = "#929292";
                                        const textStyle = isActive ? null : { color: inActiveColor };
                                        const leftIcon: any = { name: "people" };
                                        if (!isActive) {
                                            leftIcon.color = inActiveColor;
                                        }

                                        return (
                                            <ListItem
                                                titleStyle={textStyle}
                                                subtitleStyle={textStyle}
                                                leftIcon={leftIcon}
                                                title={`${translate(item, i18n)} (${isActive ? t('DoctorProfile.Active') : t('DoctorProfile.Inactive')})`}
                                                subtitle={`(${item.speciality?.map(sp => translate(sp, i18n))})`}
                                                bottomDivider
                                                chevron={true}
                                                onPress={() => {
                                                    onListItemPress(item);
                                                }}
                                            />
                                        )
                                    }}
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

export default DoctorProfileListPage;
