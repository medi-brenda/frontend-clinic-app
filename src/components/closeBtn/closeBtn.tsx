import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BUTTON_SIZE = 25
const BORDER_WIDTH = 1

type CloseBtnProps = {
    onPress: () => void,
    borderColor?: string,
    backgroundColor?: string,
    crossColor?: string,
    style:any
}

const CloseButton: React.FC<CloseBtnProps> = (props) => {
    const backgroundColor = props.backgroundColor;
    const borderColor = props.borderColor;
    const crossColor = props.crossColor;

    return (
        <TouchableOpacity onPress={props.onPress} style={[styles.button, {backgroundColor, borderColor,...props.style}]}>
            <Icon name={'close'} color={crossColor} size={BUTTON_SIZE / 2}/>
        </TouchableOpacity>
    )
}

CloseButton.defaultProps={
    backgroundColor:'#E07A6E',
    borderColor:'#E07A6E',
    crossColor:'white',
    style:undefined
}


const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: BUTTON_SIZE + BORDER_WIDTH,
        height: BUTTON_SIZE + BORDER_WIDTH,
        borderWidth: BORDER_WIDTH,
        borderRadius: BUTTON_SIZE / 2,
    }
})
export default CloseButton;
