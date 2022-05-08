import React from "react";
import { Text, View } from "native-base";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { useTranslation } from "react-i18next";

interface ZaReminderBannerProps {

}

const ZaReminderBanner: React.FC<ZaReminderBannerProps> = () => {
    const { t, i18n } = useTranslation();
    const textStyle: StyleProp<TextStyle> = [
        styleSheet.zaReminderBannerText,
        { fontSize: i18n.language === 'en' ? 13 : 19 }
    ];

    return (
        <React.Fragment>
            <View style={styleSheet.zaReminderTextWrapper}>
                <Text style={textStyle}>
                    {t('Payment.ZAPaumentReminder1')}
                </Text>
                <Text style={textStyle}>
                    {t('Payment.ZAPaumentReminder2')}
                </Text>
            </View>
        </React.Fragment>
    )
}

const styleSheet = StyleSheet.create(
    {
        zaReminderTextWrapper: {
            paddingHorizontal: 10,
            alignItems: 'center'
        },
        zaReminderBannerText: {
            backgroundColor: 'white',
            color: '#fb8260',
            fontWeight: 'bold',
            paddingHorizontal: 5,
            paddingVertical: 2
        }
    }
);

export default ZaReminderBanner;
