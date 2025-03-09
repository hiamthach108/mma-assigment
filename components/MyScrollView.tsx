import React, { PropsWithChildren } from 'react';
import { Animated } from 'react-native';
import { ThemedView } from './ThemedView';

const MyScrollView = ({ children }: PropsWithChildren) => {
  return (
    <ThemedView>
      <Animated.ScrollView>{children}</Animated.ScrollView>
    </ThemedView>
  );
};

export default MyScrollView;
