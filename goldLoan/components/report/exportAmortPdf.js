import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { Alert, Platform } from "react-native";

export const exportAmortPdf = async (
  rows = [],
  applicationNumber,
  setPdfLoading,
  chartBase64
) => {
  try {
    setPdfLoading?.(true);

    if (!rows.length) throw "No amort data";

    let totalP = 0;
    let totalI = 0;

    rows.forEach(r => {
      totalP += Number(r.principal || 0);
      totalI += Number(r.interest || 0);
    });

    const html = `
    <h2>Amortization Schedule</h2>
    <table border="1" width="100%" cellpadding="6">
      <tr>
        <th>Date</th>
        <th>EMI</th>
        <th>Interest</th>
        <th>Principal</th>
        <th>Opening</th>
        <th>Closing</th>
        <th>Disbursement</th>
        <th>Specifier</th>
        <th>Tenor</th>
      </tr>

      ${rows.map((r) => `
        <tr>
          <td>${r.dueDate ?? "-"}</td>
          <td>${r.emi ?? "-"}</td>
          <td>${r.interest ?? "-"}</td>
          <td>${r.principal ?? "-"}</td>
          <td>${r.openingBalance ?? "-"}</td>
          <td>${r.closingBalance ?? "-"}</td>
          <td>${r.disbursementAmount ?? "-"}</td>
          <td>${r.specifier ?? "-"}</td>
          <td>${r.tenor ?? "-"}</td>
        </tr>
      `).join("")}
    </table>

    <br/>
    <b>Total Principal:</b> ₹${totalP.toFixed(0)}<br/>
    <b>Total Interest:</b> ₹${totalI.toFixed(0)}
    `;

    const pdf = await RNHTMLtoPDF.convert({
      html,
      fileName: `temp_${Date.now()}`,
      directory: "Documents",
    });

    const finalPath =
      Platform.OS === "android"
        ? `${RNFS.DownloadDirectoryPath}/${applicationNumber}.pdf`
        : pdf.filePath;

    if (Platform.OS === "android") {
      await RNFS.copyFile(pdf.filePath, finalPath);
    }

    Alert.alert("PDF Ready", "Choose option", [
      {
        text: "Open",
        onPress: () =>
          FileViewer.open(finalPath).catch(() =>       // ← error alert added
            Alert.alert(
              "Cannot Open File",
              "No app found to open this PDF. Try sharing it instead."
            )
          ),
      },
      {
        text: "Share",
        onPress: () =>
          Share.open({
            url: `file://${finalPath}`,
            type: "application/pdf",
          }).catch(() =>
            Alert.alert("Share Failed", "Unable to share the file.")
          ),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);

  } catch (e) {
    Alert.alert("PDF Error", String(e));
  } finally {
    setPdfLoading?.(false);
  }
};