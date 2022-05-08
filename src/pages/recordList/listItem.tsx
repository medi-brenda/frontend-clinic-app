import { Body, ListItem, Right, Thumbnail, Text, Icon } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Record } from '../../models/record';
import { useStores } from '../../stores';
import { findInsurer } from '../../utils/common';
import { translate } from '../../utils/string';

type RecordListItemProp = {
    onPress: () => void,
    record: Record
}

const RecordListItem = ({ onPress, record }: RecordListItemProp) => {
    const { i18n, t } = useTranslation();
    const stores = useStores();
    const { insurers } = stores.configStore;
    const insurer = findInsurer(insurers, record.insurerId);

    return (
        <ListItem
            style={styleSheet.listItem}
            onPress={onPress}
        >
            <Thumbnail
                size={80}
                source={require("../../assets/icon.png")}
                style={styleSheet.verifyType}
            />
            <Body style={styleSheet.body}>
                <Text
                    numberOfLines={1}
                    style={[
                        styleSheet.bodyText,
                        Number(record.status) === 1 ? styleSheet.status1 : styleSheet.status2
                    ]}
                >
                    {Number(record.status) === 1 ? t('Record.ST2') : t('Record.ST3')}
                </Text>

                <Text numberOfLines={1} style={styleSheet.text}>
                    {`${t('Record.ST4')}: ${record.memberId.substring(0, 9)} (${insurer?.name})`}

                </Text>
                <Text numberOfLines={2} style={styleSheet.text}>
                    {`${t('Record.ST5')}: ${translate(record.doctor, i18n)}`}
                </Text>
                <Text numberOfLines={2} style={styleSheet.text}>
                    {`${t('Record.Type')}: ${record.benefitCode}`}
                </Text>
                <Text numberOfLines={1} style={styleSheet.text}>
                    {`${t('Record.ST6')}: ${record.voucher}`}
                </Text>
                {Number(record.status) === 1 ? (
                    <Text numberOfLines={1} style={styleSheet.text}>
                        {`${t('Record.ST7')}: ${record.transactionTime}`}
                    </Text>
                ) : (
                        <Text numberOfLines={1} style={styleSheet.text}>
                            {`${t('Record.RefundTime')}: ${record.refundTime}`}
                        </Text>
                    )}
                <Text numberOfLines={1} style={styleSheet.text}>
                    {`${t('Modify.ST34')}: ${record.verifyType === 2 ? t('Common.PhysicalCard') : t('Common.QrCode')}`}
                </Text>
            </Body>
            <Right>
                <Text note>
                    <Icon name="ios-arrow-forward" style={styleSheet.icon} />
                </Text>
            </Right>
        </ListItem>
    )
}

const styleSheet = StyleSheet.create({
    listItem: {
        paddingLeft: 0,
        marginLeft: 0,
        backgroundColor: "#FFF",
        opacity: 1,
        borderColor: "rgba(0,0,0,0.05)",
        borderBottomWidth: 1,
    },
    verifyType: {
        paddingLeft: 2,
        marginLeft: 2
    },
    body: {
        paddingLeft: 0,
        marginLeft: 0
    },
    bodyText: {
        fontSize: 22,
        marginBottom: 8
    },
    status1: {
        color: '#008000'
    },
    status2: {
        color: '#ff4500'
    },
    text: {
        fontSize: 12,
        marginBottom: 5
    },
    icon: {
        fontSize: 16
    }
});

export default RecordListItem;
