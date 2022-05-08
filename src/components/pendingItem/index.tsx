import { Body, ListItem, Text, View, Right } from "native-base";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React, { useCallback } from "react";
import { Alert, StyleSheet } from "react-native";
import { PendingItem } from "../../models/pendingItem";
import { useStores } from "../../stores";
import CloseButton from "../closeBtn/closeBtn";
import { findInsurer } from "../../utils/common";
import { useTranslation } from "react-i18next";
import { deletePendingItem } from "../../actions/config";
import { translate } from "../../utils/string";
import moment from "moment";

const thumbnailURI = {
  qr: require("../../assets/images/pendingList/qrCode.png"),
  card: require("../../assets/images/pendingList/card.png")
};

const iconURI = {
  patient: require("../../assets/images/pendingList/person.png"),
  doctor: require("../../assets/images/pendingList/doctor.png"),
  benefit: require("../../assets/images/pendingList/benefit.png"),
  time: require("../../assets/images/pendingList/time.png")
};

type PendingListItemProp = {
  onPress: (item: PendingItem) => void,
  pendingItem: PendingItem
}

const getThumbnailByVerifyType = (pendingItem: PendingItem): any => {
  const isQR = pendingItem.verifyType === 1;
  if (isQR) {
    return thumbnailURI.qr;
  }
  return thumbnailURI.card;
};

const PendingListItem = ({
  onPress,
  pendingItem
}: PendingListItemProp) => {
  const stores = useStores();
  const {
    t,
    i18n
  } = useTranslation();
  const verifyTypeImgSource = getThumbnailByVerifyType(pendingItem);
  const { insurers } = stores.configStore;
  const insurer = findInsurer(insurers, pendingItem.insurerId);

  const onDeletePendingItem = async () => {
    await deletePendingItem({
      stores,
      i18n,
      pendingItemId:pendingItem.id
    });
  };

  const onCloseBtnPressed = () => {
    Alert.alert(
      t("Modify.ConfirmDeletePendingItemHeader"),
      t("Modify.ConfirmDeletePendingItemMsg"),
      [
        {
          text: t("Common.Cancel"),
          style: "cancel"
        },
        {
          text: t("Common.Confirm"),
          onPress: onDeletePendingItem
        }
      ],
      {
        cancelable: true
      }
    );
  };

  const handlePress = useCallback(
    () => onPress(pendingItem),
    [onPress, pendingItem]
  );

  const benefitTranslation = i18n.language === "en" ? pendingItem.benefitDesc.descEn : pendingItem.benefitDesc.descChi;

  const formattedVerifyTime=moment(pendingItem.verifyTime).format('YYYY-MM-DD hh:mm A');

  return (
    <ListItem
      style={styles.listItem}
      onPress={handlePress}
      noIndent
    >
      <CloseButton onPress={onCloseBtnPressed} style={styles.closeBtn}/>


      <Image
        source={verifyTypeImgSource}
        resizeMode={"contain"}
        style={styles.verifyType}
      />

      <Body style={styles.body}>

        <View style={styles.sameRow}>
          <Image
            source={iconURI.patient}
            style={styles.smallIconSize}
            resizeMode={"contain"}
          />
          <Text
            numberOfLines={2}
            style={styles.textDesc}
          >
            {`${pendingItem.patientName} - ${translate(insurer, i18n)} `}
          </Text>
        </View>


        <View style={styles.sameRow}>
          <Image
            source={iconURI.doctor}
            style={styles.smallIconSize}
            resizeMode={"contain"}
          />
          <Text
            numberOfLines={1}
            style={styles.textDesc}
          >
            {translate(pendingItem.doctor, i18n)}
          </Text>
        </View>


        <View style={styles.sameRow}>
          <Image
            source={iconURI.benefit}
            style={styles.smallIconSize}
            resizeMode={"contain"}
          />

          <Text
            numberOfLines={2}
            style={styles.benefitTextDesc}
          >
            {benefitTranslation}
          </Text>
        </View>
      </Body>

      <View style={styles.verifyTimePosition}>
        <View style={styles.verifyTimeWrapper}>
          <Image source={iconURI.time} style={styles.timeIcon} resizeMode={"contain"}/>
          <Text style={styles.verifyTime}>
            {formattedVerifyTime}
          </Text>
        </View>
      </View>


      <Right>
        <Text note>
          <Icon name="chevron-forward" style={styles.icon}/>
        </Text>
      </Right>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#FFF4F3",
    borderRadius: 15,
    marginBottom: 15,
    fontFamily:'Roboto',
    paddingTop:5,
    paddingBottom:0
    // paddingHorizontal:5
  },
  verifyType: {
    position:"relative",
    marginVertical: 0,
    marginLeft:-10,
    marginRight:10,
    width: 80,
    height: 50,
  },
  body: {
    marginTop:15,
    flex:1,
    justifyContent:'space-evenly',
    height:120
  },
  sameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    color: "#E07A6E",
  },
  closeBtn: {
    position: "absolute",
    left: 5,
    top: 5
  },
  smallIconSize: {
    width: 15,
    height: 20
  },
  textDesc: {
    marginLeft: 10,
    fontWeight: "500",
    lineHeight: 20,
    fontSize:16
  },
  benefitTextDesc:{
    marginLeft: 10,
    fontWeight:"500",
    fontSize:12
  },
  verifyTimePosition: {
    position: "absolute",
    top: 5,
    right: 10
  },
  verifyTimeWrapper:{
    flexDirection: "row",
    alignItems: "center",
  },
  verifyTime: {
    fontSize: 12,
    color: "#9A9A9A"
  },
  timeIcon: {
    width: 12,
    height: 12
  },
});

export default PendingListItem;
