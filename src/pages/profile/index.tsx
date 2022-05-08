import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import { ListItem } from "react-native-elements";
import OPModal from '../../components/opModal';
import PhoneCall from "../../components/phoneCall";

const ProfilePage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [showOpModal, setShowOpModal] = useState(false);

    const openOpModal = () => {
        setShowOpModal(true);
    }

    const onOpModalDismiss = (password: string) => {
        setShowOpModal(false);
        if (password) {
            navigation.navigate('DoctorProfileList');
        }
    }


    return (
        <Container>
            <TitleBar
                title={t('Common.UserDetail')}
                onBack={() => { navigation.goBack(); }}
            />
            <ScrollView>
                <ListItem
                    title={t('Profile.ST0')}
                    leftIcon={{ name: 'perm-identity' }}
                    onPress={() => {
                        navigation.navigate('PersonalProfile')
                    }}
                    bottomDivider
                    chevron
                    containerStyle={styleSheet.listItem}
                />
                <ListItem
                    title={t('Profile.ST1')}
                    leftIcon={{ name: 'business' }}
                    onPress={() => {
                        navigation.navigate('ClinicProfile')
                    }}
                    bottomDivider
                    chevron
                    containerStyle={styleSheet.listItem}
                />
                <ListItem
                    title={t('Profile.ST2')}
                    leftIcon={{ name: 'recent-actors' }}
                    onPress={openOpModal}
                    bottomDivider
                    chevron
                    containerStyle={styleSheet.listItem}
                />
            </ScrollView>
            <OPModal
                show={showOpModal}
                onDismiss={onOpModalDismiss}
            />

            <PhoneCall/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    listItem: {
        paddingVertical: 20
    }
});

export default ProfilePage;
