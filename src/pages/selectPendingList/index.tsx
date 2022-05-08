import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet } from 'react-native';
import { Container, Text, View } from 'native-base';
import { useStores } from '../../stores';
import {getAllDoctors, getBenefits, getDoctors, getPendingListItems} from '../../actions/config';
import TitleBar from '../../components/titleBar';
import ErrorPage from '../error';
import Loading from '../loading';
import RenderPendingList from './renderList';
import {observer} from "mobx-react";
import PhoneCall from "../../components/phoneCall";

const SelectPendingListPage = observer(() => {
  const {
    t,
    i18n,
  } = useTranslation();
  const stores = useStores();
  const navigation = useNavigation();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { pendingItems } = stores.dataStore;

  useEffect(() => {
    getData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const errorMsg = await getPendingListItems({
      stores,
      i18n,
    });
    if (errorMsg) {
      Alert.alert(
        t('Common.Error'),
        errorMsg,
        [
          {
            text: t('Common.Confirm'),
            onPress: () => {
              setRefreshing(false);
            },
          },
        ],
      );
    } else {
      setRefreshing(false);
    }
  };

  const getData = async () => {
    setLoading(true);
    const pendingListErrorMsg = await getPendingListItems({
      stores,
      i18n,
    });

    const getBenefitsErrorMsg= await getBenefits({stores});
    const getDoctorListErrorMsg= await getAllDoctors({ stores});


    const errorMsg=pendingListErrorMsg||getDoctorListErrorMsg||getBenefitsErrorMsg;
    setLoading(false);
    if (errorMsg) {
      setError(errorMsg);
    }
  };

  return (
    <Container>
      <TitleBar
        title={t('Modify.SelectPendingItem')}
        onBack={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>
          {
            t('Modify.PendingItemHeader')
          }
        </Text>
      </View>




      {
        error
          ? <ErrorPage title={error} onRetry={getData} />
          : loading ? <Loading />
            : (
              <React.Fragment>
                <RenderPendingList
                  pendingListItems={pendingItems}
                  onRefresh={onRefresh}
                  refreshing={refreshing}
                />

                <PhoneCall/>
              </React.Fragment>
            )
      }

    </Container>
  );
});

const styles=StyleSheet.create({
  header:{
    height:50,
    alignItems:'center',
    justifyContent:'center'
  },
  headerText:{
    fontWeight:'700'
  }
})
export default SelectPendingListPage;
