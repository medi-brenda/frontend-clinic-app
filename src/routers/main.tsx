import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingPage from '../pages/setting';
import { Alert, Image } from 'react-native';
import VerifyNavigator from './verify';
import ModifyNavigator from './modify';
import RecordNavigator from './record';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import HomeNavigator from './home';
import SettingNavigator from './setting';

type OnTabChange = {
    navigation: any,
    event: any,
    route: any,
    t: any
}

const Tab = createBottomTabNavigator();

const getSource = (route: string, focused: boolean) => {
    switch (route) {
        case 'Home':
            return focused ?
                require('../assets/images/tab_home_pre.png') :
                require('../assets/images/tab_home.png');
        case 'Verify':
            return focused ?
                require('../assets/images/tab_verfify_pre.png') :
                require('../assets/images/tab_verfify.png');
        case 'Modify':
            return focused ?
                require('../assets/images/Scan(Active).png') :
                require('../assets/images/Scan(Inactive).png');
        case 'Record':
            return focused ?
                require('../assets/images/tab_record_pre.png') :
                require('../assets/images/tab_record.png');
        default:
            return focused ?
                require('../assets/images/tab_more_pre.png') :
                require('../assets/images/tab_more.png');
    }
}

const listeners = ({ navigation, route, t }: any) => ({
    tabPress: (e: any) => {
        onTabChange({
            navigation,
            event: e,
            route,
            t
        })
    },
})

const onTabChange = ({ navigation, event, route, t }: OnTabChange) => {
    event.preventDefault();

    // if user press the same tab, do nothing
    const state = navigation.dangerouslyGetState();

    // ensure user cannot press back button
    const currentTab = _.get(_.last(state.history), 'key');

    // ensure go to the first page of the route
    const routeName = _.get(route, 'state.routeNames[0]', route.name);

    // avoid user leave verify and modify easily
    if (_.startsWith(currentTab, 'Verify') || _.startsWith(currentTab, 'Modify')) {
        // if index is not 0, means that user has input data
        const currentRoute = state.routes.find((route: any) => route.key === currentTab);
        if (_.get(currentRoute, 'state.index')) {
            return Alert.alert(
                t('Common.Warning'),
                t('Tab.LossData'),
                [
                    {
                        text: t('Common.Cancel')
                    },
                    {
                        text: t('Common.Confirm'),
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: route.name }]
                            })
                        }
                    }
                ]
            )
        }
    }

    // navigation.navigate(routeName);
    navigation.reset({
        index: 0,
        routes: [{ name: route.name }]
    })
}

const MainNavigator = () => {
    const { t } = useTranslation();
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <Image
                            style={{ resizeMode: 'cover', width: 28, height: 28 }}
                            source={getSource(route.name, focused)}
                        />
                    ),
                    tabBarOptions: {
                        activeTintColor: 'red',
                    }
                })}
            >
                <Tab.Screen
                    name='Home'
                    component={HomeNavigator}
                    listeners={({ navigation, route }) => listeners({ navigation, route, t })}
                    options={{ title: t('Tab.Home') }}
                />
                <Tab.Screen
                    name="Verify"
                    component={VerifyNavigator}
                    listeners={({ navigation, route }) => listeners({ navigation, route, t })}
                    options={{ title: t('Tab.Verify') }}
                />
                <Tab.Screen
                    name="Modify"
                    component={ModifyNavigator}
                    listeners={({ navigation, route }) => listeners({ navigation, route, t })}
                    options={{ title: t('Tab.Modify') }}
                />
                <Tab.Screen
                    name="Record"
                    component={RecordNavigator}
                    listeners={({ navigation, route }) => listeners({ navigation, route, t })}
                    options={{ title: t('Tab.Record') }}
                />
                <Tab.Screen
                    name='Settings'
                    component={SettingNavigator}
                    listeners={({ navigation, route }) => listeners({ navigation, route, t })}
                    options={{ title: t('Tab.Setting') }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default MainNavigator;
