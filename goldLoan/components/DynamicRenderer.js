const { REPORT_CONFIG } = require("./reportConfig");


const DynamicReportRenderer = ({ type, data }) => {
  const config = REPORT_CONFIG[type];

  return (
    <ScrollView style={{ padding: 16 }}>

      <Text style={styles.title}>{config.title}</Text>

      {/* HEADER */}
      {config.header?.map(h => (
        <Row label={h.label} value={data[h.key]} />
      ))}

      {/* TABLE */}
      {config.table && (
        <View>
          {data[config.table.key]?.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              {config.table.columns.map(col => (
                <Text key={col.key}>{row[col.key]}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* FOOTER */}
      {config.footer?.map(f => (
        <Row label={f.label} value={data[f.key]} />
      ))}

    </ScrollView>
  );
};
