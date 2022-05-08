import { useNavigation } from '@react-navigation/native';
import { Tab, View, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { goRecord } from '../../actions/app';
import { Record } from '../../models/record';
import { useStores } from '../../stores';
import RecordListItem from './listItem';

type RecordTabProp = {
    records: Record[],
    onRefresh: () => void,
    refreshing: boolean
}

const RecordTab = ({ records, onRefresh, refreshing }: RecordTabProp) => {
    const { t } = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();
    const showRecord = (record: Record) => {
        goRecord({
            stores,
            navigation,
            record
        })
    }

    if (!records.length) {
        return (
            <ScrollView>
                <View style={styleSheet.container}>
                    <Text style={styleSheet.text}>
                        {t('Record.NoRecord')}
                    </Text>
                </View>
            </ScrollView>
        )
    }

    return (
        <FlatList
            data={records}
            keyExtractor={(item, index) => `record-${item.id}`}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({ item }) => (
                <RecordListItem
                    record={item}
                    onPress={() => showRecord(item)}
                />
            )}
        />
    );
}

const styleSheet = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('screen').height * 0.7,
    },
    text: {
        fontSize: 30
    }
});

export default RecordTab;
