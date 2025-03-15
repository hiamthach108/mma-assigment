import ArtToolCard from '@/components/ArtToolCard';
import LoadingScreen from '@/components/LoadingScreen';
import MyScrollView from '@/components/MyScrollView';
import { ThemedText } from '@/components/ThemedText';
import artToolApi from '@/config/api/artToolApi';
import { BACKGROUND_COLOR, PRIMARY_COLOR } from '@/constants/Colors';
import { ArtTool } from '@/types/artTool';
import { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [data, setData] = useState<ArtTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const artTools = await artToolApi.getArtToolList();
      setData(artTools);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artTools:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Add this to your HomeScreen component right after the state declarations
  const [selectedBrand, setSelectedBrand] = useState('All');

  // Add this function to your HomeScreen component
  const filterByBrand = (brand: string) => {
    setSelectedBrand(brand);
  };

  // Modify your filteredData useMemo to include brand filtering
  const filteredData = useMemo(() => {
    // First filter by search query
    let filtered = data;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = data.filter(
        item =>
          item.artName.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    // Then filter by selected brand (if not 'All')
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(item => item.brand === selectedBrand);
    }

    return filtered;
  }, [data, searchQuery, selectedBrand]);

  // Extract unique brands from data
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(data.map(item => item.brand))];
    return ['All', ...uniqueBrands];
  }, [data]);

  const renderItem = ({ item }: { item: ArtTool }) => (
    <View style={styles.cardContainer} key={item.id}>
      <ArtToolCard item={item} />
    </View>
  );

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <MyScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search art tools..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Brand filter bar */}
        <View style={styles.brandFilterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandScrollContent}
          >
            {brands.map(brand => (
              <Pressable
                key={brand}
                style={[
                  styles.brandFilter,
                  selectedBrand === brand && styles.brandFilterSelected,
                ]}
                onPress={() => filterByBrand(brand)}
              >
                <Text
                  style={[
                    styles.brandFilterText,
                    selectedBrand === brand && styles.brandFilterTextSelected,
                  ]}
                >
                  {brand}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.emptyResultContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <ThemedText style={styles.emptyResultText}>
              No art tools found matching "{searchQuery}".
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            ListHeaderComponent={
              searchQuery.length > 0 ? (
                <ThemedText style={styles.resultCount}>
                  Found {filteredData.length}{' '}
                  {filteredData.length === 1 ? 'result' : 'results'}
                </ThemedText>
              ) : null
            }
          />
        )}
      </MyScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: 12,
  },
  searchContainer: {
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  resultCount: {
    marginBottom: 10,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  emptyResultContainer: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyResultText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  // Add to your existing styles
  brandFilterContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  brandScrollContent: {
    paddingRight: 16,
  },
  brandFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  brandFilterSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  brandFilterText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  brandFilterTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
});
