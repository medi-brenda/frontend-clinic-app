import { Button } from "native-base";
import React from "react";
import { View, Text } from "react-native";
import * as Updates from 'expo-updates';

const ErrorViewComponent = () => {
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#3D3B3C",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          textAlign: "center",
          color: "white",
          margin: 20,
        }}
      >
        發生未知錯誤，請重新載入
      </Text>
      <Text
        style={{
          fontSize: 28,
          textAlign: "center",
          color: "white",
          margin: 20,
        }}
      >
        Unknown error occurred, please restart the app
      </Text>
      <Button
        style={{ 
          alignSelf: 'center',
          flexDirection: 'column',
          padding: 24,
          height: 48,
          backgroundColor: 'transparent'
         }}
        onPress={() => {
          Updates.reloadAsync();
        }}
      >
        <Text style={{ color: 'white' }}>重新載入</Text>
        <Text style={{ color: 'white' }}>Reload</Text>
      </Button>
    </View>
  )
}

export default ErrorViewComponent;