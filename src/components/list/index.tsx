import { Body, ListItem, Right, Icon } from 'native-base';
import React, { useState } from 'react';
import { FlatList, FlatListProps, StyleSheet, Text } from 'react-native';
import { Option } from '../../models/option';

export type ListType<T> = Pick<FlatListProps<T>, 'data'> & {
    icon: any,
    onPress: (item: T) => void,
    formatText: (item: T) => string,
}

const List = <T extends Option>({ data, icon, onPress, formatText }: ListType<T>) => {

    return (
        <FlatList
            style={styleSheet.list}
            data={data}
            renderItem={({ item }) => (
                <ListItem style={styleSheet.item} onPress={() => onPress(item)}>
                    <Body style={styleSheet.body}>
                        <Text style={styleSheet.text}>{formatText(item)}</Text>
                    </Body>
                    <Right>
                        <Icon name={icon} style={styleSheet.text} />
                    </Right>
                </ListItem>
            )}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

const styleSheet = StyleSheet.create({
    list: {
        paddingTop: 5,
        paddingBottom: 5
    },
    item: {
        borderColor: "rgba(0,0,0,0.25)"
    },
    body: {
        marginVertical: 4
    },
    text: {
        fontSize: 22,
        marginLeft: 0,
        marginRight: 0
    }
});

export default List;