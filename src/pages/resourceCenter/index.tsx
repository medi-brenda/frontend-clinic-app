import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Text, View } from 'native-base';
import { StyleSheet, Platform, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import { initResourceCenter } from '../../actions/app';
import PhoneCall from "../../components/phoneCall";

type Resources = {
    documentId: string,
    titleEn: string,
    titleChi: string,
    contentEn: string,
    contentChi: string,
    format: string,
    linkEn: string,
    linkChi: string,
    iconLink: string
}

const ResourceCenterPage = ()=> {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resources, setResources] = useState(stores.appStore.newResources);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        const errorMsg = await initResourceCenter({ stores, navigation, i18n, platform: Platform.OS });
        if (errorMsg) {
            setError(errorMsg);
        }
        const newResources = stores.appStore.newResources;
        setResources(newResources);
        setLoading(false);
    }

    const goResourceDetailPage = (object: Resources)=> {
        navigation.navigate("ResourceCenterDetail", { resourceItemObject: object });
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1, width: "100%", flexDirection: 'column'}} extraScrollHeight={0} enableOnAndroid={false} > 
            <Container>
                <TitleBar
                    title={t('ResourceCenter.resourceCenter')}
                    onBack={() => { navigation.goBack(); }}
                />
                {
                    loading ? <Loading /> :
                        error ? <ErrorPage title={error} onRetry={init} /> :
                            (
                                <ScrollView>
                                    {
                                        resources.map((option, index)=>(
                                            <TouchableOpacity key={index} style={styleSheet.resourceItemContainer} onPress={()=>{goResourceDetailPage(option)}}>
                                                <Image style={styleSheet.resourceItemImage} source={{uri: option.iconLink}}/>
                                                <View  style={styleSheet.resourceItemTitleContainer}>
                                                    <Text style={styleSheet.resourceItemTitle} >{i18n.language === 'chi'?option.titleChi:option.titleEn}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>
                            )
                }

                <PhoneCall/>
            </Container>
        </KeyboardAwareScrollView> 
    );
};

const styleSheet = StyleSheet.create({
    resourceItemContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dcdcdc',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    resourceItemImage: {
        height: 120,
        resizeMode: 'contain',
        marginVertical: 10,
        flex: 1,
        marginHorizontal: 10
    },
    resourceItemTitleContainer: {
        flex: 3,
    },
    resourceItemTitle: {
        paddingRight: 10
    }
})

export default ResourceCenterPage;
