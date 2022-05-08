import { Button, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Dimensions, View, ActivityIndicator } from 'react-native';

type ErrorType = {
    title: string,
    onRetry: () => void
}
const ErrorPage = ({ title, onRetry }: ErrorType) => {
    const { t } = useTranslation();
    return (
        <View style={styleSheet.preloader}>
            <Text>
                {title}
            </Text>
            <Button
                style={styleSheet.button}
                onPress={onRetry}
            >
                <Text>{t('Common.Retry')}</Text>
            </Button>
        </View>
    )
};

const { height } = Dimensions.get('window');
const styleSheet = StyleSheet.create({
    preloader: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: height,
        backgroundColor: '#FFFFFF',
    },
    button: {
        marginTop: 16,
        alignSelf: 'center'
    }
});

export default ErrorPage;