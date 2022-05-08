import { View } from 'native-base';
import React from 'react';
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import TitleBar from '../titleBar';

type ZoomImageProp = {
    show: boolean,
    title: string,
    onDismiss: () => void,
    urls: IImageInfo[]
}

const ZoomImage = ({ show, title, onDismiss, urls }: ZoomImageProp) => {
    return (
        <Modal
            visible={show}
            transparent={true}
            onRequestClose={onDismiss}
        >
            <ImageViewer
                renderHeader={() => (
                    <TitleBar
                        withoutStatusBar={false}
                        title={title}
                        onBack={onDismiss}
                    />
                )}
                renderIndicator={() => (<View></View>)}
                imageUrls={urls}
            />
        </Modal>
    )
}

export default ZoomImage;