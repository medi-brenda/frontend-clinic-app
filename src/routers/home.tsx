import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../pages/home';
import NewsListPage from '../pages/newsList';
import NewsDetailPage from '../pages/news';
import PromotionListPage from '../pages/promotionList';
import CooperatorsPage from '../pages/cooperators';
import PromotionPage from '../pages/promotion';
import ReportPage from '../pages/report';
import ResourceCenterPage from '../pages/resourceCenter';
import ResourceCenterDetailPage from '../pages/resourceCenterDetail';
import More from '../pages/more';

const Stack = createStackNavigator();

const HomeNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='HomeMain'
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
                name='HomeMain'
                component={HomePage}
            />
            <Stack.Screen
                name='NewsList'
                component={NewsListPage}
            />
            <Stack.Screen
                name='NewsDetail'
                component={NewsDetailPage}
            />
            <Stack.Screen
                name='Cooperators'
                component={CooperatorsPage}
            />
            <Stack.Screen
                name='PromotionDetail'
                component={PromotionPage}
            />
            <Stack.Screen
                name='Report'
                component={ReportPage}
            />
            <Stack.Screen
                name='ResourceCenter'
                component={ResourceCenterPage}
            />
            <Stack.Screen
                name='ResourceCenterDetail'
                component={ResourceCenterDetailPage}
            />
            <Stack.Screen
                name='More'
                component={More}
            />
        </Stack.Navigator>
    )
}

export default HomeNavigator;