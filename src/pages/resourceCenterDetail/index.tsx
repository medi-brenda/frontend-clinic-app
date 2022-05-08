import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef  } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Text, View } from 'native-base';
import { StyleSheet, Platform, Linking, Button } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import ErrorPage from '../error';
import Loading from '../loading';
import styles from '../../styles';
import PhoneCall from "../../components/phoneCall";
import WebView from 'react-native-webview';

const ResourceCenterDetail = (props: any)=> {
    const { i18n, t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [error, setError] = useState('');
    const video = useRef<any>(null);
    const [status, setStatus] = useState({isPlaying: false});
    const resourceItemObject = props.route.params.resourceItemObject;

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setLoading(true);
        setLoading(false);
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
                                <ScrollView style={styleSheet.screen}>
                                    <Text style={styleSheet.titleText}>{i18n.language === "chi"?resourceItemObject.titleChi:resourceItemObject.titleEn}</Text>
                                    <Text style={styleSheet.contentText}>{i18n.language === "chi"?resourceItemObject.contentChi:resourceItemObject.contentEn}</Text>
                                    {
                                        resourceItemObject.format === "PDF" ?
                                        <View style={styleSheet.downloadButtonContainer}>
                                            <TouchableOpacity style={styleSheet.downloadButton} onPress={() => { Linking.openURL(i18n.language === "chi"?resourceItemObject.linkChi:resourceItemObject.linkEn) }}>
                                                <Text style={styleSheet.downloadButtonText}>{t('ResourceCenter.downloadPdf')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <View style={styleSheet.videoContainer}>
                                            <WebView
                                                style={styleSheet.video}
                                                javaScriptEnabled={true}
                                                source={{uri: i18n.language === "chi"?resourceItemObject.linkChi:resourceItemObject.linkEn}}
                                            />
                                      </View>

                                    }
                                </ScrollView>
                            )
                }

                <PhoneCall/>
            </Container>
        </KeyboardAwareScrollView>
    );
}

const styleSheet = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 20,
    },
    downloadButtonContainer: {
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center'
    },
    downloadButton: {
        borderWidth: 1,
        backgroundColor:'#007bff',
        borderRadius: 10,
        borderColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 15,
        width: '50%'
    },
    downloadButtonText: {
        color: "#ffffff",
        textAlign: 'center'
    },
    titleText: {
        fontSize: 20,
        marginTop: 10,
        fontWeight: 'bold',
    },
    contentText: {
        marginTop: 10,
        marginBottom: 20,
    },
    video: {
        width: 300,
        height: 200,
    },
    videoContainer: {
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center'
    }
})

export default ResourceCenterDetail;
