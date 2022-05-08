import {PendingItem} from "../../models/pendingItem";
import {useTranslation} from "react-i18next";
import {ScrollView} from "react-native-gesture-handler";
import {Text, View} from "native-base";
import React from "react";
import {Dimensions, FlatList, StyleSheet} from "react-native";
import PendingListItem from "../../components/pendingItem";
import {useNavigation} from "@react-navigation/native";
import {useStores} from "../../stores";
import {goNextAfterSelectingPendingItem} from '../../actions/app';

type RenderPendingListProp = {
    pendingListItems: PendingItem[],
    onRefresh: () => void,
    refreshing: boolean
};


const RenderPendingList = ({pendingListItems, onRefresh, refreshing}: RenderPendingListProp) => {
    const {t} = useTranslation();
    const stores = useStores();
    const navigation = useNavigation();


    const goQrOrCardPaymentFlow = (pendingItem: PendingItem) => {
        return goNextAfterSelectingPendingItem({stores, navigation, pendingItem});
    }

    if (!pendingListItems.length) {
        return (
            <ScrollView>
                <View style={styleSheet.container}>
                    <Text style={styleSheet.text}>
                        {t('Modify.NoPendingItem')}
                    </Text>
                </View>
            </ScrollView>
        )
    }

    return (
        <FlatList
            style={styleSheet.list}
            data={pendingListItems}
            keyExtractor={(item) => `pendingList-${item.id}`}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({item}) => {
                return (
                    <PendingListItem
                        onPress={goQrOrCardPaymentFlow}
                        pendingItem={item}
                    />
                )
            }}
        />
    )
};

const styleSheet = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('screen').height * 0.7,
    },
    text: {
        fontSize: 30
    },
    list: {
        paddingHorizontal: 13
    }
});

export default RenderPendingList;
