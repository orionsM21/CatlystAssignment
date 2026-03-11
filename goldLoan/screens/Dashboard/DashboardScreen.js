

import React, { useCallback, useState, useMemo, useContext, useRef, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    PanResponder,
    Animated,
    FlatList
} from "react-native";

import useDashboard from "./useDashboard";
import Header from "../components/Header";
import KPISection from "../components/KPISection";
import StatusTabs from "../components/StatusTabs";
import LeadRow from "../components/LeadRow";
import TodayPerformance from "../components/TodayPerformance";
import TotalDisbursed from "../components/TotalDisbursed";
import SortButton from "../components/SortButton";
import AppliedFilters from "../components/AppliedFilters";
import QuickActions from "../components/QuickActions";
import { DEFAULT_FILTERS } from "./constants";
import Skeleton from "../components/Skeleton";
import { DrawerContext } from "../../DrawerContext";
import FilterModal from "../components/FilterModal";
import LeadList from "../components/LeadList";
import colors from "../../../src/theme/Color";

const DashboardScreen = () => {

    const { openDrawer } = useContext(DrawerContext);

    const {
        filters,
        setFilters,
        filteredLeads,
        kpis,
        todayMetrics,
        sortBy,
        setSortBy,
        loading,
        itemTypes,
        schemes,
        repaymentTypes
    } = useDashboard();

    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const panY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, g) => g.dy > 10,
            onPanResponderMove: (_, g) => {
                if (g.dy > 0) panY.setValue(g.dy);
            },
            onPanResponderRelease: (_, g) => {
                if (g.dy > 150) {
                    setFilterModalVisible(false);
                    panY.setValue(0);
                } else {
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true
                    }).start();
                }
            }
        })
    ).current;
console.log('Test')
    useEffect( () =>{

    console.log('Loda')
    },[])

    const handleStatusChange = useCallback((status) => {
        setFilters(prev => ({
            ...DEFAULT_FILTERS,
            ...prev,
            status
        }));
    }, [setFilters]);

    const handleRemoveFilter = useCallback((key) => {
        setFilters(prev => ({
            ...prev,
            [key]: DEFAULT_FILTERS[key]
        }));
    }, [setFilters]);

    const handleClearFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, [setFilters]);

    const handleApplyFilters = useCallback((f) => {
        setFilters(f);
        setFilterModalVisible(false);
    }, [setFilters]);

    const renderItem = useCallback(({ item }) => {
        return <LeadRow item={item} />;
    }, []);

    const keyExtractor = useCallback((item, index) => {
        return item?.id ? String(item.id) : `lead-${index}`;
    }, []);

    const renderHeader = useMemo(() => (
        <>


            <TodayPerformance
                leads={todayMetrics.todayLeads}
                disbursed={todayMetrics.todayDisbursed}
            />

            <TotalDisbursed amount={todayMetrics.totalDisbursed} />

            <View style={styles.filterSection}>

                <StatusTabs
                    value={filters?.status || "ALL"}
                    onChange={handleStatusChange}
                />

                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <Text style={styles.filterButtonText}>Filter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={handleClearFilters}
                    >
                        <Text style={styles.filterButtonText}>Clear Filter</Text>
                    </TouchableOpacity>
                </View>

                <SortButton
                    sortBy={sortBy}
                    onChange={setSortBy}
                />

                <AppliedFilters
                    filters={filters}
                    onRemove={handleRemoveFilter}
                />

            </View>

            <KPISection kpis={kpis} />

            <QuickActions />
            <LeadList data={filteredLeads} />
        </>
    ), [
        filters,
        kpis,
        sortBy,
        todayMetrics,
        openDrawer,
        handleStatusChange,
        handleRemoveFilter
    ]);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Skeleton />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                userName="Gold Loan User"
                initials="MM"
                pipelines={8}
                onMenuPress={openDrawer}
            />
            <FlatList
                data={filteredLeads}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No leads found
                    </Text>
                }
            />

            {filterModalVisible && (
                <FilterModal
                    filters={filters}
                    onApply={handleApplyFilters}
                    onClose={() => setFilterModalVisible(false)}
                    panResponder={panResponder}
                    panY={panY}
                    itemTypes={itemTypes}
                    schemes={schemes}
                    repayments={repaymentTypes}
                />
            )}

        </SafeAreaView>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F6FA"
    },

    filterSection: {
        paddingHorizontal: 12
    },

    filterRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8
    },

    filterButton: {
        backgroundColor: "#111",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
        marginRight: 10
    },

    filterButtonText: {
        color: "#FFD700",
        fontWeight: "600",
        fontSize: 12
    },

    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#777"
    }

});

// import { StyleSheet, Text, View } from 'react-native'
// import React, { useEffect } from 'react'

// const DashboardScreen = () => {
   
//     useEffect( () =>{

//     console.log('Loda')
//     },[])
//      console.log('Test')
//   return (
//     <View>
//       <Text>DashboardScreen</Text>
//     </View>
//   )
// }

// export default DashboardScreen

// const styles = StyleSheet.create({})