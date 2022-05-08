import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { LayoutAnimation, LayoutChangeEvent, Platform, StyleSheet, UIManager, View } from 'react-native';

type ExpandViewProp = {
    show: boolean,
    children: ReactNode
}

const ExpandView = ({ show, children }: ExpandViewProp) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, [])

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(show);
    }, [show]);

    return (
        <View style={{ height: expanded ? undefined : 0, overflow: 'hidden' }}>
            {children}
        </View>
    )
}

export default ExpandView;