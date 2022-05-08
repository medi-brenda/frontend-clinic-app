import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SelectBenefitPage from '../pages/selectBenefits';
import SelectInsurerPage from '../pages/selectInsurers';
import SelectDoctorPage from '../pages/selectDoctors';
import VerifyPage from '../pages/verify';
import SelectMethodPage from '../pages/selectMethod';
import QrScannerPage from '../pages/qrScanner';
import PatientInfoPage from '../pages/patientInfo';
import SelectPhysicalCardPage from '../pages/selectPhysicalCard';

const Stack = createStackNavigator();

const VerifyNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='VerifyMain'
            headerMode='none'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#ff8566",
                    shadowOpacity: 0,
                    elevation: 0,
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    textAlign: "center",
                    alignSelf: "center",
                    fontSize: 18,
                    color: "#fff",
                    fontWeight: "bold",
                },
            }}
        >
            <Stack.Screen
                name='VerifyMain'
                component={VerifyPage}
            />
            <Stack.Screen
                name='VerifyInsurer'
                component={SelectInsurerPage}
            />
            <Stack.Screen
                name='VerifyBenefit'
                component={SelectBenefitPage}
            />
            <Stack.Screen
                name='VerifyDoctor'
                component={SelectDoctorPage}
            />
            <Stack.Screen
                name='VerifyMethod'
                component={SelectMethodPage}
            />
            <Stack.Screen
                name='VerifyQrScan'
                component={QrScannerPage}
            />
            <Stack.Screen
                name='VerifyPhysicalCard'
                component={SelectPhysicalCardPage}
            />
            <Stack.Screen
                name='VerifyUserDetail'
                component={PatientInfoPage}
            />
        </Stack.Navigator>
    )
}

export default VerifyNavigator;