import ArtToolCard from '@/components/ArtToolCard';
import LoadingScreen from '@/components/LoadingScreen';
import { ThemedText } from '@/components/ThemedText';
import artToolApi from '@/config/api/artToolApi';
import { BACKGROUND_COLOR, PRIMARY_COLOR } from '@/constants/Colors';
import { ArtTool } from '@/types/artTool';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Custom useDebounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Separate SearchHeader component
function SearchHeader({
  searchQuery,
  debouncedSearchQuery,
  filteredDataLength,
  brands,
  selectedBrand,
  onClearSearch,
  onChangeText,
  onFilterByBrand,
  searchInputRef,
}: {
  searchQuery: string;
  debouncedSearchQuery: string;
  filteredDataLength: number;
  brands: string[];
  selectedBrand: string;
  onClearSearch: () => void;
  onChangeText: (text: string) => void;
  onFilterByBrand: (brand: string) => void;
  searchInputRef: React.RefObject<TextInput>;
}) {
  return (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search art tools..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={onChangeText}
            returnKeyType="default"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              console.log('onSubmitEditing triggered');
              searchInputRef.current?.focus();
            }}
            onFocus={() => console.log('TextInput focused')}
            onBlur={() => console.log('TextInput blurred')}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={onClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </Pressable>
          )}
        </View>
      </View>

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
              onPress={() => onFilterByBrand(brand)}
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

      {debouncedSearchQuery.length > 0 && (
        <ThemedText style={styles.resultCount}>
          Found {filteredDataLength}{' '}
          {filteredDataLength === 1 ? 'result' : 'results'}
        </ThemedText>
      )}
    </>
  );
}

export default function HomeScreen() {
  const [data, setData] = useState<ArtTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const searchInputRef = useRef<TextInput>(null);

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

  const filterByBrand = useCallback((brand: string) => {
    console.log('filterByBrand:', brand);
    setSelectedBrand(brand);
  }, []);

  const filteredData = useMemo(() => {
    console.log('filteredData recalculated');
    let filtered = data;
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      filtered = data.filter(
        item =>
          item.artName.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }
    if (selectedBrand !== 'All') {
      filtered = filtered.filter(item => item.brand === selectedBrand);
    }
    return filtered;
  }, [data, debouncedSearchQuery, selectedBrand]);

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(data.map(item => item.brand))];
    return ['All', ...uniqueBrands];
  }, [data]);

  const renderItem = useCallback(
    ({ item }: { item: ArtTool }) => (
      <View style={styles.cardContainer} key={item.id}>
        <ArtToolCard item={item} />
      </View>
    ),
    []
  );

  const clearSearch = useCallback(() => {
    console.log('clearSearch called');
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const handleChangeText = useCallback((text: string) => {
    console.log('handleChangeText:', text);
    setSearchQuery(text);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={{ flex: 1 }}
      >
        {filteredData.length === 0 ? (
          <View style={{ paddingHorizontal: 20 }}>
            <SearchHeader
              searchQuery={searchQuery}
              debouncedSearchQuery={debouncedSearchQuery}
              filteredDataLength={filteredData.length}
              brands={brands}
              selectedBrand={selectedBrand}
              onClearSearch={clearSearch}
              onChangeText={handleChangeText}
              onFilterByBrand={filterByBrand}
              searchInputRef={searchInputRef}
            />
            <View style={styles.emptyResultContainer}>
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <ThemedText style={styles.emptyResultText}>
                No art tools found matching "{debouncedSearchQuery}".
              </ThemedText>
            </View>
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
              <SearchHeader
                searchQuery={searchQuery}
                debouncedSearchQuery={debouncedSearchQuery}
                filteredDataLength={filteredData.length}
                brands={brands}
                selectedBrand={selectedBrand}
                onClearSearch={clearSearch}
                onChangeText={handleChangeText}
                onFilterByBrand={filterByBrand}
                searchInputRef={searchInputRef}
              />
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#888"
              />
            }
            removeClippedSubviews={false}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  searchContainer: {
    marginBottom: 16,
    marginTop: 12,
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
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '48%',
  },
  emptyResultContainer: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyResultText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  brandFilterContainer: {
    marginBottom: 16,
  },
  brandScrollContent: {
    paddingRight: 16,
  },
  brandFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
