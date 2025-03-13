import ArtToolCard from '@/components/ArtToolCard';
import MyScrollView from '@/components/MyScrollView';
import { ThemedText } from '@/components/ThemedText';
import artToolApi from '@/config/api/artToolApi';
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

  return (
    <MyScrollView>
      {loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
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
      )}
    </MyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
