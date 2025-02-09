import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useRestaurantStore} from '../../zustand/restaurant';
import {Colors, TextStyles} from '../constants';
import {useUserStore} from '../../zustand/user';
import {debounce} from 'lodash';

//   return (...args) => {
//     clearTimeout(timeoutId);

//     timeoutId = setTimeout(() => {
//       func.apply(this, args);
//     }, delay);
//   };
// };
const Home = props => {
  const {menuItems, getMenuItems} = useRestaurantStore();
  const user = useUserStore(state => state.user);
  const categories = useRestaurantStore(state => state.categories);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenu, setFilteredMenu] = useState(menuItems);
  // Toggle category selection (Multi-selection enabled)
  const toggleCategory = category => {
    const old = selectedCategories.slice();
    const newCat = old.includes(category)
      ? old.filter(c => c !== category)
      : [...old, category];
    filterMenuCategories(newCat);
    setSelectedCategories(newCat);
  };

  const filterMenuText = text => {
    const _filteredMenu = menuItems.filter(item => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(item.category);
      const matchesSearch = item.name
        .toLowerCase()
        .includes(text.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredMenu(_filteredMenu);
  };
  const filterMenuCategories = _selectedCategories => {
    const _filteredMenu = menuItems.filter(item => {
      const matchesCategory =
        _selectedCategories.length === 0 ||
        _selectedCategories.includes(item.category);
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredMenu(_filteredMenu);
  };
  const debouncedSearch = debounce(filterMenuText, 200);
  const handleSearch = text => {
    setSearchQuery(text);
    debouncedSearch(text);
  };
  // Filter menu based on selected categories and search query

  const RenderItem = ({item, index}) => {
    return (
      <View style={styles.menuItem}>
        <View style={styles.menuTextContainer}>
          <Text style={TextStyles.cardTitle}>{item.name}</Text>
          <Text
            style={[
              TextStyles.paragraphText,
              {paddingVertical: 10, paddingRight: 15},
            ]}>
            {item.description}
          </Text>
          <Text style={TextStyles.highlightText}>{`$${item.price}`}</Text>
        </View>
        <Image
          source={{uri: item.imageUrl}}
          style={styles.menuImage}
          resizeMode="cover"
          defaultSource={require('../../assets/images/Logo.png')}
        />
      </View>
    );
  };

  useEffect(() => {
    if (menuItems.length === 0) {
      getMenuItems();
    }
  }, [menuItems]);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/Logo.png')}
          style={styles.logo}
        />
        <Pressable
          onPress={() => {
            props.navigation.navigate('ProfileScreen');
          }}>
          <Avatar.Image size={40} source={{uri: user?.avatar ?? null}} />
        </Pressable>
      </View>

      {/* Restaurant Info */}
      <View style={styles.infoSection}>
        <View style={[styles.infoTextContainer, {paddingRight: 15}]}>
          <Text
            style={[
              TextStyles.subTitle,
              {fontSize: 50, color: Colors.primary2},
            ]}>
            Little Lemon
          </Text>
          <Text
            style={[
              TextStyles.subTitle,
              {paddingVertical: 10, color: Colors.secondary3},
            ]}>
            Chicago
          </Text>
          <Text style={[TextStyles.lead, {color: Colors.secondary3}]}>
            We are a family-owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image
          source={require('../../assets/images/Hero_image.png')}
          style={styles.restaurantImage}
        />
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchText}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a dish..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
      </TouchableOpacity>
      {/* Search Input */}

      {/* Category Filters using FlatList */}
      <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategories.includes(item) && styles.activeCategory,
            ]}
            onPress={() => toggleCategory(item)}>
            <Text
              style={[
                TextStyles.sectionCategories,
                {textTransform: 'capitalize'},
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Menu List Using FlatList */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item, index) => item.name}
        renderItem={({item, index}) => {
          return <RenderItem item={item} index={index} />;
        }}
        scrollEnabled={false} // Prevents nested scrolling inside ScrollView
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 16},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {width: 120, height: 30, resizeMode: 'contain'},
  infoSection: {
    backgroundColor: '#3E5F50',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  title: {fontSize: 26, fontWeight: 'bold', color: '#FFC107'},
  subtitle: {fontSize: 18, fontWeight: '600', color: '#fff'},
  description: {fontSize: 14, color: '#fff', marginTop: 8},

  searchText: {fontSize: 18},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', marginTop: 20},
  categoryList: {flexDirection: 'row', paddingVertical: 10},
  categoryButton: {
    backgroundColor: Colors.secondary3,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginRight: 10,
  },
  activeCategory: {backgroundColor: '#C4C4C4'},
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  menuTextContainer: {flex: 1},

  menuImage: {width: 80, height: 80, borderRadius: 10, marginLeft: 10},
  infoSection: {
    backgroundColor: '#3E5F50',
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
    flexDirection: 'row', // Align text & image side-by-side
    alignItems: 'center', // Center content vertically
    justifyContent: 'space-between', // Push text & image to sides
  },
  infoTextContainer: {
    flex: 1, // Makes text container take available space
    paddingRight: 10, // Adds spacing between text & image
  },
  searchContainer: {
    marginTop: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    //alignSelf: 'center',
    backgroundColor: '#EAEAEA',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {height: 40, fontSize: 16, color: '#333', paddingHorizontal: 10},
  restaurantImage: {width: 100, height: 130, borderRadius: 10}, // Ensures proper sizing
});

export default Home;
