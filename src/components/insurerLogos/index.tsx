import { observer } from "mobx-react";
import { View, Text } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import ImageComponent from "../../components/image";
import Swiper from "react-native-swiper";

const logos = [
  {
    source: require("../../assets/images/logo/ai.png"),
    width: 512,
    height: 88,
  },
  {
    source: require("../../assets/images/logo/ZA.png"),
    width: 417,
    height: 192,
  },
  {
    source: require("../../assets/images/logo/FWD.png"),
    width: 376,
    height: 192,
  },
  {
    source: require("../../assets/images/logo/boc.png"),
    width: 674,
    height: 192,
  },
  {
    source: require("../../assets/images/logo/avo.png"),
    width: 474,
    height: 192,
  },
  {
    source: require("../../assets/images/logo/bc.png"),
    width: 678,
    height: 192,
  },
  {
    source: require("../../assets/images/logo/bt.png"),
    width: 740,
    height: 192,
  },
  {
    source: require("../../assets/images/logo/cl.png"),
    width: 645,
    height: 192,
  },
  {
    source: require("../../assets/images/logo/tp.png"),
    width: 668,
    height: 192,
  },
  {
    source: require("../../assets/images/logo/hl.png"),
    width: 645,
    height: 192,
  },
  {
    source: require("../../assets/images/logo/chinalifemediplus.png"),
    width: 456,
    height: 192,
  },
];

const InsurerLogos = observer(() => {
  return (
    <View style={{ height: 200, paddingTop: 20 }}>
      <Swiper activeDotColor="#FF5A43" loop={false}>
        {Array(Math.ceil(logos.length / 6))
          .fill("")
          .map((_, pageIndex) => {
            const startIndex = pageIndex * 6;
            const pageLogos = logos.slice(startIndex, startIndex + 6);

            return (
              <View>
                {Array(Math.ceil(pageLogos.length / 2))
                  .fill("")
                  .map((_, pairIndex) => (
                    <View style={styleSheet.logoContainer}>
                      {pageLogos
                        .slice(pairIndex * 2, (pairIndex + 1) * 2)
                        .map((item) => (
                          <View style={styleSheet.logoSmallContainer}>
                            <ImageComponent
                              image={item.source}
                              style={[
                                styleSheet.logo,
                                { aspectRatio: item.width / item.height },
                              ]}
                            />
                          </View>
                        ))}
                    </View>
                  ))}
              </View>
            );
          })}
      </Swiper>
    </View>
  );
});

const styleSheet = StyleSheet.create({
  logoContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
  },
  logo: {
    height: "100%",
    maxWidth: "100%",
  },
  logoSmallContainer: {
    flex: 1,
    height: 48,
    marginHorizontal: "5%",
    marginVertical: "1%",
  },
});

export default InsurerLogos;
