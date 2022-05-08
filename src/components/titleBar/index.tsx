import React, { ReactNode } from 'react';
import { View, TouchableOpacity, Image, StatusBar, StyleSheet, Platform, Linking } from 'react-native';
import { Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import styles from '../../styles';
import { LinearGradient } from 'expo-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const backButton = require('../../assets/images/UI/backButton.png');

type TitleBarProp = {
    noReturn?: boolean,
    withoutStatusBar?: boolean,
    title: string,
    onBack?: () => void,
    onNext?: () => void,
    onNextTitle?: string,
    children?: ReactNode,
    downloadUserGuideButton?: boolean
}

const TitleBar = ({ noReturn, title, onBack, onNext, onNextTitle, children, withoutStatusBar = false, downloadUserGuideButton }: TitleBarProp) => {
    const { i18n, t } = useTranslation();
    return (
        <LinearGradient
            start={[0, 0]}
            end={[1, 0]}
            colors={['#ef6666', '#f5b076']}
        >
            <View>
                <StatusBar translucent={true} backgroundColor='transparent' />
                {withoutStatusBar ? undefined : <View style={styleSheet.statusBar} />}
                <View style={styleSheet.header}>
                    {
                        noReturn ? (
                            <View />
                        ) : (
                                <TouchableOpacity
                                    onPress={onBack}
                                    style={styles.title_backButton}
                                >
                                    <Image source={backButton} />
                                </TouchableOpacity>
                            )
                    }
                    <Text style={[styles.title_text]}>{title}</Text>
                    {
                        onNext ? (
                            <TouchableOpacity
                            onPress={onNext}
                                style={styleSheet.nextAction}
                            >
                                <View>
                                    <Text style={[styles.title_text]}>
                                        {onNextTitle || t('Common.Next')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            downloadUserGuideButton?
                            <TouchableOpacity style={styleSheet.nextAction} onPress={ ()=>{ Linking.openURL('https://www.mediconcen.com/bservice/service-terms.pdf')}}>
                                <View>
                                    <Image
                                        source={require('../../assets/images/guide.png')}
                                        resizeMode={"contain"}
                                        style={styleSheet.downloadUserGuideButton}
                                    />
                                </View>
                            </TouchableOpacity> 
                            : null
                        )
                    }
                </View>
                {children}
            </View>

        </LinearGradient>
    )
}

const styleSheet = StyleSheet.create({
    statusBar: {
        height: getStatusBarHeight(),
    },
    header: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    nextAction: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingLeft: 10,
        paddingRight: 10,
    },
    downloadUserGuideButton: {
        width: 30,
        height: 30,
    }
})

export default TitleBar;