import { View } from 'native-base';
import { options } from 'numeral';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import styles from '../../styles';
import { LinearGradient } from 'expo-linear-gradient';

type InsurerModalProp = {
    show: boolean,
    title: string
    onDismiss: () => void
}

const InsurerModal = ({ show, title, onDismiss }: InsurerModalProp) => {
    const { t } = useTranslation();

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
                    <View style={styles.modalContainer}>
                        <LinearGradient
                            start={[0, 0]}
                            end={[1, 0]}
                            colors={['#ef6666', '#f5b076']}
                        >
                            <View style={styleSheet.modalView}>
                                    <View style={styleSheet.modalCloseX}>
                                        <Pressable
                                            style={[styleSheet.button, styleSheet.buttonClose]}
                                            onPress={onDismiss}
                                        >
                                            <Text style={styleSheet.modalClose}>X</Text>
                                        </Pressable>
                                    </View>

                                    <Image
                                        style={styleSheet.modalInsurerIcon}
                                        source={require('../../assets/images/star.png')}
                                    />

                                    <Text style={styleSheet.modalTitle}>{title}</Text>
                            </View>
                        </LinearGradient>
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
        top: '40%',
        // marginTop: 100,
    },
    modalView: {
        // margin: 20,
        // backgroundColor: "white",
        // borderRadius: 20,
        // paddingTop: 35,
        alignItems: "center",
        marginBottom: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
        // borderWidth: 1,
        // borderColor: '#ff8566',
        // height: "100%",
    },
    modalContainer: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 0,
        overflow: 'hidden',
    },  
    modalClose: {
        color: "#ff8566",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalTitle: {
        color: '#ffffff',
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
        marginVertical: 10,
        marginHorizontal: 10,
    },
    modalPhysicalCardImage: {
        width: 300,
        height: 150,
        resizeMode: 'contain'
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