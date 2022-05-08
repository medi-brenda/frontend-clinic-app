import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Container, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Platform, TextInput, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import { initCooperators } from '../../actions/app';
import ReadMoreView from '../../components/readMoreView';
import InsurerModal from './modal';
import PhoneCall from "../../components/phoneCall";

export type Cooperators = {
    descriptionChi: string,
    descriptionEn: string,
    insurerId: string,
    logo: string,
    physicalCardImage: string,
    physicalCard: string,
    supportMedicalCard: string,
    supportQrcode: string,
    userGuide: string
}

const CooperatorsPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentInsurers, setCurrentInsurers] = useState(stores.appStore.cooperators);
    const [currentNewProducts, setCurrentNewProducts] = useState(stores.appStore.newProducts);
    const [textInput, setTextInput] = useState('');
    const [option, setOption] = useState<Cooperators>();

    const [error, setError] = useState('');

    useEffect(() => {
        init();
    }, []);

    const initData = () => {
        const { cooperators, newProducts } = stores.appStore;
        setCurrentInsurers(cooperators);
        setCurrentNewProducts(newProducts);
    }

    const init = async () => {
        setLoading(true);
        const errorMsg = await initCooperators({ stores, navigation, i18n, platform: Platform.OS });
        if (errorMsg) {
            setError(errorMsg);
        }
        initData();
        setLoading(false);
    }

    const showModal = (option: Cooperators) => {
        setOption(option);
        setModalVisible(true)
    }

    const onSubmitSearch = () => {
        const { cooperators, newProducts } = stores.appStore;

        let foundInsurer = cooperators.filter((cooperator) => (
            (cooperator.descriptionEn.toLowerCase().includes(textInput.toLowerCase()) || cooperator.descriptionChi.includes(textInput))
        ));

        let foundNewProducts = newProducts.filter((newProduct) => (
            (newProduct.nameEn.toLowerCase().includes(textInput.toLowerCase()) || newProduct.nameChi.includes(textInput))
        ));

        if (!textInput) {
            foundInsurer = cooperators;
            foundNewProducts = newProducts;
        }

        setCurrentInsurers(foundInsurer);
        setCurrentNewProducts(foundNewProducts);
    }

    const callModal=(insurerId: string)=> {
        const { cooperators } = stores.appStore;
        let foundInsurer = cooperators.filter((cooperator) => (
            (cooperator.insurerId === insurerId)
        ));
        showModal(foundInsurer[0]);
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{flex: 1, width: "100%", flexDirection: 'column'}} extraScrollHeight={0} enableOnAndroid={false} > 
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
                                    <View style={styleSheet.mainContentContainer}>
                                        <View style={styleSheet.view}>
                                            <Image
                                                source={require('../../assets/images/UI/searchSmall.png')}
                                                resizeMode={"contain"}
                                                style={styleSheet.icon}
                                            />
                                            <TextInput
                                                onKeyPress={onSubmitSearch}
                                                onChange={onSubmitSearch}
                                                onSelectionChange={onSubmitSearch}
                                                placeholder={t('Cooperators.search')}
                                                clearButtonMode="always"
                                                onChangeText={(text) => setTextInput(text)}
                                                style={styleSheet.textInput}
                                                value={textInput}
                                            />
                                        </View>

                                        {
                                            currentNewProducts.length ?
                                                <View style={styleSheet.newProductContainer}>
                                                    <View style={styleSheet.newProductCardTitle}>
                                                        <Text style={styleSheet.cardTitleWhiteText}>{t('Cooperators.newProducts')}</Text>
                                                        <Text style={styleSheet.cardTitleWhiteText}></Text>
                                                    </View>
                                                    <View style={styleSheet.cardImageContainer}>
                                                        <View style={styleSheet.insideCardTextContainer}>
                                                            <View style={styleSheet.insideCardTextTempContainer}></View>
                                                            <View style={styleSheet.insideCardTextMiddleContainer}>
                                                                <ReadMoreView
                                                                    show={currentNewProducts.length < 4}
                                                                    children={
                                                                        <View>
                                                                            {
                                                                                currentNewProducts.map((option, index) => (
                                                                                    <TouchableOpacity key={index} onPress={()=>callModal(option.insurerId)}>
                                                                                        <Text key={index} style={styleSheet.newProductText}>{i18n.language === 'chi' ? option.nameChi+" "+option.launchDate : option.nameEn+" "+option.launchDate}</Text>
                                                                                    </TouchableOpacity>
                                                                                ))
                                                                            }
                                                                        </View>
                                                                    }
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                :
                                                undefined
                                        }


                                        {
                                            currentInsurers.map((option, index) => (
                                                <TouchableOpacity key={index} style={styleSheet.cardContainer} onPress={() => showModal(option)}>
                                                    <View style={styleSheet.cardTitle}>
                                                        <Text style={styleSheet.cardTitleWhiteText}>{option.descriptionChi} {option.descriptionEn}</Text>
                                                    </View>
                                                    <View style={styleSheet.cardImageContainer}>
                                                        <View style={styleSheet.insideCardImageContainer}>
                                                            <Image
                                                                style={styleSheet.cardImage}
                                                                source={{
                                                                    uri: option.logo,
                                                                }}
                                                            />
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ))
                                        }

                                    </View>

                                    <View style={styleSheet.whiteSpace}></View>

                                    <InsurerModal
                                        show={modalVisible}
                                        insurer={option}
                                        onDismiss={() => { setModalVisible(false); }}
                                    />
                                </ScrollView>
                            )
                }

                <PhoneCall/>
            </Container>
        </KeyboardAwareScrollView>
    )
});

const styleSheet = StyleSheet.create({
    background: {
        backgroundColor: '#fafafa',
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
    },
    downloadButton: {
        backgroundColor: "#0275d8",
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 10,
    },
    insurerGuideContainer: {
        flexDirection: 'row',
    },
    insurerGuideTitleContainer: {
        justifyContent: 'center'
    },
    downloadButtonContainer: {
        justifyContent: 'center'
    },
    downloadButtonText: {
        color: "#ffffff",
    },
    mainContentContainer: {
        margin: 10,
        flex: 1,
        flexGrow: 0,
    },
    cardContainer: {
        marginVertical: 10,
        height: 150,
        flex: 1,
        borderWidth: 1,
        borderColor: "#ff8566",
        // backgroundColor: 'red'
    },
    cardTitle: {
        backgroundColor: '#ff8566',
        flexDirection: 'row',
        width: '100%',
    },
    cardImageContainer: {

    },
    cardTitleWhiteText: {
        color: "#ffffff",
        marginHorizontal: 10,
        marginVertical: 10,
        fontSize: 12,
    },
    cardImage: {
        width: "80%",
        height: 70,
        resizeMode: 'contain',
        marginHorizontal: 30,
        marginVertical: 15,
    },
    insideCardImageContainer: {
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'center'
    },
    insideCardTextContainer: {

    },
    insideCardTextTempContainer: {
        height: 10,
    },
    insideCardTextMiddleContainer: {
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
    },
    backButton: {
        backgroundColor: '#ff8566',
        width: '25%',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 30,
        alignSelf: 'center'
    },
    backButtonText: {
        textAlign: 'center',
        color: '#ffffff'
    },
    backButtonContainer: {
        marginTop: 30,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center'
    },
    newProductContainer: {
        marginTop: 30,
        flex: 1,
        borderWidth: 1,
        borderColor: "#ff8566",
        marginBottom: 10,
    },
    newProductCardTitle: {
        backgroundColor: '#ff8566',
        flexDirection: 'row',
        width: '100%',
        zIndex: 1,
    },
    readMoreText: {
        color: '#999999',
        fontSize: 12,
    },
    view: {
        height: 40,
        marginBottom: 10,
        backgroundColor: "white",
        borderColor: '#ff8566',
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 10,
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
    },
    input: {
        flex: 1,
        width: "100%"
    },
    text: {
        fontSize: 20
    },
    icon: {
        left: 15,
        height: "100%",
        position: "absolute"
    },
    textInput: {
        width: '100%'
    },
    whiteSpace: {
        height: 30,
    },
    newProductText: {
        fontSize: 12,
        paddingVertical: 5,
    }
});

export default CooperatorsPage;
