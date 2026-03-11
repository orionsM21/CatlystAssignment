import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ADMIN_MENU = [
  {
    title: 'Administration',
    data: [
      // { title: 'User Management', icon: 'people-outline', route: 'UserManagement' },
      { title: 'User Master', icon: 'person-outline', route: 'UserMaster' },
      { title: 'Role Master', icon: 'shield-checkmark-outline', route: 'RoleMaster' },
    ],
  },
  {
    title: 'Configuration',
    data: [
      { title: 'Configuration', icon: 'settings-outline', route: 'Configuration' },
    ],
  },
  {
    title: 'Master Setup',
    data: [
      { title: 'Lookup Master', icon: 'list-outline', route: 'LookupMaster' },
      { title: 'Geography Master', icon: 'map-outline', route: 'GeographyMaster' },
      { title: 'Bank Branch Master', icon: 'business-outline', route: 'BankBranchMaster' },
      { title: 'Document Master', icon: 'document-text-outline', route: 'DocumentMaster' },
      { title: 'Sourcing Branch', icon: 'git-branch-outline', route: 'SourcingBranch' },
    ],
  },
];

export default function AdminDashboard({ navigation }) {
  const renderCard = item => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route)}
    >
      <Icon name={item.icon} size={26} color="#2563EB" />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderRow = ({ item, index, section }) => {
    if (index % 2 !== 0) return null;

    const rowItems = section.data.slice(index, index + 2);

    return (
      <View style={styles.row}>
        {rowItems.map(menu => (
          <TouchableOpacity
            key={menu.route}   // 🔥 FIX
            style={styles.card}
            onPress={() => navigation.navigate(menu.route)}
          >
            <Icon name={menu.icon} size={26} color="#2563EB" />
            <Text style={styles.cardText}>{menu.title}</Text>
          </TouchableOpacity>
        ))}

        {rowItems.length === 1 && <View style={styles.cardPlaceholder} />}
      </View>
    );
  };


  return (
    <SectionList
      sections={ADMIN_MENU}
      keyExtractor={item => item.title}
      renderItem={renderRow}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
      contentContainerStyle={styles.container}
      stickySectionHeadersEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
    marginTop: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },

  cardPlaceholder: {
    width: '48%',
  },

  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
});
