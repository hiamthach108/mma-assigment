import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import MyScrollView from '@/components/MyScrollView';

const DetailPage = () => {
  const { id } = useLocalSearchParams();

  console.log('id', id);

  return (
    <MyScrollView>
      <Text>DetailPage {id}</Text>
    </MyScrollView>
  );
};

export default DetailPage;
