export const MASTER_CONFIG_BBM = {
    BANK: {
        title: 'Bank Master',
        api: {
            list: 'getAllBanks',
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
        api: {
            list: 'getAllClearingLocations',
            create: 'createClearingLocation',
            update: 'updateClearingLocation',
        },
        primaryKey: 'clearingLocationId',

        columns: [
            { key: 'clearingCode', label: 'Clearing Code' },
            { key: 'clearingName', label: 'Clearing Location' },
            { key: 'bankName', label: 'Bank' },
            { key: 'active', label: 'Status', type: 'status' },
        ],

        form: [
            { key: 'clearingCode', label: 'Clearing Code', type: 'text', required: true },
            { key: 'clearingName', label: 'Clearing Location', type: 'text', required: true },

            {
                key: 'bankId',
                label: 'Bank',
                type: 'dropdown',
                source: 'BANK',
                labelKey: 'bankName',
                valueKey: 'bankId',
                required: true,
            },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

    BRANCH: {
        title: 'Branch Master',
        api: {
            list: 'getAllBranches',
            create: 'createBranch',
            update: 'updateBranch',
        },
        primaryKey: 'branchId',

        columns: [
            { key: 'branchCode', label: 'Branch Code' },
            { key: 'branchName', label: 'Branch Name' },
            { key: 'bankName', label: 'Bank' },
            { key: 'clearingName', label: 'Clearing Location' },
            { key: 'active', label: 'Status', type: 'status' },
        ],

        form: [
            { key: 'branchCode', label: 'Branch Code', type: 'text', required: true },
            { key: 'branchName', label: 'Branch Name', type: 'text', required: true },

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
                key: 'clearingLocationId',
                label: 'Clearing Location',
                type: 'dropdown',
                source: 'CLEARING_LOCATION',
                labelKey: 'clearingName',
                valueKey: 'clearingLocationId',
                required: true,
            },

            { key: 'active', label: 'Active Status', type: 'switch' },
        ],
    },

}