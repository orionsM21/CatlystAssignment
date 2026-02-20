import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../theme/Color";

const TodoComponent = React.memo(
    ({ id, title, completed, createdAt, updatedAt, onDelete, onToggle, cardClick, bgColor }) => {

        const formatDate = (timestamp) => {
            if (!timestamp) return "-";
            const date = new Date(timestamp);
            return date.toLocaleString();
        };

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={cardClick}
                style={[styles.card, { backgroundColor: bgColor }]}
            >
                {/* LEFT SECTION */}
                <View style={{ flex: 1 }}>
                    <Text style={[styles.title, completed && styles.done]}>
                        {title}
                    </Text>

                    <View style={styles.metaContainer}>
                        <Text style={styles.metaText}>ID: {id}</Text>
                        <Text style={styles.metaText}>
                            Created: {formatDate(createdAt)}
                        </Text>
                        <Text style={styles.metaText}>
                            Updated: {formatDate(updatedAt)}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={onToggle}>
                    <Text style={{ fontSize: 18 }}>
                        {completed ? "✅" : "⬜"}
                    </Text>
                </TouchableOpacity>
                {/* RIGHT SECTION */}
                <TouchableOpacity onPress={onDelete} style={styles.delete}>
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }
);

export default TodoComponent;


const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginBottom: 14,
        borderRadius: 14,
        backgroundColor: colors.card,
        flexDirection: "row",
        alignItems: "center",

        elevation: 4,

        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },

    title: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.white,
    },

    done: {
        color: colors.text,
    },

    metaContainer: {
        marginTop: 6,
    },

    metaText: {
        fontSize: 13,
        color: colors.white,
    },

    delete: {
        backgroundColor: colors.deleteBg,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },

    deleteText: {
        color: colors.deleteText,
        fontWeight: "600",
        fontSize: 13,
    },
});

