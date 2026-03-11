// import React, { useState } from "react";
// import { Modal, View, TouchableOpacity, Text, SafeAreaView } from "react-native";
// import AmortTables from "./AmortTables";
// import EmiChart from "./EmiChart";
// import { exportAmortPdf } from "./exportAmortPdf";
// import PdfEmiChart from "./PdfEmiChart";

// export default function AmortModal({
//     visible,
//     onClose,
//     data = [],
//     pdfLoading,
//     setPdfLoading,
//     applicationNumber
// }) {
//     const [chart64, setChart64] = useState(null);

//     return (
//         <Modal visible={visible} animationType="slide" transparent>

//             <SafeAreaView style={{ flex: 1, backgroundColor: "#00000066" }}>

//                 <View style={{
//                     flex: 1,
//                     backgroundColor: "#fff",
//                     marginTop: 80,
//                     borderTopLeftRadius: 16,
//                     borderTopRightRadius: 16,
//                     padding: 12
//                 }}>

//                     {/* Header */}
//                     <View style={{
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                         marginBottom: 10
//                     }}>
//                         <Text style={{ fontWeight: "700", fontSize: 16 }}>
//                             Amortization Schedule
//                         </Text>

//                         <TouchableOpacity onPress={onClose}>
//                             <Text style={{ color: "#2563EB" }}>Close</Text>
//                         </TouchableOpacity>
//                     </View>
//                     {/* <TouchableOpacity
//                         disabled={pdfLoading}
//                         onPress={() => exportAmortPdf(data, setPdfLoading)}
//                     >
//                         {pdfLoading ? (
//                             <ActivityIndicator size="small" color="#16A34A" />
//                         ) : (
//                             <Text style={{ color: "#16A34A" }}>Download PDF</Text>
//                         )}
//                     </TouchableOpacity> */}
//                     <TouchableOpacity
//                         disabled={pdfLoading}
//                         onPress={() => exportAmortPdf(data, applicationNumber, setPdfLoading, chart64)}

//                     >
//                         {pdfLoading ? (
//                             <ActivityIndicator color="#16A34A" />
//                         ) : (
//                             <Text style={{ color: "#16A34A" }}>Download PDF</Text>
//                         )}
//                     </TouchableOpacity>

//                     <PdfEmiChart
//                         data={data}
//                         onCapture={async uri => {
//                             const base64 = await RNFS.readFile(uri, "base64");
//                             setChart64(`data:image/png;base64,${base64}`);
//                         }}
//                     />

//                     <AmortTables data={data} />
//                     <EmiChart data={data} />
//                 </View>

//             </SafeAreaView>

//         </Modal>
//     );
// }


import React, { useState } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import RNFS from "react-native-fs";

import AmortTables from "./AmortTables";
import EmiChart from "./EmiChart";
import PdfEmiChart from "./PdfEmiChart";
import { exportAmortPdf } from "./exportAmortPdf";

export default function AmortModal({
  visible,
  onClose,
  data = [],
  pdfLoading,
  setPdfLoading,
  applicationNumber
}) {
  const [chart64, setChart64] = useState(null);
  console.log(data, 'Amortfggjgdatadata')
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#00000066" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            marginTop: 80,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 12
          }}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontWeight: "700", color: '#000', fontSize: 16 }}>
              Amortization Schedule
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: "#2563EB" }}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* PDF Button */}
          <TouchableOpacity
            disabled={pdfLoading || !chart64}
            onPress={() =>
              exportAmortPdf(data, applicationNumber, setPdfLoading, chart64)
            }
          >
            {pdfLoading ? (
              <ActivityIndicator color="#16A34A" />
            ) : !chart64 ? (
              <Text style={{ color: "#94A3B8" }}>Preparing chart…</Text>
            ) : (
              <Text style={{ color: "#16A34A" }}>Download PDF</Text>
            )}
          </TouchableOpacity>

          {/* Hidden chart for PDF */}
          <View style={{ position: "absolute", left: -1000 }}>
            <PdfEmiChart
              data={data}
              onCapture={async uri => {
                const base64 = await RNFS.readFile(uri, "base64");
                setChart64(`data:image/png;base64,${base64}`);
              }}
            />
          </View>

          <AmortTables data={data} />
          {/* <EmiChart data={data} /> */}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
