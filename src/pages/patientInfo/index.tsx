import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { Card, CardItem, Container, View } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MCCButton from '../../components/mccButton';
import TitleBar from '../../components/titleBar';
import { useStores } from '../../stores';
import styles from '../../styles';
import * as _ from 'lodash';
import PhoneCall from '../../components/phoneCall/index';

const PatientInfoPage = observer(() => {
    const store = useStores();
    const navigation = useNavigation();
    const { i18n, t } = useTranslation();
    
    const isEng = i18n.language === 'en';
    
    const { values } = store.dataStore;

    return (
        <Container>
            <TitleBar
                title={t(`Common.UserDetail`)}
                onBack={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }]
                    });
                }}
            />
            <ScrollView style={styleSheet.scrollView}>
                <Card transparent>
                    {values.insurerDescription ? (
                        <CardItem bordered style={styleSheet.cardBorder}>
                            <View style={[styleSheet.center, styleSheet.context]}>
                                <Text style={styles.text_20}>
                                    {t('Verify.Insurer')}
                                </Text>
                                <Text style={[styles.text_24, styles.text_red]}>
                                    {isEng ? values.insurerDescription.en : values.insurerDescription.chi}
                                </Text>
                            </View>
                        </CardItem>
                    ) : null}
                    <CardItem bordered style={styleSheet.cardBorder}>
                        <View style={[styleSheet.center, styleSheet.context]}>
                            <Text style={styles.text_20}>{t('UserDetail.UserId')}</Text>
                            <Text style={[styles.text_24, styles.text_red]}>
                                {values.member}
                            </Text>
                        </View>
                    </CardItem>
                    <CardItem bordered style={styleSheet.cardBorder}>
                        <View style={[styleSheet.center, styleSheet.context]}>
                            <Text style={styles.text_20}>{t('UserDetail.Copayment')}</Text>
                            <Text style={[styles.text_24, styles.text_red]}>
                                HKD ${values.copayment}
                            </Text>
                        </View>
                    </CardItem>
                    <CardItem bordered style={styleSheet.cardBorder}>
                        <View style={[styleSheet.center, styleSheet.context]}>
                            <Text style={styles.text_20}>{t('UserDetail.ExtraMedLimit')}</Text>
                            <Text style={[styles.text_24, styles.text_red]}>
                                {values.extraMedLimit === 0 ? 'N/A' : 'HKD $' + values.extraMedLimit}
                            </Text>
                        </View>
                    </CardItem>

                    <CardItem bordered style={styleSheet.cardBorder}>
                        <View style={[styleSheet.center, styleSheet.context]}>
                            <Text style={styles.text_20}>{t('UserDetail.RefLetter')}</Text>
                            <Text style={[styles.text_24, styles.text_red]}>
                                {Number(values.referenceLetter) === 1 ? t('UserDetail.Necessary') : t('UserDetail.NotNecessary')}
                            </Text>
                        </View>
                    </CardItem>

                    <CardItem bordered style={styleSheet.cardBorder}>
                        <View style={[styleSheet.center, styleSheet.context]}>
                            <Text style={styles.text_20}>{t('UserDetail.Eligibility')}</Text>
                            <Text style={[styles.text_24, styles.text_green, { marginTop: 2 }]}>
                                {t('UserDetail.Pass')}
                            </Text>
                        </View>
                    </CardItem>
                    <CardItem bordered style={styleSheet.cardBorder}>
                        <View style={[styleSheet.center, styleSheet.context]}>
                            <Text style={styles.text_20}>{t('UserDetail.Cautions')}</Text>
                            <Text style={[styles.text_20, styles.text_primaryColor]}>
                                {'N/A'}
                            </Text>
                        </View>
                    </CardItem>
                    <CardItem bordered style={{ borderWidth: 2 }}>
                        <View style={styleSheet.center}>
                            <MCCButton
                                onPress={() => {
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Modify' }]
                                    });
                                }}
                                text={t('Common.Confirm')}
                            />
                        </View>
                    </CardItem>
                </Card>
            </ScrollView>
            
            <PhoneCall/>
        </Container>
    )

});

const styleSheet = StyleSheet.create({
    scrollView: {
        borderRadius: 10
    },
    cardBorder: {
        borderWidth: 2
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    context: {
        paddingVertical: 15
    }
});

export default PatientInfoPage;