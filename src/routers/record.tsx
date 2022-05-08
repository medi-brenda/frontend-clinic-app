import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecordListPage from '../pages/recordList';
import RecordPage from '../pages/record';
import RecordDetailPage from '../pages/recordDetail';

const Stack = createStackNavigator();

const RecordNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName='RecordMain'
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
                name='RecordMain'
                component={RecordPage}
            />
            <Stack.Screen
                name='RecordList'
                component={RecordListPage}
            />
            <Stack.Screen
                name='RecordDetail'
                component={RecordDetailPage}
            />
        </Stack.Navigator>
    )
}

export default RecordNavigator;