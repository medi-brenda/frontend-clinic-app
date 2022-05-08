import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../pages/splash';
import RegisterPage from '../pages/register';
import RegisterStep2 from '../pages/register/step2';
import RegisterStep3 from '../pages/register/step3';
import ServiceHour from '../pages/register/serviceHour';
import DoctorDetail from '../pages/register/doctorDetail';
import RegisterStep4 from '../pages/register/step4';
import LoginPage from '../pages/login';
import ForgetPasswordPage from '../pages/login/forgetPassword';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Start'
                headerMode='none'
                screenOptions={{
                    headerStyle: {
                        backgroundColor: "#ffffff",
                        borderWidth: 0,
                        borderBottomWidth: 0,
                    },
                    headerTintColor: "#f39c12",
                    headerTitleStyle: {
                        textAlign: "center",
                        alignSelf: "center",
                        fontSize: 20,
                        color: "#333333",
                        fontWeight: "bold",
                    },
                }}
            >
                <Stack.Screen
                    name='Start'
                    component={SplashScreen}
                />
                <Stack.Screen
                    name="RegisterStepOne"
                    component={RegisterPage}
                />
                <Stack.Screen
                    name="RegisterStepTwo"
                    component={RegisterStep2}
                />
                <Stack.Screen
                    name="ServiceHour"
                    component={ServiceHour}
                />
                <Stack.Screen
                    name="RegisterStepThree"
                    component={RegisterStep3}
                />
                <Stack.Screen
                    name="DoctorDetail"
                    component={DoctorDetail}
                />
                <Stack.Screen
                    name="RegisterStepFour"
                    component={RegisterStep4}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginPage}
                />
                <Stack.Screen
                    name="ForgetPassword"
                    component={ForgetPasswordPage}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AuthNavigator;