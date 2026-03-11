import React, { useContext } from "react";
import {
    Dimensions,
    StyleSheet,
    Animated,
    PanResponder,
    Pressable,
} from "react-native";
import { DrawerContext } from "./DrawerContext";
import GoldDrawerUI from "./GoldDrawerUI";

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.78;

export default function DrawerLayout({ children }) {
    const { progress, openDrawer, closeDrawer } = useContext(DrawerContext);

    const drawerTranslate = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [-DRAWER_WIDTH, 0],
    });

    const mainTranslate = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, DRAWER_WIDTH],
    });

    const backdropOpacity = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
    });

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (e, g) =>
            e.nativeEvent.pageX < 40 && g.dx > 20,

        onPanResponderRelease: (_, g) => {
            if (g.dx > DRAWER_WIDTH / 3) openDrawer();
            else closeDrawer();
        },
    });

    return (
        <>
            {/* Main App */}
            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.app,
                    { transform: [{ translateX: mainTranslate }] },
                ]}
            >
                <Pressable style={{ flex: 1 }} onPress={closeDrawer}>
                    {children}
                </Pressable>
            </Animated.View>

            {/* Drawer */}
            <Animated.View
                style={[
                    styles.drawer,
                    { transform: [{ translateX: drawerTranslate }] },
                ]}
            >
                <GoldDrawerUI />
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    drawer: {
        position: "absolute",
        width: DRAWER_WIDTH,
        height: "100%",
        zIndex: 20,
    },

    app: {
        flex: 1,
        zIndex: 10,
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000",
        zIndex: 15,
    },
});