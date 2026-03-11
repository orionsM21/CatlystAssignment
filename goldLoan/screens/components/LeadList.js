import React, { useCallback } from "react";
import { FlatList, Text } from "react-native";
import LeadRow from "./LeadRow";

function LeadList({ data = [] }) {

  const renderItem = useCallback(({ item }) => {
    if (!item) return null;
    return <LeadRow item={item} />;
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      removeClippedSubviews
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      contentContainerStyle={{paddingBottom:120}}
      ListEmptyComponent={() => (
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          No leads found
        </Text>
      )}
    />
  );
}

export default React.memo(LeadList);