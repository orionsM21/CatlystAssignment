export const MASTER_CONFIG = {
    COUNTRY: {
        title: 'Country Master',
        layout: 'card',
        api: {
            list: 'getAllCountries',
            create: 'createCountry',
            update: 'createCountry',
        },
        primaryKey: 'countryId',

        columns: [
            { key: 'countryCode', label: 'Country Code' },
            { key: 'countryName', label: 'Country Name' },
            { key: 'active', label: 'Country Status', type: 'status' },
        ],

        form: [
            { key: 'countryCode', label: 'Country Code', type: 'text', required: true },
            { key: 'countryName', label: 'Country Name', type: 'text', required: true },
            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    ZONE: {
        title: 'Zone Master',
        layout: 'card',
        api: {
            list: 'getAllZones',
            create: 'createZone',
            update: 'createZone',
        },
        primaryKey: 'zoneId',

        columns: [
            { key: 'zoneCode', label: 'Zone Code' },
            { key: 'zoneName', label: 'Zone Name' },
            { key: 'active', label: 'Zone Status', type: 'status' },
        ],

        form: [
            { key: 'zoneCode', label: 'Zone Code', type: 'text', required: true },
            { key: 'zoneName', label: 'Zone Name', type: 'text', required: true },

            {
                key: 'countryId',
                label: 'Country',
                type: 'dropdown',
                source: 'COUNTRY',
                labelKey: 'countryName',
                valueKey: 'countryId',
                required: true,
            },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    REGION: {
        title: 'Region Master',
        layout: 'card',
        api: {
            list: 'getAllRegions',
            create: 'createRegion',
            update: 'createRegion',
        },
        primaryKey: 'regionId',

        columns: [
            { key: 'regionCode', label: 'Region Code' },
            { key: 'regionName', label: 'Region Name' },
            { key: 'zoneName', label: 'Zone' },
            { key: 'countryName', label: 'Country' },
            { key: 'active', label: 'Region Status', type: 'status' },
        ],

        form: [
            { key: 'regionCode', label: 'Region Code', type: 'text', required: true },
            { key: 'regionName', label: 'Region Name', type: 'text', required: true },

            {
                key: 'zoneId',
                label: 'Zone',
                type: 'dropdown',
                source: 'ZONE',
                labelKey: 'zoneName',
                valueKey: 'zoneId',
                required: true,
            },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    STATE: {
        title: 'State Master',
        layout: 'card',
        api: {
            list: 'getAllStates',
            create: 'createState',
            update: 'createState',
        },
        primaryKey: 'stateId',

        columns: [
            { key: 'stateCode', label: 'State Code' },
            { key: 'stateName', label: 'State Name' },
            { key: 'regionName', label: 'Region' },
            { key: 'countryName', label: 'Country' },
            { key: 'active', label: 'State Status', type: 'status' },
        ],

        form: [
            { key: 'stateCode', label: 'State Code', type: 'text', required: true },
            { key: 'stateName', label: 'State Name', type: 'text', required: true },

            {
                key: 'regionId',
                label: 'Region',
                type: 'dropdown',
                source: 'REGION',
                labelKey: 'regionName',
                valueKey: 'regionId',
                required: true,
            },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    CITY: {
        title: 'City Master',
        layout: 'card',
        api: {
            list: 'getAllCities',
            create: 'createCity',
            update: 'createCity',
        },
        primaryKey: 'cityId',

        columns: [
            { key: 'cityCode', label: 'City Code' },
            { key: 'cityName', label: 'City Name' },
            { key: 'stateName', label: 'State Name' },
            { key: 'active', label: 'City Status', type: 'status' },
        ],

        form: [
            { key: 'cityCode', label: 'City Code', type: 'text', required: true },
            { key: 'cityName', label: 'City Name', type: 'text', required: true },

            {
                key: 'stateId',
                label: 'State',
                type: 'dropdown',
                source: 'STATE',
                labelKey: 'stateName',
                valueKey: 'stateId',
                required: true,
            },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    PINCODE: {
        title: 'Pincode Master',
        layout: 'card',
        api: {
            list: 'getAllPincodes',
            create: 'createPincode',
            update: 'createPincode',
        },
        primaryKey: 'pincodeId',

        columns: [
            { key: 'pincode', label: 'Pincode' },
            { key: 'cityName', label: 'City Name' },
            { key: 'areaName', label: 'Area Name' },
            { key: 'active', label: 'Pincode Status', type: 'status' },
        ],

        form: [
            { key: 'pincode', label: 'Pincode', type: 'text', required: true },
            { key: 'areaName', label: 'Area Name', type: 'text', required: true },

            {
                key: 'cityId',
                label: 'City',
                type: 'dropdown',
                source: 'CITY',
                labelKey: 'cityName',
                valueKey: 'cityId',
                required: true,
            },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    BANK: {
        title: 'Bank Master',
        layout: 'card',
        api: {
            list: 'getAllBank',
            create: 'createBank',
            update: 'updateBank',
        },
        primaryKey: 'bankId',

        columns: [
            { key: 'bankCode', label: 'Bank Code' },
            { key: 'bankName', label: 'Bank Name' },
            { key: 'active', label: 'Bank Status', type: 'status' },
        ],

        form: [
            { key: 'bankCode', label: 'Bank Code', type: 'text', required: true },
            { key: 'bankName', label: 'Bank Name', type: 'text', required: true },
            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    CLEARING_LOCATION: {
        title: 'Bank Clearing Location',
        layout: 'card',
        api: {
            list: 'getAllBranchClearingLocations',
            create: 'createBranchClearingLocation',
            update: 'updateBranchClearingLocation',
        },
        primaryKey: 'branchClearingLocationId',

        columns: [
            { key: 'branchClearingLocationCode', label: 'Clearing Code' },
            { key: 'branchClearingLocationName', label: 'Clearing Location' },
            { key: 'active', label: 'Status', type: 'status' },
        ],

        form: [
            {
                key: 'branchClearingLocationCode',
                label: 'Clearing Code',
                type: 'text',
                required: true,
            },
            {
                key: 'branchClearingLocationName',
                label: 'Clearing Location',
                type: 'text',
                required: true,
            },
            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    BRANCH: {
        title: 'Branch Master',
        layout: 'card',
        api: {
            list: 'getAllBankBranches',
            create: 'createBankBranch',
            update: 'updateBankBranch',
        },
        primaryKey: 'bankBranchId',

        columns: [
            { key: 'bankBranchCode', label: 'Branch Code' },
            { key: 'bankBranchName', label: 'Branch Name' },
            { key: 'bankName', label: 'Bank' },
            { key: 'branchClearingLocationName', label: 'Clearing Location' },
            { key: 'active', label: 'Status', type: 'status' },
        ],

        form: [
            {
                key: 'bankBranchCode',
                label: 'Branch Code',
                type: 'text',
                required: true,
            },
            {
                key: 'bankBranchName',
                label: 'Branch Name',
                type: 'text',
                required: true,
            },

            {
                key: 'bankId',
                label: 'Bank',
                type: 'dropdown',
                source: 'BANK',
                labelKey: 'bankName',
                valueKey: 'bankId',
                required: true,
            },

            {
                key: 'branchClearingLocationId',
                label: 'Clearing Location',
                type: 'dropdown',
                source: 'CLEARING_LOCATION',
                labelKey: 'branchClearingLocationName',
                valueKey: 'branchClearingLocationId',
                required: true,
            },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    DOCUMENT: {
        title: 'Document Master',
        layout: 'card',
        api: {
            list: 'getAllDocuments',
            create: 'createDocument',
            update: 'updateDocument',
        },
        primaryKey: 'documentId',

        columns: [
            { key: 'documentCode', label: 'Document Code' },
            { key: 'documentName', label: 'Document Name' },
            { key: 'applicableFor', label: 'Applicable For' },
            { key: 'active', label: 'Status', type: 'status' },
        ],

        form: [
            { key: 'documentCode', label: 'Document Code', type: 'text', required: true },
            { key: 'documentName', label: 'Document Name', type: 'text', required: true },

            {
                key: 'applicableFor',
                label: 'Applicable For',
                type: 'text',
                required: true,
            },

            { key: 'originalRequired', label: 'Original Required', type: 'switch' },
            // { key: 'applicantRequired', label: 'Applicant Required', type: 'switch' },
            // { key: 'coApplicantRequired', label: 'Co-Applicant Required', type: 'switch' },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    DOCUMENT_GROUP: {
        title: 'Document Group',
        layout: 'card',
        api: {
            list: 'getAllDocumentsGroups',
            create: 'createDocumentGroup',
            update: 'updateDocumentGroup',
        },
        primaryKey: 'documentsGroupId',

        columns: [
            { key: 'documentsGroupCode', label: 'Group Code' },
            { key: 'documentsGroupName', label: 'Group Name' },
            { key: 'applicableFor', label: 'Applicable For' },
            { key: 'active', label: 'Status', type: 'status' },
        ],

        form: [
            {
                key: 'documentsGroupCode',
                label: 'Group Code',
                type: 'text',
                required: true,
            },
            {
                key: 'documentsGroupName',
                label: 'Group Name',
                type: 'text',
                required: true,
            },

            {
                key: 'applicableFor',
                label: 'Applicable For',
                type: 'text',
                required: true,
            },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    SOURCING_BRANCH: {
        title: 'Sourcing Branch Master',
        api: {
            list: 'getAllBranch',
            create: 'createBranch',
            update: 'updateBranch',
        },
        primaryKey: 'branchId',
        layout: 'table', // default

        columns: [
            { key: 'branchCode', label: 'Branch Code' },
            { key: 'branchName', label: 'Branch Name' },
            { key: 'parentBranch', label: 'Parent Branch' },
            { key: 'active', label: 'Branch Status', type: 'status' },
        ],

        form: [
            { key: 'branchCode', label: 'Branch Code', type: 'text', required: true },
            { key: 'branchName', label: 'Branch Name', type: 'text', required: true },
            { key: 'parentBranch', label: 'Parent Branch', type: 'text' },
            { key: 'branchType', label: 'Branch Type', type: 'text' },
            { key: 'phoneNo', label: 'Phone No', type: 'text' },
            { key: 'address', label: 'Address', type: 'text' },
            { key: 'area', label: 'Area', type: 'text' },
            { key: 'pincode', label: 'Pincode', type: 'text' },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    CUSTOMER_ACQUISITION: {
        title: 'Customer Acquisition',
        api: {
            list: 'getAllApplication',
        },
        primaryKey: 'id',
        layout: 'table',

        columns: [
            { key: 'applicationNo', label: 'Application No.' },
            { key: 'applicantName', label: 'Applicant Name' },
            { key: 'portfolio', label: 'Portfolio' },
            { key: 'productName', label: 'Product' },
            { key: 'mobileNumber', label: 'Mobile No.' },
            { key: 'pan', label: 'PAN' },
        ],

        actions: {
            view: true,
            edit: true,
        },

        // ✅ MOVE TRANSFORM HERE
        transform: (item) => {
            const applicant = item.applicant?.find(
                a => a.applicantTypeCode === 'Applicant'
            )?.consumptionApplicant;

            return {
                id: item.id,
                applicationNo: item.applicationNo,
                productName: item.productName,
                portfolio: item.portfolioDescription,
                applicantName: applicant
                    ? `${applicant.firstName} ${applicant.lastName}`
                    : '-',
                mobileNumber: applicant?.mobileNumber ?? '-',
                pan: applicant?.pan ?? '-',
            };
        },
    },


};
