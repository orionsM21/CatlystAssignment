




import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { View, Switch, ScrollView, Text, SafeAreaView, ActivityIndicator, FlatList, Alert, Keyboard, RefreshControl, Dimensions, Modal, TouchableOpacity, Image, TextInput, useColorScheme, StyleSheet, Animated } from "react-native";
import { useSelector } from "react-redux";

import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from "@react-native-community/datetimepicker";
import DocumentPicker from 'react-native-document-picker';
import CheckBox from '@react-native-community/checkbox';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from "react-native-vector-icons/Ionicons";

import { moderateVerticalScale } from "react-native-size-matters";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import ApplicantDetailModal from "../components/Modalhelper/ApplicantDetailModal";
import ConfirmRemoveModal from "../components/Modalhelper/ConfirmRemoveModal";
import PreviewFileModal from "../components/Modalhelper/PreviewFileModal";
import CreateLeadModal from "../components/Modalhelper/CreateLeadModal";
import OtpModal from "../components/Modalhelper/OtpModal";

import { scale, verticalScale, moderateScale } from "react-native-size-matters";
const { width, height } = Dimensions.get('window')
const isSmallScreen = width < 768;
import { nanoid } from 'nanoid/non-secure';
import MultiSelectDropdown from "../admin/components/MultiSelectDropdown";
import AmortTables from "../components/report/AmortTables";
import AmortModal from "../components/report/AmortModal";
import { exportAmortPdf } from "../components/report/exportAmortPdf";
import { BASE_URL } from "../api/Endpoint";
import createApiClient from "../common/hooks/apiClient";
import DatePickerInput from "../components/DatePickerInput";


const PURITY_RATE_KEY = {
  24: "twentyFourK",
  22: "twentyTwoK",
  18: "eighteenK",
  14: "fourteenK",
};

const renderDropdown = (
  label,
  data,
  selectedValue,
  onChange,
  placeholder,
  isRequired = true,
  dropdownKey,
  disabled = false
) => {
  const safeData = (data || [])?.map((item) => ({
    ...item,
    label: String(item.label ?? ""),
  }));

  return (
    <View>
      <Text style={styles.label}>
        {label}
        {isRequired && <Text style={styles.required}>*</Text>}
      </Text>

      <Dropdown
        key={dropdownKey}
        data={safeData}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        placeholderStyle={styles.placeholderStyle}
        value={selectedValue}
        search
        onChange={onChange}
        disable={disabled}   // 🔥 HERE
        style={[
          styles.dropdown,
          {
            minHeight: isSmallScreen ? 36 : 44,
            paddingHorizontal: isSmallScreen ? 8 : 10,
            paddingVertical: isSmallScreen ? 6 : 8,
          },
          disabled && { backgroundColor: "#f1f5f9", opacity: 0.6 },
        ]}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        renderItem={(item) => (
          <View style={styles.dropdownItem}>
            <Text style={styles.dropdownItemText}>{item.label}</Text>
          </View>
        )}
      />

    </View>
  );
};





const InfoRow = React.memo(({ label, value }) => (
  <View style={styles.textRow}>
    <Text style={styles.cardLabel}>{label}:</Text>
    <Text style={styles.cardValue}>{value || 'N/A'}</Text>
  </View>
));

const pageFields = {
  "cust-1": {
    Applicant: [
      {
        title: "Lead Details",
        fields: [
          { type: "dropdown", label: "Portfolio", field: "portfolio" },
          { type: "dropdown", label: "Product", field: "product" },
          { type: "dropdown", label: "Branch", field: "branch" },
        ],
      },
      {
        title: "Personal Details",
        fields: [
          { type: "input", label: "First Name", field: "firstName", placeholder: "Enter First Name", editable: true },
          { type: "input", label: "Middle Name", field: "middleName", placeholder: "Enter Middle Name", editable: true, required: false },
          { type: "input", label: "Last Name", field: "lastName", placeholder: "Enter Last Name", editable: true },
          { type: "input", label: "Mobile Number", field: "mobile", isMobile: true, placeholder: "Enter 10-digit Number", editable: true },
          { type: "input", label: "Email", field: "email", placeholder: "Enter Email", editable: true },
          {
            type: "dropdown",
            label: "Gender",
            field: "gender",
            data: [
              { label: "Male", value: "M" },
              { label: "Female", value: "F" },
              { label: "Other", value: "O" },
            ],
            placeholder: "Select Gender",
          },
          { type: "date", label: "Date of Birth", field: "dob" },
          { type: "input", label: "PAN Number", field: "pan", isPan: true, placeholder: "Enter PAN", editable: true },
          { type: "input", label: "Aadhaar Number", field: "aadhaar", isAadhaar: true, placeholder: "Enter Aadhaar Number", editable: true, required: false },
          { type: "dropdown", label: "Loan Purpose", field: "loanpurpose", placeholder: "Select Loan Purpose" },
        ],
      },
      {
        title: "Current Address",
        fields: [
          { type: "input", label: "Address Line 1", field: "addressline1", placeholder: "Enter Address Line 1", editable: true },
          { type: "input", label: "Address Line 2", field: "addressline2", placeholder: "Enter Address Line 2", editable: true },
          { type: "input", label: "Address Line 3", field: "addressline3", placeholder: "Enter Address Line 3", editable: true, required: false },
          { type: "dropdown", label: "Pincode", field: "pincode", placeholder: "Select Pincode" },
          { type: "input", label: "Country", field: "Country", placeholder: "Enter Country", editable: false },
          { type: "input", label: "City", field: "City", placeholder: "Enter City", editable: false },
          { type: "input", label: "State", field: "State", placeholder: "Enter State", editable: false },
          { type: "input", label: "Area", field: "Area", placeholder: "Enter Area", editable: false },
        ],
      },
      {
        title: "Permanent Address",
        fields: [
          { type: "checkbox", label: "Same as current address", field: "sameAsCurrent" },
          { type: "input", label: "Address Line 1", field: "per_addressline1", placeholder: "Enter Address Line 1", editable: true },
          { type: "input", label: "Address Line 2", field: "per_addressline2", placeholder: "Enter Address Line 2", editable: true },
          { type: "input", label: "Address Line 3", field: "per_addressline3", placeholder: "Enter Address Line 3", editable: true },
          { type: "dropdown", label: "Pincode", field: "per_pincode", placeholder: "Select Pincode" },
        ],
      },
      {
        title: "Bank Details",
        fields: [
          { type: 'input', label: 'Account Holder', field: 'accountholder', editable: true },
          { type: 'dropdown', label: 'IFSC Code', field: 'IFSCCode', editable: true },
          { type: 'input', label: 'Bank Name', field: 'bankname', editable: false },
          { type: 'input', label: 'Branch Name', field: 'branchname', editable: false },
          { type: 'dropdown', label: 'Account Type', field: 'accounttype', editable: true },
          { type: 'input', label: 'Account Number', field: 'accountNumber', editable: true },


        ]
      }
    ],

    "Co-Applicant": [
      {
        title: "Personal Details",
        fields: [
          { type: "input", label: "First Name", field: "coFirstName", placeholder: "Enter First Name", editable: true },
          { type: "input", label: "Middle Name", field: "coMiddleName", placeholder: "Enter Middle Name", editable: true, required: false },
          { type: "input", label: "Last Name", field: "coLastName", placeholder: "Enter Last Name", editable: true },
          { type: "input", label: "Mobile Number", field: "coMobile", isMobile: true, placeholder: "Enter 10-digit Number", editable: true },
          { type: "input", label: "Email", field: "coemail", placeholder: "Enter Email", editable: true },

          {
            type: "dropdown",
            label: "Gender",
            field: "coGender",
            data: [
              { label: "Male", value: "M" },
              { label: "Female", value: "F" },
              { label: "Other", value: "O" },
            ],
            placeholder: "Select Gender",
          },
          { type: "date", label: "Date of Birth", field: "coDob" },
          { type: "input", label: "PAN Number", field: "coPan", isPan: true, placeholder: "Enter PAN", editable: true },
          { type: "input", label: "Aadhaar Number", field: "coAadhaar", isAadhaar: true, placeholder: "Enter Aadhaar Number", editable: true, required: false },
          // { type: "dropdown", label: "Loan Purpose", field: "coloanpurpose", placeholder: "Select Loan Purpose" },
        ],
      },
      {
        title: "Current Address",
        fields: [
          { type: "input", label: "Address Line 1", field: "co_addressline1", placeholder: "Enter Address Line 1", editable: true },
          { type: "input", label: "Address Line 2", field: "co_addressline2", placeholder: "Enter Address Line 2", editable: true },
          { type: "input", label: "Address Line 3", field: "co_addressline3", placeholder: "Enter Address Line 3", editable: true, required: false },
          { type: "dropdown", label: "Pincode", field: "coPincode", placeholder: "Select Pincode" },
          { type: "input", label: "Country", field: "coCountry", placeholder: "Enter Country", editable: false },
          { type: "input", label: "City", field: "coCity", placeholder: "Enter City", editable: false },
          { type: "input", label: "State", field: "coState", placeholder: "Enter State", editable: false },
          { type: "input", label: "Area", field: "coArea", placeholder: "Enter Area", editable: false },
        ],
      },
      {
        title: "Permanent Address",
        fields: [
          { type: "checkbox", label: "Same as current address", field: "co_sameAsCurrent" },
          { type: "input", label: "Address Line 1", field: "co_per_addressline1", placeholder: "Enter Address Line 1", editable: true },
          { type: "input", label: "Address Line 2", field: "co_per_addressline2", placeholder: "Enter Address Line 2", editable: true },
          { type: "input", label: "Address Line 3", field: "co_per_addressline3", placeholder: "Enter Address Line 3", editable: true },
          { type: "dropdown", label: "Pincode", field: "co_per_pincode", placeholder: "Select Pincode" },
        ],
      },
      {
        title: "Bank Details",
        fields: [
          { type: 'input', label: 'Account Holder', field: 'co_accountholder', editable: true },
          { type: 'dropdown', label: 'IFSC Code', field: 'co_IFSCCode', editable: true },
          { type: 'input', label: 'Bank Name', field: 'co_bankname', editable: false },
          { type: 'input', label: 'Bank Branch Name', field: 'co_branchname', editable: false },
          { type: 'dropdown', label: 'Account Type', field: 'co_accounttype', editable: true },
          { type: 'input', label: 'Account Number', field: 'co_accountNumber', editable: true },


        ]
      }
    ],

    KYCBureau: [
      {
        title: "Empty Section",
        fields: [],
      },
    ],
  },

  "cust-2": [
    {
      title: "Gold Details",
      isRepeatable: true,

      fields: [
        // { type: "input", label: "Item Category", field: "goldCategory" },
        {
          type: "dropdown",
          label: "Item Category",
          field: "goldCategory",

        },
        // { type: "input", label: "Item Type", field: "goldType" },
        { type: "input", label: "Item Name", field: "goldBrandName" },
        { type: "input", label: "No. of Items", field: "noOfItems", required: false },

        { type: "input", label: "Gross Weight", field: "goldWeight", required: false },
        { type: "input", label: "Stone Weight", field: "stoneWeight", required: false },
        { type: "input", label: "Stone Type", field: "stoneType", required: false },
        { type: "input", label: "Impurity %", field: "impurityPercentage", required: false },

        { type: "input", label: "Net Weight", field: "netWeight", },
        { type: "dropdown", label: "Gold Purity", field: "goldPurity" },
        { type: "input", label: "Gold Rate", field: "goldMarketRate", editable: false },
        { type: "input", label: "Collateral Value", field: "goldValue", editable: false },
        { type: "input", label: "Hallmark", field: "goldCertNumber" },

        { type: "input", label: "Remarks", field: "goldRemarks" },

        { type: "dropdown", label: "Gold Ownership", field: "goldOwnership" },
        { type: "dropdown", label: "Gold Status", field: "goldStatus" },

        { type: "checkbox", label: "Broken Jewellery", field: "brokenJewellery" },
        { type: "checkbox", label: "GLO Confirmation", field: "gloConfirmation" },

        {
          type: "docTabs", field: "activeDocTab", fullWidth: true,
          data: [

          ],
        },
        { type: "document", fullWidth: true }
      ]

    },
  ],

  "orig-1": [
    {
      title: "Valuation Details",
      fields: [


        { type: "input", label: "Gold Valuer Name", field: "valuerName", placeholder: "Enter valuer Name", editable: false },
        { type: "input", label: "Valuer Emp ID", field: "ValuerEmpID", placeholder: "Enter valuer Name", editable: false },
        { type: "date", label: "Valuation Date", field: "valuationDate" },
        { type: "input", label: "Gold Rate Date", field: "goldratedate", placeholder: "Enter", editable: false },
        { type: "input", label: "Valuer Contact Number", field: "valuerContact", placeholder: "Enter contact Number", editable: true },
        // { type: "input", label: "Valuation Certificate Number", field: "valuationCertNumber", placeholder: "Enter certificate Number", editable: true },
        { type: "input", label: "Total Net Gold Weight (gram) ", field: "verifiedWeight", placeholder: "Enter verified weight" },
        { type: "input", label: "Total Gold Purity", field: "pureWeight", placeholder: "Enter verified purity" },
        { type: "input", label: "Gold Rate", field: "marketRate", editable: false },

        { type: "input", label: "Gold Caret", field: "verifiedPurity", editable: false },

        { type: "input", label: "Total Gold Value", field: "totalGoldValue", editable: false },


      ],
    },
  ],

  "orig-3": [
    {
      title: "Loan Sanction + Loan Booking",
      fields: [
        { type: "input", label: "Total Gold Value", field: "totalGoldValue", editable: false },
        {
          type: "dropdown",
          label: "Scheme",
          field: "scheme",
          placeholder: "Select Scheme",
        },
        { type: "input", label: "Interest Rate (%)", field: "interestRate", placeholder: "Enter interest rate", editable: false },
        { type: "input", label: "Tenure (months)", field: "tenure", placeholder: "Enter tenure", editable: false },
        { type: "input", label: "Eligible LTV (%)", field: "ltv", placeholder: "Enter LTV", editable: true },
        { type: "input", label: "Eligible Loan Amount", field: "eligibleLoan", placeholder: "Auto-calculated", editable: false },
        { type: "input", label: "Sanction ROI", field: "SanctioninterestRate", placeholder: "Enter tenure", editable: true },
        { type: "input", label: "Sanction Tenure", field: "Sanctiontenure", placeholder: "Enter interest rate", editable: true },
        { type: "input", label: "Sanction AMount", field: "loanAmount", placeholder: "Enter loan amount", editable: true },
        {
          type: "dropdown",
          label: "Billing Cycle",
          field: "billingCycle",
          placeholder: "Select Billing Cycle",
        },
        // { type: "input", label: "Sanction AMount", field: "SanctioninterestRate", placeholder: "Enter interest rate", editable: true },
        // { type: "input", label: "EMI Amount (₹)", field: "emiAmount", placeholder: "Auto-calculated", editable: false },
        {
          type: "dropdown",
          label: "Loan Approval",
          field: "loanApproval",

          placeholder: "Select ",
        },
        {
          type: "dropdown",
          label: "Reject Reason",
          field: "rejecteReason",
          placeholder: "Select Reason",
        },

        { type: "input", label: "Remarks", field: "remark", placeholder: "Enter Remark", editable: true },
      ],
    },
  ],

  "orig-4": [
    {
      title: "Gold Packaging & Vaulting",
      fields: [
        {
          type: "input",
          label: "Index No",
          field: "indexNo",
          placeholder: "Enter Index No",
          editable: true,
        },
        {
          type: "input",
          label: "Rack No",
          field: "rackNo",
          placeholder: "Enter Rack No",
          editable: true,
        },
        {
          type: "input",
          label: "Tray No",
          field: "trayNo",
          placeholder: "Enter Tray No",
          editable: true,
        },
        {
          type: "input",
          label: "Packet No (RFID / Barcode)",
          field: "packetNo",
          placeholder: "Enter Packet No",
          editable: true,
        },

        {
          type: "input",
          label: "Packet Weight (gm)",
          field: "packetWeight",
          placeholder: "Enter Packet Weight",
          editable: true,
        },

        // 📸 Upload Packet Photo
        {
          type: "document",
          label: "Packet Photo",
          field: "packetPhoto",
          fullWidth: true,
        },

        // 👀 Preview Uploaded Image
        {
          type: "imagePreview",
          field: "packetPhotoPreview",
          fullWidth: true,
        },
      ],
    },
  ],

  "orig-5": [
    {
      title: "Gold Packaging & Vaulting",
      fields: [
        {
          type: "input",
          label: "Index No",
          field: "indexNo",
          placeholder: "Enter Index No",
          editable: false,
        },
        {
          type: "input",
          label: "Rack No",
          field: "rackNo",
          placeholder: "Enter Rack No",
          editable: false,
        },
        {
          type: "input",
          label: "Tray No",
          field: "trayNo",
          placeholder: "Enter Tray No",
          editable: false,
        },
        {
          type: "input",
          label: "Packet No (RFID / Barcode)",
          field: "packetNo",
          placeholder: "Enter Packet No",
          editable: false,
        },

        {
          type: "input",
          label: "Packet Weight (gm)",
          field: "packetWeight",
          placeholder: "Enter Packet Weight",
          editable: false,
        },
        { type: "checkbox", label: "Approval", field: "packageApproval" },
        {
          type: "input",
          label: "Remarks",
          field: "packgeRemarks",
          placeholder: "Enter Remarks",

        },


      ],
    },
  ],

  "decision-1": [

    {
      title: "Disbursement Request",
      fields: [
        { type: "input", label: "Portfolio", field: "disbursementportfolio", editable: false },
        { type: "input", label: "Product", field: "disbursementproduct", editable: false },
        { type: "input", label: "Scheme", field: "disbursementscheme", editable: false },
        { type: "input", label: "Interest Rate", field: "disbursementlinterestRate", editable: false },
        { type: "input", label: "Tenor", field: "disbursementtenor", editable: false },
        { type: "input", label: "Sanction Amount", field: "disbursementsanctionAmount", editable: false },
        { type: "input", label: "Repayment Frequency", field: "disbursementrepaymentFrequency" },
        { type: "checkbox", label: "Initiate", field: "disbursementinitiate" },
        { type: "checkbox", label: "Terminate", field: "disbursementterminate" },
        {
          type: "button",
          label: "Amort",
          action: "openAmort"
        },
        {
          type: "button",
          label: "Save",
          action: "IntiateDisbursement"
        }
      ],
    },

    /* ================= DISBURSEMENT REQUEST ================= */

    {
      title: "Disbursement Request",
      fields: [
        { type: "input", label: "Approved Loan Amount", field: "approvedLoanAmount", editable: false },

        { type: "input", label: "Reference / UTR No", field: "utrNumber" },

        {
          type: "dropdown",
          label: "Instrument Type",
          field: "instrumentType",

        },

        { type: "dropdown", label: "Deposit Bank", field: "depositBank" },

        { type: "dropdown", label: "Bank Name", field: "disbbankname" },

        { type: "dropdown", label: "Branch Name", field: "disbbranch" },

        { type: "date", label: "Valuation Date", field: "valuationDate" },

        { type: "date", label: "Receipt Date", field: "receiptDate" },

        { type: "input", label: "Amount", field: "amount", isNumber: true },
        {
          title: "Processing Fees",
          type: "feeList"
        },
        {
          type: "button",
          label: "Save",
          action: "MultiFeeDetails"
        }
      ],
    },

    /* ================= DISBURSEMENT DETAILS ================= */

    {
      title: "Disbursement Details",
      fields: [
        { type: "input", label: "Total Disbursement Amount", field: "totalDisbursement", isNumber: true },

        {
          type: "dropdown",
          label: "Mode of Disbursement",
          field: "disbursementMode",

        },

        { type: "date", label: "Disbursement Date", field: "disbursementDate" },

        { type: "input", label: "Loan Account Number", field: "loanAccountNumber" },

        { type: "dropdown", label: "Disbursement Account", field: "disbursementAccount" },

        { type: "checkbox", label: "Display BPI On Row", field: "displayBpi" },

      ],
    },

    /* ================= BENEFICIARY ================= */

    {
      title: "Beneficiary Details",
      fields: []
    },

    {
      title: "Actions",
      fields: [
        {
          type: "button",
          label: "Save",
          action: "SaveInitiateDisbursement"
        },
        {
          type: "button",
          label: "Submit",
          action: "SUbmitInitiateDisbursement"
        }
      ]
    }

  ],

  "decision-2": [
    {
      title: "Beneficiary Details",
      fields: []
    },
    {
      title: "Approve Disbursement",
      fields: [
        { type: "input", label: "Total Disbursement Amount ", field: "totalDisbursement", editable: false },
        { type: "input", label: "Mode of Disbursement", field: "disbursementMode", editable: false },
        { type: "input", label: "Disbursement Account", field: "approveddisbursementaccount", editable: false },
        { type: "input", label: "BPI Details", field: "approveddisbursementBPIDetails", editable: false },

        { type: "input", label: "Instalment Start Date", field: "approveddisbursementDate", editable: false },
        { type: "dropdown", label: "Loan Approval", field: "approvedisbursementloanApproval" },
        { type: "input", label: "Remark", field: "approvedisbursementremark" },
        { type: "button", label: "Amort", action: "approvedisbursementopenAmort" }
      ]
    },
    {
      title: "Actions",
      fields: [
        {
          type: "button",
          label: "Save",
          action: "SaveDisbursementUpdate"
        },
        {
          type: "button",
          label: "Submit",
          action: "SUbmiDisbursementUpdate"
        }
      ]
    }
  ],

  "decision-3": [

    {
      title: "Update Disbursement",
      fields: [
        { type: "input", label: "Total Disbursement Amount ", field: "totalDisbursement", editable: false },

        { type: "input", label: "Disbursement Date", field: "UpdatedisbursementDate", editable: false },

        { type: "input", label: "Cheque No.", field: "UpdatedDisbCHeque" },

        { type: "input", label: "Remarks", field: "UpdatedDisbRemarks" },


      ]
    },
    {
      title: "Actions",
      fields: [
        {
          type: "button",
          label: "Save",
          action: "SaveDisbursementUpdateFInal"
        },
        {
          type: "button",
          label: "Submit",
          action: "SUbmiDisbursementUpdateFinal"
        }
      ]
    }

  ],

  // "disb-1": [
  //   {
  //     title: "Disbursal Details",
  //     fields: [
  //       { type: "input", label: "Disbursal Amount", field: "disbAmt", placeholder: "Enter amount", editable: false },
  //     ],
  //   },
  // ],
};

const renderSwitchField = (label, value, onChange) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 6 }}>
    <Text style={{ flex: 1, fontSize: 14, color: '#888' }}>{label}</Text>

    <Switch
      value={Boolean(value)}
      onValueChange={onChange}
      trackColor={{ false: "#D1D5DB", true: "#86EFAC" }}
      thumbColor={value ? "#22C55E" : "#F3F4F6"}
    />
  </View>
);


const NewLoan = () => {
  const route = useRoute();
  const api = createApiClient('gold');
  const userDetails = useSelector((state) => state.auth.userDetails);
  const mkc = useSelector((state) => state.auth.userDetails);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.roleCode);
  const accessRole = userDetails?.role[0]

  const [activeMain, setActiveMain] = useState("cust");
  const [activeSub, setActiveSub] = useState(null);
  const loadedSections = useRef(new Set());
  const [formData, setFormData] = useState({});
  console.log(formData, 'formDataformData')

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState({
    docType: null,
    file: null,
  });
  const [accesTabs, setAccesTabs] = useState([]);

  const [activeCust1Tab, setActiveCust1Tab] = useState("Applicant");


  const [Pincode, setPincode] = useState([]);
  const [Pincodeco, setPincodeco] = useState([]);
  const [Pincodeguar, setPincodeguar] = useState([]);

  const [CoApllicant, setCoApplicant] = useState(false);
  const [categoryData, setCategoryData] = useState({
    applicant_current: {},
    applicant_permanent: {},

    co_current: {},
    co_permanent: {},

    guar_current: {},
    guar_permanent: {},
  });
  const [selectedLead, setSelectedLead] = useState(null);

  const [leadByLeadiD, setleadByLeadiD] = useState({})
  const [GoldDetailsByApplicationNumber, setGoldDetailsByApplicationNumber] = useState(null)
  const [ApproveDisbursementReleaseByApplicationId, setApproveDisbursementReleaseByApplicationId] = useState([])
  const [getApplicationDetailsById, setgetApplicationDetailsById] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [leadsWithLoanAmount, setLeadsWithLoanAmount] = useState([]);
  const [refreshing, setrefreshing] = useState(false);
  const [AmortTable, setAmortTable] = useState([])
  const [showAmort, setShowAmort] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [rejectReasonList, setRejectReasonList] = useState([]);


  const [isLoadingsendotp, setIsLoadingsentotp] = useState(false);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission
  const [submitting, setSubmitting] = useState(false);

  const [SelectedLeadApplicant, setSelectedLeadApplicant] = useState({});

  const [selectedCoApplicant, setSelectedCoApplicant] = useState({});
  const [selectedGurantor, setselectedGurantor] = useState({});
  const [otpApplicant, setOtpApplicant] = useState(['', '', '', '']);  // 4 empty strings for Applicant OTP
  const [otpCoApplicant, setOtpCoApplicant] = useState(['', '', '', '']);  // 4 empty strings for Co-Applicant OTP
  const [otpGurantor, setotpGurantor] = useState(['', '', '', '']);
  const [ifscList, setIfscList] = useState([]);
  const [accountTypeList, setAccountTypeList] = useState([]);
  const [loanPurposeList, setLoanPurposeList] = useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [pincodeList, setPincodeList] = useState([]);
  const [goldPurityList, setGoldPurityList] = useState([]);
  const [goldOwnershipList, setGoldOwnershipList] = useState([]);
  const [goldStatusList, setGoldStatusList] = useState([]);
  const [ItemCategoryList, setItemCategoryList] = useState([]);
  const [loanApprovalList, setloanApprovalList] = useState([]);
  const [InstrumentList, setInstrumentList] = useState([])
  const [depositbanklist, setdepositbanklist] = useState([])
  const [getAllBanklist, setgetAllBanklist] = useState([]);
  const [Branchist, setBranchist] = useState([]);
  const [AllFees, setAllFees] = useState([]);
  const [DisbursmentmodeList, setDisbursmentmodeList] = useState([])

  const [expandedGoldId, setExpandedGoldId] = useState(null);
  const [goldRates, setGoldRates] = useState([]);
  const [getScheduleByApplicationNumber, setgetScheduleByApplicationNumber] = useState([])
  const [getGoldValuationByApplicationNumber, setgetGoldValuationByApplicationNumber] = useState([])
  const [DebtDisbursementSummary, setDebtDisbursementSummary] = useState([])
  const [viewSchedule, setviewSchedule] = useState([])

  const [applicationId, setApplicationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState({
    0: {
      FRONT: [],
      BACK: [],
      LEFT: [],
      RIGHT: [],
      HALLMARK: [],
    },
    PACKET: {
      FRONT: [],
      BACK: [],
      LEFT: [],
      RIGHT: [],
      HALLMARK: [],
    },
  });

  const [documentpcket, setpacket] = useState({});

  const [ketImage, setketImage] = useState(null)
  const [ketImageName, setketImageName] = useState(null)

  const [confirmRemoveModalVisible, setConfirmRemoveModalVisible] = useState(false);
  const [fileToRemove, setFileToRemove] = useState(null);
  const [fileToRemoveIndex, setFileToRemoveIndex] = useState(null);
  const [activeDocTab, setActiveDocTab] = useState("FRONT");
  const MODALS = {
    CREATE_LEAD: "CREATE_LEAD",
    OTP: "OTP",
    PREVIEW_FILE: "PREVIEW_FILE",
    CONFIRM_REMOVE: "CONFIRM_REMOVE",
    DETAILS: "DETAILS",
  };
  const [activeModal, setActiveModal] = useState(null);
  const [modalPayload, setModalPayload] = useState(null);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otpType, setOtpType] = useState(null);
  const [schemeList, setSchemeList] = useState([]);
  const [getBusinessDate, setgetBusinessDate] = useState(null)

  const [getSchemeLoanInterestAmortizationB, setSchemeAmortization] = useState([])
  const [billingCycleList, setBillingCycleList] = useState([]);
  const [getDecisionByApplicationNumber, setgetDecisionByApplicationNumber] = useState([])
  const [ApplicationDetailsByApplicationNumber, setApplicationDetailsByApplicationNumber] = useState([])
  const [FeeDetailsByApplicationNumber, setFeeDetailsByApplicationNumber] = useState([])
  const [ProductFeeDetailByApplicationNumber, setProductDetailsByApplicationNumber] = useState([])
  const [ApproveGoldPackagingDetailsByApplicationNumber, setApproveGoldPackagingDetailsByApplicationNumber] = useState([])
  const [getGoldPackagingDetailsByApplicationNumber, setgetGoldPackagingDetailsByApplicationNumber] = useState(null);
  const [DisbursementRequestMsmeByApplicationId, setDisbursementRequestMsmeByApplicationId] = useState([])
  const [getUpdateDisbursementReleaseByApplicationId, setgetUpdateDisbursementReleaseByApplicationId] = useState([])
  const [SchemeCOde, setSchemeCOde] = useState('');
  const [InitiatDatabyApplicationNumber, setInitiatDatabyApplicationNumber] = useState([])
  const [Logetails, setLogetails] = useState([])
  console.log(SchemeCOde, 'SchemeCOdeSchemeCOde')

  const sourceFees = FeeDetailsByApplicationNumber?.feeDetailsId
    ? FeeDetailsByApplicationNumber?.feeCalculation
    : ProductFeeDetailByApplicationNumber;

  const feeMap = new Map(
    (sourceFees || [])?.map(x => [x.feeTypeCode, x])
  );

  const mergedFees = useMemo(() => (
    (AllFees || []).map(fee => ({
      ...fee,
      ...(feeMap.get(fee.feeTypeCode) || {})
    }))
  ), [AllFees, sourceFees]);

  const normalizedFees = useMemo(() => (
    mergedFees?.map(f => {
      const amount =
        Number(f.amountTillDate ?? f.amountValueForFlat ?? 0);

      return {
        feeDetails: f.feeName || f.feeTypeName,
        feeTypeCode: f.feeTypeCode,
        basicAmount: amount,
        taxAmount: 0,
        amountDue: amount,
        amountReceived: amount,      // since you're submitting full payment

        receivedAmountTillDate: Number(f.receivedAmountTillDate || 0),
      };
    })
  ), [mergedFees]);


  const openModal = (type, payload = null) => {
    setModalPayload(payload);
    setActiveModal(type);
  };
  const resetAllStates = () => {
    setFormData({});
    setSelectedLead(null);
    setleadByLeadiD([]);
    setGoldDetailsByApplicationNumber(null);
    setApproveDisbursementReleaseByApplicationId(null);
    setgetGoldValuationByApplicationNumber([]);
    setSchemeAmortization([])
    setAllFees([]);
    setgetUpdateDisbursementReleaseByApplicationId([]);
    setDisbursementRequestMsmeByApplicationId([]);
    setgetGoldPackagingDetailsByApplicationNumber([]);
    setApproveGoldPackagingDetailsByApplicationNumber([]);
    setProductDetailsByApplicationNumber([]);
    setFeeDetailsByApplicationNumber([]);
    setApplicationDetailsByApplicationNumber([]);
    setgetDecisionByApplicationNumber([])
    setActiveMain("cust");
    setActiveSub(null);
    setActiveCust1Tab("Applicant");
    setAmortTable([])
    setPreviewVisible(false);
    setPreviewData({ docType: null, file: null });

    setCoApplicant(false);

    setCategoryData({
      applicant_current: {},
      applicant_permanent: {},
      co_current: {},
      co_permanent: {},
      guar_current: {},
      guar_permanent: {},
    });
    setSchemeCOde('')
    setSelectedLeadApplicant({});
    setSelectedCoApplicant({});
    setselectedGurantor({});

    setOtpApplicant(["", "", "", ""]);
    setOtpCoApplicant(["", "", "", ""]);
    setotpGurantor(["", "", "", ""]);

    setExpandedGoldId(null);
    setGoldRates([]);

    setApplicationId(null);

    setDocuments({
      FRONT: [],
      BACK: [],
      LEFT: [],
      RIGHT: [],
      HALLMARK: [],
    });

    setActiveDocTab("FRONT");

    setConfirmRemoveModalVisible(false);
    setFileToRemove(null);
    setFileToRemoveIndex(null);

    setIsOtpVisible(false);
    setOtpType(null);

    setSubmitting(false);
    setIsSubmitting(false);
  };
  const getAllLeads = async () => {
    try {
      const response = await api.get(`getAllApplication`);
      const rawLeads = response?.data?.data ?? [];
      // const filterData = rawLeads?.filter(i => i.createdBy === userDetails?.userName)

      const normalizedLeads = normalizeLeads(rawLeads);

      setLeadsWithLoanAmount(normalizedLeads); // show all
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch leads');
    }
  };
  const onRefresh = useCallback(async () => {
    setrefreshing(true);
    try {
      await getAllLeads(); // Wait for the worklist to be fetched
    } catch (error) {
      console.error("Failed to refresh worklist:", error);
    } finally {
      setrefreshing(false); // Ensure refreshing is turned off
    }
  }, []);
  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
    resetAllStates();
    onRefresh()
  };

  const getDecisionByApplicationNumbers = async (applicationumber) => {
    try {
      const res = await api.get(`getDecisionByApplicationNumber/${applicationumber}`);


      setgetDecisionByApplicationNumber(res?.data?.data);
    } catch (e) {

    }
  };
  const getLogsDetailsByApplicationNumber = async (applicationumber) => {
    try {
      const res = await api.get(`getLogsDetailsByApplicationNumber/${applicationumber}`);


      setLogetails(res?.data?.data);
    } catch (e) {

    }
  };
  const tProductFeeDetailByApplicationNumber = async (applicationumber) => {
    try {
      const res = await api.get(`getProductFeeDetailByApplicationNumber/${applicationumber}`);


      setProductDetailsByApplicationNumber(res?.data?.data);
    } catch (e) {

    }
  };
  const tFeeDetailsByApplicationNumber = async (applicationumber) => {
    try {
      const res = await api.get(`getFeeDetailsByApplicationNumber/${applicationumber}`);


      setFeeDetailsByApplicationNumber(res?.data?.data);
      const allbank = await api.get("getAllBank")
      setgetAllBanklist(allbank?.data?.data?.content?.map(x => ({
        label: x?.bankName,
        value: x?.bankId,
      })) || []);
    } catch (e) {

    }
  };
  const ApplicationDetailsByApplicationNo = async (applicationumber) => {
    try {
      const res = await api.get(`getApplicationDetailsByApplicationNumber/${applicationumber}`);


      setApplicationDetailsByApplicationNumber(res?.data?.data);
    } catch (e) {

    }
  };
  const InitiateDisbByApplicationNumber = async (applicationumber) => {
    try {
      const res = await api.get(`getInitiateDisbByApplicationNumber/${applicationumber}`);


      setInitiatDatabyApplicationNumber(res?.data?.data);
    } catch (e) {

    }
  };
  const GoldPackagingDetailsByApplicationNumber = async (applicationumber) => {
    try {
      const res = await api.get(`getApproveGoldPackagingDetailsByApplicationNumber/${applicationumber}`);


      setApproveGoldPackagingDetailsByApplicationNumber(res?.data?.data);
    } catch (e) {

    }
  };
  const getGoldPackagingDetailsByApplicationNumberss = async (applicationNumber) => {
    try {
      const res = await api.get(`getGoldPackagingDetailsByApplicationNumber/${applicationNumber}`);
      if (res?.data?.data) {

        setgetGoldPackagingDetailsByApplicationNumber(res?.data?.data)
      }
    } catch (e) {

    }
  };
  const getDisbursementRequestMsmeByApplicationId = async (id) => {
    try {
      const res = await api.get(`getDisbursementRequestMsmeByApplicationId/${id}`);
      if (res?.data?.data) {

        setDisbursementRequestMsmeByApplicationId(res?.data?.data)
      }
    } catch (e) {

    }
  };
  const getUpdateDisbursementReleaseByApplicationIdd = async (id) => {
    try {
      const res = await api.get(`getUpdateDisbursementReleaseByApplicationId/${id}`);
      if (res?.data?.data) {

        setgetUpdateDisbursementReleaseByApplicationId(res?.data?.data)
      }
    } catch (e) {

    }
  };
  const getApproveDisbursementReleaseByApplicationId = useCallback(async (leadId) => {
    try {
      const response = await api.get(`getApproveDisbursementReleaseByApplicationId/${leadId}`,

      );
      const lead = response.data.data;

      setApproveDisbursementReleaseByApplicationId(lead);
    } catch (error) {
      console.error('Error fetching lead details:', error);
    }
  }, []);
  useEffect(() => {
    if (ApplicationDetailsByApplicationNumber?.applicationDetailsId) {
      // getDisbursementRequestMsmeByApplicationId(ApplicationDetailsByApplicationNumber?.applicationDetailsId)
      // getUpdateDisbursementReleaseByApplicationIdd(ApplicationDetailsByApplicationNumber?.applicationDetailsId)
      // getApproveDisbursementReleaseByApplicationId(ApplicationDetailsByApplicationNumber?.applicationDetailsId)
      // getApplicationDetailsByIdd(ApplicationDetailsByApplicationNumber?.applicationDetailsId)
    }
  }, [ApplicationDetailsByApplicationNumber])

  useEffect(() => {
    if (selectedLead?.leadId) {
      // getDecisionByApplicationNumbers(selectedLead?.leadId)
      // getGoldPackagingDetailsByApplicationNumberss(selectedLead?.leadId)
      // GoldPackagingDetailsByApplicationNumber(selectedLead?.leadId)
      // InitiateDisbByApplicationNumber(selectedLead?.leadId)
      // ApplicationDetailsByApplicationNo(selectedLead?.leadId)
      // tFeeDetailsByApplicationNumber(selectedLead?.leadId)

      // tProductFeeDetailByApplicationNumber(selectedLead?.leadId)
      getLogsDetailsByApplicationNumber(selectedLead?.leadId)
    }
  }, [selectedLead?.leadId])
  const fetchLookup = async (url, setter, existingList) => {
    try {

      if (existingList?.length) return;

      const res = await api.get(url);

      const raw =
        res?.data?.data?.content ||
        res?.data?.data ||
        [];

      const list = raw.map(x => ({
        label:
          x.lookupName ||
          x.schemeName ||
          x.bankName ||
          x.depositBankName ||
          "",
        value:
          x.lookupCode ||
          x.lookupId ||
          x.schemeId ||
          x.bankId ||
          x.depositBankCode ||
          ""
      }));

      setter(list);

    } catch (e) {
      console.error("Lookup fetch failed:", url, e);
    }
  };
  const loadSectionData = useCallback(async (section) => {

    if (!section || loadedSections.current.has(section)) return;

    loadedSections.current.add(section);

    try {

      switch (section) {

        /* ================= CUSTOMER ================= */

        case "cust-1":

          await Promise.all([
            portfolioList.length ? Promise.resolve() : getPortfolio(),
            branchList.length ? Promise.resolve() : getAllBranch(),
            productList.length ? Promise.resolve() : getProduct(),
            pincodeList.length ? Promise.resolve() : getAllPincodes(),
            ifscList.length ? Promise.resolve() : getAllBankBranches(),
            accountTypeList.length ? Promise.resolve() : getAccountTypes(),

            fetchLookup(
              "getLookupMasterByLookupType?lookupType=Loan%20Purpose",
              setLoanPurposeList,
              loanPurposeList
            )
          ]);

          break;


        /* ================= GOLD DETAILS ================= */

        case "cust-2":

          await Promise.all([
            fetchLookup(
              "getLookupMasterByLookupType?lookupType=Gold%20Purity",
              setGoldPurityList,
              goldPurityList
            ),
            fetchLookup(
              "getLookupMasterByLookupType?lookupType=Gold%20Ownership",
              setGoldOwnershipList,
              goldOwnershipList
            ),
            fetchLookup(
              "getLookupMasterByLookupType?lookupType=Gold%20Status",
              setGoldStatusList,
              goldStatusList
            ),
            fetchLookup(
              "getLookupMasterByLookupType?lookupType=Item%20Category",
              setItemCategoryList,
              ItemCategoryList
            )
          ]);
          await getGoldDetailsByApplicationNumber(selectedLead?.leadId)
          break;


        /* ================= VALUATION ================= */

        case "orig-1":

          await getGoldDetailsByApplicationNumber(selectedLead?.leadId)
          await getGoldValuationByApplicationNumberAll(selectedLead?.leadId)
          break;


        /* ================= SANCTION ================= */

        case "orig-3":
          await getGoldDetailsByApplicationNumber(selectedLead?.leadId)
          await Promise.all([
            fetchLookup(
              "getLookupMasterByLookupType?lookupType=Loan%20Approval",
              setloanApprovalList,
              loanApprovalList
            ),
            fetchLookup(
              "getLookupMasterByLookupType?lookupType=Reject%20Reason",
              setRejectReasonList,
              rejectReasonList
            ),
            fetchLookup(
              "getAllScheme",
              setSchemeList,
              schemeList
            ),
            await getDecisionByApplicationNumbers(selectedLead?.leadId),
          ]);

          break;


        /* ================= PACKAGING ================= */

        case "orig-4":

          if (selectedLead?.leadId) {
            await getGoldPackagingDetailsByApplicationNumberss(selectedLead.leadId);

          }

          break;


        case "orig-5":

          if (selectedLead?.leadId) {
            await GoldPackagingDetailsByApplicationNumber(selectedLead.leadId);
          }

          break;


        /* ================= DISBURSEMENT ================= */

        case "decision-1":

          await Promise.all([
            fetchLookup(
              "getLookupMasterByLookupType?lookupType=Instrument%20Type",
              setInstrumentList,
              InstrumentList
            ),
            fetchLookup(
              "getLookupMasterByLookupType?lookupType=Mode%20of%20Disbursement",
              setDisbursmentmodeList,
              DisbursmentmodeList
            ),
            fetchLookup(
              "getAllDepositBank",
              setdepositbanklist,
              depositbanklist
            ),
            fetchLookup(
              "getAllBank",
              setgetAllBanklist,
              getAllBanklist
            )
          ]);

          if (!AllFees?.length) {
            const fees = await api.get("getAllFee");
            setAllFees(fees?.data?.data?.content || []);
          }

          if (selectedLead?.leadId) {
            await ApplicationDetailsByApplicationNo(selectedLead?.leadId)
            await InitiateDisbByApplicationNumber(selectedLead?.leadId)
            await getDisbursementRequestMsmeByApplicationId(selectedLead.leadId);
            await tFeeDetailsByApplicationNumber(selectedLead?.leadId)
            await tProductFeeDetailByApplicationNumber(selectedLead?.leadId)
          }
          if (ApplicationDetailsByApplicationNumber?.applicationDetailsId) {

            const res = await api.get(
              `getDebtDisbursementSummaryByApplicationDetailId/${ApplicationDetailsByApplicationNumber.applicationDetailsId}`
            );

            setDebtDisbursementSummary(res?.data?.data?.[0]);
          }
          await ScheduleByApplicationNumber(selectedLead?.leadId)
          break;


        case "decision-2":

          if (selectedLead?.leadId) {
            await getApproveDisbursementReleaseByApplicationId(selectedLead.leadId);
          }

          break;


        case "decision-3":

          if (selectedLead?.leadId) {
            await getUpdateDisbursementReleaseByApplicationIdd(selectedLead.leadId);
          }

          break;

        default:
          break;
      }

    } catch (err) {
      console.error("Section API error:", section, err);
    }

  }, [
    portfolioList,
    branchList,
    productList,
    pincodeList,
    ifscList,
    accountTypeList,
    loanPurposeList,
    goldPurityList,
    goldOwnershipList,
    goldStatusList,
    ItemCategoryList,
    loanApprovalList,
    rejectReasonList,
    schemeList,
    InstrumentList,
    DisbursmentmodeList,
    depositbanklist,
    getAllBanklist,
    AllFees,
    selectedLead,
    ApplicationDetailsByApplicationNumber
  ]);
  useEffect(() => {
    if (!activeSub) return;

    loadSectionData(activeSub);

  }, [activeSub]);
  const fetchSchemes = async () => {
    try {
      const res = await api.get("getAllScheme");

      const schemes =
        res.data?.data?.content?.map(s => ({
          label: s.schemeName,   // UI
          value: s.schemeId,     // backend
          schemeCode: s.schemeCode
        })) || [];

      setSchemeList(schemes);
    } catch (e) {

    }
  };
  const getBusinessDates = async () => {
    try {
      const res = await api.get("getBusinessDate");


      setgetBusinessDate(res?.data?.data);
    } catch (e) {

    }
  };

  useEffect(() => {
    if (!getSchemeLoanInterestAmortizationB) return;

    setFormData(prev => ({
      ...prev,
      interestRate: String(getSchemeLoanInterestAmortizationB?.defaultInterestRate || ""),
      tenure: String(getSchemeLoanInterestAmortizationB?.minTenure || ""),
    }));

  }, [getSchemeLoanInterestAmortizationB]);

  const getSchemeLoanInterestAmortizationBySchemeIds = async (id) => {
    try {
      const res = await api.get(`getSchemeLoanInterestAmortizationBySchemeId/${id}`);

      if (res?.data?.msgKey === "Success") {
        const schemeData = res.data.data;

        setSchemeAmortization(schemeData);

        // ✅ BUILD BILLING DROPDOWN
        const cycles =
          schemeData?.billingCycleDataDTO?.map(c => ({
            label: `${c?.cycleDay}`,
            value: c?.billingCycleId,
          })) || [];

        setBillingCycleList(cycles);
        setSchemeCOde(schemeData?.schemeCode)
      }
    } catch (e) {

    }
  };
  useEffect(() => {
    if (formData?.scheme) {
      getSchemeLoanInterestAmortizationBySchemeIds(formData?.scheme)
      const filterschemeCode = schemeList?.filter(i => i.value === formData?.scheme)
      const SchemeCode = filterschemeCode?.[0]
      // setSchemeCOde(SchemeCode)
    }
  }, [formData?.scheme])


  useEffect(() => {
    // fetchSchemes();
    getBusinessDates();
    fetchRejectReasons();
  }, []);

  const fetchRejectReasons = async () => {
    try {
      const res = await api.get(
        "getLookupMasterByLookupType?lookupType=Reject%20Reason"
      );

      const list = (res?.data?.data || [])?.map(i => ({
        label: i?.lookupName,
        value: i?.lookupCode || i?.lookupId,
      }));

      setRejectReasonList(list);

    } catch (e) {

    }
  };
  const [verifiedRoles, setVerifiedRoles] = useState({
    Applicant: false,
    "Co-Applicant": false,
    Guarantor: false,
  });

  const OTP_TYPE_TO_ROLE = {
    applicant: "Applicant",
    coApplicant: "Co-Applicant",
    guarantor: "Guarantor",
  };
  // useEffect(() => {
  //   let mounted = true;



  //   const fetchGoldLookups = async () => {
  //     try {
  //       const [
  //         purityRes,
  //         ownershipRes,
  //         statusRes,
  //         itemcategory,
  //         Approval,
  //         instrument,
  //         Disbursmentmode,
  //         depositbank,
  //         allbank,
  //         AllFee,
  //         DebtSummary,
  //         viewSchedule
  //       ] = await Promise.all([
  //         api.get("getLookupMasterByLookupType?lookupType=Gold%20Purity"),
  //         api.get("getLookupMasterByLookupType?lookupType=Gold%20Ownership"),
  //         api.get("getLookupMasterByLookupType?lookupType=Gold%20Status"),
  //         api.get("getLookupMasterByLookupType?lookupType=Item%20Category"),
  //         api.get("getLookupMasterByLookupType?lookupType=Loan%20Approval"),
  //         api.get("getLookupMasterByLookupType?lookupType=Instrument%20Type"),
  //         api.get("getLookupMasterByLookupType?lookupType=Mode%20of%20Disbursement"),
  //         api.get("getAllDepositBank"),
  //         api.get("getAllBank"),
  //         api.get("getAllFee"),
  //         api.get(`getDebtDisbursementSummaryByApplicationDetailId/${ApplicationDetailsByApplicationNumber?.applicationDetailsId}`),
  //         api.get(`viewScheduleByApplicationNumber/${selectedLead?.leadId}?page=1&size=1000`)
  //       ]);

  //       if (!mounted) return;

  //       setGoldPurityList(purityRes.data?.data?.map(x => ({
  //         label: x.lookupName,
  //         value: x.lookupCode,
  //       })) || []);

  //       setGoldOwnershipList(ownershipRes.data?.data?.map(x => ({
  //         label: x.lookupName,
  //         value: x.lookupCode,
  //       })) || []);

  //       setGoldStatusList(statusRes.data?.data?.map(x => ({
  //         label: x?.lookupName,
  //         value: x?.lookupCode,
  //       })) || []);

  //       setItemCategoryList(itemcategory.data?.data?.map(x => ({
  //         label: x.lookupName,
  //         value: x.lookupCode,
  //       })) || []);

  //       setloanApprovalList(Approval.data?.data?.map(x => ({
  //         label: x?.lookupName,
  //         value: x?.lookupCode,
  //       })) || []);

  //       setInstrumentList(instrument.data?.data?.map(x => ({
  //         label: x?.lookupName,
  //         value: x?.lookupCode,
  //       })) || []);

  //       setDisbursmentmodeList(Disbursmentmode.data?.data?.map(x => ({
  //         label: x?.lookupName,
  //         value: x?.lookupCode,
  //       })) || []);

  //       setdepositbanklist(depositbank.data?.data?.map(x => ({
  //         label: x?.depositBankName,
  //         value: x?.depositBankCode,
  //         accountNumber: x?.accountNumber,
  //       })) || []);

  //       setgetAllBanklist(allbank.data?.data?.content?.map(x => ({
  //         label: x?.bankName,
  //         value: x?.bankId,
  //       })) || []);

  //       setAllFees(AllFee.data?.data?.content || []);
  //       
  //       setDebtDisbursementSummary(DebtSummary?.data?.data?.[0])

  //       setviewSchedule(viewSchedule?.data?.response)
  //     } catch (e) {
  //       console.error("Gold lookup error", e);
  //     }
  //   };

  //   fetchGoldLookups();

  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  const getAllBankBranches = async () => {
    try {
      const res = await api.get("getAllBankBranches");

      const list =
        res?.data?.data.content?.map(b => ({
          label: b.ifscCode,               // shown in dropdown
          value: b.ifscCode,               // stored in form
          bankName: b?.bankName,
          branchName: b.bankBranchName,
        })) || [];

      setIfscList(list);
    } catch (e) {

    }
  };

  const getAccountTypes = async () => {
    try {
      const res = await api.get(
        "getLookupMasterByLookupType?lookupType=Account%20Type"
      );

      const list =
        res?.data?.data?.map(x => ({
          label: x.lookupName,
          value: x.lookupCode,
        })) || [];

      setAccountTypeList(list);
    } catch (e) {

    }
  };

  const getPortfolio = useCallback(async () => {
    const res = await api.get(`getAllPortfolios`);

    setPortfolioList(
      (res.data?.data.content || [])?.map(x => ({
        label: x.portfolioDescription,
        value: x.portfolioId,
      }))
    );
  }, []);

  const getAllBranch = useCallback(async () => {
    const res = await api.get(`getAllBranch`);

    setBranchList(
      (res.data?.data.content || [])?.map(x => ({
        label: x.branchName,
        value: x.branchId,
      }))
    );
  }, []);

  const getProduct = useCallback(async () => {
    const res = await api.get(`getLookupMasterByLookupType?lookupType=Product`);

    setProductList([
      { label: "Gold Loan", value: 1 },

    ]);
  }, []);

  useEffect(() => {
    // getAllBankBranches();
    // getAccountTypes();
    // getPortfolio();
    // getProduct();
    // getAllBranch();
  }, []);

  const otpInputs = useRef([]);
  const canSubmitLead = useMemo(() => {
    return Object.values(verifiedRoles).every(Boolean);
  }, [verifiedRoles]);

  useEffect(() => {
    otpInputs.current = [];
  }, [modalPayload?.type]);
  useEffect(() => {



  }, [activeModal, modalPayload, verifiedRoles]);

  const handleOtpChange = useCallback((text, type, index) => {
    if (type === "applicant") {
      const updated = [...otpApplicant];
      updated[index] = text;
      setOtpApplicant(updated);
    }
    else if (type === "coApplicant") {
      const updated = [...otpCoApplicant];
      updated[index] = text;
      setOtpCoApplicant(updated);
    }
    else if (type === "guarantor") {
      const updated = [...otpGurantor];
      updated[index] = text;
      setotpGurantor(updated);
    }

    if (text && index < 3) {
      otpInputs.current[index + 1]?.focus();
    }
  }, [otpApplicant, otpCoApplicant, otpGurantor]);

  const otpMap = {
    applicant: otpApplicant,
    coApplicant: otpCoApplicant,
    guarantor: otpGurantor,
  };

  const MobileNo =
    leadByLeadiD?.applicant
      ?.find(a => a.applicantTypeCode === "Applicant")
      ?.consumptionApplicant?.mobileNumber || null;

  const MOBILE_NUMBER_MAP = {
    applicant: MobileNo,
  };

  const APPLICANT_ID_MAP = {
    applicant: leadByLeadiD?.applicant
      ?.find(a => a.applicantTypeCode === "Applicant")
      ?.consumptionApplicant?.consumptionApplicantId,

    coApplicant: leadByLeadiD?.applicant
      ?.find(a => a.applicantTypeCode === "Co-Applicant")
      ?.consumptionApplicant?.consumptionApplicantId,

    guarantor: leadByLeadiD?.applicant
      ?.find(a => a.applicantTypeCode === "Guarantor")
      ?.consumptionApplicant?.consumptionApplicantId,
  };

  useEffect(() => {
    const applicant = leadByLeadiD?.applicant
      ?.find(a => a.applicantTypeCode === "Applicant")
    // ?.consumptionApplicant?.consumptionApplicantId,

    const coApplicant = leadByLeadiD?.applicant
      ?.find(a => a.applicantTypeCode === "Co-Applicant")
    // ?.consumptionApplicant?.consumptionApplicantId,

    const guarantor = leadByLeadiD?.applicant
      ?.find(a => a.applicantTypeCode === "Guarantor")

    setSelectedLeadApplicant(applicant)
    setSelectedCoApplicant(coApplicant)
    setselectedGurantor(guarantor)
  }, [leadByLeadiD])

  const verifyOtpGeneric = async type => {
    try {
      setIsLoading(true);

      const res = await api.post("verifyOtp", {
        mobileNumber: MOBILE_NUMBER_MAP[type],
        otp: otpMap[type].join(""),
        consumptionApplicantId: APPLICANT_ID_MAP[type],
        applicationNumber: leadByLeadiD?.applicationNo,
      });



      const msgKey = res?.data?.msgKey;
      setIsOtpVisible(false)
      closeModal();  // ✅ CLOSE MODAL HERE
      if (msgKey === "Success") {
        setVerifiedRoles(prev => ({
          ...prev,
          [OTP_TYPE_TO_ROLE[type]]: true,
        }));

        await PAN_HANDLER_MAP[type]?.();
        setIsOtpVisible(false);
        return;
      }

      Alert.alert(res?.data?.msgKey || "Error", res?.data?.message);

    } catch (err) {


      // ✅ fallback check
      if (err?.response?.data?.msgKey === "Success") {
        setVerifiedRoles(prev => ({
          ...prev,
          [OTP_TYPE_TO_ROLE[type]]: true,
        }));
        await PAN_HANDLER_MAP[type]?.();
        setIsOtpVisible(false);
        return;
      }

      // Alert.alert("Error", "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (type, onOtpSuccess) => {
    verifyOtpGeneric(type, onOtpSuccess);
  };

  const fetchPanDetails = async (id, applicationumber) => {
    try {
      const response = await api.get(`panDetailsNew/${id}/${applicationumber}`, {

      });

      if (response.data.msgKey === "Success") {
        Alert.alert('Success', 'PAN verification successful!');

      } else {
        Alert.alert('Error', 'PAN verification failed.');
      }
    } catch (error) {
      console.error('PAN verification API error:', error);
      Alert.alert('Error', 'Failed to verify PAN.');
    }
  };

  const getpanDetails = async () => {
    const applicationumber = leadByLeadiD?.applicationNo;
    const id = APPLICANT_ID_MAP?.applicant
    if (!id) return;
    await fetchPanDetails(id, applicationumber);
  };

  const getpanDetailsCoApplicant = async () => {
    const applicationumber = leadByLeadiD?.applicationNo;
    const id = APPLICANT_ID_MAP.coApplicant
    if (!id) return;
    await fetchPanDetails(id, applicationumber);
  };

  const getpanDetailsGurantor = async () => {
    const applicationumber = leadByLeadiD?.applicationNo;
    const id = APPLICANT_ID_MAP.guarantor
    if (!id) return;
    await fetchPanDetails(id, applicationumber);
  };

  const PAN_HANDLER_MAP = {
    applicant: getpanDetails,
    coApplicant: getpanDetailsCoApplicant,
    guarantor: getpanDetailsGurantor,
  };
  // OTP for Applicant
  const sendOtpGeneric = async (type) => {
    let mobileNumber;
    if (type === "applicant") mobileNumber = SelectedLeadApplicant?.consumptionApplicant?.mobileNumber;
    else if (type === "coApplicant") mobileNumber = "1252521599";
    else if (type === "guarantor") mobileNumber = "0000000000";
    else return;


    if (!mobileNumber) {
      console.warn("❌ No mobile number for:", type);
      return;
    }

    setIsSubmitting(true);
    setIsLoadingsentotp(true);

    try {
      const res = await api.post(
        `sendOtpToMobile`,
        { mobileNumber },

      );

      if (res.data.msgKey === "Success") {

        // openModal(MODALS.OTP, { type }); // 🔥 THIS WAS MISSING
        setOtpType(type);
        setIsOtpVisible(true); // 🔥 DOES NOT TOUCH CREATE_LEAD
      } else {
        Alert.alert(res.data.msgKey, res.data.message);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
      setIsLoadingsentotp(false);
    }
  };

  const handleLeadCreateSuccess = (leadData) => {
    setSelectedLeadApplicant(leadData?.applicant);
    setTimeout(() => {
      sendOtpGeneric("applicant"); // ✅ OPEN OTP AFTER
    }, 0);
  };

  const handleVerifyMobileSuccess = (coApplicantData) => {
    setSelectedCoApplicant(coApplicantData);
    setTimeout(() => {
      sendOtpGeneric("coApplicant");
    }, 0);
  };

  const handleGurantorVerificationSuccess = (gurantorData) => {
    setselectedGurantor(gurantorData);
    setTimeout(() => {
      sendOtpGeneric("guarantor");
    }, 0);
  };




  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleCreatePress = () => {
    openModal(MODALS.CREATE_LEAD)
    setLeadsWithLoanAmount([]);
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.triggerCreate) {
        handleCreatePress();
      }
    }, [route.params?.triggerCreate])
  );
  useEffect(() => {
    if (leadByLeadiD && leadByLeadiD.length > 0) {
      const applicant = leadByLeadiD?.applicant.find(person => person?.applicantTypeCode === 'Applicant') || null;
      const coApplicant = leadByLeadiD?.applicant.find(person => person?.applicantTypeCode === 'Co-Applicant') || null;
      const guarantor = leadByLeadiD?.applicant.find(person => person?.applicantTypeCode === 'Gurantor') || null;

      if (applicant) setSelectedLeadApplicant(applicant);
      if (coApplicant) setSelectedCoApplicant(coApplicant);
      if (guarantor) setselectedGurantor(guarantor);
    }
  }, [leadByLeadiD]);

  const normalizeLeads = (leads = []) => {
    return leads?.map(lead => {
      const applicant = lead?.applicant?.find(
        a => a.applicantTypeCode === 'Applicant'
      );

      const profile = applicant?.consumptionApplicant ?? {};

      return {
        id: lead.id,
        leadId: lead.applicationNo,
        loanAmount: lead.loanAmount,
        productName: lead.productName,
        stage: lead.stage,
        status: lead.status,

        applicantTypeCode: applicant?.applicantTypeCode,
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        email: profile.email,
        pan: profile.pan,
        mobileNo: profile.mobileNumber,
        dateOfBirth: profile.dateOfBirth,
      };
    });
  };

  useEffect(() => {
    getAllLeads();
  }, []);



  const filteredData = useMemo(() => {
    if (!leadsWithLoanAmount.length) return [];
    if (!searchQuery) return leadsWithLoanAmount;

    const query = searchQuery.toLowerCase().trim();

    return leadsWithLoanAmount.filter(item =>
      [
        item.firstName,
        item.lastName,
        item.pan,
        item.mobileNo,
        item.leadId,
      ].some(field => field?.toLowerCase()?.includes(query))
    );
  }, [leadsWithLoanAmount, searchQuery]);

  const setFieldValue = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const colorScheme = useColorScheme();
  const placeholderColor = colorScheme === "dark" ? "#d3d3d3" : "#808080";
  const errorsRef = useRef({});
  const renderInputt = (
    label,
    value,
    setValue,
    editable = true,
    placeholder = "",
    isMobile = false,
    isPan = false,
    isAadhaar = false,
    isEmail = false,
    fieldName,
    isVerified = "",
    required = true,
    multiline = false,
    finaloccupation = "",
    finaloccupationCo = "",
    isgw = false,
    isgp = false,
    isav = false,
    isNumber = false
  ) => {
    const handleAadhaarValidation = (aadhaarValue) => {
      if (aadhaarValue.length > 0 && aadhaarValue.length !== 12) {
        errorsRef.current[fieldName] = "Invalid Aadhaar Number. Must be 12 digits.";
      } else {
        delete errorsRef.current[fieldName];
      }
    };

    const getKeyboardTypeForPan = (panValue = "") => {
      const val = panValue || "";
      if (val.length < 5) return "default";
      if (val.length >= 5 && val.length < 9) return "numeric";
      return "default";
    };

    const handleKeyboardDismiss = (newValue, isFieldPan) => {
      if (
        (isFieldPan && newValue.length === 10) ||
        (isMobile && newValue.length === 10) ||
        (isAadhaar && newValue.length === 12)
      ) {
        Keyboard.dismiss();
      }
    };

    let keyboardType = "default";
    if (isgw || isgp || isNumber || isav) keyboardType = "decimal-pad";
    else if (isMobile || isAadhaar) keyboardType = "numeric";
    else if (isPan) keyboardType = getKeyboardTypeForPan(value);

    let maxLength;
    if (isPan) maxLength = 10;
    else if (isMobile) maxLength = 10;
    else if (isAadhaar) maxLength = 12;
    else if (isgp) maxLength = 3;

    return (
      <View >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>

          {isVerified && (
            <Icon
              name="checkmark-circle"
              size={16}
              color="#22C55E"
              style={{ marginLeft: 6 }}
            />
          )}
        </View>


        <TextInput
          style={[
            styles.inputformodal,
            {
              borderColor: isVerified
                ? "#22C55E" // ✅ green when verified
                : errorsRef.current?.[fieldName]
                  ? "#FF4D4F"
                  : "#ccc",

              backgroundColor: editable
                ? "#fff"
                : "#f5f5f5",

              color: editable ? "#000" : "#666",

              minHeight: multiline
                ? (isSmallScreen ? 50 : 60)
                : (isSmallScreen ? 36 : 44),

              fontSize: isSmallScreen ? 12 : 14,
              paddingHorizontal: isSmallScreen ? 8 : 10,
            },
          ]}
          value={value || ""}

          editable={!isVerified && editable}   // 🔐 LOCK AFTER VERIFIED

          onChangeText={(text) => {
            if (isVerified) return;            // 🛑 safety guard

            let newValue = text;

            if (isPan)
              newValue = newValue.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
            else if (isMobile || isAadhaar)
              newValue = newValue.replace(/[^0-9]/g, "");
            else if (isgw || isgp || isNumber || isav)
              newValue = newValue.replace(/[^0-9.]/g, "");

            setValue(newValue);

            if (isAadhaar) handleAadhaarValidation(newValue);
            handleKeyboardDismiss(newValue, isPan);
          }}

          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          textAlignVertical={multiline ? "top" : "center"}
        />


        {errorsRef.current?.[fieldName] && (
          <Text style={styles.errorText}>
            {errorsRef.current[fieldName]}
          </Text>
        )}
      </View>
    );
  };

  const handleDocumentSelection = async (itemIndex, docType) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      });

      const validFiles = [];

      for (const file of res) {
        let filePath = file.uri;

        if (file.uri.startsWith("content://") && Platform.OS === "android") {
          const localPath = `${RNFS.DocumentDirectoryPath}/${file.name}`;
          await RNFS.copyFile(file.uri, localPath);
          filePath = localPath;
        }

        const base64 = await RNFS.readFile(filePath, "base64");

        validFiles.push({
          id: Date.now() + Math.random(),
          uri: `file://${filePath}`,
          Name: file.name,
          type: file.type,
          base64,
          imageType: docType,
        });
      }

      // Remove setketImage — documents is single source of truth
      setDocuments(prev => ({
        ...prev,
        [itemIndex]: {
          ...(prev[itemIndex] || {
            FRONT: [],
            BACK: [],
            LEFT: [],
            RIGHT: [],
            HALLMARK: [],
          }),
          [docType]: [
            ...(prev[itemIndex]?.[docType] || []),
            ...validFiles,
          ],
        },
      }));

    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error(err);
      }
    }
  };

  const handlePreview = (itemIndex, docType, file) => {
    if (!file) {
      Alert.alert("No File", "Nothing to preview.");
      return;
    }

    const uri = file.uri ||
      (file.base64 ? `data:image/png;base64,${file.base64}` : null);

    if (!uri) {
      Alert.alert("Preview Error", "File has no previewable content.");
      return;
    }

    setPreviewData({ itemIndex, docType, file: { ...file, uri } });
    setPreviewVisible(true);
  };

  const handleRemovePress = (itemIndex, docType, index) => {
    setFileToRemove({ itemIndex, docType, index });
    setConfirmRemoveModalVisible(true);
  };

  const confirmRemoveFile = () => {
    if (!fileToRemove) return;

    const { itemIndex, docType, index } = fileToRemove;

    setDocuments(prev => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        [docType]: prev[itemIndex][docType].filter((_, i) => i !== index),
      },
    }));

    setConfirmRemoveModalVisible(false);
    setFileToRemove(null);
  };


  const rebuildDocumentsFromApi = (goldDetails = []) => {
    const docs = {};

    goldDetails.forEach((item, index) => {
      docs[index] = {
        FRONT: [],
        BACK: [],
        LEFT: [],
        RIGHT: [],
        HALLMARK: [],
      };

      (item.getGoldItemImageDto || []).forEach(img => {
        const type = img.imageType;

        if (docs[index][type]) {
          docs[index][type].push({
            id: img.goldItemImageId,
            Name: type,
            base64: img.itemImage,
            uri: `data:image/png;base64,${img.itemImage}`, // ← ADD THIS
            imageType: type,
          });
        }
      });
    });

    return docs;
  };
  // ✅ Single source of truth — initialize documents from gold items
  useEffect(() => {
    if (!GoldDetailsByApplicationNumber?.getGoldDetailsDto?.length) return;

    const rebuiltDocs = rebuildDocumentsFromApi(
      GoldDetailsByApplicationNumber.getGoldDetailsDto
    );

    setDocuments(prev => ({
      ...prev,
      ...rebuiltDocs,
    }));

  }, [GoldDetailsByApplicationNumber]);


  // ✅ Packet photo — always goes to PACKET.FRONT
  useEffect(() => {
    if (!getGoldPackagingDetailsByApplicationNumber?.goldPacketPhoto) return;

    const file = {
      id: "packet-photo",
      Name: getGoldPackagingDetailsByApplicationNumber.goldPacketPhotoName || "Packet Image",
      uri: `data:image/jpeg;base64,${getGoldPackagingDetailsByApplicationNumber.goldPacketPhoto}`,
      base64: getGoldPackagingDetailsByApplicationNumber.goldPacketPhoto,
      type: "image/jpeg",
      imageType: "FRONT",
    };

    setDocuments(prev => ({
      ...prev,
      PACKET: {
        ...(prev.PACKET || { FRONT: [], BACK: [], LEFT: [], RIGHT: [], HALLMARK: [] }),
        FRONT: [file],
      },
    }));

  }, [getGoldPackagingDetailsByApplicationNumber]);




  const renderPacketDocContent = useCallback(() => {
    const currentDocs = documents?.["PACKET"]?.[activeDocTab] || [];

    return (
      <View style={styles.uploadSectionf}>
        <Text style={styles.contentTitle}>Upload {activeDocTab}</Text>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => handleDocumentSelection("PACKET", activeDocTab)}
        >
          <Text style={styles.uploadBtnText}>+ Upload {activeDocTab}</Text>
        </TouchableOpacity>

        {currentDocs?.length ? (
          currentDocs?.map((file, index) => (
            <View key={file.id} style={styles.fileRow}>
              <Text numberOfLines={1} style={styles.fileName}>
                {file.Name}
              </Text>
              <View style={styles.fileActions}>
                <TouchableOpacity onPress={() => handlePreview("PACKET", activeDocTab, file)}>
                  <Text style={styles.previewText}>👁 Preview</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePreview(itemIndex, activeDocTab, file)}>
                  <Text style={styles.removeText}>🗑 Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noFileText}>No {activeDocTab} uploaded yet</Text>
        )}
      </View>
    );
  }, [documents, activeDocTab]);

  const documentsRef = useRef(documents);
  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);
  const renderDocContent = (itemIndex) => {
    const currentDocs = documents?.[itemIndex]?.[activeDocTab] || [];

    return (
      <View style={styles.uploadSectionf}>
        <Text style={styles.contentTitle}>Uplovvad {activeDocTab}</Text>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => handleDocumentSelection(itemIndex, activeDocTab)}
        >
          <Text style={styles.uploadBtnText}>+ Upload {activeDocTab}</Text>
        </TouchableOpacity>

        {currentDocs.length ? (
          currentDocs?.map((file, index) => (
            <View key={file.id} style={styles.fileRow}>
              <Text numberOfLines={1} style={styles.fileName}>
                {file.Name}
              </Text>

              <View style={styles.fileActions}>
                <TouchableOpacity onPress={() => handlePreview(itemIndex, activeDocTab, file)}>
                  <Text style={styles.previewText}>👁 Preview</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    handleRemovePress(itemIndex, activeDocTab, index)
                  }
                >
                  <Text style={styles.removeText}>🗑 Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noFileText}>No {activeDocTab} uploaded yet</Text>
        )}
      </View>
    );
  }

  // const getAllPincodes = useCallback(async () => {
  //   try {
  //     const response = await api.get(`getAllPincodes`, {

  //     });

  //     const Pincodes = response.data?.data?.content || [];

  //     const transformedPincodes = Pincodes?.map(p => ({ value: p.pincodeId, label: p.pincode }));

  //     // Batch update all relevant states
  //     setPincode(transformedPincodes);
  //     setPincodeco(transformedPincodes);
  //     setPincodeguar(transformedPincodes);


  //   } catch (error) {
  //     console.error('Failed to fetch pincodes:', error);
  //     Alert.alert('Error', 'Failed to fetch Pincodes data');
  //   }
  // }, [token]);
  const getAllPincodes = useCallback(async () => {

    try {

      if (pincodeList.length) return;

      const response = await api.get("getAllPincodes");

      const raw = response?.data?.data?.content || [];

      const transformed = raw.map(p => ({
        label: p?.pincode,
        value: p?.pincodeId
      }));

      setPincodeList(transformed);

    } catch (error) {

      console.error("Failed to fetch pincodes:", error);

      Alert.alert(
        "Error",
        "Failed to fetch Pincodes data"
      );
    }

  }, [pincodeList]);
  // useEffect(() => {
  //   getLoanPurpose();
  // }, []);

  // useEffect(() => {
  //   if (activeCust1Tab === 'Applicant') {
  //     getAllPincodes();
  //   }
  // }, [activeCust1Tab])



  const fetchDataByPincode = async (pincode, type) => {

    if (!pincode || !type) return;

    try {
      const res = await api.get(
        `findAreaNameCityStateRegionZoneCountryByPincode/${pincode}`
      );

      setCategoryData(prev => ({
        ...prev,
        [type]: res?.data?.data || {},
      }));
    } catch (e) {

    }
  };

  const getBankBranchByBankId = async (id) => {
    try {
      const res = await api.get(`getBankBranchByBankId/${id}`)

      setBranchist(
        res.data.data?.map(x => ({
          label: x.bankBranchName,
          value: x.bankBranchId
        }))
      );
    } catch (e) {
      console.error('Failed')
    }
  }

  useEffect(() => {
    const { applicant, coApplicant, guarantor, applicantpermanent, coApplicantpermanent, guarantorpermanent } = categoryData;

    setFormData((prev) => ({
      ...prev,

      // Current Address
      Country: applicant?.countryName || '',
      State: applicant?.stateName || '',
      City: applicant?.cityName || '',
      Area: applicant?.areaName || '',

      coCountry: coApplicant?.countryName || '',
      coState: coApplicant?.stateName || '',
      coCity: coApplicant?.cityName || '',
      coArea: coApplicant?.areaName || '',

      guarCountry: guarantor?.countryName || '',
      guarState: guarantor?.stateName || '',
      guarCity: guarantor?.cityName || '',
      guarArea: guarantor?.areaName || '',

      // Permanent Address
      // per_pincode: applicantpermanent?.pincode || '',
      // per_pincode: resolvePincode(applicantpermanent?.pincode),
      per_Area: applicantpermanent?.areaName || '',
      per_City: applicantpermanent?.cityName || '',
      per_State: applicantpermanent?.stateName || '',
      per_Country: applicantpermanent?.countryName || '',

      // co_per_pincode: coApplicantpermanent?.pincode || '',
      // co_per_pincode: resolvePincode(coApplicantpermanent?.pincode),
      co_per_Area: coApplicantpermanent?.areaName || '',
      co_per_City: coApplicantpermanent?.cityName || '',
      co_per_State: coApplicantpermanent?.stateName || '',
      co_per_Country: coApplicantpermanent?.countryName || '',

      // guar_per_pincode: guarantorpermanent?.pincode || '',
      // guar_per_pincode: resolvePincode(guarantorpermanent?.pincode),
      guar_per_Area: guarantorpermanent?.areaName || '',
      guar_per_City: guarantorpermanent?.cityName || '',
      guar_per_State: guarantorpermanent?.stateName || '',
      guar_per_Country: guarantorpermanent?.countryName || '',
    }));
  }, [categoryData]);


  const TAB_STAGE_MAP = {
    "cust-1": "Customer Acquisition",
    "cust-2": "GoldDetails",
    "cust-3": "Customer Acquisition",
    "cust-4": "Customer Acquisition",

    "orig-1": "Valuation",
    "orig-3": "LoanDetails",
    "orig-4": "Gold Packaging",
    "orig-5": "Gold Packaging",

    "decision-1": "Disbursement",
    "decision-2": "Disbursement",
    "decision-3": "Disbursement",

    "disb-1": "Disbursement"
  };
  const DISBURSEMENT_TAB_ORDER = [
    "decision-1",
    "decision-2",
    "decision-3"
  ];
  const normalizeStage = (stage) =>
    stage?.replace(/\s+/g, "").toLowerCase();
  const lastDisbursementLog = useMemo(() => {
    return Logetails
      ?.filter(l => normalizeStage(l.stage) === "disbursement")
      ?.sort((a, b) => b.createdTime - a.createdTime)[0] ?? null;
  }, [Logetails]);
  const DISBURSEMENT_TAB_MAP = {
    "Disbursement Request": "decision-1",
    "Approve Disbursement": "decision-2",
    "Update Disbursement": "decision-3"
  };


  // const currentDecisionIndex = useMemo(() => {

  //   if (!lastDisbursementLog) return -1;

  //   const tabId = DISBURSEMENT_TAB_MAP[lastDisbursementLog.description];

  //   return DISBURSEMENT_TAB_ORDER.indexOf(tabId);

  // }, [lastDisbursementLog]);
  const STAGE_ORDER = [
    "customeracquisition",
    "golddetails",
    "valuation",
    "loandetails",
    "goldpackaging",
    "disbursement"
  ];

  const currentWorkflow = useMemo(() => {
    if (!Array.isArray(Logetails) || !Logetails.length) return null;

    let highestIndex = -1;
    let candidate = null;

    // 1️⃣ First check Pending stage created by current user
    Logetails.forEach(log => {

      const index = STAGE_ORDER.indexOf(
        normalizeStage(log.stage)
      );

      if (index === -1) return;

      if (
        log.status === "Pending" &&
        log.user === userDetails?.firstName
      ) {
        if (index > highestIndex) {
          highestIndex = index;
          candidate = log;
        }
      }

    });

    if (candidate) return candidate;

    // 2️⃣ If no Pending → fallback to highest Completed
    highestIndex = -1;

    Logetails.forEach(log => {

      const index = STAGE_ORDER.indexOf(
        normalizeStage(log.stage)
      );

      if (index === -1) return;

      if (log.status === "Completed" && index > highestIndex) {
        highestIndex = index;
        candidate = log;
      }

    });

    return candidate;

  }, [Logetails, userDetails]);

  const currentStage = currentWorkflow?.stage ?? null;
  const currentStatus = currentWorkflow?.status ?? null;
  const STAGE_TAB_RULES = {
    "Customer Acquisition": {
      Completed: ["cust", "orig"],
      Pending: ["cust"]
    },
    "GoldDetails": {
      Completed: ["cust", "orig"],
      Pending: ["cust"]
    },
    "Valuation": {
      Completed: ["cust", "orig", "decision"],
      Pending: ["cust", "orig"]
    },
    "Disbursement": {
      Completed: ["cust", "orig", "decision", "disbursal"],
      Pending: ["cust", "orig", "decision"]
    }
  };

  const mainTabs = useMemo(() => [
    {
      id: "cust",
      title: "Customer Acquisition",
      children: [
        { id: "cust-1", title: "Customer Details" },
        { id: "cust-2", title: "Gold Details" },
        { id: "cust-3", title: "Document Upload" },
        { id: "cust-4", title: "KYC & Bureau" },
      ],
    },
    {
      id: "orig",
      title: "Origination",
      children: [
        { id: "orig-1", title: "Gold Valuation" },
        { id: "orig-3", title: "Loan Details" },
        { id: "orig-4", title: "gold packaging" },
        { id: "orig-5", title: "Aprove gold packaging" },
      ],
    },
    {
      id: "decision",
      title: "Decision",
      children: [
        { id: "decision-1", title: "Disbursement Request" },
        { id: "decision-2", title: "Approve Disbursement" },
        { id: "decision-3", title: "Update Dibursement" },
      ],
    },
    {
      id: "disbursal",
      title: "Disbursal",
      children: [
        { id: "disb-1", title: "Disbursal" },
      ],
    },
  ], []);

  const allowedMainIds = useMemo(() => {
    if (!currentStage || !currentStatus) {
      return mainTabs.map(tab => tab.id);
    }

    return (
      STAGE_TAB_RULES[currentStage]?.[currentStatus] ??
      mainTabs.map(tab => tab.id)
    );
  }, [currentStage, currentStatus]);




  const getTabPrefixMap = {
    Applicant: "",
    "Co-Applicant": "co",
    Guarantor: "guar",
  };

  useEffect(() => {
    const objerole = userDetails?.role?.[0];
    if (!objerole?.access) return;

    const access = JSON.parse(objerole.access);

    const keysWithF = Object.keys(access).filter(
      key => access[key] === "F"
    );

    setAccesTabs(keysWithF);
  }, [userDetails]);

  const accessKeyMap = useMemo(() => ({
    "cust-1": "customeracquisition_customerdetails",
    "cust-2": "customeracquisition_golddetails",
    "cust-3": "customeracquisition_documentupload",
    "cust-4": "customeracquisition_kycbureau",

    "orig-1": "customeracquisition_valuation",
    "orig-3": "customeracquisition_loandetails",
    "orig-4": 'customeracquisition_goldpackagingvaulting',
    "orig-5": 'customeracquisition_approvegoldpackaging',

    "decision-1": "customeracquisition_disbursementrequest",
    "decision-2": "customeracquisition_approvedisbursement",
    "decision-3": "customeracquisition_updatedisbursement",

    // "disb-1": "customeracquisition_approvedisbursement",
  }), []);

  const hasRenderableFields = useCallback((tabId) => {
    const sections = pageFields[tabId];

    if (!sections) return false;

    // cust-1 is object (Applicant/Co-Applicant)
    if (!Array.isArray(sections)) {
      return Object.values(sections).some(group =>
        group?.some(section => section.fields?.length > 0)
      );
    }


    return sections.some(section => section.fields?.length > 0);
  }, []);

  const getAllowedTabs = useCallback((tabs = [], accessTabList = []) => {
    if (!Array.isArray(accessTabList)) return [];

    return tabs.filter(tab => {
      const accessKey = accessKeyMap[tab.id];
      if (!accessKey) return false;

      if (!accessTabList?.includes(accessKey)) return false;

      return hasRenderableFields(tab.id);
    });
  }, [hasRenderableFields]);

  const currentStageIndex = useMemo(() => {
    if (!currentStage) return -1;

    return STAGE_ORDER.indexOf(
      normalizeStage(currentStage)
    );

  }, [currentStage]);
  const currentDecisionIndex = useMemo(() => {

    if (!Array.isArray(Logetails)) return -1;

    const disbursementLogs = Logetails.filter(
      log => normalizeStage(log.stage) === "disbursement"
    );

    if (!disbursementLogs.length) return -1;

    const map = {
      "Disbursement Request": 0,
      "Approve Disbursement": 1,
      "Update Disbursement": 2
    };

    let highestIndex = -1;

    disbursementLogs.forEach(log => {

      const index = map[log.description];

      if (index === undefined) return;

      if (log.status === "Completed") {
        highestIndex = Math.max(highestIndex, index);
      }

      if (log.status === "Pending") {
        highestIndex = index;
      }

    });

    return highestIndex;

  }, [Logetails]);
  const filteredMainTabs = useMemo(() => {
    if (!Array.isArray(accesTabs)) return [];

    return mainTabs
      .map((main) => {

        const allowedChildren = getAllowedTabs(main.children, accesTabs);

        const isCreateMode = !selectedLead;
        const childrenWithState = allowedChildren.map((child) => {

          const stageName = TAB_STAGE_MAP[child.id];

          const stageIndex = STAGE_ORDER.indexOf(
            normalizeStage(stageName)
          );

          let isDisabled = false;

          // 🔹 Only apply workflow rules if editing existing lead
          if (!isCreateMode) {

            isDisabled =
              stageIndex === -1 ||
              currentStageIndex === -1 ||
              stageIndex > currentStageIndex;

            if (normalizeStage(stageName) === "disbursement") {

              const tabIndex =
                DISBURSEMENT_TAB_ORDER.indexOf(child.id);

              if (tabIndex > currentDecisionIndex) {
                isDisabled = true;
              }

            }

          }

          return {
            ...child,
            disabled: isDisabled
          };

        });
        return {
          ...main,
          children: childrenWithState,
        };

      })
      .filter((main) => main.children?.length > 0);

  }, [mainTabs, accesTabs, currentStageIndex, currentStatus]);
  const subTabs = useMemo(() => {
    const main = filteredMainTabs.find((m) => m.id === activeMain);
    return main ? main.children : [];
  }, [activeMain, filteredMainTabs]);

  const visibleTabs = useMemo(() => {
    return filteredMainTabs.flatMap(main => main.children);
  }, [filteredMainTabs]);

  const renderedTabs = useMemo(() =>
    visibleTabs.map(tab => {
      const isActive = activeSub === tab.id;
      const isDisabled = tab.disabled;

      return (
        <TouchableOpacity
          key={tab.id}
          disabled={isDisabled}
          style={[
            styles.tab,
            isActive && styles.activeTab,
            isDisabled && styles.disabledTab
          ]}
          onPress={() => !isDisabled && setActiveSub(tab.id)}
        >
          <Text style={[
            styles.tabText,
            isActive && styles.activeTabText,
            isDisabled && styles.disabledTabText
          ]}>
            {tab.title}
          </Text>
        </TouchableOpacity>
      );
    }),
    [visibleTabs, activeSub]);

  const renderCheckboxField = (f, idx, onValueChange) => (
    <View style={styles.checkboxRow}>
      <CheckBox
        value={formData[f.field] || false}
        onValueChange={onValueChange}
        tintColors={{ true: '#007bff', false: '#ccc' }}
      />
      <Text style={{ marginLeft: 8 }}>{f.label}</Text>
    </View>
  );
  const PINCODE_TYPE_MAP = {
    pincode: "applicant_current",
    per_pincode: "applicant_permanent",

    coPincode: "co_current",
    co_per_pincode: "co_permanent",

    guarPincode: "guar_current",
    guar_per_pincode: "guar_permanent",
  };

  const handleSameAsCurrentToggle = (checkboxField) => (isChecked) => {
    setFormData(prev => {
      const updated = { ...prev };
      updated[checkboxField.field] = isChecked;

      // const map = {
      //   Applicant: {
      //     cur: ["addressline1", "addressline2", "addressline3", "pincode"],
      //     per: ["per_addressline1", "per_addressline2", "per_addressline3", "per_pincode"],
      //   },
      //   "Co-Applicant": {
      //     cur: ["co_addressline1", "co_addressline2", "co_addressline3", "coPincode"],
      //     per: ["co_per_addressline1", "co_per_addressline2", "co_per_addressline3", "co_per_pincode"],
      //   },
      //   Guarantor: {
      //     cur: ["guar_addressline1", "guar_addressline2", "guar_addressline3", "guarPincode"],
      //     per: ["guar_per_addressline1", "guar_per_addressline2", "guar_per_addressline3", "guar_per_pincode"],
      //   },
      // };
      const map = {
        Applicant: {
          cur: [
            "addressline1",
            "addressline2",
            "addressline3",
            "pincode",
            "Country",
            "City",
            "State",
            "Area"
          ],
          per: [
            "per_addressline1",
            "per_addressline2",
            "per_addressline3",
            "per_pincode",
            "per_Country",
            "per_City",
            "per_State",
            "per_Area"
          ],
        },

        "Co-Applicant": {
          cur: [
            "co_addressline1",
            "co_addressline2",
            "co_addressline3",
            "coPincode",
            "coCountry",
            "coCity",
            "coState",
            "coArea"
          ],
          per: [
            "co_per_addressline1",
            "co_per_addressline2",
            "co_per_addressline3",
            "co_per_pincode",
            "co_per_Country",
            "co_per_City",
            "co_per_State",
            "co_per_Area"
          ],
        },

        Guarantor: {
          cur: [
            "guar_addressline1",
            "guar_addressline2",
            "guar_addressline3",
            "guarPincode",
            "guarCountry",
            "guarCity",
            "guarState",
            "guarArea"
          ],
          per: [
            "guar_per_addressline1",
            "guar_per_addressline2",
            "guar_per_addressline3",
            "guar_per_pincode",
            "guar_per_Country",
            "guar_per_City",
            "guar_per_State",
            "guar_per_Area"
          ],
        }
      };

      const role = map[activeCust1Tab];
      if (!role) return updated;

      if (isChecked) {
        const pincodeValue = prev[role.cur];

        role.cur.forEach((k, i) => {
          updated[role.per[i]] = prev[k] ?? "";
        });

      } else {
        role.per.forEach(k => updated[k] = "");
      }

      return updated;
    });
  };

  const PINCODE_MAP = useMemo(() => ({
    Applicant: {
      keys: ["pincode", "per_pincode"],
      data: pincodeList,
    },
    "Co-Applicant": {
      keys: ["coPincode", "co_per_pincode"],
      data: pincodeList,
    },
    Guarantor: {
      keys: ["guarPincode", "guar_per_pincode"],
      data: pincodeList,
    },
  }), [pincodeList]);
  useEffect(() => {

  }, [activeMain]);

  useEffect(() => {

  }, [activeSub]);

  useEffect(() => {

  }, [filteredMainTabs]);
  // Refs for measurements
  const subTabMeasurements = useRef({});
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorY = useRef(new Animated.Value(0)).current;

  const animateIndicatorToSub = (subTabId) => {
    const m = subTabMeasurements.current[subTabId];
    if (!m) return;
    const centerX = m.x + m.width / 2;

    Animated.spring(indicatorX, {
      toValue: centerX,
      useNativeDriver: true,
      stiffness: 220,
      damping: 20,
      mass: 0.7,
    }).start();

    indicatorY.setValue(-8);
    Animated.spring(indicatorY, {
      toValue: 0,
      useNativeDriver: true,
      stiffness: 260,
      damping: 16,
    }).start();
  };

  // Animate when sub changes
  useEffect(() => {
    if (subTabMeasurements.current[activeSub]) {
      animateIndicatorToSub(activeSub);
    }
  }, [activeSub]);




  const selectedLeadId = useMemo(() => selectedLead?.id, [selectedLead]);
  const fetchLeadDetails = useCallback(async (leadId) => {
    try {
      const response = await api.get(`getApplicationById/${leadId}`,

      );
      const lead = response.data.data;

      setleadByLeadiD(lead);
    } catch (error) {
      console.error('Error fetching lead details:', error);
    }
  }, []);


  const getApplicationDetailsByIdd = useCallback(async (leadId) => {
    try {
      const response = await api.get(`getApplicationDetailsById/${leadId}`,

      );
      const lead = response.data.data;

      setgetApplicationDetailsById(lead);
    } catch (error) {
      console.error('Error fetching lead details:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedLead) {
      fetchLeadDetails(selectedLeadId);
      // getGoldDetailsByApplicationNumber(selectedLead?.leadId)
      // getGoldValuationByApplicationNumberAll(selectedLead?.leadId)
      // ScheduleByApplicationNumber(selectedLead?.leadId)

    }

  }, [selectedLead, selectedLeadId, fetchLeadDetails]);

  const getGoldValuationByApplicationNumberAll = useCallback(async (applicationNumber) => {
    try {
      const res = await api.get(
        `getGoldValuationByApplicationNumber/${applicationNumber}`
      );


      setgetGoldValuationByApplicationNumber(res?.data?.data);
    } catch (e) {

    }
  }, []);
  const ScheduleByApplicationNumber = useCallback(async (applicationNumber) => {
    try {
      const res = await api.get(
        `getScheduleByApplicationNumber/${applicationNumber}`
      );


      setgetScheduleByApplicationNumber(res?.data?.response);
    } catch (e) {

    }
  }, []);


  const getGoldDetailsByApplicationNumber = useCallback(async (applicationNumber) => {
    try {
      const response = await api.get(`getGoldDetailsByApplicationNumber/${applicationNumber}`);

      const lead = response.data.data;
      setGoldDetailsByApplicationNumber(lead);
    } catch (error) {
      console.error('Error fetching lead details:', error);
    }
  }, []);

  const baseGoldItems = Array.isArray(formData?.goldItems)
    ? formData.goldItems
    : [];

  const goldItemsWithLoan = useMemo(() => {
    if (!formData.ltv || !baseGoldItems.length) return baseGoldItems;

    const ltv = Number(formData.ltv);

    return baseGoldItems?.map(item => {
      const goldValue = Number(item.goldValue || 0);

      return {
        ...item,
        indicativeLoan: ((goldValue * ltv) / 100).toFixed(0),
      };
    });
  }, [baseGoldItems, formData.ltv]);

  const PURITY_MAP = { 24: 0.999, 22: 0.916, 20: 0.833, 18: 0.75, };
  const getDominantPurity = items => {
    if (!Array.isArray(items) || items.length === 0) return "";

    const freq = {};
    const order = []; // track insertion order

    items.forEach(i => {
      const purity = i?.goldPurity;
      if (!purity) return;
      if (!freq[purity]) {
        freq[purity] = 0;
        order.push(purity); // preserve order
      }
      freq[purity]++;
    });

    if (!order.length) return "";

    return order.reduce((a, b) => freq[a] >= freq[b] ? a : b);
  };

  const valuationBase = useMemo(() => {
    if (!goldItemsWithLoan.length) return {
      totalNet: 0,
      totalPure: 0,
      marketRate: 0,
      totalGoldValue: 0,
    };

    let totalNet = 0;
    let totalPure = 0;

    goldItemsWithLoan.forEach(i => {
      const net = Number(i.netWeight || 0);
      const purity = PURITY_MAP[i.goldPurity] || 0;

      totalNet += net;
      totalPure += net * purity;
    });


    return {
      totalNet,
      totalPure,
      // marketRate,
      // totalGoldValue,
    };
  }, [goldItemsWithLoan]);

  useEffect(() => {
    if (!goldItemsWithLoan.length) return;

    // const dominantPurity = getDominantPurity(goldItemsWithLoan);
    const dominantPurity = getDominantPurity(goldItemsWithLoan);


    const purityKey = PURITY_RATE_KEY[dominantPurity];
    const marketRate = Number(goldRates?.[purityKey] || 0);

    const totalGoldValue = marketRate * valuationBase?.totalPure.toFixed(2);

    setFormData(prev => ({
      ...prev,
      verifiedWeight: valuationBase.totalNet.toFixed(2),

      // Show dominant purity (22 / 18 / 24)
      verifiedPurity: String(dominantPurity || ""),
      // RBI single slab rate
      marketRate: String(marketRate),
      valuerName: ` ${userDetails?.firstName}${" "}${userDetails?.lastName}`,
      ValuerEmpID: `${userDetails?.userName}`,
      valuerContact: `${userDetails?.mobileNo}`,
      goldratedate: `${goldRates?.goldRateDate}`,
      // true pure gold
      pureWeight: valuationBase.totalPure.toFixed(2),

      // FINAL valuation
      totalGoldValue: String(totalGoldValue.toFixed(0)),
    }));
  }, [valuationBase, goldItemsWithLoan, goldRates]);

  useEffect(() => {
    if (!formData.totalGoldValue) return;

    const goldValue = Number(formData.totalGoldValue);

    // 🔒 RBI MAX
    let rbiMax = 75;

    if (goldValue <= 250000) rbiMax = 85;
    else if (goldValue <= 500000) rbiMax = 80;
    else rbiMax = 75;

    // NBFC entered (optional)
    const requested = Number(formData.ltv || rbiMax);

    // FINAL LTV = min(NBFC, RBI)
    const finalLtv = Math.min(requested, rbiMax);

    const eligible = goldValue * finalLtv / 100;

    setFormData(prev => ({
      ...prev,
      rbiMaxLtv: rbiMax,                // 👈 immutable RBI cap
      ltv: String(finalLtv),           // 👈 final applied
      eligibleLoan: eligible.toFixed(0),
      maxLoanAmount: eligible.toFixed(0),
    }));

  }, [formData.totalGoldValue, formData.ltv]);

  useEffect(() => {
    const { eligibleLoan, interestRate, tenure } = formData;

    if (
      !eligibleLoan ||
      interestRate === "" ||
      tenure === ""
    ) return;

    const P = Number(eligibleLoan);
    const r = Number(interestRate) / 12 / 100;
    const n = Number(tenure);

    if (!P || !r || !n) return;   // extra safety

    const emi =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    setFormData(prev => ({
      ...prev,
      emiAmount: emi.toFixed(0),
    }));
  }, [formData.eligibleLoan, formData.interestRate, formData.tenure]);

  const GoldRateAPi = useCallback(async () => {
    try {
      const response = await api.get(`https://indiagoldratesapi.com/api/latest`,

      );

      const lead = response.data.data;
      setleadByLeadiD(lead);
    } catch (error) {
      console.error('Error fetching lead details:', error);
    }
  }, []);

  const buildAddress = ({
    line1,
    line2,
    line3,
    pincodeId,
    type,
    sameAsCurrent = false,
  }) => ({
    addressLine1: line1,
    addressLine2: line2,
    addressLine3: line3,
    addressType: type,
    sameAsCurrentAddress: sameAsCurrent,
    pincodeId: Number(pincodeId),
  });

  const buildCreateApplicationPayload = () => ({
    id: "",
    loanPurpose: loanPurposeList.find(x => x.value === formData.loanpurpose)?.label,

    branchId: formData.branch,

    applicationNo: "",

    applicant: {
      id: "",
      applicationId: "",
      applicantCategoryCode: formData.loanpurpose,
      applicantTypeCode: "Applicant",
      customerId: "",
      existingCustomer: false,

      address: [
        buildAddress({
          line1: formData.addressline1,
          line2: formData.addressline2,
          line3: formData.addressline3,
          pincodeId: formData.pincode,
          type: "Current",
        }),

        buildAddress({
          line1: formData.per_addressline1,
          line2: formData.per_addressline2,
          line3: formData.per_addressline3,
          pincodeId: formData.per_pincode,
          type: "Permanent",
          sameAsCurrent: formData.sameAsCurrent,
        }),
      ],
    },

    consumptionApplicant: {
      consumptionApplicantId: "",
      applicantId: "",

      firstName: formData.firstName,
      middleName: formData.middleName || '',
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dob,
      pan: formData.pan,
      mobileNumber: formData.mobile,
      email: formData.email,
      aadhaarNo: formData.aadhaar,
      pincodeId: formData.pincode,

      bankDetails: [
        {
          id: "",
          accountHolderName: formData.accountholder,
          bankName: formData?.bankname,
          bankBranchName: formData.branchname,
          ifsc: formData.IFSCCode,
          accountType: formData.accounttype,
          accountNumber: formData.accountNumber,
          useForRepayment: true,
        },
      ],
    },

    portfolioId: formData.portfolio,
    productId: formData.product,

    createdBy: 2,
    coApplicantRequired: false,
    guarantorRequired: false,
  });

  const submitApplication = async () => {
    try {
      setSubmitting(true);

      const payload = buildCreateApplicationPayload();

      const res = await api.post("createApplication", payload);

      const appId = res?.data?.data?.id;

      if (appId) {
        setApplicationId(appId);
        fetchLeadDetails(appId);
        Alert.alert("Success", "Applicant created");
      }
    } catch (e) {
      Alert.alert("Error", "Applicant creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const buildCoApplicantPayload = (applicationId) => ({
    applicationId,

    applicationCoApplicant: [
      {
        consumptionCoApplicant: [
          {
            applicant: {
              applicationId,
              applicantCategoryCode: "",
              applicantTypeCode: "Co-Applicant",

              address: [
                buildAddress({
                  line1: formData.co_addressline1,
                  line2: formData.co_addressline2,
                  line3: formData.co_addressline3,
                  pincodeId: formData.coPincode,
                  type: "Current",
                }),

                buildAddress({
                  line1: formData.co_per_addressline1,
                  line2: formData.co_per_addressline2,
                  line3: formData.co_per_addressline3,
                  pincodeId: formData.co_per_pincode,
                  type: "Permanent",
                  sameAsCurrent: formData.co_sameAsCurrent,
                }),
              ],
            },

            consumptionApplicantDTO: {
              firstName: formData.coFirstName,
              middleName: formData.coMiddleName || '',
              lastName: formData.coLastName,
              gender: formData.coGender,
              dateOfBirth: formData.coDob,
              pan: formData.coPan,
              mobileNumber: formData.coMobile,
              email: formData.coemail,
              aadhaarNo: formData.coAadhaar,
              pincodeId: formData.coPincode,

              bankDetails: [
                {
                  accountHolderName: formData.accountholder,
                  bankName: formData?.bankname,
                  bankBranchName: formData.branchname,
                  ifsc: formData.IFSCCode,
                  accountType: formData.accounttype,
                  accountNumber: formData.accountNumber,
                  useForRepayment: false,
                },
              ],
            },
          },
        ],
      },
    ],
  });

  const submitCoApplication = async () => {
    if (!applicationId) {
      Alert.alert("Error", "Create Applicant first");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("addCoApplicant", buildCoApplicantPayload(applicationId));

      Alert.alert("Success", "Co-Applicant added");
    } catch (e) {
      Alert.alert("Error", "Co-Applicant failed");
    } finally {
      setSubmitting(false);
    }
  };

  const VERIFY_LABEL_MAP = {
    Applicant: "Verify Applicant",
    "Co-Applicant": "Verify Co-Applicant",
    Guarantor: "Verify Guarantor",
  };

  const VerifyButton = React.memo(({ label, onPress, disabled = false }) => {
    if (!label) return null;

    return (
      <TouchableOpacity
        style={[
          styles.verifyBtn,
          disabled && { backgroundColor: "#9CA3AF" }, // grey when disabled
        ]}
        onPress={disabled ? undefined : onPress}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <Text style={styles.verifyBtnText}>
          {disabled ? "Verified" : label}
        </Text>
      </TouchableOpacity>
    );
  });

  const VerifyButtonNormal = React.memo(({ label = "Verify", onPress, disabled }) => {
    return (
      <TouchableOpacity
        style={[styles.verifyBtn, disabled && { opacity: 0.6 }]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.verifyBtnText}>{label}</Text>
      </TouchableOpacity>
    );
  });



  const VerifyButtonKYC = React.memo(({ role, onPress, disabled = false }) => {
    if (!role) return null;

    return (
      <TouchableOpacity
        style={[
          styles.verifyBtn,
          disabled && { opacity: 0.5 },
        ]}
        onPress={!disabled ? onPress : undefined}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <Text style={styles.verifyBtnText}>
          {disabled ? "Verified" : VERIFY_LABEL_MAP[role] || "Verify"}
        </Text>
      </TouchableOpacity>
    );
  });


  const ROLE_TO_OTP_TYPE = {
    Applicant: "applicant",
    "Co-Applicant": "coApplicant",
    Guarantor: "guarantor",
  };

  const VERIFY_HANDLER_MAP = {
    Applicant: handleLeadCreateSuccess,
    "Co-Applicant": handleVerifyMobileSuccess,
    Guarantor: handleGurantorVerificationSuccess,
  };

  const handleVerify = useCallback(() => {
    const otpType = ROLE_TO_OTP_TYPE.Applicant;
    const handler = VERIFY_HANDLER_MAP.Applicant;
    if (!handler) return;
    handler(SelectedLeadApplicant);
  }, [SelectedLeadApplicant]);

  const resolveBankPrefix = (field = "") => {
    if (typeof field !== "string") return "";

    if (field.startsWith("co_")) return "co_";
    if (field.startsWith("guar_")) return "guar_";
    return "";
  };


  useEffect(() => {
    if (!categoryData) return;

    const map = {
      applicant_current: {
        Country: "Country",
        City: "City",
        State: "State",
        Area: "Area",
      },
      applicant_permanent: {
        Country: "per_Country",
        City: "per_City",
        State: "per_State",
        Area: "per_Area",
      },
      co_current: {
        Country: "coCountry",
        City: "coCity",
        State: "coState",
        Area: "coArea",
      },
      co_permanent: {
        Country: "co_per_Country",
        City: "co_per_City",
        State: "co_per_State",
        Area: "co_per_Area",
      },
      guar_current: {
        Country: "guarCountry",
        City: "guarCity",
        State: "guarState",
        Area: "guarArea",
      },
      guar_permanent: {
        Country: "guar_per_Country",
        City: "guar_per_City",
        State: "guar_per_State",
        Area: "guar_per_Area",
      },
    };

    setFormData((prev) => {
      const updated = { ...prev };

      Object.entries(map).forEach(([type, fields]) => {
        const data = categoryData[type];

        if (!data) return;
        updated[fields.pincode] = data.pincode || "";
        updated[fields.Country] = data.countryName || "";
        updated[fields.City] = data.cityName || "";
        updated[fields.State] = data.stateName || "";
        updated[fields.Area] = data.areaName || "";
      });

      return updated;
    });
  }, [categoryData]);

  useEffect(() => {
    const firstFilled = Object.keys(documents || {}).find(
      k => documents[k]?.length
    );

    if (firstFilled) setActiveDocTab(firstFilled);
  }, [documents]);

  const roiTimer = useRef(null);
  const tenureTimer = useRef(null);
  useEffect(() => {
    if (formData.loanApproval !== "reject") {
      setFormData(prev => ({
        ...prev,
        rejecteReason: null,
      }));
    }
  }, [formData.loanApproval]);

  useEffect(() => {
    if (formData.loanApprovalupprovedisb !== "reject") {
      setFormData(prev => ({
        ...prev,
        rejecteReasonupprovedisb: null,
      }));
    }
  }, [formData.loanApprovalupprovedisb]);

  const IntiateDisbursement = async () => {
    try {
      // 1️⃣ get existing

      const payload = {
        initiateDisbRequestId: InitiatDatabyApplicationNumber.initiateDisbRequestId || "",
        appliedLoanAmount: Number(formData.loanAmount),
        approvedLoanAmount: Number(formData.loanAmount),
        allocatedLoanAmount: Number(formData.loanAmount),
        product: "Gold Loan",
        productType: "Secured",
        tenor: Number(formData.Sanctiontenure),
        interestRate: Number(formData.SanctioninterestRate),
        repaymentFrequency: "Monthly",
        terminateDisbursion: formData?.disbursementterminate === true ? "Y" : "N",
        initiateDisbursion: formData?.disbursementinitiate === true ? "Y" : "N",
        applicationNumber: selectedLead?.leadId,
        applicationDetails: {
          applicationDetailsId: ApplicationDetailsByApplicationNumber?.applicationDetailsId || "",
        },
        scheme: formData.scheme,
        submit: false,
        userId: userDetails?.userId || "",
      };


      await api.put(
        `updateInitiateDisbursementRequestById/${InitiatDatabyApplicationNumber?.initiateDisbRequestId
        }`,
        payload
      );

      await api.put(
        `submitInitiateDisb/${InitiatDatabyApplicationNumber?.initiateDisbRequestId}`

      );




      Alert.alert("Success", "Disbursement Initiated");

    } catch (e) {

      Alert.alert("Error", "Initiate Disbursement Failed");
    } finally {

    }
  };

  const buildFeePayload = () => {
    return normalizedFees?.map(f => ({
      entity: "Application",
      product: "Gold Loan",
      paymentType: "Fee",

      feeName: f.feeDetails,
      feeTypeCode: f.feeTypeCode,   // MUST come from mergedFees

      basicAmount: Number(f.basicAmount || 0),
      taxAmount: Number(f.taxAmount || 0),
      tdsAmount: 0,

      amountDue: Number(f.amountDue || 0),
      amountReceived: Number(f.amountReceived || 0),

      remark: "",
      taxType: JSON.stringify(["SGST", "CGST"]),
    }));
  };

  const submitFees = async () => {
    const feeCalculation = buildFeePayload();

    const totalAmount = feeCalculation.reduce(
      (sum, f) => sum + Number(f.amountReceived || 0),
      0
    );
    const selectedBank = getAllBanklist.find(
      b => b.value === formData.disbbankname
    );

    const selectedBranch = Branchist.find(
      b => b.value === formData.disbbranch
    );
    const payload = {
      feeCalculation,
      feeType: "",
      utrNo: formData.utrNumber,
      instrumentType: formData.instrumentType,
      instrumentDate: formData.valuationDate,

      bankName: selectedBank?.label,
      bankBranchName: selectedBranch?.label,
      depositBank: formData.depositbankaccountNumber,

      feeAmount: totalAmount,
      receiptDate: formData.receiptDate,

      applicationNumber: selectedLead?.leadId,
      flag: true,
    };

    await api.post("addMultiFeeDetails", payload);

    await tFeeDetailsByApplicationNumber(selectedLead?.leadId);

    Alert.alert("Success", "Fees saved");
  };
  const formatDateForAPI = (date) => {
    if (!date) return null;

    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const buildDisbursementPayload = () => {

    const disbursementDate = formData?.disbursementDate
      ? formatDateForAPI(formData.disbursementDate)
      : "";

    const toNumber = (value) =>
      Number(String(value || 0).replace(/,/g, ""));

    return {
      disbursementRequestMsmeId:
        Number(DisbursementRequestMsmeByApplicationId?.disbursementRequestMsmeId) || '',

      approvedLoanAmount: toNumber(formData?.approvedLoanAmount),

      totalDisbursableAmount: toNumber(formData?.totalDisbursement),
      currentDisbursableAmount: toNumber(formData?.totalDisbursement),
      amountDisbursedTillDate: toNumber(formData?.totalDisbursement),

      undisbursedAmount: 0,
      percentDisbursed: 100,
      trancheNumber: 1,

      disbursementDate,
      modeOfDisbursement: formData?.disbursementMode || "",

      lan: formData?.loanAccountNumber || "",
      finalDisbursement: "Y",

      repaymentCriteria: "",
      deductFromDisbursement: false,
      addToFirstInstallment: false,
      totalInsuranceAmount: 0,
      bpiAmount: 0,

      displayBpiOnZeroThRow: formData?.displayBpi || false,

      applicationNumber: selectedLead?.leadId,

      applicationDetails: {
        applicationDetailsId:
          ApplicationDetailsByApplicationNumber?.applicationDetailsId
      },

      beneficiaryDetails: [
        {
          beneficiaryType: "Applicant",
          name: [
            formData?.firstName,
            formData?.middleName,
            formData?.lastName
          ].filter(Boolean).join(" "),

          bankName: formData?.bankname || "",
          branchName: formData?.branchname || "",
          accountNumber: formData?.accountNumber || "",
          accountType: formData?.accounttype || "",

          bankCode: "",
          branchCode: "",

          amount: toNumber(
            formData?.beneficiaryAmount || formData?.totalDisbursement
          ),

          applicationNumber: selectedLead?.leadId
        }
      ],

      submit: true,
      userId: userDetails?.userId,

      disbursementAccount: String(
        formData?.disburmentaccountbankaccountNumber || ""
      )
    };
  };
  const saveDisbursementRequest = async (isSubmit) => {
    const payload = buildDisbursementPayload();

    if (isSubmit) {
      await api.put(`submitDisbursementRequest/${DebtDisbursementSummary?.disbursementRequestMsmeId}`,);   // FINAL SUBMIT API
      // setActiveModal(null)
      closeModal();
    } else {
      await api.post(`addDisbursementRequest`, payload);      // SAVE APIf
      const res = await api.get(`getDebtDisbursementSummaryByApplicationDetailId/${ApplicationDetailsByApplicationNumber?.applicationDetailsId}`)

      setDebtDisbursementSummary(res?.data?.data?.[0])
    }
  };

  const buildDisbursementUpdatePayload = () => {

    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    return {

      disbursementApprovalId:
        Number(
          ApproveDisbursementReleaseByApplicationId?.disbursementApprovalId
        ) || '',

      installmentStartDate:
        formatDate(formData?.approveddisbursementDate),

      decision:
        formData?.loanApprovalupprovedisb === "approve"
          ? "Y"
          : "N",

      remark:
        formData?.approvedupdatedisbursementremark || "",

      applicationNumber: selectedLead?.leadId,

      createdTime: "",
      lastModifiedTime: "",

      disbursementRequestMsme: {

        disbursementRequestMsmeId:
          DisbursementRequestMsmeByApplicationId?.disbursementRequestMsmeId,

        approvedLoanAmount:
          Number(formData?.approvedLoanAmount || 0),

        totalDisbursableAmount:
          Number(formData?.totalDisbursement || 0),

        currentDisbursableAmount:
          Number(formData?.totalDisbursement || 0),

        amountDisbursedTillDate:
          Number(formData?.totalDisbursement || 0),

        undisbursedAmount: 0,

        percentDisbursed: 100,

        trancheNumber: 1,

        disbursementDate:
          formatDate(formData?.disbursementDate),

        modeOfDisbursement:
          formData?.disbursementMode,

        lan:
          formData?.loanAccountNumber,

        finalDisbursement: "Y",

        repaymentCriteria: "",

        deductFromDisbursement: false,

        addToFirstInstallment: false,

        displayBpiOnZeroThRow:
          formData?.displayBpi || false,

        disbursementAccount:
          formData?.disburmentaccountbankaccountNumber,

        bpiAmount: 0,

        submit: true,

        beneficiaryDetails: [
          {
            beneficiaryId:
              formData?.beneficiaryId || 0,

            beneficiaryType: "Applicant",

            name: [
              formData?.firstName,
              formData?.middleName,
              formData?.lastName
            ].filter(Boolean).join(" "),

            otherName: null,

            bankCode: "",

            bankName: formData?.bankname,

            branchName: formData?.branchname,

            branchCode: "",

            accountNumber: formData?.accountNumber,

            accountType: formData?.accounttype,

            amount:
              Number(
                formData?.beneficiaryAmount ||
                formData?.totalDisbursement
              ),

            applicationNumber:
              selectedLead?.leadId,

            createdTime: Date.now(),

            lastModifiedTime: Date.now()
          }
        ],

        totalInsuranceAmount: 0,

        applicationNumber:
          selectedLead?.leadId,

        userId:
          userDetails?.userId
      },

      submit: false,

      userId:
        userDetails?.userId
    };
  };

  const saveDisbursementUpdate = async (isSubmit) => {
    const payload = buildDisbursementUpdatePayload();

    if (isSubmit) {
      await api.put(
        `submitApproveDisbursementRelease/${ApproveDisbursementReleaseByApplicationId?.disbursementApprovalId}`,
        // payload
      );

      // setActiveModal(null)
      closeModal();
    } else {
      await api.put(`addApproveDisbursementRelease`, payload);

      getApproveDisbursementReleaseByApplicationId(
        ApplicationDetailsByApplicationNumber?.applicationDetailsId
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return null;

    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  };

  const buildUpdateDisbursementPayload = () => {

    return {

      updateDisbursementId:
        getUpdateDisbursementReleaseByApplicationId?.updateDisbursementId || "",

      trancheNumber: 1,

      approvedAmount:
        Number(formData?.approvedLoanAmount || 0),

      actualAmountDisbursed:
        Number(formData?.totalDisbursement || 0),

      disbursementDate:
        formatDate(formData?.disbursementDate),

      actualDisbursementDate:
        formatDate(formData?.disbursementDate),

      utrNumber:
        formData?.UpdatedDisbCHeque || "",

      utrNumberDate:
        formatDate(formData?.disbursementDate),

      remark:
        formData?.UpdatedDisbRemarks || "",

      lan:
        formData?.loanAccountNumber,

      applicationNumber:
        selectedLead?.leadId,

      approveDisbursementRelease:
        buildDisbursementUpdatePayload(),

      submit: false,

      userId:
        userDetails?.userId
    };
  };

  const saveDisbursementUpdateFinal = async (isSubmit) => {
    const payload = buildUpdateDisbursementPayload();

    if (isSubmit) {
      await api.put(
        `submitUpdateDisbursementRelease/${getUpdateDisbursementReleaseByApplicationId?.updateDisbursementId}`,
        // payload
      );
      closeModal();
    } else {
      await api.put(`addUpdateDisbursement`, payload);

      // getApproveDisbursementReleaseByApplicationId(
      //   ApplicationDetailsByApplicationNumber?.applicationDetailsId
      // );
      getUpdateDisbursementReleaseByApplicationIdd(
        ApplicationDetailsByApplicationNumber?.applicationDetailsId)
    }
  };
  // ApproveDisbursementReleaseByApplicationId

  const BUTTON_ACTIONS = {
    openAmort: () => setShowAmort(true),
    IntiateDisbursement: () => IntiateDisbursement(),
    MultiFeeDetails: () => submitFees(),
    SaveInitiateDisbursement: () => saveDisbursementRequest(false),

    SUbmitInitiateDisbursement: () => saveDisbursementRequest(true),

    SaveDisbursementUpdate: () => saveDisbursementUpdate(false),

    SUbmiDisbursementUpdate: () => saveDisbursementUpdate(true),

    approvedisbursementopenAmort: () => setShowAmort(true),

    SaveDisbursementUpdateFInal: () => saveDisbursementUpdateFinal(false),

    SUbmiDisbursementUpdateFinal: () => saveDisbursementUpdateFinal(true),

  };

  const formatBusinessDate = (arr) => {
    if (!Array.isArray(arr) || arr.length !== 3) return "";

    const [year, month, day] = arr;

    return new Date(year, month - 1, day)
      .toISOString()
      .split("T")[0];
  };

  const renderFieldSafe = (f, idx, options = {}) => {
    if (!f) return null;

    const {
      sectionKey,   // e.g. "goldItems"
      itemIndex,    // number
      isRepeatable, // boolean
    } = options;

    const fieldValue =
      isRepeatable
        ? formData?.[sectionKey]?.[itemIndex]?.[f.field] ?? ""
        : formData?.[f.field] ?? "";

    const setValue = (val) => {
      if (isRepeatable) {
        setFormData(prev => {
          const existingList = Array.isArray(prev[sectionKey])
            ? prev[sectionKey]
            : [];

          const updatedList = [...existingList];

          updatedList[itemIndex] = {
            ...(updatedList[itemIndex] || {}),
            [f.field]: val,
          };

          return {
            ...prev,
            [sectionKey]: updatedList,
          };
        });
      } else {
        setFieldValue(f.field, val);
      }
    };

    let element = null;
    const resolveVerifyKey = (field = "") => {
      if (typeof field !== "string") return "";

      if (field.startsWith("co")) return "co_per";
      if (field.startsWith("guar")) return "guar";
      return "";
    };
    const isDecision2 = activeSub === "decision-2";

    const DECISION2_EDITABLE = ["loanApproval", "remark"];

    const isEditable =
      !isDecision2 || DECISION2_EDITABLE?.includes(f.field);

    const fieldName = f?.field || "";

    const roleKey = resolveVerifyKey(fieldName);

    const verified =
      fieldName.toLowerCase()?.includes("firstname") ||
        fieldName.toLowerCase()?.includes("middlename") ||
        fieldName.toLowerCase()?.includes("lastname") ||
        fieldName === "dob" ||
        fieldName === "coDob" ||
        fieldName === "guarDob"
        ? roleKey
          ? formData[`${roleKey}_panNameValid`] && formData[`${roleKey}_panValid`]
          : formData._panNameValid && formData._panValid
        : fieldName.toLowerCase()?.includes("pan")
          ? roleKey
            ? formData[`${roleKey}_panValid`]
            : formData._panValid
          : fieldName.toLowerCase()?.includes("mobile")
            ? roleKey
              ? formData[`${roleKey}_mobileVerified`]
              : formData._mobileVerified
            : false;

    switch (f.type) {
      case "input": {

        const isLtv = f.field === "ltv";
        const isLoanAmount = f.field === "loanAmount";
        // const isvaluerName = f.field ===

        const handleSafeChange = (val) => {
          const num = Number(val.replace(/[^0-9]/g, ""));

          if (isLtv) {
            const rbiMax = Number(formData.rbiMaxLtv || 0);
            if (num > rbiMax) return;
            setValue(String(num));
            return;
          }

          if (isLoanAmount) {
            const max = Number(formData.eligibleLoan || 0);
            if (num > max) return;
            setValue(String(num));
            return;
          }



          // ================= SANCTION ROI =================
          if (f.field === "SanctioninterestRate") {


            clearTimeout(roiTimer.current);

            setValue(String(num)); // allow typing FIRST

            roiTimer.current = setTimeout(() => {
              const max = Number(getSchemeLoanInterestAmortizationB?.maxInterestRate || 0);
              const min = Number(getSchemeLoanInterestAmortizationB?.minInterestRate || 0);

              if ((max && num > max) || (min && num < min)) {
                Alert.alert(
                  "Invalid ROI",
                  `ROI must be between ${min}% and ${max}%`
                );

                setValue(String(Math.min(Math.max(num, min), max)));
              }
            }, 400);

            return;
          }




          // ================= SANCTION TENURE =================
          if (f.field === "Sanctiontenure") {
            clearTimeout(tenureTimer.current);

            setValue(String(num));

            tenureTimer.current = setTimeout(() => {
              const max = Number(getSchemeLoanInterestAmortizationB?.maxTenure || 0);
              const min = Number(getSchemeLoanInterestAmortizationB?.minTenure || 0);

              if ((max && num > max) || (min && num < min)) {
                Alert.alert(
                  "Invalid Tenure",
                  `Tenure must be between ${min} and ${max} months`
                );

                setValue(String(Math.min(Math.max(num, min), max)));
              }
            }, 400);

            return;
          }


          setValue(val);
        };

        element = renderInputt(
          f.label,
          fieldValue,
          handleSafeChange,
          f.editable !== false,
          f.placeholder,
          f.isMobile,
          f.isPan,
          f.isAadhaar,
          f.isEmail,
          f.field,
          verified,
          f.required !== false,
          false,
          "",
          "",
          f.isgw ?? false,
          f.isgp ?? false,
          f.isav ?? false,
          f.isNumber ?? false   // ✅ NOT hardcoded
        );

        break;
      }

      case "dropdown": {
        const pincodeConfig = PINCODE_MAP[activeCust1Tab];
        const isPincode = pincodeConfig?.keys?.includes(f.field);
        const isBillingCycle = f.field === "billingCycle";
        const isIFSC = f.field?.includes("IFSC");
        const isAccountType = f.field?.includes("accounttype");

        const isLoanPurpose =
          f.field === "loanpurpose" ||
          f.field === "coloanpurpose" ||
          f.field === "guarloanpurpose";

        const isPortfolio = f.field === "portfolio";
        const isProduct = f.field === "product";
        const isBranch = f.field === "branch";
        const isGoldPurity = f.field === "goldPurity";
        const isGoldOwnership = f.field === "goldOwnership";
        const isGoldStatus = f.field === "goldStatus";
        const isScheme = f.field === "scheme";
        const isRejectReason = f.field === "rejecteReason";
        const isRejectReasonrejectupprovedisb = f.field === "rejecteReasonupprovedisb";
        // const isRejectReason = f.field === "rejecteReason";
        const isItemCategory = f.field === "goldCategory";
        const isloanApprovalList = f.field === 'loanApproval';
        const rejectDisabled = isRejectReason && formData.rejecteReason !== "reject";
        const isloanApprovalupprovedisbList = f.field === 'loanApprovalupprovedisb';
        const rejectupprovedisbDisabled =
          isRejectReasonrejectupprovedisb &&
          formData.loanApprovalupprovedisb !== "Rejected";

        const isInstrumentList = f.field === "instrumentType"
        const isdepositbanklist = f.field === "depositBank"
        const isdisbursementAccount = f.field === 'disbursementAccount'
        const isgetAllBanklist = f.field === 'bankname'
        const isdisbgetAllBanklist = f.field === 'disbbankname'
        const isBranchist = f.field === 'disbbranch'
        const isDisbursmentmodeList = f.field === 'disbursementMode'
        const isapprovedisbursementloanApproval = f.field === 'approvedisbursementloanApproval'
        // const isBranchist = f.field === 'disbbranch'
        const dropdownData = isPincode
          ? pincodeConfig.data
          : isGoldPurity
            ? goldPurityList
            : isGoldOwnership
              ? goldOwnershipList
              : isGoldStatus
                ? goldStatusList
                : isItemCategory
                  ? ItemCategoryList
                  : isloanApprovalList
                    ? loanApprovalList
                    : isloanApprovalupprovedisbList
                      ? loanApprovalList
                      : rejectupprovedisbDisabled
                        ? rejectReasonList
                        : isInstrumentList
                          ? InstrumentList
                          : isdepositbanklist
                            ? depositbanklist
                            : isgetAllBanklist
                              ? getAllBanklist
                              : isdisbgetAllBanklist
                                ? getAllBanklist
                                : isBranchist
                                  ? Branchist
                                  : isDisbursmentmodeList
                                    ? DisbursmentmodeList
                                    : isRejectReason
                                      ? rejectReasonList
                                      : isScheme
                                        ? schemeList
                                        : isIFSC
                                          ? ifscList
                                          : isAccountType
                                            ? accountTypeList
                                            : isLoanPurpose
                                              ? loanPurposeList
                                              : isPortfolio
                                                ? portfolioList
                                                : isProduct
                                                  ? productList
                                                  : isBranch
                                                    ? branchList
                                                    : isBillingCycle
                                                      ? billingCycleList
                                                      : isdisbursementAccount
                                                        ? depositbanklist
                                                        : isapprovedisbursementloanApproval
                                                          ? loanApprovalList
                                                          : f.data || [];


        const handleChange = (item) => {

          const selectedValue = item?.value;

          setValue(selectedValue);


          // PINCODE
          if (isPincode) {
            const type = PINCODE_TYPE_MAP[f.field];
            fetchDataByPincode(item?.label, type);
          }
          // if (isgetAllBanklist) {
          //   getBankBranchByBankId(item.value);

          // }

          // ✅ ROLE AWARE BANK AUTOFILL
          if (isIFSC) {
            const prefix = resolveBankPrefix(f.field);

            setFormData(prev => ({
              ...prev,
              [`${prefix}bankname`]: item?.bankName || "",
              [`${prefix}branchname`]: item?.branchName || "",
            }));
          }

          if (isdisbgetAllBanklist) {
            setFormData(prev => ({
              ...prev,
              disbbankname: item?.value,
              disbbanklabel: item?.label,
              disbbranch: "",
              disbbranchlabel: ""
            }));

            getBankBranchByBankId(item?.value);
            return;
          }
          if (isBranchist) {
            setFormData(prev => ({
              ...prev,
              disbbranch: item?.value,
              disbbranchlabel: item?.label
            }));
          }
          if (isgetAllBanklist) {
            setFormData(prev => ({
              ...prev,
              // branch: item.value,
              banklabel: item?.label
            }));
          }
          if (isdepositbanklist) {
            setFormData(prev => ({
              ...prev,
              depositbanklabel: item.label,
              depositbankvalue: item.value,
              depositbankaccountNumber: item?.accountNumber
            }));
          }
          if (isdisbursementAccount) {
            setFormData(prev => ({
              ...prev,
              disburmentaccountbanklabel: item.label,
              disburmentaccountbankvalue: item.value,
              disburmentaccountbankaccountNumber: item?.accountNumber
            }));
          }

          // Branch dropdown (Details)
          if (isBranch) {
            setFormData(prev => ({
              ...prev,
              branch: item?.value,
              branchlabel: item?.label
            }));
          }
          if (isBillingCycle) {
            setFormData(prev => ({
              ...prev,
              billingCycle: item?.value,       // 🔥 important
              isBillingCyclelabel: item?.label,
            }));
          }

          const selectedPurity = Number(item?.value);

          // setValue(String(selectedPurity));

          // ONLY for gold purity
          if (isGoldPurity && isRepeatable) {
            const rateKey = PURITY_RATE_KEY[selectedPurity];

            if (!rateKey || !goldRates) return;

            const rate = Number(goldRates?.[rateKey] || 0);

            setFormData(prev => {
              const list = [...(prev[sectionKey] || [])];
              const row = list[itemIndex] || {};

              const netWeight = Number(row.netWeight || 0);

              const collateralValue = netWeight * rate;

              list[itemIndex] = {
                ...row,
                goldPurity: String(selectedPurity),
                goldMarketRate: String(rate),
                goldValue: String(collateralValue),
              };

              return {
                ...prev,
                [sectionKey]: list,
              };
            });
          }

        };

        const disabled =
          rejectDisabled || rejectupprovedisbDisabled;

        element = renderDropdown(
          f.label,
          dropdownData,
          fieldValue,
          handleChange,
          f.placeholder,
          true,
          f.field,
          disabled
        );

        break;
      }

      case "multiDropdown": {
        const goldOptions = (formData.goldItems || [])?.map(item => ({
          label: item?.goldType || `Item`,
          value: item?.goldDetailsId,
        }));

        element = (
          <MultiSelectDropdown
            label={f.label}
            data={goldOptions}
            value={formData[f.field] || []}
            labelField="label"
            valueField="value"
            onChange={(vals) => setFieldValue(f.field, vals)}
          />
        );

        break;
      }

      case "date": {

        const businessDateArray =
          getBusinessDate?.businessDate
        // : null;

        element = (
          <DatePickerInput
            label={f.label}
            value={fieldValue}
            onChange={setValue}
            verified={verified}
            businessDate={businessDateArray}
          />
        );

        break;
      }

      case "checkbox": {
        if (f.field === "displayBpi") {
          element = renderSwitchField(
            f.label,
            true,      // always true
            () => { },  // no-op so it never changes
            true       // disabled (if your renderSwitchField supports it)
          );
        } else {
          element = renderSwitchField(
            f.label,
            fieldValue,
            setValue
          );
        }

        break;
      }
      case "document":
        element = (
          <View style={styles.documentWrapper}>
            {activeSub === "orig-4"
              ? renderPacketDocContent()
              : renderDocContent(itemIndex)}
          </View>
        );
        break;


      case "docTabs":
        element = (
          <View style={{ marginBottom: 12, width: "100%" }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {f?.data?.map(tab => (
                <TouchableOpacity
                  key={tab?.value}
                  style={[
                    styles.goldDocTab,
                    activeDocTab === tab?.value && styles.goldDocTabActive,
                  ]}
                  onPress={() => setActiveDocTab(tab?.value)}
                >
                  <Text
                    style={[
                      styles.goldDocTabText,
                      activeDocTab === tab?.value && styles.goldDocTabTextActive,
                    ]}
                  >
                    {tab?.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
        break;

      case "button": {
        element = (
          <TouchableOpacity
            style={styles.amortBtn}
            onPress={() => {
              if (!BUTTON_ACTIONS[f.action]) {
                console.warn("Missing button action:", f.action);
                return;
              }
              BUTTON_ACTIONS[f.action]();
            }}
          >
            <Text style={styles.amortBtnText}>{f.label}</Text>
          </TouchableOpacity>
        );
        break;
      }

      case "feeList": {
        element = (
          <View style={styles.feeGrid}>
            {(normalizedFees || [])?.map((fee, i) => (
              <View
                key={i}
                style={[
                  styles.feeCard,
                  i === 0 ? styles.fullFeeCard : styles.halfFeeCard
                ]}
              >
                <Text style={styles.feeTitle}>{fee.feeDetails}</Text>

                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Basic Amount</Text>
                  <Text style={styles.feeValue}>₹{fee.basicAmount}</Text>
                </View>

                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Tax Amount</Text>
                  <Text style={styles.feeValue}>₹{fee.taxAmount}</Text>
                </View>

                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Amount Due</Text>
                  <Text style={styles.feeAmount}>₹{fee.amountDue}</Text>
                </View>

                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Amount Received</Text>
                  <Text style={styles.feeValue}>₹{fee.amountReceived}</Text>
                </View>
              </View>
            ))}
          </View>
        );
        break;
      }
      default:
        element = null;
    }

    return <View key={`${f.field}-${idx}`}>{element}</View>;
  };

  const isSmallScreen = width < 768;

  const renderFieldRow = (fieldsArray) => (
    <View style={{ marginVertical: 5 }}>
      {fieldsArray?.map((field, idx) => {
        if (field?.type === "feeList") {
          // 🔥 feeList must NOT be inside row
          return <View key={idx}>{renderFieldSafe(field, idx)}</View>;
        }

        return (
          <View
            key={field?.field || idx}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingHorizontal: 5 }}>
              {renderFieldSafe(field, idx)}
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderGenericSection = (section, secIdx) => {
    const fields = section.fields || [];
    const rows = [];

    for (let i = 0; i < fields.length;) {
      const current = fields[i];

      // ✅ Full width field (docTabs / document)
      if (current?.fullWidth) {
        rows.push(
          <View key={`row-${secIdx}-${i}`} style={{ width: "100%" }}>
            {renderFieldSafe(current, i)}
          </View>
        );
        i += 1;
        continue;
      }

      // ✅ Normal 2-column row
      rows.push(
        <View key={`row-${secIdx}-${i}`}>
          {renderFieldRow([fields[i], fields[i + 1]])}
        </View>
      );

      i += 2;
    }

    return (
      <View key={`section-${secIdx}`} style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {rows}
      </View>
    );
  };
  const noop = useCallback(() => { }, []);
  const renderPermanentAddressSection = (section, secIdx, prefix) => {
    const fieldsMap = (section.fields || []).reduce((a, f) => ({ ...a, [f.field]: f }), {});

    const checkboxField =
      fieldsMap[`${prefix}sameAsCurrent`] ||
      fieldsMap[`${prefix}_sameAsCurrent`];

    const sameAsCurrent = formData[checkboxField?.field] ?? false;

    const permanentPincodeField =
      fieldsMap[`${prefix}per_pincode`] ||
      fieldsMap[`${prefix}_per_pincode`];

    const renderStatic = (label, key) =>
      renderInputt(label, formData?.[key] ?? "", noop, false);

    const map = {
      Applicant: {
        a1: "per_addressline1",
        a2: "per_addressline2",
        a3: "per_addressline3",
        Country: "per_Country",
        City: "per_City",
        State: "per_State",
        Area: "per_Area",
      },
      "Co-Applicant": {
        a1: "co_per_addressline1",
        a2: "co_per_addressline2",
        a3: "co_per_addressline3",
        Country: "co_per_Country",
        City: "co_per_City",
        State: "co_per_State",
        Area: "co_per_Area",
      },
      Guarantor: {
        a1: "guar_per_addressline1",
        a2: "guar_per_addressline2",
        a3: "guar_per_addressline3",
        Country: "guar_per_Country",
        City: "guar_per_City",
        State: "guar_per_State",
        Area: "guar_per_Area",
      },
    };

    const k = map[activeCust1Tab] || {};

    return (
      <View key={secIdx} style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{section.title}</Text>

        {checkboxField && (
          <View style={styles.fullWidthFieldContainer}>
            {renderCheckboxField(checkboxField, 0, handleSameAsCurrentToggle(checkboxField))}
          </View>
        )}

        {/* Address Lines */}
        <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            {sameAsCurrent
              ? renderStatic("Address Line 1", k.a1)
              : renderFieldSafe(fieldsMap[k.a1], 1)}
          </View>

          <View style={styles.fieldContainer}>
            {sameAsCurrent
              ? renderStatic("Address Line 2", k.a2)
              : renderFieldSafe(fieldsMap[k.a2], 2)}
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            {sameAsCurrent
              ? renderStatic("Address Line 3", k.a3)
              : renderFieldSafe(fieldsMap[k.a3], 3)}
          </View>

          <View style={styles.fieldContainer}>
            {renderFieldSafe(permanentPincodeField, 99)}
          </View>
        </View>

        {/* Static geography */}
        {/* <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            {renderInputt("Country", formData[k.Country], () => { }, false)}
          </View>
          <View style={styles.fieldContainer}>
            {renderInputt("City", formData[k.City], () => { }, false)}
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            {renderInputt("State", formData[k.State], () => { }, false)}
          </View>
          <View style={styles.fieldContainer}>
            {renderInputt("Area", formData[k.Area], () => { }, false)}
          </View>
        </View> */}
        {/* Static geography */}

        {/* Static geography */}

        <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            {renderInputt(
              "Country",
              formData?.[k.Country] ?? "",
              noop,
              false
            )}
          </View>

          <View style={styles.fieldContainer}>
            {renderInputt(
              "City",
              formData?.[k.City] ?? "",
              noop,
              false
            )}
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            {renderInputt(
              "State",
              formData?.[k.State] ?? "",
              noop,
              false
            )}
          </View>

          <View style={styles.fieldContainer}>
            {renderInputt(
              "Area",
              formData?.[k.Area] ?? "",
              noop,
              false
            )}
          </View>
        </View>
      </View>
    );
  };
  const generateId = () =>
    `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const handleAddItem = (sectionKey) => {
    setFormData(prev => ({
      ...prev,
      [sectionKey]: [
        ...(prev[sectionKey] || []),
        {
          _localId: generateId(),
        },
      ],
    }));
  };
  const handleRemoveItem = (sectionKey, itemIndex) => {

    setFormData(prev => {
      const updated = [...(prev[sectionKey] || [])];
      updated.splice(itemIndex, 1);

      return {
        ...prev,
        [sectionKey]: updated,
      };
    });

    setDocuments(prev => {
      const newDocs = { ...prev };

      delete newDocs[itemIndex];

      // reindex documents
      const reIndexed = {};
      Object.keys(newDocs)
        .sort((a, b) => Number(a) - Number(b))
        .forEach((key, idx) => {
          reIndexed[idx] = newDocs[key];
        });

      return reIndexed;
    });
  };

  const renderRepeatableSection = useCallback(
    (section, sectionKey) => {

      const items = formData?.[sectionKey] || [];

      return (
        <View>
          {items.map((item, itemIndex) => {

            const isOpen = expandedGoldId === item._localId;

            return (
              <View key={item._localId} style={styles.card}>

                <TouchableOpacity
                  style={styles.goldHeader}
                  onPress={() =>
                    setExpandedGoldId(prev =>
                      prev === item._localId ? null : item._localId
                    )
                  }
                >
                  <Text style={styles.cardTitle}>
                    {section?.title} #{itemIndex + 1}
                  </Text>

                  <Text style={styles.goldMeta}>
                    {(item?.goldType || "Item")} •
                    {(item?.goldWeight || 0)}g •
                    ₹{item?.goldValue || 0}
                  </Text>
                </TouchableOpacity>

                {isOpen && (
                  <View style={{ marginTop: 10 }}>

                    {section?.fields?.map((f, idx) =>
                      renderFieldSafe(f, idx, {
                        isRepeatable: true,
                        sectionKey,
                        itemIndex,
                      })
                    )}

                    {items.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() =>
                          handleRemoveItem(sectionKey, itemIndex)
                        }
                      >
                        <Text style={styles.removeBtnText}>
                          Remove Item
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

              </View>
            );
          })}

          {/* ADD BUTTON */}
          <TouchableOpacity
            onPress={() => handleAddItem(sectionKey)}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>
              ➕ Add Another Item
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [formData, expandedGoldId, documents]
  );

  const generateAmortization = async () => {
    try {
      setSubmitting(true);

      // 1️⃣ DELETE EXISTING
      await api.delete(`deleteAmortDetailsOnApplicationNumber/${selectedLead?.leadId}`, {
        applicationNumber: selectedLead?.leadId,
      });

      // 2️⃣ ADD FIRST AMORT
      await api.post("addFirstAmortDetails", {
        amortId: "",
        tenor: "",
        totalTenor: formData.Sanctiontenure,
        dueDate: getBusinessDate.businessDate,
        requiredDays: "",
        rateOfInterest: formData.SanctioninterestRate,
        emi: "",
        interest: formData.interestRate,
        principal: formData.loanAmount,
        openingBalance: formData.loanAmount,
        closingBalance: formData.loanAmount,
        disbursementAmount: "",
        specifier: "",
        applicationNumber: selectedLead?.leadId,
      });

      // 3️⃣ ADD AMORT DETAILS (cycle days)
      await api.post(`addAmortDetails/${selectedLead?.leadId}`, {
        cycleDays: Number(formData.isBillingCyclelabel),
        schemeCode: SchemeCOde
      });

      // 4️⃣ FETCH FINAL TABLE


      const res = await api.get(`getAllAmortDetails/${selectedLead?.leadId}`);

      setAmortTable(res?.data?.data?.content || []);

    } catch (err) {
      Alert.alert("Error", "Amortization generation failed");

    } finally {
      setSubmitting(false);
    }
  };
  const submitDecision = useCallback(async () => {

    try {
      setSubmitting(true);

      // ================= MAP APPROVAL =================
      const approvalValue =

        formData.loanApproval


      // 
      // if (!approvalValue) {
      //   Alert.alert("Validation", "Please select Loan Approval");
      //   return;
      // }

      // ================= VALIDATE REJECT =================
      if (approvalValue === "Rejected" && !formData.rejecteReason) {
        Alert.alert("Validation", "Please select Reject Reason");
        return;
      }

      // ================= BUILD PAYLOAD =================
      const payload = {
        decisionId: getDecisionByApplicationNumber?.decisionId,
        roi: Number(formData.interestRate || 0),
        tenor: Number(formData.tenure || 0),
        sanctionAmount: Number(formData.loanAmount || 0),

        sanctionROI: Number(formData.SanctioninterestRate || 0),
        sanctionTenor: Number(formData.Sanctiontenure || 0),

        dateOfEmi: Number(formData.billingCycle),
        emi: Number(formData.emiAmount || 0),

        loanApproval: formData.loanApproval,
        rejectionReason:
          formData.rejecteReason,

        remark: formData.remark || "",
        eligibility: Number(formData.eligibleLoan || 0),
        ltv: Number(formData.ltv || 0),

        active: true,
        applicationNumber: selectedLead?.leadId,

        disbursementAmount: Number(formData.loanAmount || 0),
        schemeId: Number(formData.scheme || 0),
        loanDetailType: "INIT"
      };

      const Flagpayload = {

        active: true,
        applicationNumber: selectedLead?.leadId

      }


      // ================= API CALL =================
      const res = await api.put("addDecision", payload);

      if (res?.data?.msgKey === "Success") {
        Alert.alert("Success", "Decision submitted successfully");
        await api.put("updateDecisionFlagByApplicationNumber", Flagpayload);
        closeModal();

        // Optional navigation
        // setActiveSub("disb-1");
      } else {
        Alert.alert("Error", res?.data?.message || "Decision failed");
      }

    } catch (e) {

      Alert.alert("Error", "Unable to submit decision");
    } finally {
      setSubmitting(false);
    }
  }, [formData,]);

  const isApplicantVerified =
    formData?._panNameValid &&
    formData?._panValid &&
    formData?._mobileVerified;

  const isCoApplicantVerified =
    formData?.co_per_panNameValid &&
    formData?.co_per_panValid &&
    formData?.co_per_mobileVerified;

  const addGoldPackagingDetails = async () => {
    try {
      const flagpaylod = {
        applicationNumber: selectedLead?.leadId,
        active: true
      }
      const dto = {
        goldPackingId: getGoldPackagingDetailsByApplicationNumber?.goldPackingId,
        indexNo: formData.indexNo,
        rackNo: formData.rackNo,
        trayNo: formData.trayNo,
        packetNo: formData.packetNo,
        packetWeight: formData.packetWeight,
        applicationNumber: selectedLead?.leadId,
      };

      let filesArray = [];

      // ✅ FRONT image (base64)
      const packetImage = documents?.PACKET?.FRONT?.[0];
      //  const packetImage = documents?.FRONT?.[0];

      if (packetImage) {
        filesArray.push({
          name: "file",
          filename: packetImage.Name || "packet.jpg",
          type: packetImage.type || "image/jpeg",
          data: packetImage.base64,
        });
      }




      // const response = await RNFetchBlob.fetch(
      //   "POST",
      //   `${BASE_URL}addGoldPackagingDetails`,
      //   {
      //     "Content-Type": "multipart/form-data",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   [
      //     ...filesArray,
      //     { name: "dto", data: JSON.stringify(dto) },
      //   ]
      // );
      const response = await RNFetchBlob.fetch(
        'POST',
        `${BASE_URL}addGoldPackagingDetails`,
        {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        [
          ...filesArray,
          { name: 'dto', data: JSON.stringify(dto) },
        ]
      );

      const res = response.json();

      console.log(res, 'addGoldPackagingDetails')

      if (res?.msgKey === "Success") {
        Alert.alert("Success", "Gold Packaging saved successfully");
        await api.put(`updatedGoldPackagingFlag`, flagpaylod)
        closeModal();
      } else {
        Alert.alert("Error", res?.message || "Failed");
      }

    } catch (e) {

      Alert.alert("Error", "Unable to save packaging");
    }
  };

  const buildGoldPayload = (formData, documents = {}, leadByLeadiD) => {
    const goldItems = formData?.goldItems || [];

    return {
      goldDetailsDto: goldItems?.map((item, index) => {
        const gross = Number(item.goldWeight || 0);
        const stone = Number(item.stoneWeight || 0);

        // ✅ Collect THIS item's docs only
        const itemDocs = Object.values(documents[index] || {}).flat();

        return {
          goldDetailsId: item.goldDetailsId || 0,

          itemCategory: item.goldCategory || "",
          itemType: item.goldType || "",
          itemName: item.goldBrandName || "",

          goldOwnership: item.goldOwnership || "",
          goldStatus: item.goldStatus || "",

          noOfItems: Number(item.noOfItems || 1),

          grossWeight: gross,
          purity: Number(item.goldPurity || 0),

          stoneWeight: stone,
          stoneType: item.stoneType || "",

          impurityPercentage: Number(item.impurityPercentage || 0),

          netWeight: Number(item.netWeight || gross - stone),

          goldRate: Number(item.goldMarketRate || 0),

          collateralValue: Number(item.goldValue || 0),

          hallmarkDetails: item.goldCertNumber || "",

          brokenJewellery: Boolean(item.brokenJewellery),

          remarks: item.goldRemarks || "",

          goldConfirmation: Boolean(item.gloConfirmation),

          applicationId: leadByLeadiD?.id || 0,

          // ✅ Per item images
          goldItemImageDto: itemDocs?.map(doc => ({
            goldItemImageId: "",
            imageType: doc.imageType || "",
            itemImage: doc.base64 || "",
            goldDetailsId: item.goldDetailsId || "",
          })),
        };
      }),
    };
  };

  const submitGoldDetails = async () => {
    const payload = buildGoldPayload(formData, documents, leadByLeadiD);
    const updatepayload = {

      applicationNumber: selectedLead?.leadId,
      active: true

    }


    const res = await api.put("addGoldDetails", payload);
    if (res.data.msgKey === "Success") {
      const res = await api.put("updateGoldDetailsFlagByApplicationNumber", updatepayload);
      closeModal();

    }

  };

  const valuationPayload = {
    goldValuationId: getGoldValuationByApplicationNumber?.goldValuationId || '',
    goldValuerEmployeeId: userDetails?.userName || '',
    applicationNumber: selectedLead?.leadId || "",
    goldValuerName: formData.valuerName || "",
    goldValuerContactNo: formData.valuerContact || "",
    valuationDate: formData.valuationDate || new Date().toISOString().split("T")[0],
    goldRateDate: goldRates?.goldRateDate,
    goldPurity: formData.goldItems?.[0]?.goldPurity,
    goldRateAmount: formData.goldItems?.[0]?.goldMarketRate,
    totalNetGoldWeight: Number(formData.verifiedWeight),        // 105.50           // 22
    totalPureGoldWeight: Number(formData.pureWeight),          // 23.21
    goldRate: Number(formData.marketRate),                     // 6500
    totalGoldValue: Number(formData.totalGoldValue),           // 150865
    valuationType: "INIT"
  };

  const valuationPayloadFlag = {

    applicationNumber: selectedLead?.leadId,
    active: true

  }

  const handleSubmitValuation = async () => {
    try {
      setSubmitting(true);

      const res = await api.put(`addGoldValuation`, valuationPayload);

      if (res.data?.msgKey === 'Success') {
        const res = await api.put(`updateGoldValuationFlag`, valuationPayloadFlag);
        closeModal();
      }
      // Alert.alert("Success", "Co-Applicant added");
    } catch (e) {
      Alert.alert("Error", " Failed to addGoldValuation");
    } finally {
      setSubmitting(false);
    }
  };

  const submitGoldPackagingApproval = async () => {
    try {
      const payload = {
        approveGoldPackagingId:
          ApproveGoldPackagingDetailsByApplicationNumber?.approveGoldPackagingId || "",

        goldPackagingId:
          getGoldPackagingDetailsByApplicationNumber?.goldPackingId || "",

        applicationNumber: selectedLead?.leadId,

        approval: Boolean(formData.packageApproval),

        active: true,

        approvalRemark: formData.packgeRemarks || "",
      };

      const res = await api.put(
        'addApproveGoldPackagingDetails',
        payload
      );

      if (!res?.data) {
        throw new Error("Approval API failed");
      }

      const flagPayload = {
        applicationNumber: selectedLead?.leadId,
        active: true,
      };

      const flagRes = await api.put(
        'updatedApproveGoldPackagingFlag',
        flagPayload
      );

      if (!flagRes?.data) {
        throw new Error("Flag update failed");
      }

      Alert.alert("Success", "Gold Packaging Approved");
      closeModal();
    } catch (e) {

      Alert.alert("Error", "Approval failed");
    }
  };
  const amortData = AmortTable.length
    ? AmortTable
    : getScheduleByApplicationNumber;
  const TAB_ACTION_MAP = {
    "cust-2": () => (
      <VerifyButtonNormal onPress={submitGoldDetails} />
    ),

    "orig-1": () => (
      <VerifyButtonNormal onPress={handleSubmitValuation} />
    ),

    "orig-3": () => (
      <>
        <VerifyButtonNormal
          label="Generate Amort"
          onPress={generateAmortization}
        />

        <VerifyButtonNormal onPress={submitDecision} />

        {Array.isArray(AmortTable) && AmortTable.length > 0 && (
          <>
            <TouchableOpacity
              style={styles.amortBtn}
              onPress={() => setShowAmort(true)}
            >
              <Text style={styles.amortBtnText}>
                View Amortization
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={pdfLoading}
              onPress={() =>
                exportAmortPdf(
                  AmortTable,
                  selectedLead?.leadId,
                  setPdfLoading
                )
              }
            >
              {pdfLoading ? (
                <ActivityIndicator color="#16A34A" />
              ) : (
                <Text style={{ color: "#16A34A" }}>
                  Download PDF
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </>
    ),

    "orig-4": () => (
      <VerifyButtonNormal onPress={addGoldPackagingDetails} />
    ),

    "orig-5": () => (
      <VerifyButtonNormal
        label="Approve Package"
        onPress={submitGoldPackagingApproval}
      />
    ),
  };
  const renderActionButtons = () => {
    const renderer = TAB_ACTION_MAP[activeSub];
    return renderer ? renderer() : null;
  };
  const renderBeneficiaryCard = (key) => {
    const disbursementMode = formData?.disbursementMode;

    const beneficiaryCard =
      disbursementMode === "CASH"
        ? [
          { label: "Applicant Name", value: formData?.accountholder },
          { label: "Mode", value: formData?.disbursementMode },
          { label: "Amount", value: formData?.beneficiaryAmount },
        ]
        : [
          { label: "Account Holder", value: formData?.accountholder },
          { label: "Bank Name", value: formData?.bankname },
          { label: "Branch Name", value: formData?.branchname },
          { label: "IFSC Code", value: formData?.IFSCCode },
          { label: "Account Number", value: formData?.accountNumber },
          { label: "Mode", value: formData?.disbursementMode },
          { label: "Amount", value: formData?.beneficiaryAmount },
        ];

    return (
      <View key={key} style={styles.beneficiaryCard}>
        <Text style={styles.sectionTitle}>Beneficiary Details</Text>

        {beneficiaryCard?.map((item, i) => (
          <View key={i} style={styles.beneficiaryRow}>
            <Text style={styles.beneficiaryLabel}>{item.label}</Text>
            <Text style={styles.beneficiaryValue}>
              {item.value || "-"}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  const renderContent = () => {
    if (!activeSub) {
      return <Text>No accessible sub-tab for this section</Text>;
    }

    // ================= CUSTOMER DETAILS =================
    if (activeSub === "cust-1") {
      const subTabs = Object.keys(pageFields["cust-1"]);
      const sections = pageFields["cust-1"]?.[activeCust1Tab] || [];
      const prefix = getTabPrefixMap[activeCust1Tab] || "";
      const verifyLabel = VERIFY_LABEL_MAP[activeCust1Tab];

      const isCurrentVerified =
        activeCust1Tab === "Applicant"
          ? isApplicantVerified
          : activeCust1Tab === "Co-Applicant"
            ? isCoApplicantVerified
            : false;

      return (
        <ScrollView
          stickyHeaderIndices={subTabs.length ? [0] : []}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* ROLE TABS */}
          <View style={{ backgroundColor: "#fff", paddingBottom: 8 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {subTabs?.map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.custTabItem,
                    activeCust1Tab === tab && styles.activeCustTab,
                  ]}
                  onPress={() => setActiveCust1Tab(tab)}
                >
                  <Text
                    style={[
                      styles.custTabText,
                      activeCust1Tab === tab && styles.activeCustTabText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {sections?.map((section, secIdx) =>
            section.title.toLowerCase()?.includes("permanent address")
              ? renderPermanentAddressSection(section, secIdx, prefix)
              : renderGenericSection(section, secIdx)
          )}

          <VerifyButton
            label={isCurrentVerified ? "Verified" : verifyLabel}
            disabled={
              (activeCust1Tab === "Applicant" && isApplicantVerified) ||
              !!leadByLeadiD?.id
            }
            onPress={async () => {
              if (activeCust1Tab === "Applicant" && !isApplicantVerified) {
                await submitApplication();
              }

              if (activeCust1Tab === "Co-Applicant") {
                submitCoApplication();
              }
            }}
          />

          {activeCust1Tab === "KYCBureau" && (
            <VerifyButtonKYC
              role={activeCust1Tab}
              disabled={isApplicantVerified}
              onPress={handleVerify}
            />
          )}
        </ScrollView>
      );
    }

    // ================= OTHER TABS =================

    const rawSections = pageFields[activeSub] || [];

    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>

        {rawSections?.map((section, secIdx) => {

          if (section.title === "Beneficiary Details") {
            return renderBeneficiaryCard(secIdx);
          }

          if (section.isRepeatable) {
            return (
              <View key={secIdx}>
                {renderRepeatableSection(section, "goldItems")}
              </View>
            );
          }

          return (
            <View key={secIdx}>
              {renderGenericSection(section, secIdx)}
            </View>
          );
        })}

        {renderActionButtons()}

        <AmortModal
          visible={showAmort}
          onClose={() => setShowAmort(false)}
          data={amortData}
          pdfLoading={pdfLoading}
          setPdfLoading={setPdfLoading}
          applicationNumber={selectedLead?.leadId}
        />

      </ScrollView>
    );
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      goldItems: prev.goldItems?.length ? prev.goldItems : [{}],
    }));
  }, []);

  const subScrollRef = useRef(null);
  // 1️⃣ Whenever main tab changes, reset scroll & active sub-tab
  useEffect(() => {
    if (!subScrollRef.current) return;

    if (!subTabs.length) return;

    // Only set if activeSub is invalid
    const validSub = subTabs.some(tab => tab.id === activeSub);

    if (!validSub) {
      const firstTabId = subTabs[0].id;
      setActiveSub(firstTabId);
      animateIndicatorToSub(firstTabId);
      subScrollRef.current.scrollTo({ x: 0, animated: true });
    }

  }, [activeMain, subTabs]);

  const submitLead = async () => {
    try {
      // 1. Collect main form data
      const payload = {
        applicant: {
          firstName: formData.firstName ?? "",
          middleName: formData.middleName ?? "",
          lastName: formData.lastName ?? "",
          mobile: formData.mobile ?? "",
          email: formData.email ?? "",
          gender: formData.gender ?? "",
          dob: formData.dob ?? "",
          aadhaar: formData.aadhaar ?? "",
          pan: formData.pan ?? "",
          loanPurpose: formData.loanpurpose ?? "",

          // Current Address
          pincode: "",
          pincodeId: formData.pincode ?? "",
          country: formData.Country ?? "",
          state: formData.State ?? "",
          city: formData.City ?? "",
          area: formData.Area ?? "",
          addressline1: formData?.addressline1 ?? "",
          addressline2: formData?.addressline2 ?? "",
          addressline3: formData?.addressline3 ?? "",

          // Permanent Address
          sameAsCurrent: formData.sameAsCurrent ?? false,
          per_addressLine1: formData.per_addressline1 ?? "",
          per_addressLine2: formData.per_addressline2 ?? "",
          per_addressLine3: formData.per_addressline3 ?? "",
          per_pincode: "",
          per_pincodeid: formData.per_pincode ?? formData.pincode ?? "",
          per_country: formData.per_Country ?? formData.Country ?? "",
          per_state: formData.per_State ?? formData.State ?? "",
          per_city: formData.per_City ?? formData.City ?? "",
          per_area: formData.per_Area ?? formData.Area ?? "",
        },

        coApplicant: {
          firstName: formData.coFirstName ?? "",
          middleName: formData.coMiddleName ?? "",
          lastName: formData.coLastName ?? "",
          mobile: formData.coMobile ?? "",
          email: formData.coemail ?? "",
          gender: formData.coGender ?? "",
          dob: formData.coDob ?? "",
          aadhaar: formData.coAadhaar ?? "",
          pan: formData.coPan ?? "",
          loanPurpose: formData.coloanpurpose ?? "",

          // Current Address
          pincode: "",
          pincodeid: formData.pincodeco ?? "",
          country: formData.coCountry ?? "",
          state: formData.coState ?? "",
          city: formData.coCity ?? "",
          area: formData.coArea ?? "",
          addressline1: formData?.co_addressline1 ?? "",
          addressline2: formData?.co_addressline2 ?? "",
          addressline3: formData?.co_addressline3 ?? "",

          // Permanent Address
          sameAsCurrent: formData.co_sameAsCurrent ?? false,
          per_addressLine1: formData.co_per_addressline1 ?? "",
          per_addressLine2: formData.co_per_addressline2 ?? "",
          per_addressLine3: formData.co_per_addressline3 ?? "",
          per_pincode: "",
          per_pincodeid: formData.co_per_pincode ?? formData.pincodeco ?? "",
          per_country: formData.co_per_Country ?? formData.coCountry ?? "",
          per_state: formData.co_per_State ?? formData.coState ?? "",
          per_city: formData.co_per_City ?? formData.coCity ?? "",
          per_area: formData.co_per_Area ?? formData.coArea ?? "",
        },

        guarantor: {
          firstName: formData.guarFirstName ?? "",
          middleName: formData.guarMiddleName ?? "",
          lastName: formData.guarLastName ?? "",
          mobile: formData.guarMobile ?? "",
          email: formData.guaremail ?? "",
          gender: formData.guarGender ?? "",
          dob: formData.guarDob ?? "",
          aadhaar: formData.guarAadhaar ?? "",
          pan: formData.guarPan ?? "",
          loanPurpose: formData.guarloanpurpose ?? "",

          // Current Address
          pincode: "",
          pincodeid: formData.pincodeguar ?? "",
          country: formData.guarCountry ?? "",
          state: formData.guarState ?? "",
          city: formData.guarCity ?? "",
          area: formData.guarArea ?? "",
          addressline1: formData?.guar_addressline1 ?? "",
          addressline2: formData?.guar_addressline2 ?? "",
          addressline3: formData?.guar_addressline3 ?? "",

          // Permanent Address
          sameAsCurrent: formData.guar_sameAsCurrent ?? false,
          per_addressLine1: formData.guar_per_addressline1 ?? "",
          per_addressLine2: formData.guar_per_addressline2 ?? "",
          per_addressLine3: formData.guar_per_addressline3 ?? "",
          per_pincode: "",
          per_pincodeid: formData.guar_per_pincode ?? "",
          per_country: formData.guar_per_Country ?? formData.guarCountry ?? "",
          per_state: formData.guar_per_State ?? formData.guarState ?? "",
          per_city: formData.guar_per_City ?? formData.guarCity ?? "",
          per_area: formData.guar_per_Area ?? formData.guarArea ?? "",
        },
        origination: {
          goldValuerName: formData.valuerName ?? "",
          valuationDate: formData.valuationDate ?? "",
          verifiedWeight: formData.verifiedWeight ?? "",
          verifiedPurity: formData.verifiedPurity ?? "",
          verifiedType: formData.verifiedType ?? "",
          ltv: formData.ltv ?? "",
          eligibleLoan: formData.eligibleLoan ?? "",
          interestRate: formData.interestRate ?? "",
          tenure: formData.tenure ?? "",
          emiAmount: formData.emiAmount ?? "",
          loanAmount: formData.loanAmount ?? "",
          packageNo: formData.packageNo ?? "",
        },
        // goldDetails: {
        //   goldWeight: formData.goldWeight,
        //   goldPurity: formData.goldPurity,
        //   goldType: formData.goldType,
        //   goldCategory: formData.goldCategory,
        //   goldValue: formData.goldValue,
        //   goldPurchaseDate: formData.goldPurchaseDate,
        //   goldStorage: formData.goldStorage,
        //   goldRemarks: formData.goldRemarks,
        // },
        goldDetails: (formData.goldItems || [])?.map(item => ({
          goldWeight: item.goldWeight ?? "",
          goldPurity: item.goldPurity ?? "",
          goldType: item.goldType ?? "",
          goldCertNumber: item.goldCertNumber ?? "",
          goldBrandName: item.goldBrandName ?? "",
          goldMarketRate: item.goldMarketRate ?? "",
          goldSerialNumber: item.goldSerialNumber ?? "",
          goldCategory: item.goldCategory ?? "",
          goldValue: item.goldValue ?? "",
          goldPurchaseDate: item.goldPurchaseDate ?? "",
          goldStorage: item.goldStorage ?? "",
          goldRemarks: item.goldRemarks ?? "",
        })),

        // documents: {
        //   docId: formData.docId,
        //   // For actual file uploads, handle FormData separately
        // },
        decision: {
          approval: formData.approval,
          letterRef: formData.letterRef,
        },
        disbursal: {
          disbAmt: formData.disbAmt,
        },
      };



      // 2. Send POST request
      const response = await api.post(
        `lead`,
        payload,

      );


      alert("submitted successfully!");
    } catch (error) {
      console.error("Error submitting lead:", error.response || error);
      alert("Failed to submit lead");
    }
  };

  // Memoized Main Tabs

  const handleCardPress = (item) => {
    setSelectedLead(item);
    openModal(MODALS.CREATE_LEAD);
  };

  const LeadCard = React.memo(({ item, isExpanded, onToggle, onPress }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => onPress(item)}
      >
        {/* Header */}
        <View style={styles.collapsedHeader}>
          <View>
            <Text style={styles.cardTitle}>
              {item?.organizationName ? 'Organization Name:' : 'Lead Name:'}{' '}
              <Text style={styles.cardText}>
                {item?.organizationName ??
                  `${item?.firstName ?? ''} ${item?.lastName ?? ''}`}
              </Text>
            </Text>

            <Text style={styles.cardTitle}>
              ID: <Text style={styles.cardText}>{item.leadId}</Text>
            </Text>

            {!!item?.enquiryId && (
              <Text style={styles.cardTitle}>
                Enquiry Id: <Text style={styles.cardText}>{item.enquiryId}</Text>
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={() => onToggle(item.id)}>
            <Text style={styles.expandIcon}>
              {isExpanded ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <InfoRow label="Gender" value={item?.gender} />
            <InfoRow label="Mobile" value={item?.mobileNo} />
            <InfoRow label="Email" value={item?.email} />
            <InfoRow label="Stage" value={item?.leadStage} />
            <InfoRow
              label="Status"
              value={item?.leadStatus?.leadStatusName}
            />
            <InfoRow label="PAN" value={item?.pan} />
          </View>
        )}
      </TouchableOpacity>
    );
  });

  useEffect(() => {
    setPreviewVisible(false);
    setPreviewData({ docType: null, file: null });
  }, [activeDocTab]);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = useCallback((id) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <LeadCard
        item={item}
        isExpanded={expandedId === item.id}
        onToggle={toggleExpand}
        onPress={handleCardPress}
      />
    ),
    [expandedId, toggleExpand]
  );

  useEffect(() => {
    if (!leadByLeadiD?.applicant?.length) return;

    const updated = {};
    const apiCalls = [];

    leadByLeadiD?.applicant?.forEach(app => {
      const role =
        app.applicantTypeCode === "Applicant"
          ? "Applicant"
          : app.applicantTypeCode === "Co-Applicant"
            ? "Co-Applicant"
            : "Guarantor";

      app.address?.forEach(addr => {
        const isCurrent = addr.addressType === "Current";

        const fieldMap = {
          Applicant: { CURRENT: "pincode", PERMANENT: "per_pincode" },
          "Co-Applicant": { CURRENT: "coPincode", PERMANENT: "co_per_pincode" },
          Guarantor: { CURRENT: "guarPincode", PERMANENT: "guar_per_pincode" },
        };

        const field = fieldMap[role]?.[isCurrent ? "CURRENT" : "PERMANENT"];

        if (!field || !addr?.pincode?.pincodeId) return;

        updated[field] = addr.pincode.pincodeId;

        apiCalls.push({
          pincode: addr.pincode.pincode,
          type:
            role === "Applicant"
              ? isCurrent ? "applicant_current" : "applicant_permanent"
              : role === "Co-Applicant"
                ? isCurrent ? "co_current" : "co_permanent"
                : isCurrent ? "guar_current" : "guar_permanent",
        });
      });
    });
    setFormData(prev => ({ ...prev, ...updated }));
    Promise.all(
      apiCalls?.map(x => fetchDataByPincode(x.pincode, x.type))
    );
  }, [leadByLeadiD]);

  const flattenLeadByField = useCallback(
    (
      lead,
      golddetails,
      goldValuation,
      schemeLoan,
      goldDecision,
      goldPackage,
      goldbillingCycle,
      approvepackage,
      InitiateDisbByApplicationNumber,
      DisbursementRequestMsmeByApplicationId,
      FeeDetailsByApplicationNumber,
      getAllBanklist,
      depositbanklist,
      ApproveDisbursementReleaseByApplicationId,
      getUpdateDisbursementReleaseByApplicationId
    ) => {
      if (!lead) return {};

      let d = {};
      const goldDetails = golddetails?.getGoldDetailsDto || [];

      const portfolio = lead?.portfolio
      const product = lead?.product
      const applicant = lead?.applicant?.find(a => a.applicantTypeCode === "Applicant");
      const co = lead?.applicant?.find(a => a.applicantTypeCode === "Co-Applicant");
      const decision = goldDecision;
      const goldpackaging = goldPackage;
      const a = applicant?.consumptionApplicant || {};
      const ca = co?.consumptionApplicant || {};

      const cur = applicant?.address?.find(x => x.addressType === "Current") || {};
      const per = applicant?.address?.find(x => x.addressType === "Permanent") || {};

      const cocur = co?.address?.find(x => x.addressType === "Current") || {};
      const coper = co?.address?.find(x => x.addressType === "Permanent") || {};

      const bank = a?.bankDetails?.[0] || {};
      const bankco = ca?.bankDetails?.[0] || {};
      // const goldValuation = getGoldValuationByApplicationNumber
      const bankObj = getAllBanklist.find(
        b => b.label === FeeDetailsByApplicationNumber?.bankName
      );



      const disbArr = ApproveDisbursementReleaseByApplicationId?.installmentStartDate;

      // if (Array.isArray(disbArr) && disbArr.length === 3) {
      //   const [y, m, d1] = disbArr;

      d.approveddisbursementDate = disbArr
      // `${y}-${String(m).padStart(2, "0")}-${String(d1).padStart(2, "0")}`;
      // }

      const disbArrd = getUpdateDisbursementReleaseByApplicationId?.disbursementDate;

      // if (Array.isArray(disbArrd) && disbArrd.length === 3) {
      //   const [y, m, d1] = disbArrd;

      d.UpdatedisbursementDate =
        getUpdateDisbursementReleaseByApplicationId?.disbursementDate;
      // }

      d.UpdatedDisbCHeque = getUpdateDisbursementReleaseByApplicationId?.utrNumber;
      d.UpdatedDisbRemarks = getUpdateDisbursementReleaseByApplicationId?.remark;
      // }
      // 
      // ===== Applicant Personal =====
      d.firstName = a?.firstName || "";
      d.middleName = a?.middleName || "";
      d.lastName = a?.lastName || "";
      d.mobile = a?.mobileNumber || "";
      d.email = a?.email || "";
      d.gender = a?.gender?.[0] || "";
      d.dob = a?.dateOfBirth || "";
      d.pan = a?.pan || "";
      d.aadhaar = a?.aadhaarNo || "";
      d.loanpurpose = lead?.loanPurpose || "";
      d.portfolio = portfolio?.portfolioId
      d.product = product?.productId
      // ===== Applicant Current =====
      d.addressline1 = cur?.addressLine1 || "";
      d.addressline2 = cur?.addressLine2 || "";
      d.addressline3 = cur?.addressLine3 || "";
      d.pincode = cur?.pincode?.pincodeId || "";
      d.branch = lead?.branch?.branchId
      // ===== Applicant Permanent =====
      d.sameAsCurrent = per?.sameAsCurrentAddress || false;
      d.per_addressline1 = per?.addressLine1 || "";
      d.per_addressline2 = per?.addressLine2 || "";
      d.per_addressline3 = per?.addressLine3 || "";
      d.per_pincode = per?.pincode?.pincodeId || "";

      // ===== Bank =====
      // ===== Applicant Bank =====
      d.accountholder = bank?.accountHolderName || "";
      d.IFSCCode = bank?.ifsc || "";
      d.bankname = bank?.bankName || "";
      d.branchname = bank?.bankBranchName || "";
      d.accounttype = bank?.accountType || "";
      d.accountNumber = bank?.accountNumber || "";

      // ===== Co Applicant Bank =====
      d.co_accountholder = bankco?.accountHolderName || "";
      d.co_IFSCCode = bankco?.ifsc || "";
      d.co_bankname = bankco?.bankName || "";
      d.co_branchname = bankco?.bankBranchName || "";
      d.co_accounttype = bankco?.accountType || "";
      d.co_accountNumber = bankco?.accountNumber || "";


      // ===== Co Applicant =====
      d.coFirstName = ca?.firstName || "";
      d.coMiddleName = ca?.middleName || "";
      d.coLastName = ca?.lastName || "";
      d.coMobile = ca?.mobileNumber || "";
      d.coemail = ca?.email || "";
      d.coGender = ca?.gender?.[0] || "";
      d.coDob = ca?.dateOfBirth || "";
      d.coPan = ca?.pan || "";
      d.coAadhaar = ca?.aadhaarNo || "";

      d.co_addressline1 = cocur?.addressLine1 || "";
      d.co_addressline2 = cocur?.addressLine2 || "";
      d.co_addressline3 = cocur?.addressLine3 || "";
      d.coPincode = cocur?.pincode?.pincodeId || "";

      d.co_sameAsCurrent = coper?.sameAsCurrentAddress || false;
      d.co_per_addressline1 = coper?.addressLine1 || "";
      d.co_per_addressline2 = coper?.addressLine2 || "";
      d.co_per_addressline3 = coper?.addressLine3 || "";
      d.co_per_pincode = coper?.pincode?.pincodeId || "";


      d.goldItems = goldDetails?.map(g => ({
        goldCategory: g?.itemCategory || "",
        goldType: g?.itemType || "",
        goldBrandName: g?.itemName || "",

        goldOwnership: g?.goldOwnership || "",
        goldStatus: g?.goldStatus || "",

        noOfItems: String(g?.noOfItems) || 0,

        goldWeight: String(g?.grossWeight ?? ""),
        goldPurity: String(g?.purity ?? ""),

        stoneWeight: String(g?.stoneWeight ?? ""),
        stoneType: g?.stoneType || "",

        impurityPercentage: String(g?.impurityPercentage ?? ""),

        netWeight: String(g?.netWeight ?? ""),

        goldMarketRate: String(g?.goldRate ?? ""),
        goldValue: String(g?.collateralValue ?? ""),

        goldCertNumber: g?.hallmarkDetails || "",
        goldRemarks: g?.remarks || "",

        brokenJewellery: g?.brokenJewellery || false,
        gloConfirmation: g?.goldConfirmation ?? false,



        applicationId: g?.applicationId,
        goldDetailsId: g?.goldDetailsId,
        // keep images per gold item (optional if you show preview)
        images: g?.getGoldItemImageDto || [],
      }));

      // d.valuerContact = goldValuation?.goldValuerContactNo;
      // d.valuerName = goldValuation?.goldValuerName;
      // d.valuationDate = goldValuation?.valuationDate
      // d.goldValuation =  goldValuation
      d._panNameValid = a?.panNameValid || false;
      d._panValid = a?.panValid || false;
      d._mobileVerified = a?.mobileVerify || false;
      d._panVerify = a?.panVerify || false

      d.co_per_panNameValid = ca?.panNameValid || false;
      d.co_per_panValid = ca?.panValid || false;
      d.co_per_mobileVerified = ca?.mobileVerify || false;
      d.co_per_panVerify = ca?.panVerify || false



      d.valuerContact = goldValuation?.goldValuerContactNo || "";
      d.valuerName = goldValuation?.goldValuerName || "";
      d.valuationDate = goldValuation?.valuationDate || "";
      // ================= Decision Prefill =================
      d.SanctioninterestRate = String(decision?.sanctionROI || "");
      d.Sanctiontenure = String(decision?.sanctionTenor || "");
      d.scheme = decision?.schemeId || "";

      d.loanApproval =
        decision?.loanApproval

      d.rejecteReason = decision?.rejectionReason || "";
      // Billing Cycle (comes from dateOfEmi)
      // const billingOption = billingCycleList.find(
      //   x => String(x.label) === String(goldbillingCycle?.dateOfEmi)
      // );
      // 
      // d.billingCycle = billingOption?.value || "";


      d.loanAmount = String(decision?.sanctionAmount || "");
      d.emiAmount = String(decision?.emi || "");
      d.remark = decision?.remark || "";

      // financial restore
      d.ltv = String(decision?.ltv || "");
      d.eligibleLoan = String(decision?.eligibility || "");

      d.indexNo = String(goldpackaging?.indexNo || "")

      d.rackNo = String(goldpackaging?.rackNo || "")


      d.trayNo = String(goldpackaging?.trayNo || "")

      d.packetNo = goldpackaging?.packetNo

      d.packetWeight = String(goldpackaging?.packetWeight || "")

      d.packageApproval = Boolean(approvepackage?.approval)
      d.packgeRemarks = String(approvepackage?.approvalRemark || "")
      // Billing label restore

      d.disbursementportfolio = String(InitiateDisbByApplicationNumber?.productType || "")
      d.disbursementproduct = String(InitiateDisbByApplicationNumber?.product)
      d.disbursementscheme = String(InitiateDisbByApplicationNumber?.scheme)
      d.disbursementlinterestRate = String(InitiateDisbByApplicationNumber?.interestRate)
      d.disbursementtenor = String(InitiateDisbByApplicationNumber?.tenor)
      d.disbursementsanctionAmount = String(InitiateDisbByApplicationNumber?.allocatedLoanAmount)
      d.disbursementrepaymentFrequency = String(InitiateDisbByApplicationNumber?.repaymentFrequency)

      d.disbursementinitiate = InitiateDisbByApplicationNumber?.initiateDisbursion === "Y" ? true : false
      d.disbursementterminate = InitiateDisbByApplicationNumber?.terminateDisbursion === "Y" ? true : false
      d.approvedLoanAmount = String(InitiateDisbByApplicationNumber?.allocatedLoanAmount)
      d.totalDisbursement = String(InitiateDisbByApplicationNumber?.allocatedLoanAmount)

      d.loanAccountNumber = String(DisbursementRequestMsmeByApplicationId?.lan)
      d.disbursementDate = String(DisbursementRequestMsmeByApplicationId?.disbursementDate)

      d.utrNumber = FeeDetailsByApplicationNumber?.utrNo || "";

      d.instrumentType = FeeDetailsByApplicationNumber?.instrumentType || "";

      // d.depositBank = String(FeeDetailsByApplicationNumber?.depositBank || "");



      const matcheddepositAccount = depositbanklist?.find(
        x => x.accountNumber === Number(FeeDetailsByApplicationNumber?.depositBank)
      );
      d.depositBank = matcheddepositAccount?.value
      d.disbbankname = bankObj?.value,     // ✅ VALUE NOT LABEL
        d.disbbanklabel = bankObj?.label,


        d.valuationDate = FeeDetailsByApplicationNumber?.instrumentDate || "";

      d.receiptDate = FeeDetailsByApplicationNumber?.receiptDate || "";

      d.amount = String(FeeDetailsByApplicationNumber?.feeAmount || "");

      d.beneficiaryAmount = String(InitiateDisbByApplicationNumber?.allocatedLoanAmount || '')
      d.disbursementMode =
        DisbursementRequestMsmeByApplicationId?.modeOfDisbursement || "";

      const matchedAccount = depositbanklist?.find(
        x => x.accountNumber === Number(DisbursementRequestMsmeByApplicationId?.disbursementAccount)
      );

      d.disbursementAccount = matchedAccount?.value || "";
      d.displayBpiOnZeroThRow = DisbursementRequestMsmeByApplicationId?.displayBpiOnZeroThRow

      d.approveddisbursementaccount = String(DisbursementRequestMsmeByApplicationId?.disbursementAccount)
      d.approveddisbursementBPIDetails = DisbursementRequestMsmeByApplicationId?.displayBpiOnZeroThRow ? 'Display BPI on 0th Row' : ''

      // d.approveddisbursementDate = String(formattedDate)
      d.approvedisbursementloanApproval = ApproveDisbursementReleaseByApplicationId?.decision === "Y" ? 'Approved' : 'Rejected' ? null : ''
      d.approvedisbursementremark = String(ApproveDisbursementReleaseByApplicationId?.remark || "")
      d.approveddisbursementBPIDetails = String('Display BPI on 0th Row')
      return d;
    }, []);

  //   useEffect(() => {
  //     const arr =
  //       ApproveDisbursementReleaseByApplicationId?.installmentStartDate;

  //     if (Array.isArray(arr) && arr.length === 3) {

  //       const [year, month, day] = arr;

  //       const formattedDate =
  //         `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  // 
  //       setFormData(prev => ({
  //         ...prev,
  //         approveddisbursementDate: String(formattedDate)
  //       }));
  //     }

  //   }, [ApproveDisbursementReleaseByApplicationId]);

  useEffect(() => {
    if (!FeeDetailsByApplicationNumber?.bankName || !getAllBanklist.length) return;

    const bankObj = getAllBanklist.find(
      b => b.label === FeeDetailsByApplicationNumber?.bankName
    );

    if (bankObj) {
      setFormData(prev => ({
        ...prev,
        disbbankname: bankObj?.value,     // ✅ VALUE NOT LABEL
        disbbanklabel: bankObj?.label,
        disbbranch: "",
        disbbranchlabel: ""
      }));

      getBankBranchByBankId(bankObj.value);
    }
  }, [FeeDetailsByApplicationNumber, getAllBanklist]);

  useEffect(() => {
    if (!FeeDetailsByApplicationNumber?.bankBranchName || !Branchist?.length) return;
    const branchObj = Branchist.find(
      b => b.label === FeeDetailsByApplicationNumber?.bankBranchName
    );

    if (branchObj) {
      setFormData(prev => ({
        ...prev,
        disbbranch: branchObj?.value,
        disbbranchlabel: branchObj?.label
      }));
    }
  }, [FeeDetailsByApplicationNumber, Branchist]);

  useEffect(() => {
    if (!leadByLeadiD?.id) return;

    const flattened = flattenLeadByField(
      leadByLeadiD,
      GoldDetailsByApplicationNumber,
      getGoldValuationByApplicationNumber,
      null,
      getDecisionByApplicationNumber,
      getGoldPackagingDetailsByApplicationNumber,
      getDecisionByApplicationNumber,
      ApproveGoldPackagingDetailsByApplicationNumber,
      InitiatDatabyApplicationNumber,
      DisbursementRequestMsmeByApplicationId,
      FeeDetailsByApplicationNumber,
      getAllBanklist,
      depositbanklist,
      ApproveDisbursementReleaseByApplicationId,
      getUpdateDisbursementReleaseByApplicationId
    );

    setFormData(flattened);

  }, [
    leadByLeadiD?.id,
    GoldDetailsByApplicationNumber,
    getDecisionByApplicationNumber,
    getGoldValuationByApplicationNumber,
    getGoldPackagingDetailsByApplicationNumber,
    ApproveGoldPackagingDetailsByApplicationNumber,
    InitiatDatabyApplicationNumber,
    DisbursementRequestMsmeByApplicationId,
    FeeDetailsByApplicationNumber,
    getAllBanklist,
    depositbanklist,
    ApproveDisbursementReleaseByApplicationId,
    getUpdateDisbursementReleaseByApplicationId
  ]);

  useEffect(() => {
    if (!getDecisionByApplicationNumber?.dateOfEmi || !billingCycleList?.length)
      return;

    const billingOption = billingCycleList.find(
      x => Number(x?.label) === Number(getDecisionByApplicationNumber.dateOfEmi)
    );



    if (billingOption) {
      setFormData(prev => ({
        ...prev,
        billingCycle: billingOption?.value,
        isBillingCyclelabel: billingOption?.label,
      }));
    }
  }, [billingCycleList, getDecisionByApplicationNumber?.dateOfEmi,]);
  // useEffect(() => {

  //   
  //   if (getDecisionByApplicationNumber?.schemeId) {
  //     getSchemeLoanInterestAmortizationBySchemeIds(getDecisionByApplicationNumber.schemeId);
  //   }

  // }, [getDecisionByApplicationNumber,]);


  useEffect(() => {
    api.get("getAllGoldRate").then(res => {
      const rates = res.data?.data || [];

      if (!rates.length) return;

      // API already sorted newest → oldest
      const latestRate = rates[0];

      setGoldRates(latestRate);
    });
  }, []);






  useEffect(() => {
    if (!formData.eligibleLoan) return;

    setFormData(prev => ({
      ...prev,
      loanAmount: prev.loanAmount || prev.eligibleLoan,
    }));
  }, [formData.eligibleLoan]);

  const validateLoanAmount = () => {
    if (Number(formData.loanAmount) > Number(formData.eligibleLoan)) {
      Alert.alert(
        "Invalid Loan",
        "Loan Amount cannot exceed Eligible Loan"
      );
      return false;
    }
    return true;
  };







  return (
    <View style={styles.container}>

      {/* ===== HEADER ===== */}
      <View style={styles.firstrow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {accessRole?.roleCode === 'Sales' && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => openModal(MODALS.CREATE_LEAD)}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        )}

      </View>

      {/* ===== LEAD LIST ===== */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No data available</Text>
        }
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
      />


      {/* ================= MODAL MANAGER ================= */}

      {/* LOADING */}
      {activeModal === MODALS.LOADING && (
        <Modal transparent visible>
          <View style={styles.loaderFullScreen}>
            <ActivityIndicator size="large" color="#040675FF" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </Modal>
      )}

      {/* DETAILS */}
      {/* {activeModal === MODALS.DETAILS && (
        <ApplicantDetailModal
          visible
          selectedCoApplicant={selectedCoApplicant}
          renderTabContent={renderTabContent}
          onClose={closeModal}
          styles={styles}
        />
      )} */}


      {/* CONFIRM REMOVE */}
      {/* {activeModal === MODALS.CONFIRM_REMOVE && ( */}
      {confirmRemoveModalVisible && (
        <ConfirmRemoveModal
          visible
          file={fileToRemove}
          onConfirm={confirmRemoveFile}
          onClose={() => setConfirmRemoveModalVisible(false)}

        />
      )}


      {/* FILE PREVIEW */}
      {/* {activeModal === MODALS.PREVIEW && ( */}
      {previewVisible && (
        <PreviewFileModal
          visible
          data={previewData}
          onClose={() => setPreviewVisible(false)}

        />
      )}


      {/* CREATE LEAD */}
      {activeModal === MODALS.CREATE_LEAD && (
        // {confirmRemoveModalVisible && (
        <CreateLeadModal
          visible
          onSubmit={submitLead}
          onClose={closeModal}
          selectedLead={leadByLeadiD}

          renderedTabs={renderedTabs}
          renderContent={renderContent()}
          canSubmitLead={canSubmitLead}
          formDatafilled={formData}
        />
      )}


      {/* {activeModal === MODALS.OTP && modalPayload?.type && ( */}
      {isOtpVisible && (
        <OtpModal
          visible
          modalType={otpType}
          // modalType={modalPayload.type}
          otpApplicant={otpApplicant}
          otpCoApplicant={otpCoApplicant}
          otpGurantor={otpGurantor}
          otpInputs={otpInputs}
          handleOtpChange={handleOtpChange}
          handleVerifyOtp={handleVerifyOtp}
          isLoading={isLoading}
          onClose={() => setIsOtpVisible(false)}
        />
      )}
    </View>
  );

};

const styles = StyleSheet.create({
  activeSubTabdoc: { borderBottomWidth: 2, borderBottomColor: "green" },
  activeSubTabTextdoc: { color: "green", fontWeight: "bold" },
  custTabItem: { paddingVertical: isSmallScreen ? 6 : 8, paddingHorizontal: isSmallScreen ? 12 : 18, marginRight: 10, borderRadius: 25, backgroundColor: "#F0F0F0", borderWidth: 1, borderColor: "#D0D0D0" },
  activeCustTab: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  custTabText: { fontSize: isSmallScreen ? 12 : 14, color: "#555", fontWeight: "500" },
  activeCustTabText: { color: "#FFFFFF", fontWeight: "700" },
  fieldContainer: { flex: 1, marginRight: 12 },
  dropdown: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, paddingHorizontal: isSmallScreen ? 8 : 10, paddingVertical: isSmallScreen ? 6 : 8, backgroundColor: "#fff", minHeight: isSmallScreen ? 36 : 44, justifyContent: "center" },
  selectedTextStyle: { fontSize: isSmallScreen ? 12 : 13, color: "#000" },
  inputSearchStyle: { fontSize: isSmallScreen ? 12 : 13, color: "#000" },
  dropdownItem: { paddingVertical: isSmallScreen ? 6 : 8, paddingHorizontal: isSmallScreen ? 8 : 10, backgroundColor: "#fff", borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  dropdownItemText: { fontSize: isSmallScreen ? 12 : 13, color: "#333" },
  required: { color: "#FF4D4F" },
  placeholderStyle: { color: "#999", fontSize: isSmallScreen ? 12 : 14 },
  rowContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: isSmallScreen ? 8 : 12 },
  fullWidthFieldContainer: { flex: 1, },
  removeBtn: { flex: 1, paddingVertical: isSmallScreen ? 10 : 12, backgroundColor: '#ff5555', borderRadius: 8, alignItems: 'center' },
  inputField: {
    flex: 1, paddingHorizontal: 5, marginVertical: 6,
  },
  labelformodal: {
    fontSize: isSmallScreen ? 11 : 12,
    marginBottom: 4,
    color: 'black',
    fontWeight: 'bold',
  },
  checkIcon: {
    width: 12,
    height: 12,
    marginLeft: 5,
  },
  inputformodaliui: {
    borderWidth: 1,
    borderColor: 'black',       // unified with 
    borderRadius: 5,
    fontSize: isSmallScreen ? 11 : 12,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
    color: 'black',
    flex: 1,                    // responsive width instead of fixed width
    minHeight: 40,              // keeps touch-friendly height
  },
  inputMultiline: {
    height: height * 0.08, // Adjust height for multiline
    textAlignVertical: 'top', // Align text to the top
  },
  loaderFullScreen: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  loadingText: {
    marginTop: 10,
    color: 'black',
    fontSize: isSmallScreen ? 14 : 16,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardLabel: {
    fontWeight: '500',
    color: 'black',
    flex: 1, // Ensures labels are consistent width
  },
  cardValue: {
    color: 'black',
    flex: 2, // Allows value to take more space
    textAlign: 'left',
  },
  addBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
  },
  addBtnText: {
    color: "#090C0F",
    fontWeight: "600",
  },
  removeBtnText: {
    color: "#D32F2F",
    fontWeight: "600",
  },

  /* ===================== CONTAINER ===================== */
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    padding: moderateScale(16),
  },

  firstrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(12),
  },

  /* ===================== SEARCH ===================== */
  searchBar: {
    flex: 1,
    minHeight: verticalScale(44),
    paddingHorizontal: moderateScale(12),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(6),
    backgroundColor: "#fff",
    fontSize: moderateScale(14),
    color: "#000",
    marginRight: moderateScale(8),
  },

  createButton: {
    minHeight: verticalScale(44),
    paddingHorizontal: moderateScale(14),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  createButtonText: {
    fontSize: moderateScale(13),
    fontWeight: "500",
    color: "#000",
  },

  /* ===================== TABS ===================== */


  mainTab: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(16),
    marginHorizontal: moderateScale(6),
    borderRadius: moderateScale(20),
    backgroundColor: "#ddd",
    elevation: 2,
  },

  activeMainTab: {
    backgroundColor: "#007bff",
    elevation: 4,
  },

  mainTabText: {
    fontSize: moderateScale(15),
    color: "#333",
  },

  activeMainTabText: {
    color: "#fff",
    fontWeight: "600",
  },



  subTab: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(16),
    backgroundColor: "#eee",
    marginHorizontal: moderateScale(6),
  },

  subTabText: {
    fontSize: moderateScale(13),
    color: "#333",
  },

  /* ===================== SECTION ===================== */
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    padding: moderateScale(14),
    marginBottom: verticalScale(14),
    elevation: 3,
  },

  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(10),
  },

  label: {
    fontSize: moderateScale(12),
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(4),
  },

  /* ===================== INPUT ===================== */
  inputformodal: {
    minHeight: verticalScale(44),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(14),
    color: "#000",
    backgroundColor: "#fff",
  },

  errorText: {
    fontSize: moderateScale(11),
    color: "#FF4D4F",
    marginTop: verticalScale(4),
  },

  /* ===================== CARD ===================== */
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginVertical: verticalScale(6),
    elevation: 3,
  },

  cardTitle: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: "#000",
  },

  cardText: {
    fontSize: moderateScale(13),
    color: "#555",
    marginTop: verticalScale(4),
  },
  emptyListText: {
    textAlign: "center",
    marginTop: verticalScale(40),
    fontSize: moderateScale(14),
    color: "#888",
  },

  collapsedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  /* ===== EXPANDED CONTENT ===== */
  expandedContent: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 8,
  },
  expandIcon: {
    fontSize: moderateScale(14),
    color: "#555",
  },
  verifyBtn: {
    marginTop: 20,
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  verifyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },


  uploadSection: {
    // backgroundColor: "#EEEEEEF1",
    borderRadius: moderateScale(12),
    padding: scale(14),
    marginBottom: verticalScale(12),
    width: width * 0.8
  },

  contentTitle: {
    fontSize: moderateScale(15),
    fontWeight: "600",
    color: "#111827",
    marginBottom: verticalScale(10),
  },

  uploadBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    alignItems: "center",
    marginBottom: verticalScale(14),
  },

  uploadBtnText: {
    color: "#FFFFFF",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },

  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    backgroundColor: "#F9FAFB",
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
  },

  fileName: {
    flex: 1,
    fontSize: moderateScale(13),
    color: "#374151",
    marginRight: scale(8),
  },

  fileActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  previewText: {
    fontSize: moderateScale(13),
    color: "#2563EB",
    fontWeight: "500",
    marginRight: scale(12),
  },

  removeText: {
    fontSize: moderateScale(13),
    color: "#DC2626",
    fontWeight: "500",
  },

  noFileText: {
    textAlign: "center",
    fontSize: moderateScale(13),
    color: "#6B7280",
    marginTop: verticalScale(10),
  },

  documentWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    padding: scale(12),
    elevation: 3,
    flexDirection: "column",   // 👈 FORCE vertical stack
  },

  goldDocTab: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(14),
    borderRadius: moderateScale(16),
    backgroundColor: "#F3F4F6",
    marginRight: scale(8),          // spacing between pills
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  goldDocTabActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  goldDocTabText: {
    fontSize: moderateScale(12),
    color: "#374151",
    fontWeight: "500",
  },

  goldDocTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tableWrapper: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },

  header: {
    backgroundColor: "#F1F5F9",
  },

  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },

  headerCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 12,
  },

  amortBtn: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },

  amortBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  feeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  fullFeeCard: {
    width: "100%",
  },

  halfFeeCard: {
    width: "48%",
  },

  feeCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  feeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 6,
  },

  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },

  feeLabel: {
    fontSize: 12,
    color: "#64748B",
  },

  feeValue: {
    fontSize: 12,
    color: "#020617",
    fontWeight: "500",
  },

  feeAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16A34A",
  },

  beneficiaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    elevation: 2,
  },

  beneficiaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },

  beneficiaryLabel: {
    fontSize: 13,
    color: "#555",
  },

  beneficiaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2F80ED',
    marginRight: 8,
    alignSelf: "center",     // important
  },

  activeTab: {
    backgroundColor: '#2F80ED',
  },

  inactiveTab: {
    backgroundColor: 'white',
  },

  tabText: {
    fontSize: 14,
    color: '#2F80ED',
    fontWeight: '500',
  },

  activeTabText: {
    color: 'white',
  },

  disabledTab: {
    backgroundColor: "#E5E7EB",
    opacity: 0.6
  },

  disabledTabText: {
    color: "#6B7280"
  }
});


export default NewLoan;