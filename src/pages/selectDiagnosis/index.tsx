import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Body, Card, CardItem, Container, Text, View } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Image, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ListRow from '../../components/listRow';
import SearchInput from '../../components/searchInput';
import { getDiagnosis } from '../../actions/config';
import TitleBar from '../../components/titleBar';
import { Option } from '../../models/option';
import { useStores } from '../../stores';
import ErrorPage from '../error';
import Loading from '../loading';
import { translate } from '../../utils/string';
import MCCButton from '../../components/mccButton';
import { goSelectExtraMed, initAboutUs } from '../../actions/app';
import { Diagnosis } from '../../models/diagnosis';
import * as _ from 'lodash';
import PhoneCall from "../../components/phoneCall";
import { initFavoriteDiagnosis, toggleFavoriteDiagnosis } from '../../actions/app';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from './modal';
import { findInsurer } from '../../utils/common';
import { countBy } from 'lodash';

const SelectDiagnosisPage = observer(() => {
    const stores = useStores();
    const { i18n, t } = useTranslation();
    const navigation = useNavigation();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Diagnosis[]>([]);
    const [favoriteDiagnosis, setFavoriteDiagnosis] = useState<any[]>([]);
    const [refreshed, setRefreshed] = useState(false);
    const { diagnosis, insurers } = stores.configStore;
    const { pendingItem } = stores.dataStore;
    const [currentDiagnosis, setCurrentDiagnosis] = useState(stores.configStore.diagnosis);

    const isIcd10 = () => {
        const insurer = findInsurer(insurers, pendingItem.insurerId);
        return _.get(insurer, 'icd', 9) === 10;
    }


    const usePrevious = (value: any) => {
        const ref = useRef();
        useEffect(() => {
          ref.current = value;
        });
        return ref.current;
    }

    const prevAmount = usePrevious(diagnosis);
    const prevFavoriteDiagnosis = usePrevious(favoriteDiagnosis);
    
    const {newFavoriteDiagnosis} = stores.appStore;

    const [isToggleFavoriteLoading, setIsToggleFavoriteLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');

    useEffect(() => {
        onSearch();
    }, []);

    useEffect(() => {
        if(
            (diagnosis && prevAmount !== diagnosis) || 
            (newFavoriteDiagnosis && prevFavoriteDiagnosis !== newFavoriteDiagnosis)
        ) {
            init();
        }
    }, [diagnosis, newFavoriteDiagnosis]);

    const init = async () => {
        setLoading(true);
        const errorMsgFavoriteDiagnosis = await initFavoriteDiagnosis({ stores, navigation, i18n, platform: Platform.OS });

        if (errorMsgFavoriteDiagnosis) {
            setError(errorMsgFavoriteDiagnosis);
        }

        let intArray:any = [];
        let temp:any = [];
        let result:any = [];
        if(newFavoriteDiagnosis !== null){
            if(!newFavoriteDiagnosis.includes(',')){
                intArray.push(parseInt(newFavoriteDiagnosis))
            }
            else{
                intArray = newFavoriteDiagnosis.split(',')
                    .map((item) => parseInt(item, 10));
            }
            
            temp = _.cloneDeep(diagnosis);
            temp.forEach((element:Diagnosis) => {
                if(intArray.includes(element.id)){
                    element['isFavorite'] = true;
                }
                else{
                    element['isFavorite'] = false;
                }
            });
            result = sortFavorite(temp);
        }
        else{
            temp = _.cloneDeep(diagnosis);
            temp.forEach((element:Diagnosis) => {
                element['isFavorite'] = false;
            });
            result = temp;
        }
        setFavoriteDiagnosis(intArray);
        setCurrentDiagnosis(result);
        setLoading(false);
    }

    const onSearch = async (value?: string) => {
        if (loading) {
            return;
        }

        setLoading(true);

        const errMsg = await getDiagnosis({
            stores,
            search: value || '',
            i18n
        });
 
        if (errMsg) {
            setError(errMsg);
        }

        return setLoading(false);
    }

    const onSubmitSearch = (value: string) => {
        onSearch(value);
    }

    const onRemoveSelectedDiagnosis = (item: Diagnosis) => {
        setSelected(selected.filter(d => d !== item));
    }

    const onAddSelectedDiagnosis = (item: Diagnosis) => {
        if (selected.length > 1) {
            return Alert.alert(
                t('Common.Error'),
                t('Modify.WarnAtMostTwoDiagnosis')
            )
        }
        selected.push(item);
        setSelected(selected);
        setRefreshed(!refreshed);
    }



    const onNextStep = () => {
        const errorMsg = goSelectExtraMed({
            stores,
            navigation,
            diagnosis: selected
        });

        if (errorMsg) {
            Alert.alert(
                t('Common.Error'),
                t(errorMsg)
            );
        }
    }

    const toggleFavoriteItems = async (item: any) => {
        const temp = _.cloneDeep(favoriteDiagnosis);
        if(favoriteDiagnosis.includes(item.id)){
            const index = temp.indexOf(item.id); 
            temp.splice(index, 1);
            setIsToggleFavoriteLoading(true);
            const resp = await toggleFavoriteDiagnosis({ stores, navigation, i18n, platform: Platform.OS, diagnosisId: item.id.toString(), type: '0' }).catch(error => {
                Alert.alert(
                    t('Common.Error'),
                    t(error)
                );
            })
            setIsToggleFavoriteLoading(false);

            const tempCurrentDiagnosis = _.cloneDeep(currentDiagnosis);
            const tempResult:any = [];
            tempCurrentDiagnosis.forEach(e => {
                if(e.id === item.id){
                    e.isFavorite = false;
                    tempResult.push(e);
                }
                else{
                    tempResult.push(e);
                }
            })
            const tempSelectedCurrentDiagnosis = _.cloneDeep(selected);
            const tempSelectedResult:any = [];
            tempSelectedCurrentDiagnosis.forEach(e => {
                if(e.id === item.id){
                    e.isFavorite = false;
                    tempSelectedResult.push(e);
                }
                else{
                    tempSelectedResult.push(e);
                }
            });
            const result = sortFavorite(tempResult);
            setCurrentDiagnosis(result);
            setSelected(tempSelectedResult);
            setModalVisible(true);
            setModalText(t('Diagnosis.removeFavoriteSuccess'));
        }
        else{
            temp.push(item.id);
            setIsToggleFavoriteLoading(true);
            const resp = await toggleFavoriteDiagnosis({ stores, navigation, i18n, platform: Platform.OS, diagnosisId: item.id.toString(), type: '1' }).catch(error => {
                Alert.alert(
                    t('Common.Error'),
                    t(error)
                );
            });
            setIsToggleFavoriteLoading(false);

            const tempCurrentDiagnosis = _.cloneDeep(currentDiagnosis);
            const tempResult:any = [];
            tempCurrentDiagnosis.forEach(e => {
                if(e.id === item.id){
                    e.isFavorite = true;
                    tempResult.push(e);
                }
                else{
                    tempResult.push(e);
                }
            });
            const tempSelectedCurrentDiagnosis = _.cloneDeep(selected);
            const tempSelectedResult:any = [];
            tempSelectedCurrentDiagnosis.forEach(e => {
                if(e.id === item.id){
                    e.isFavorite = true;
                    tempSelectedResult.push(e);
                }
                else{
                    tempSelectedResult.push(e);
                }
            });
            const result = sortFavorite(tempResult);
            setCurrentDiagnosis(result);
            setSelected(tempSelectedResult);
            setModalVisible(true);
            setModalText(t('Diagnosis.addFavoriteSuccess'));
        }
        
        setFavoriteDiagnosis(temp);
    }

    const sortFavorite = (diagnosisList: Diagnosis[]) => {
        return diagnosisList.sort((a: Diagnosis, b: Diagnosis) => {
            if (a.isFavorite && !b.isFavorite) {
                return -1;
            }
            else if (!a.isFavorite && b.isFavorite) {
                return 1;
            }
            return 0;
        });
    }
    
    return (
        <Container>
            <TitleBar
                title={t(`Diagnosis.Step1Title`)}
                onBack={() => {
                    navigation.goBack();
                }}
                children={
                    <SearchInput
                        disabled={loading}
                        placeholder={t('Modify.ST30')}
                        onSubmit={onSubmitSearch}
                    />
                }
            />
            {
                error ?
                    <ErrorPage title={error} onRetry={onSearch} /> :
                    loading ? <Loading /> :
                        <>
                            <Spinner
                                visible={isToggleFavoriteLoading}
                                textContent={t('Common.Loading')}
                            />

                            {
                                isIcd10() && <View  style={styleSheet.favouriteReminderWrapper}>
                                    <Card>
                                    <CardItem style={styleSheet.favouriteReminderCallout}>
                                        <Body>
                                            <Text>
                                                {t('Diagnosis.favouriteReminder')}
                                            </Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                                </View>
                            }

                            <Modal show={modalVisible} title={modalText} onDismiss={() => { setModalVisible(false); }} />
                            <View style={styleSheet.selectedHeader}>
                                <View style={styleSheet.selectedHeaderImage}>
                                    <Image style={styleSheet.favoriteIcon} source={require('../..//assets/images/star-activated.png')}/>
                                    <Text>{t('Diagnosis.favorite')}</Text>
                                </View>
                                
                                {
                                    selected.length ?
                                        <View style={styleSheet.selectedHeaderTextContainer}>
                                            <Text style={styleSheet.selectedHeaderText}>{t('Modify.ST2')}</Text>
                                        </View>
                                    :<View style={styleSheet.selectedHeaderTextContainer}></View>
                                }


                                <View style={styleSheet.selectedHeaderChooseDiagnosis}>
                                    <Text>{t('Diagnosis.selectDiagnosis')}</Text>
                                </View>
                                
                            </View>
                            {
                                selected.length ? (
                                    <View>
                                        <FlatList
                                            style={styleSheet.selected}
                                            scrollEnabled={false}
                                            data={selected}
                                            keyExtractor={(item, index) => `selected-dialognosis-${item.code}`}
                                            renderItem={({ item }) => (
                                                <ListRow
                                                    item={item}
                                                    onPress={onRemoveSelectedDiagnosis}
                                                    formatText={(item) => `${item.code} - ${translate(item, i18n)}`}
                                                    leftIcon={item.isFavorite?'activated':'unactivated'}
                                                    rightIcon='md-checkmark'
                                                    rightStyle={{ color: '#fc8651' }}
                                                    addFavorite={()=>toggleFavoriteItems(item)}
                                                />
                                            )}
                                        />
                                    </View>
                                ) : null
                            }
                            <FlatList
                                data={currentDiagnosis.filter(d => !selected.find(s => s.code === d.code))}
                                keyExtractor={(item, index) => `diagnosis-${index}`}
                                renderItem={({ item }:any) => {                                    
                                    return (
                                    <ListRow
                                        item={item}
                                        onPress={onAddSelectedDiagnosis}
                                        formatText={(item) => `${item.code} - ${translate(item, i18n)}`}
                                        rightIcon='add'
                                        leftIcon={item.isFavorite?'activated':'unactivated'}
                                        addFavorite={()=>toggleFavoriteItems(item)}
                                    />
                                )}}
                            />
                            <View style={styleSheet.action}>
                                <MCCButton
                                    onPress={onNextStep}
                                    text={t('Modify.ST3')}
                                />
                            </View>
                        </>
            }

        <PhoneCall style={styleSheet.hotline}/>
        </Container>
    )
});


const styleSheet = StyleSheet.create({
    action: {
        paddingVertical: 5
    },
    selected: {
        borderColor: '#ff8566',
        borderTopWidth: 3,
        borderBottomWidth: 3,
    },
    selectedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: "rgba(0,0,0,0.25)",
        borderBottomWidth: 1,
    },
    hotline:{
        bottom: 80
    },
    favoriteIcon: {
        width: 30,
        height: 30,
    },
    selectedHeaderImage: {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedHeaderTextContainer: {
        marginTop: 5,
        flex: 6,
    },
    selectedHeaderChooseDiagnosis: {
        flex: 4,
        marginLeft: 5,
    },
    selectedHeaderText: {
        width: '60%'
    },
    favouriteReminderWrapper: {
        paddingHorizontal:5,
        paddingVertical:5
    },
    favouriteReminderCallout: {
        borderLeftColor: "#e91e63",
        borderLeftWidth: 10,
    }
});

export default SelectDiagnosisPage;
