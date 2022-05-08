import { Body, Button, Icon, Left, ListItem, Right, Switch } from 'native-base';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import CardIcon from '../../icons/CardIcon';
type ListItemProp = {
    icon: string,
    title: string,
    value: any,
    onChange: () => void
};

const SettingListItem = ({ icon, title, value, onChange }: ListItemProp) => {

    const getIcon = (icon: string) => {
        switch (icon) {
            case 'physicalimg':
                return <CardIcon />;
            default:
                return <Icon active name={icon} />;
        }
    }
    return (
        <ListItem icon>
            <Left>
                <Button style={styleSheet.button}>
                    {getIcon(icon)}
                </Button>
            </Left>
            <Body>
                <Text>{title}</Text>
            </Body>
            <Right>
                <Switch value={value} onValueChange={onChange} />
            </Right>
        </ListItem>
    )
}

const styleSheet = StyleSheet.create({
    button: {
        backgroundColor: '#FF9501'
    }
})

export default SettingListItem;