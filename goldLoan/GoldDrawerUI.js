import React, { useContext, useMemo, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useNavigation, useNavigationState, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { DrawerContext } from "./DrawerContext";
import { useDispatch } from "react-redux";
import { fullLogout, sessionLogoutOnly } from "./config/logoutHelper";
import { InteractionManager } from "react-native";

const MenuItem = React.memo(({ label, icon, active, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.menuItem, active && styles.menuItemActive]}
        >
            <Icon name={icon} size={22} color={active ? "#1A1815" : "#D4AF37"} />
            <Text style={[styles.menuText, active && styles.menuTextActive]}>
                {label}
            </Text>
            {active && <View style={styles.activeDot} />}
        </TouchableOpacity>
    );
});

export default function GoldDrawerUI() {
    const navigation = useNavigation();
    //   const route = useRoute();
    const activeRoute = useNavigationState(state => {
        if (!state || !state.routes || typeof state.index !== "number") return null;
        return state.routes[state.index].name;
    });
    const dispatch = useDispatch();
    const { closeDrawer } = useContext(DrawerContext);

    const MENU = useMemo(
        () => [
            { label: "Dashboard", icon: "grid-outline", route: "Dashboard" },
            { label: "New Loan", icon: "cash-outline", route: "NewLoan" },
            { label: "Customers", icon: "people-outline", route: "Customers" },
            { label: "Profile", icon: "person-outline", route: "Profile" },
            { label: "Report", icon: "stats-chart-outline", route: "Report" },
            { label: "History", icon: "stats-chart-outline", route: "History" },
        ],
        []
    );

    const go = useCallback(
        screen => {
            closeDrawer();
            InteractionManager.runAfterInteractions(() => {
                navigation.navigate(screen);
            });
        },
        [navigation, closeDrawer]
    );

    const handleLogout = () => {
        Alert.alert("Logout", "Choose an option", [

            {
                text: "Logout",
                onPress: () => {
                    closeDrawer();
                    InteractionManager.runAfterInteractions(() => {
                        sessionLogoutOnly(dispatch, navigation);
                    });
                    navigation.navigate('Login')
                },
            },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    return (
        <LinearGradient colors={["#0F0E0C", "#1A1815"]} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <LinearGradient colors={["#D4AF37", "#B8962E"]} style={styles.avatar}>
                    <Text style={styles.avatarText}>G</Text>
                </LinearGradient>

                <Text style={styles.title}>Gold Loan</Text>
                <Text style={styles.subTitle}>Premium Lending</Text>
            </View>

            {/* Menu */}
            <View style={styles.menu}>
                {MENU.map(item => (
                    <MenuItem
                        key={item.route}
                        label={item.label}
                        icon={item.icon}
                        active={activeRoute === item.route}
                        onPress={() => go(item.route)}
                    />
                ))}
            </View>

            {/* Footer */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Icon name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 22,
    },

    header: {
        marginBottom: 28,
    },

    avatar: {
        height: 56,
        width: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },

    avatarText: {
        color: "#1A1815",
        fontSize: 22,
        fontWeight: "800",
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#F9FAF7",
    },

    subTitle: {
        fontSize: 13,
        color: "#C7B88A",
    },

    menu: {
        marginTop: 24,
    },

    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        marginBottom: 10,
        backgroundColor: "rgba(255,215,0,0.05)",
    },

    menuItemActive: {
        backgroundColor: "#D4AF37",
    },

    menuText: {
        marginLeft: 14,
        fontSize: 15,
        color: "#E5E7EB",
    },

    menuTextActive: {
        color: "#1A1815",
        fontWeight: "700",
    },

    activeDot: {
        marginLeft: "auto",
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: "#1A1815",
    },

    logoutBtn: {
        marginTop: "auto",
        backgroundColor: "#B91C1C",
        paddingVertical: 14,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    logoutText: {
        color: "#fff",
        marginLeft: 8,
        fontSize: 15,
        fontWeight: "600",
    },
});
// import React, { useContext, useCallback, memo } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     Alert,
//     Pressable,
//     InteractionManager,
// } from "react-native";

// import {
//     useNavigation,
//     useNavigationState,
// } from "@react-navigation/native";

// import Icon from "react-native-vector-icons/Ionicons";
// import LinearGradient from "react-native-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useDispatch } from "react-redux";

// import { DrawerContext } from "./DrawerContext";
// import { sessionLogoutOnly } from "./config/logoutHelper";



// /* ---------------- MENU CONSTANT ---------------- */

// const MENU = [
//     { label: "Dashboard", icon: "grid-outline", route: "Dashboard" },
//     { label: "New Loan", icon: "cash-outline", route: "NewLoan" },
//     { label: "Customers", icon: "people-outline", route: "Customers" },
//     { label: "Profile", icon: "person-outline", route: "Profile" },
//     { label: "Report", icon: "stats-chart-outline", route: "Report" },
//     { label: "History", icon: "time-outline", route: "History" },
// ];



// /* ---------------- MENU ITEM ---------------- */

// const MenuItem = memo(({ label, icon, active, onPress }) => {
//     return (
//         <Pressable
//             onPress={onPress}
//             style={({ pressed }) => [
//                 styles.menuItem,
//                 active && styles.menuItemActive,
//                 pressed && { opacity: 0.7 },
//             ]}
//         >
//             <Icon
//                 name={icon}
//                 size={22}
//                 color={active ? "#1A1815" : "#D4AF37"}
//             />

//             <Text
//                 style={[
//                     styles.menuText,
//                     active && styles.menuTextActive,
//                 ]}
//             >
//                 {label}
//             </Text>

//             {active && <View style={styles.activeDot} />}
//         </Pressable>
//     );
// });



// /* ---------------- DRAWER COMPONENT ---------------- */

// export default function GoldDrawerUI() {

//     const navigation = useNavigation();
//     const dispatch = useDispatch();
//     const insets = useSafeAreaInsets();
//     const { closeDrawer } = useContext(DrawerContext);



//     /* -------- ACTIVE ROUTE DETECTION (handles nested navigators) -------- */

//     //   const activeRoute = useNavigationState((state) => {
//     //     const route = state.routes[state.index];

//     //     if (route.state) {
//     //       return route.state.routes[route.state.index].name;
//     //     }

//     //     return route.name;
//     //   });
//     const activeRoute = useNavigationState(state => {
//         if (!state || !state.routes || typeof state.index !== "number") return null;
//         return state.routes[state.index].name;
//     });


//     /* -------- NAVIGATION -------- */

//     const go = useCallback(
//         (screen) => {
//             closeDrawer();

//             InteractionManager.runAfterInteractions(() => {
//                 navigation.navigate(screen);
//             });
//         },
//         [navigation, closeDrawer]
//     );



//     /* -------- LOGOUT -------- */

//     const handleLogout = useCallback(() => {
//         Alert.alert("Logout", "Are you sure you want to logout?", [
//             {
//                 text: "Logout",
//                 onPress: () => {
//                     closeDrawer();

//                     InteractionManager.runAfterInteractions(() => {
//                         sessionLogoutOnly(dispatch, navigation);
//                     });
//                 },
//             },
//             { text: "Cancel", style: "cancel" },
//         ]);
//     }, [dispatch, navigation, closeDrawer]);



//     /* ---------------- UI ---------------- */

//     return (
//         <LinearGradient
//             colors={["#0F0E0C", "#1A1815"]}
//             style={[styles.container, { paddingTop: insets.top }]}
//         >

//             {/* -------- HEADER -------- */}

//             <View style={styles.header}>
//                 <LinearGradient
//                     colors={["#F5C542", "#C8A133"]}
//                     style={styles.avatar}
//                 >
//                     <Text style={styles.avatarText}>G</Text>
//                 </LinearGradient>

//                 <Text style={styles.title}>Gold Loan</Text>
//                 <Text style={styles.subTitle}>Premium Lending</Text>
//             </View>



//             {/* -------- MENU -------- */}

//             <View style={styles.menu}>
//                 {MENU.map((item) => (
//                     <MenuItem
//                         key={item.route}
//                         label={item.label}
//                         icon={item.icon}
//                         active={activeRoute === item.route}
//                         onPress={() => go(item.route)}
//                     />
//                 ))}
//             </View>



//             {/* -------- LOGOUT -------- */}

//             <Pressable
//                 style={({ pressed }) => [
//                     styles.logoutBtn,
//                     pressed && { opacity: 0.8 },
//                 ]}
//                 onPress={handleLogout}
//             >
//                 <Icon name="log-out-outline" size={20} color="#fff" />
//                 <Text style={styles.logoutText}>Logout</Text>
//             </Pressable>

//         </LinearGradient>
//     );
// }



// /* ---------------- STYLES ---------------- */

// const styles = StyleSheet.create({

//     container: {
//         flex: 1,
//         paddingHorizontal: 22,
//     },

//     header: {
//         marginBottom: 28,
//     },

//     avatar: {
//         height: 56,
//         width: 56,
//         borderRadius: 28,
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 10,
//     },

//     avatarText: {
//         color: "#1A1815",
//         fontSize: 22,
//         fontWeight: "800",
//     },

//     title: {
//         fontSize: 22,
//         fontWeight: "700",
//         color: "#F9FAF7",
//     },

//     subTitle: {
//         fontSize: 13,
//         color: "#C7B88A",
//     },

//     menu: {
//         marginTop: 24,
//     },

//     menuItem: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingVertical: 14,
//         paddingHorizontal: 16,
//         borderRadius: 14,
//         marginBottom: 10,
//         backgroundColor: "rgba(255,215,0,0.05)",
//     },

//     menuItemActive: {
//         backgroundColor: "#F5C542",
//     },

//     menuText: {
//         marginLeft: 14,
//         fontSize: 15,
//         color: "#E5E7EB",
//     },

//     menuTextActive: {
//         color: "#1A1815",
//         fontWeight: "700",
//     },

//     activeDot: {
//         marginLeft: "auto",
//         height: 8,
//         width: 8,
//         borderRadius: 4,
//         backgroundColor: "#1A1815",
//     },

//     logoutBtn: {
//         marginTop: "auto",
//         backgroundColor: "#B91C1C",
//         paddingVertical: 14,
//         borderRadius: 14,
//         flexDirection: "row",
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     logoutText: {
//         color: "#fff",
//         marginLeft: 8,
//         fontSize: 15,
//         fontWeight: "600",
//     },

// });