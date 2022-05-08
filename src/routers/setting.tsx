import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingPage from '../pages/setting';
import ProfilePage from '../pages/profile';
import PersonalProfilePage from '../pages/peronsalProfile';
import ClinicProfilePage from '../pages/clinicProfile';
import DoctorProfileListPage from '../pages/doctorProfileList';
import DoctorProfilePage from '../pages/doctorProfile';
import AboutUsPage from '../pages/aboutUs';
import SettingDisplayPage from '../pages/settingDisplay';
import ChangePassword from '../pages/changePassword';

const Stack = createStackNavigator();

const SettingNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='SettingMain'
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
                name='SettingMain'
                component={SettingPage}
            />
            <Stack.Screen
                name='Profile'
                component={ProfilePage}
            />
            <Stack.Screen
                name='PersonalProfile'
                component={PersonalProfilePage}
            />
            <Stack.Screen
                name='ClinicProfile'
                component={ClinicProfilePage}
            />
            <Stack.Screen
                name='DoctorProfileList'
                component={DoctorProfileListPage}
            />
            <Stack.Screen
                name='DoctorProfile'
                component={DoctorProfilePage}
            />
            <Stack.Screen
                name='ChangePassword'
                component={ChangePassword}
            />

            <Stack.Screen
                name='AboutUs'
                component={AboutUsPage}
            />


            <Stack.Screen
                name='SettingDisplay'
                component={SettingDisplayPage}
            />
        </Stack.Navigator>
    )
}

export default SettingNavigator;