import React, { Component } from "react";
import { ImageBackground } from "react-native";

type BackgroundImageProp = {
  source?: any,
  children?: any
}
const BackgroundImage = ({ source, children }: BackgroundImageProp) => {
  return (
    <ImageBackground
      source={source}
      style={{ flex: 1, width: undefined, height: undefined }}
    >
      {children}
    </ImageBackground>
  )
}

export default BackgroundImage;