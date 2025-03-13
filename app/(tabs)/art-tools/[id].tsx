import { View, Text } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const DetailPage = () => {
  const { id } = useLocalSearchParams();

  console.log('id', id);

  return (
    <View>
      <Text>DetailPage {id}</Text>
    </View>
  );
};

export default DetailPage;
