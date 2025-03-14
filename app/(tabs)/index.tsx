import ArtToolCard from '@/components/ArtToolCard';
import LoadingScreen from '@/components/LoadingScreen';
import MyScrollView from '@/components/MyScrollView';
import { ThemedText } from '@/components/ThemedText';
import artToolApi from '@/config/api/artToolApi';
import { BACKGROUND_COLOR } from '@/constants/Colors';
import { ArtTool } from '@/types/artTool';
import { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [data, setData] = useState<ArtTool[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const artTools = await artToolApi.getArtToolList();
      setData(artTools);
      setLoading(false);
      console.log('ArtTools:', artTools);
    } catch (error) {
      console.error('Error fetching artTools:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchData();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  console.log('Data:', data);

  const renderItem = ({ item }: { item: ArtTool }) => (
    <View style={styles.cardContainer} key={item.id}>
      <ArtToolCard item={item} />
    </View>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <MyScrollView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View>
            <Text>No art tools found. Try adjusting your filters.</Text>
          </View>
        }
      />
    </MyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
  },
});
