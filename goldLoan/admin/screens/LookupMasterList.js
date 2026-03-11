import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View, Switch,
  TouchableOpacity,
  TextInput, Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';
import EditLookupForm from '../components/EditLookupForm';
import CreateLookupBlock from '../components/CreateLookupBlock';
import createApiClient from '../../common/hooks/apiClient';



const ConfigRow = memo(({ item, onEdit }) => {
  return (
    <View style={styles.row}>
      {/* <View>
        <Text style={styles.rowText}>{item.name}</Text>
        <Text style={styles.subText}>{item.code}</Text>
      </View> */}
      <View>
        <Text style={styles.rowText}>{item.type}</Text>
        {/* <Text style={styles.subText}>Tap to view values</Text> */}
        <Text style={styles.subText}>{item.code}</Text>
      </View>

      <View style={styles.rowRight}>
        <Text style={[styles.status, item.active && styles.active]}>
          {/* {item.active ? 'Active' : 'Inactive'} */}
        </Text>

        <TouchableOpacity onPress={() => onEdit(item)}>
          <Icon name="create-outline" size={18} color="#2563EB" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const LookupMasterList = () => {
  const api = createApiClient('gold');

  const [list, setList] = useState([]);
  const [listModal, setListModal] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createList, setCreateList] = useState([]);

  console.log(listModal, 'listModallistModal')
  const getAllLookupMaster = async () => {
    try {
      const res = await api.get('getAllLookupMaster');
      const content = res?.data?.data?.content ?? [];
      const uniqueTypes = Array.from(
        new Map(
          content.map(item => [
            item.lookupType,

            {
              type: item.lookupType,
              id: item.lookupId,
              code: item.lookupCode
            }
          ])
        ).values()
      );

      setList(uniqueTypes);
    } catch (error) {
      console.log('Failed to fetch lookup master:', error.message);
    }
  };



  useEffect(() => {
    getAllLookupMaster();
  }, []);



  const openEdit = async (item) => {
    setEditingItem(item);

    try {
      const res = await api.get(
        `getLookupMasterByLookupType?lookupType=${item.type}`
      );

      const values = res?.data?.data ?? [];

      setListModal(
        values.map(v => ({
          id: v.lookupId,
          name: v.lookupName,
          code: v.lookupCode,
          active: v.active,
          type: v.lookupType,
        }))
      );

      setModalVisible(true);
    } catch (error) {
      console.log(error.message, 'Failed TO call LookUpType')
    }
  };

  const renderItem = useCallback(
    ({ item }) => <ConfigRow item={item} onEdit={openEdit} />,
    [openEdit]
  );

  const ItemSeparator = useCallback(
    () => <View style={{ height: 10 }} />,
    []
  );



  const handleModalRowChange = useCallback((id, changes) => {
    setListModal(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  }, []);


  const handleAddRow = () => {
    setListModal(prev => [
      ...prev,
      {
        id: "",   // 🔑 temporary unique key for RN
        lookupId: "",              // 👈 backend expects empty string
        name: "",
        code: "",
        active: true,
        type: editingItem.type,
        isNew: true,               // optional (useful later)
      },
    ]);
  };


  const handleSubmitAll = async () => {
    const payload = listModal.map(item => ({
      lookupId: item.id || "",
      lookupCode: item.code.trim(),
      lookupName: item.name.trim(),
      lookupType: item.type,
      active: item.active,
    }));

    try {
      await api.post('createLookupMaster', payload);
      setModalVisible(false);
      getAllLookupMaster();
    } catch (err) {
      console.log('Save failed', err);
    }
  };


  const handleDelete = async (item) => {
    // setList(prev => prev.filter(i => i.id !== item.id));
    // setEditVisible(false);
    console.log(item, 'deletebyID')
    try {
      const res = await api.delete(`deleteLookupByLookupId/${item?.id}`)
      if (res.data.msgKey === "Success") {
        setModalVisible(false);
        getAllLookupMaster();
      }

    } catch (error) {
      console.log(error.message, 'deleteLookupByLookupId')
    }
  };

  const handleRemoveCreateBlock = (id) => {
    setCreateList(prev => {
      if (prev.length <= 1) return prev; // 🛡 safety
      return prev.filter(item => item.id !== id);
    });
  };

  const openCreateModal = () => {
    setCreateList([
      {
        id: `new-${Date.now()}`,
        lookupType: '',
        lookupName: '',
        lookupCode: '',
        active: true,
      },
    ]);
    setCreateModalVisible(true);
  }
  return (

    <View style={{ flex: 1 }}>

      <TouchableOpacity style={styles.createBtn} onPress={openCreateModal}>
        <Icon name="add" size={18} color="#fff" />
        <Text style={styles.createText}>CREATE</Text>
      </TouchableOpacity>

      <FlatList
        data={list}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        ListEmptyComponent={
          <Text style={styles.empty}>No records found</Text>
        }
      />
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              Lookup Type : {editingItem?.type}
            </Text>

            <FlatList
              data={listModal}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <EditLookupForm
                  item={item}
                  onChange={handleModalRowChange}
                  onDelete={handleDelete}
                />
              )}
            />

            {/* FOOTER */}
            <View style={styles.footerRow}>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleAddRow}
              >
                <Icon name="add" size={18} color="#2563EB" />
                <Text style={styles.addText}>ADD</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text>CLOSE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSubmitAll}
                >
                  <Text style={styles.saveText}>SAVE</Text>
                </TouchableOpacity>
              </View>

            </View>


          </View>
        </View>
      </Modal>

      <Modal visible={createModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>Create Lookup Master</Text>

            <FlatList
              data={createList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CreateLookupBlock
                  item={item}
                  onChange={(id, changes) => {
                    setCreateList(prev =>
                      prev.map(i =>
                        i.id === id ? { ...i, ...changes } : i
                      )
                    );
                  }}
                  onRemove={handleRemoveCreateBlock}
                  canRemove={createList.length > 1}
                />
              )}
            />


            {/* FOOTER */}
            <View style={styles.footerRow}>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() =>
                  setCreateList(prev => [
                    ...prev,
                    {
                      id: `new-${Date.now()}`,
                      lookupType: '',
                      lookupName: '',
                      lookupCode: '',
                      active: true,
                    },
                  ])
                }
              >
                <Icon name="add" size={18} color="#2563EB" />
                <Text style={styles.addText}>ADD</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setCreateModalVisible(false)}
                >
                  <Text>CLOSE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={async () => {
                    const payload = createList.map(item => ({
                      lookupId: '',
                      lookupType: item.lookupType.trim(),
                      lookupName: item.lookupName.trim(),
                      lookupCode: item.lookupCode.trim(),
                      active: item.active,
                    }));

                    await api.post('createLookupMaster', payload);
                    setCreateModalVisible(false);
                    getAllLookupMaster();
                  }}
                >
                  <Text style={styles.saveText}>SAVE</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
      </Modal>


    </View>

  );
};

export default LookupMasterList;

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  row: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
  },
  rowRight: { alignItems: 'flex-end' },
  rowText: { fontWeight: '700' },
  subText: { color: '#64748B', marginTop: 4 },
  status: { fontWeight: '700', color: '#DC2626', marginBottom: 6 },
  active: { color: '#16A34A' },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748B',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginBottom: 12,
    elevation: 3,          // Android
    shadowColor: '#000',   // iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  createText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 14,
  },


  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  disabled: {
    backgroundColor: '#E5E7EB',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },

  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  removeText: {
    color: '#DC2626',
    marginLeft: 6,
    fontWeight: '600',
  },

  modalContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    maxHeight: '90%',
    padding: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },

  addText: {
    color: '#2563EB',
    fontWeight: '700',
    marginLeft: 4,
  },

  closeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },

  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2563EB',
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
  },

});
