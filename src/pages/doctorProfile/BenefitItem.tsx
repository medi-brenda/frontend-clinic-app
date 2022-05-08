import React, { useState } from 'react';
import { DoctorProfileBenefit } from '../../models/doctor';
import { Body, Icon, Left, Right, View } from 'native-base';
import ReadOnlyField from '../../components/readOnlyField/infex';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../stores';
import { translate } from '../../utils/string';
import { StyleSheet, Text } from 'react-native';
import * as _ from 'lodash';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ExpandView from '../../components/expandView';

type BenefitItemProp = {
    benefits: DoctorProfileBenefit[],
    benefitCode: string
}

const BenefitItem = ({ benefits, benefitCode }: BenefitItemProp) => {
    const { t, i18n } = useTranslation();
    const stores = useStores();

    const [show, setShow] = useState(false);
    const benefitObj = _.find(stores.dataStore.doctorProfile.speciality, speciality => speciality.code === benefitCode);

    return (
        <View>
            <TouchableOpacity onPress={() => { setShow(!show) }}>
                <View style={styleSheet.header}>
                    <Text style={styleSheet.title}>{translate(benefitObj, i18n)}</Text>
                    <Icon style={styleSheet.action} name={show ? 'menu-up' : 'menu-down'} type='MaterialCommunityIcons' />
                </View>
            </TouchableOpacity>
            {
                show ? (
                    benefits.map((benefit, index) => (
                        <ExpandView
                            key={`benefit-${index}`}
                            show={show}
                            children={
                                <View

                                    style={[styleSheet.benefitContainer, index % 2 === 0 ? styleSheet.white : styleSheet.grey]}
                                >
                                    <ReadOnlyField
                                        title={t('DoctorProfile.Insurer_name')}
                                        value={translate(benefit.insurer, i18n)}
                                    />
                                    <ReadOnlyField
                                        title={t('DoctorProfile.Doctor_code')}
                                        value={benefit.doctorCode}
                                    />
                                    <ReadOnlyField
                                        title={t('DoctorProfile.Doctor_fee')}
                                        value={`$${benefit.doctorFee}`}
                                    />
                                    <ReadOnlyField
                                        title={t('DoctorProfile.Location_code')}
                                        value={benefit.location}
                                    />
                                </View>
                            }
                        />
                    ))
                ) : undefined
            }

        </View>
    )

}

const styleSheet = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        padding: 8
    },
    title: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1
    },
    action: {
        alignSelf: 'flex-end',
        paddingRight: 16
    },
    nextAction: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingLeft: 10,
        paddingRight: 10,
    },
    benefitContainer: {
        padding: 16,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        paddingTop: 0
    },
    grey: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)'
    },
    white: {
        backgroundColor: 'white'
    }
})


export default BenefitItem;