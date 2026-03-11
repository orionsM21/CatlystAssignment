import React, { memo, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";

const HEADERS = ["Due", 'EMI', "Interest", "Principal", "Opening", "Closing", "Disbursement", "Specifier", "tenor"];

const COL_WIDTH = 90;

const Row = memo(({ item, index }) => (
  <View style={styles.row}>
    {/* <Text style={styles.cell}>{index + 1}</Text> */}
    <Text style={styles.cell}>{item.dueDate}</Text>
    <Text style={styles.cell}>{item.emi || 0}</Text>
    <Text style={styles.cell}>
      ₹{item.interest.toFixed(0)}
    </Text>
    <Text style={styles.cell}>
      ₹{item.principalAmount.toFixed(0)}
    </Text>
    <Text style={styles.cell}>
      ₹{Number(item.openingBalance || 0).toFixed(0)}
    </Text>





    <Text style={styles.cell}>
      ₹{Number(item.closingBalance || 0).toFixed(0)}
    </Text>
    <Text style={styles.cell}>{item.disbursementAmount}</Text>
    <Text style={styles.cell}>{item.specifier}</Text>
    <Text style={styles.cell}>{item.tenor}</Text>

  </View>
));


export default function AmortTables({ data = [] }) {

  // ✅ normalize once
  const normalized = useMemo(() => {
    return data.map((r, idx) => ({
      ...r,
      principalAmount: Number(r.principal || 0),
      interestAmount: idx === 0 ? 0 : Number(r.interest || 0), // skip ROI row
      emiAmount: Number(r.emi || 0),
    }));
  }, [data]);
  console.log(normalized, 'normalizednormalized')

  // ✅ totals from normalized
  const totals = useMemo(() => {
    let p = 0, i = 0;

    normalized.forEach(r => {
      p += r.principalAmount;
      i += r.interestAmount;
    });

    return { p, i };
  }, [normalized]);


  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>

      <View style={{ minWidth: 6 * COL_WIDTH }}>

        <FlatList
          data={normalized}
          keyExtractor={i => String(i.amortId)}
          stickyHeaderIndices={[0]}

          ListHeaderComponent={() => (
            <View style={styles.header}>
              {HEADERS.map(h => (
                <Text key={h} style={styles.headerCell}>{h}</Text>
              ))}
            </View>
          )}

          renderItem={({ item, index }) => (
            <Row item={item} index={index} />
          )}

          ListFooterComponent={() => (
            <View style={styles.footer}>
              <Text style={styles.headerCell}>Total Principal: ₹{totals.p.toFixed(0)}</Text>
              <Text style={styles.headerCell}>Total Interest: ₹{totals.i.toFixed(0)}</Text>
            </View>
          )}
        />

      </View>

    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden"
  },

  header: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5
  },

  footer: {
    padding: 10,
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    flexDirection: 'row',
  },

  cell: {
    width: COL_WIDTH,
    textAlign: "center",
    fontSize: 12,
    paddingVertical: 6,
    color: '#000'
  },

  headerCell: {
    width: COL_WIDTH,
    textAlign: "center",
    fontWeight: "700",
    paddingVertical: 8,
    color: '#888'

  },
});
