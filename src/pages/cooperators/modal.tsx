import _ from 'lodash';
import { View } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper'

type InsurerModalProp = {
    show: boolean,
    insurer: any,
    onDismiss: () => void
}

const InsurerModal = ({ show, insurer, onDismiss }: InsurerModalProp) => {
    const { t } = useTranslation();
    const physicalCard = insurer?.supportMedicalCard === 'T';
    const qrCode = insurer?.supportQrcode === 'T';
    const physicalCardImages = _.split(insurer?.physicalCard, ',');

    const getSupportText = () => {
        return `${physicalCard || physicalCard ? `${t('Cooperators.support')}`: ''}  ${physicalCard ? t('Cooperators.physicalCard') : ''}${physicalCard && qrCode ? ` ${t('Cooperators.and')} ` : ''}${qrCode ? t('Cooperators.qrCode') : ''}`;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={show}
            onRequestClose={onDismiss}
        >
            <TouchableWithoutFeedback onPress={onDismiss} style={styleSheet.modalOverlayPress}>
                <View style={styleSheet.modalOverlay} />
            </TouchableWithoutFeedback>
            
            <View style={styleSheet.centeredView}>
                <View style={styleSheet.modalView}>
                    <View style={styleSheet.modalCloseX}>
                        <Pressable
                            style={[styleSheet.button, styleSheet.buttonClose]}
                            onPress={onDismiss}
                        >
                            <Text style={styleSheet.modalClose}>X</Text>
                        </Pressable>
                    </View>

                    <Text style={styleSheet.modalTitle}>{t('Cooperators.insurerPlan')}</Text>
                    <Image
                        style={styleSheet.modalInsurerIcon}
                        source={{
                            uri: insurer?.logo,
                        }}
                    />
                    <View style={styleSheet.userGuideDownloadContainer}>
                        <Text style={styleSheet.modalText}>
                            {insurer?.descriptionChi}
                        </Text>
                    </View>

                    <Text style={styleSheet.modalText}>
                        {getSupportText()}
                    </Text>
                    {
                        physicalCard ?
                            (
                                physicalCardImages.length > 1 ?
                                <View style={styleSheet.swiperContainer}>
                                    <Swiper showsButtons={true} activeDotColor='#FF5A43'>
                                        {physicalCardImages.map((item, key)=>(
                                            <View style={styleSheet.swiperInnerContainer}>
                                                <Image
                                                    source={{ uri: item }}
                                                    style={styleSheet.swiperItem}
                                                />
                                            </View>
                                        ))}
                                    </Swiper>
                                </View>
                                :
                                <Image
                                    source={{ uri: physicalCardImages[0] }}
                                    style={styleSheet.physicalImage} 
                                />
                            )
                            : undefined
                    }

                    {
                        qrCode ?
                            <Image
                                style={styleSheet.modalQrcodeImage}
                                source={require('../../assets/images/qrcode_sample.png')}
                            /> : undefined
                    }

                    {
                            insurer?.userGuide !== null ?
                            <View style={styleSheet.userGuideButton}>
                                <TouchableOpacity onPress={() => { Linking.openURL(insurer.userGuide) }}>
                                    <Text style={styleSheet.userGuideButtonText}>{t('Cooperators.userGuide')}</Text>
                                </TouchableOpacity>
                            </View>
                            : null
                        }
                </View>
            </View>
        </Modal>
    )
}

const styleSheet = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalOverlayPress: {
        height: "100%",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.7)',
        position: "absolute",
        marginTop: 100,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#ff8566',
        height: "100%",
    },
    modalClose: {
        color: "#ff8566",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalTitle: {
        color: '#ff8566',
        fontSize: 20,
    },
    modalText: {
        marginBottom: 10,
        textAlign: "center",
        color: '#ff8566',
        marginHorizontal: 10,
    },
    modalInsurerIcon: {
        width: 230,
        height: 60,
        resizeMode: 'contain',
        margin: 10,
    },
    swiperContainer: {
        height: 200,
    },
    swiperInnerContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    swiperItem: {
        flex: 1,
        height: 150,
        resizeMode: 'contain',
    },
    physicalImage: {
        height: 200,
        width: 250,
        marginHorizontal: 20,
        resizeMode: 'contain',
    },
    modalQrcodeImage: {
        height: 100,
        resizeMode: 'contain',
    },
    modalCloseX: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    button: {
        borderRadius: 20,
        paddingHorizontal: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#ff8566'
    },
    buttonOpen: {
        backgroundColor: "#ff8566",
    },
    buttonClose: {
        backgroundColor: "#FFFFFF",
    },
    userGuideDownloadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: "wrap",
        marginBottom: 10,
    },
    userGuideButton: {
        borderWidth: 1,
        backgroundColor:'#467fd0',
        borderRadius: 10,
        borderColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    userGuideButtonText: {
        color: "#ffffff",
        fontSize: 15
    }
})

export default InsurerModal;