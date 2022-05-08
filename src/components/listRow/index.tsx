import React from "react";
import { StyleSheet, Image, View, TouchableOpacity } from "react-native";
import { Body, ListItem, Text, Left, Right, Icon } from "native-base";
import { useTranslation } from 'react-i18next';

type ListRowProp = {
    leftIcon?: string,
    rightIcon?: string,
    item: any,
    rightStyle?: any,
    onPress: (item: any) => void,
    formatText: (item: any) => string,
    addFavorite: (item: any) => void
}

const ListRow = ({ leftIcon, item, rightIcon, rightStyle, onPress, formatText, addFavorite }: ListRowProp) => {
    const { i18n, t } = useTranslation();

    return (
        <View style={styleSheet.item}>
            {
                leftIcon ? (
                    <TouchableOpacity style={styleSheet.favoriteIconContainer} onPress={addFavorite}>
                        <Image style={styleSheet.favoriteIcon} source={leftIcon === 'unactivated'?require('../..//assets/images/star-unactivated.png'):require('../..//assets/images/star-activated.png')}/>
                        <Text style={styleSheet.codeText}>{item.code}</Text>
                    </TouchableOpacity>
                ) : null
            }
            <TouchableOpacity
                style={styleSheet.listItem}
                onPress={() => onPress(item)}
            >

                <Text style={styleSheet.text}>
                    {
                        i18n.language === 'en' ?
                        (
                            `${item.nameEn}\n${item.nameChi}`
                        ) : (
                            `${item.nameChi}\n${item.nameEn}` 
                        )
                    }
                </Text>

                {rightIcon && (
                    <Right style={styleSheet.addIcon}>
                        <Icon 
                        name={rightIcon} 
                        style={[styleSheet.text, rightStyle]} />
                    </Right>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styleSheet = StyleSheet.create({
    list: {
        paddingTop: 5,
        paddingBottom: 5
    },
    item: {
        borderColor: "rgba(0,0,0,0.25)",
        borderBottomWidth: 1,
        flexDirection: 'row',
        padding: 10,
    },
    text: {
        fontSize: 22,
        marginLeft: 0,
        marginRight: 0,
        width: '90%',
    },
    codeText: {
        fontSize: 22,
        marginLeft: 0,
        marginRight: 0,
        textDecorationLine: 'underline'
    },
    favoriteIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    listItem: {
        flex: 5,
        flexDirection: 'row',
    },
    addIcon: {
        flex: 1
    },
    favoriteIconContainer: {
        flexDirection: 'row',
        flex: 3
    }
});

export default ListRow;