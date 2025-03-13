import React, { PropsWithChildren } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';

const MyScrollView = ({ children, ...props }: PropsWithChildren<any>) => {
  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        {...props}
      >
        {children}
      </Animated.ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default MyScrollView;
