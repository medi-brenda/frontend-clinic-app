import { Text } from 'native-base';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutAnimation, LayoutChangeEvent, Platform, StyleSheet, UIManager, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type ReadMoreViewProp = {
    show: boolean,
    minHeight?: number
    children: ReactNode
}

const ReadMoreView = ({ show, children, minHeight = 60 }: ReadMoreViewProp) => {
    const [expanded, setExpanded] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, [])

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(expanded);
    }, [expanded]);

    return (
        <View>
            <View style={{ height: show || expanded ? undefined : minHeight, overflow: 'hidden' }}>
                {children}
            </View>
            {
                !show ? (
                    <TouchableOpacity onPress={() => { setExpanded(!expanded) }}>
                        <Text style={styleSheet.readMoreText}>{expanded ? "" : "..."}</Text>
                        <Text style={styleSheet.readMoreText}>{expanded ? t('Cooperators.readLess') : t('Cooperators.readMore')}</Text>
                    </TouchableOpacity>
                ) : undefined
            }

        </View>
    )
}

const styleSheet = StyleSheet.create({
    readMoreText: {
        marginTop: 5,
        color: "#999999",
        fontSize: 12,
    }
})

export default ReadMoreView;