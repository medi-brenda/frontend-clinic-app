import React from "react";
import { StyleSheet, TouchableOpacity, View, Alert, Linking, Image, ViewProps } from "react-native";
import { useTranslation } from "react-i18next";

const img: Record<string, number> = {
  chi: require("../../assets/images/sos/sos_chi.png"),
  en: require("../../assets/images/sos/sos_en.png")
}

const PhoneCall = (props: Pick<ViewProps, 'style'>) => {
  const {t,i18n} = useTranslation();

  const onPress = () => {
    Alert.alert(
        t("SupportCall.SupportTitle"),
        t("SupportCall.SupportDescription"),
        [
          {
            text: t("Common.Cancel"),
            style: "cancel"
          },
          {
            text: t("Common.Confirm"),
            onPress: () => {
              Linking.openURL("tel:95316485");
            }
          }
        ]
    );
  };

  return (
      <View style={[styles.wrapper, props.style]}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onPress}>
            <Image source={img[i18n.language]} style={styles.imageSize}/>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    right: 25,
    zIndex: 999
  },
  container: {
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#56b5f9",
    borderRadius: 50,
    height: 40,
    width: 40
  },
  imageSize: {
    height: 70,
    width: 70
  }
});
export default PhoneCall;
