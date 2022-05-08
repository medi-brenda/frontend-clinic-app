import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SelectBenefitPage from '../pages/selectBenefits';
import SelectInsurerPage from '../pages/selectInsurers';
import SelectDoctorPage from '../pages/selectDoctors';
import ModifyPage from '../pages/modify';
import SelectMethodPage from '../pages/selectMethod';
import QrScannerPage from '../pages/qrScanner';
import PatientInfoPage from '../pages/patientInfo';
import SelectDiagnosisPage from '../pages/selectDiagnosis';
import SelectExtraMedPage from '../pages/selectExtraMed';
import ConfirmPayPage from '../pages/confirmPay';
import SelectPhysicalCardPage from '../pages/selectPhysicalCard';
import PatientDetailPage from '../pages/patientDetail';
import PaymentInfoPage from '../pages/paymentInfo';
import TransactionSuccessPage from '../pages/transactionSuccess';
import SelectPendingListPage from "../pages/selectPendingList";

const Stack = createStackNavigator();

const ModifyNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='ModifyMain'
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
                name='ModifyMain'
                component={ModifyPage}
            />
            <Stack.Screen
                name='ModifyPendingList'
                component={SelectPendingListPage}
            />
            <Stack.Screen
                name='ModifyInsurer'
                component={SelectInsurerPage}
            />
            <Stack.Screen
                name='ModifyBenefit'
                component={SelectBenefitPage}
            />
            <Stack.Screen
                name='ModifyDoctor'
                component={SelectDoctorPage}
            />
            <Stack.Screen
                name='ModifyMethod'
                component={SelectMethodPage}
            />
            <Stack.Screen
                name='ModifyQrScan'
                component={QrScannerPage}
            />
            <Stack.Screen
                name='ModifyPhysicalCard'
                component={SelectPhysicalCardPage}
            />
            <Stack.Screen
                name='ModifyUserDetail'
                component={PatientInfoPage}
            />
            <Stack.Screen
                name='SelectDiagnosis'
                component={SelectDiagnosisPage}
            />
            <Stack.Screen
                name='SelectExtraMed'
                component={SelectExtraMedPage}
            />
            <Stack.Screen
                name='ConfirmPay'
                component={ConfirmPayPage}
            />
            <Stack.Screen
                name='PatientDetail'
                component={PatientDetailPage}
            />
            <Stack.Screen
                name='PaymentInfo'
                component={PaymentInfoPage}
            />
            <Stack.Screen
                name='TransactionSuccess'
                component={TransactionSuccessPage}
            />
        </Stack.Navigator>
    )
}

export default ModifyNavigator;
