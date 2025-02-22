import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import * as signalR from '@microsoft/signalr';
import { useLayoutEffect } from 'react';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiIwOGU3Y2Q4ZC1hMmQ0LTQxYjItOTU2Yi1hNWEzNmVjYmE2ZTciLCJzdGF0dXMiOiJBY3RpdmUiLCJlbWFpbCI6InN0cmluZyIsIm5iZiI6MTczODI1MDI4MCwiZXhwIjoxNzQwODQyMjgwLCJpYXQiOjE3MzgyNTAyODAsImlzcyI6Ijk4M2Y2OTk2LTlkM2EtNDczYi1iY2M5LWNmOWZiMjY4MmEwNSJ9.caxPHdqUiNPUISPZQQL-0Y99qIbJN9a-6F-92baSiK0';
const CONVERSATION = '';

const firebaseConfig = {
  apiKey: 'AIzaSyAmVYKxXFt81kfJf-L5Pb9I4v8ahrK3_cU',
  authDomain: 'vn-history-chat.firebaseapp.com',
  projectId: 'vn-history-chat',
  storageBucket: 'vn-history-chat.firebasestorage.app',
  messagingSenderId: '1022887170143',
  appId: '1:1022887170143:web:1e2b867907f2f83cc58bea',
  measurementId: 'G-5SHB5EKF7T',
};

const provider = new GoogleAuthProvider();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const buildConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7187/chat', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => TOKEN,
    })
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();
};

export default function HomeScreen() {
  useLayoutEffect(() => {
    const connection = buildConnection();

    const startConnection = async () => {
      try {
        fetch('https://exe201-server-production.up.railway.app/api/v1/ping');

        await connection.start();
        console.log('Connection started!');

        connection.onclose(() => {
          console.log('Connection closed');
          // Retry connection after a delay
          setTimeout(startConnection, 1000);
        });

        connection.on('ReceiveMessage', (user, message) => {
          console.log('ReceiveMessage', user, message);
        });
      } catch (err) {
        console.error('Connection failed: ', err);
        // Retry connection after a delay
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    // Cleanup on component unmount
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{' '}
          to see changes. Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{' '}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{' '}
          directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>

        <ThemedText
          onPress={() => {
            signInWithPopup(auth, provider)
              .then(result => {
                console.log(result);
              })
              .catch(error => {
                console.log(error);
              });
          }}
        >
          Go firebase
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
