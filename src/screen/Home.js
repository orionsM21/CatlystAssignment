import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    TextInput,
    Modal,
    Text,
    Alert,
    Dimensions,
    TouchableOpacity,
    View,
    FlatList,
    TouchableWithoutFeedback
} from 'react-native';

import TodoComponent from '../component/TodoComponent';
import axios from 'axios';
import colors from '../theme/Color';

import { useDispatch, useSelector } from "react-redux";
import {
    setTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    setFilter,
    setSort,
    updateTodo
} from "../redux/reduxSlice";

import {
    selectFilteredTodos,
    selectCounters
} from "../redux/Selector";

const { width } = Dimensions.get('window');

const Home = () => {
    const dispatch = useDispatch();

    const Todos = useSelector(selectFilteredTodos);
    const counters = useSelector(selectCounters);

    const [refreshing, setRefreshing] = useState(false);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [editingTodo, setEditingTodo] = useState(null);
    const activeFilter = useSelector(state => state.todo.filter);
    const activeSort = useSelector(state => state.todo.sortBy);
    // ================= FETCH =================

    const fetchTodosFromApi = async () => {
        try {
            const res = await axios.get(
                "https://jsonplaceholder.typicode.com/todos?_limit=20"
            );

            const apiTodos = res.data.map(item => ({
                id: String(item.id),
                title: item.title,
                completed: item.completed,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }));

            dispatch(setTodos(apiTodos));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchTodosFromApi();
    }, []);

    // ================= ADD =================

    const handleSave = () => {
        if (!title.trim()) return;

        if (editingTodo) {
            dispatch(updateTodo({
                ...editingTodo,
                title: title.trim(),
                updatedAt: Date.now()
            }));
        } else {
            dispatch(addTodo({
                id: Date.now().toString(),
                title: title.trim(),
                completed: false,
                createdAt: Date.now(),
                updatedAt: Date.now()
            }));
        }

        setTitle("");
        setEditingTodo(null);
        setVisible(false);
    };
    const onCardPress = (item) => {
        setEditingTodo(item);
        setTitle(item.title);
        setVisible(true);
    };
    // ================= DELETE =================

    const confirmDelete = useCallback((id) => {
        Alert.alert("Delete Todo", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => dispatch(deleteTodo(id))
            }
        ]);
    }, []);

    // ================= RENDER =================

    const renderItem = ({ item }) => {
        const bg = item.completed ? colors.success : colors.danger;

        return (
            <TodoComponent
                {...item}
                bgColor={bg}
                onDelete={() => confirmDelete(item.id)}
                onToggle={() => dispatch(toggleTodo(item.id))}
                cardClick={() => onCardPress(item)}
            />
        );
    };

    return (
        <View style={styles.container}>

            <View style={styles.headerCard}>
                <Text style={styles.header}>Todo Manager</Text>
                <Text style={styles.count}>
                    Total {counters.total} · Done {counters.completed}
                </Text>
            </View>

            {/* FILTER */}
            <View style={styles.filterRow}>
                {["ALL", "ACTIVE", "DONE"].map(key => {
                    const isActive = activeFilter === key;

                    return (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.filterBtn,
                                isActive && styles.activeBtn
                            ]}
                            onPress={() => dispatch(setFilter(key))}
                        >
                            <Text style={isActive ? styles.activeText : styles.normalText}>
                                {key}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* SORT */}
            <View style={styles.row}>
                {["RECENT", "ID"].map(key => {
                    const isActive = activeSort === key;

                    return (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.sortBtn,
                                isActive && styles.activeBtn
                            ]}
                            onPress={() => dispatch(setSort(key))}
                        >
                            <Text style={isActive ? styles.activeText : styles.normalText}>
                                {key}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <FlatList
                data={Todos}
                keyExtractor={i => i.id}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={fetchTodosFromApi}
            />

            <TouchableOpacity style={styles.addBtn} onPress={() => setVisible(true)}>
                <Text style={{ color: "#fff" }}>Add Todo</Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent>
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TextInput
                                placeholder="Enter todo"
                                placeholderTextColor='#888'
                                value={title}
                                onChangeText={setTitle}
                                style={styles.input}
                            />

                            <TouchableOpacity style={styles.btn} onPress={handleSave}>
                                <Text style={styles.text}>
                                    {editingTodo ? "Update" : "Add"}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
    },

    header: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10,
        color: colors.text,
    },

    row: {
        flexDirection: "row",
        gap: 15,
        marginVertical: 10,
    },

    addBtn: {
        backgroundColor: colors.primary,
        padding: 12,
        alignItems: "center",
        marginTop: 10,
        borderRadius: 8,
    },

    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.overlay,
    },

    modalContent: {
        width: "85%",
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
        elevation: 6,
    },

    input: {
        borderWidth: 1,
        borderColor: colors.border,
        padding: 10,
        marginBottom: 20,
        borderRadius: 6,
        color: colors.text,
    },

    btn: {
        backgroundColor: colors.primary,
        padding: 12,
        alignItems: "center",
        borderRadius: 6,
    },

    text: {
        color: colors.white,
    },

    headerCard: {
        backgroundColor: colors.card,
        padding: 16,
        borderRadius: 14,
        marginBottom: 10,
        elevation: 4,
    },

    count: {
        color: colors.grey,
        marginTop: 4,
    },

    filterRow: {
        flexDirection: "row",
        marginVertical: 10,
    },

    filterBtn: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.filterBg,
        marginRight: 10,
    },

    filterActive: {
        backgroundColor: colors.primary,
    },

    filterText: {
        color: colors.text,
    },

    filterTextActive: {
        color: colors.white,
    },

    sortBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: colors.filterBg,
        marginRight: 10,
        width: width * 0.35,
        justifyContent: "center",
        alignItems: "center",
    },

    sortActive: {
        backgroundColor: colors.sortActive,
    },

    sortText: {
        color: colors.text,
    },
    activeBtn: {
        backgroundColor: "#000"
    },

    activeText: {
        color: "#fff",
        fontWeight: "600"
    },

    normalText: {
        color: "#000"
    }
});

