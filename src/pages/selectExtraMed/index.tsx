import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Button, Container, Icon, Input, Text, View } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Dimensions, Platform, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FlatList, ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import MCCButton from '../../components/mccButton';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import * as _ from 'lodash';
import { goDetailPage } from '../../actions/app';
import PhoneCall from '../../components/phoneCall/index';

const { height, width } = Dimensions.get('window');

const SelectExtraMedPage = observer(() => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();
    const { method, values } = stores.dataStore;
    const [extraMed, setExtraMed] = useState(_.cloneDeep(values.extraMed));
    const [refresh, setRefresh] = useState(false);

    const onNext = () => {
        const errorMsg = goDetailPage({
            stores,
            navigation,
            extraMed
        });

        if (errorMsg) {
            Alert.alert(
                t('Common.Error'),
                t(errorMsg)
            );
        }
    }

    const onAddExtraMed = () => {
        extraMed.push({
            code: '',
            price: ''
        });

        setExtraMed(extraMed);
        setRefresh(!refresh);
    }

    const onExtraMedCodeChange = (index: number, text: string) => {
        extraMed[index].code = text;
        setExtraMed(extraMed);
        setRefresh(!refresh);
    }

    const onExtraMedPriceChange = (index: number, text: string) => {
        extraMed[index].price = text;
        setExtraMed(extraMed);
        setRefresh(!refresh);
    }

    const onRemoveExtraMed = (index: number) => {
        extraMed.splice(index, 1);
        setExtraMed(extraMed);
        setRefresh(!refresh);
    }

    return (
        <Container>
            <TitleBar
                title={t(`ExtraMed.Title`)}
                onBack={() => {
                    navigation.goBack();
                }}
            />
                <KeyboardAwareScrollView contentContainerStyle={{flex: 1, width: "100%", flexDirection: 'column'}} extraScrollHeight={0} enableOnAndroid={false} > 
                <ScrollView
                    contentContainerStyle={styleSheet.scrollView}
                    keyboardShouldPersistTaps="never"
                >
                    <View style={styleSheet.header}>
                        <View style={styleSheet.headerTitle}>
                            <Text style={styleSheet.headerTitleText}>
                                {t('Modify.ConfirmDetails')}
                            </Text>
                        </View>
                    </View>

                    {
                        // MCC465 - have no payment code for physical card
                        method !== 'PhysicalCard' ? (
                            <View style={styleSheet.header}>
                                <View style={styleSheet.headerTitle}>
                                    <Text style={styleSheet.blackText}>
                                        {`${t('ExtraMed.QRCode')} `}
                                    </Text>
                                    <Text style={styleSheet.greyText}>
                                        {values.token}
                                    </Text>
                                </View>
                            </View>
                        ) : null
                    }

                    <View style={styleSheet.context}>
                        <View>
                            <Text style={styleSheet.blackText}>
                                {t('Common.Diagnosis')}
                            </Text>
                        </View>
                        <View>
                            <FlatList
                                data={values.diagnosis}
                                scrollEnabled={false}
                                keyExtractor={(item, index) => `selected-diagnosis-${index}`}
                                renderItem={({ item }) => (
                                    <View style={styleSheet.flatListRow} >
                                        <Text
                                            numberOfLines={2}
                                            style={styleSheet.greyText}
                                        >
                                            {`${item.code} - ${translate(item, i18n)}`}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                    </View>

                    <View style={styleSheet.context}>
                        <View>
                            <Text style={styleSheet.blackText}>
                                {t('ExtraMed.ServiceType')}
                            </Text>
                        </View>
                        <View>
                            <Text style={styleSheet.greyText}>
                                {t('ExtraMed.Notice')}
                            </Text>
                        </View>
                    </View>

                    <View style={styleSheet.context}>
                        <View>
                            <Text style={styleSheet.blackText}>
                                {t('Common.ExtraMed')}
                            </Text>
                        </View>
                        <View>
                            <FlatList
                                data={extraMed}
                                scrollEnabled={false}
                                keyExtractor={(item, index) => `extra-medican-${index}`}
                                renderItem={({ item, index }) => {
                                    const pricePlaceHolder=extraMed[index].price.toString()||t('Common.Price');

                                    return (<View style={styleSheet.extraMedContainer}>
                                        <View style={styleSheet.extraMedRow}>
                                            <View style={styleSheet.extraMedContent}>
                                                <Input
                                                    style={styleSheet.extraMedCode}
                                                    placeholder={t('Common.Name')}
                                                    placeholderTextColor="rgba(0, 0, 0, 0.35)"
                                                    onChangeText={(input) => onExtraMedCodeChange(index, input)}
                                                    value={extraMed[index].code}
                                                    blurOnSubmit={true}
                                                />
                                                <Input
                                                    style={styleSheet.extraMedPrice}
                                                    placeholder={pricePlaceHolder}
                                                    placeholderTextColor="rgba(0, 0, 0, 0.35)"
                                                    onChangeText={(input) => onExtraMedPriceChange(index, input)}
                                                    value={extraMed[index].price.toString()}
                                                    blurOnSubmit={true}
                                                    keyboardType="numeric"
                                                    maxLength={10}
                                                />
                                            </View>
                                            <View style={styleSheet.removeContainer}>
                                                <TouchableHighlight
                                                    onPress={() => onRemoveExtraMed(index)}
                                                    style={styleSheet.removeHighLight}
                                                >
                                                    <Icon
                                                        name="close"
                                                        style={styleSheet.removeIcon}
                                                    />
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    </View>
                                )}}
                            />
                        </View>
                        <Button
                            full
                            bordered
                            onPress={onAddExtraMed}
                            style={styleSheet.addExtraMedButton}
                        >
                            <Text style={styleSheet.addExtraMedButtonText}>
                                {`+ ${t('Common.Add')}`}
                            </Text>
                        </Button>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>

            <View style={styleSheet.submitButton}>
                <MCCButton
                    onPress={onNext}
                    text={t('Modify.ST3')}
                />
            </View>
            
            <PhoneCall style={styleSheet.hotline}/>
        </Container>
    )
});

const styleSheet = StyleSheet.create({
    keyboard: {
        flex: 1,
        paddingBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flexDirection: "column",
        paddingLeft: 5,
        width: width * 0.9,
        paddingBottom: 5,
        marginBottom: 0,
    },
    header: {
        justifyContent: "space-between"
    },
    headerTitle: {
        justifyContent: "space-between",
        marginTop: height * 0.04,
    },
    headerTitleText: {
        fontSize: 30,
        fontWeight: "normal"
    },
    blackText: {
        fontSize: 20,
        color: 'black'
    },
    greyText: {
        fontSize: 20,
        color: '#F65555'
    },
    submitButton: {
        paddingVertical: 4
    },
    context: {
        justifyContent: "space-between",
        marginTop: height * 0.03,
    },
    flatListRow: {
        marginTop: height * 0.005
    },
    addExtraMedButton: {
        borderColor: "#F65555",
        marginTop: 4
    },
    addExtraMedButtonText: {
        color: "#F65555",
        fontSize: 15
    },
    extraMedContainer: {
        marginBottom: 5,
        opacity: 10
    },
    extraMedRow: {
        flex: 9,
        flexDirection: "row"
    },
    extraMedCode: {
        color: "black",
        height: 40,
        borderColor: "rgba(0, 0, 0, 0.35)",
        borderWidth: 1,
        opacity: 10,
    },
    extraMedContent: {
        flex: 9,
        marginVertical: 5
    },
    extraMedPrice: {
        color: "black",
        height: 40,
        borderColor: "rgba(0, 0, 0, 0.35)",
        borderWidth: 1,
        marginTop: 5,
        opacity: 10,
    },
    removeContainer: {
        flex: 1
    },
    removeHighLight: {
        justifyContent: "center",
        marginTop: 28,
        alignItems: "center",
    },
    removeIcon: {
        fontSize: 20,
        color: "#F65555"
    },
    hotline:{
        bottom:80
    }
});

export default SelectExtraMedPage;
