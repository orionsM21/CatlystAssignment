import React, { useState, useCallback, memo, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal,
    Switch, ScrollView,
    Platform, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { types } from 'react-native-mime-types';
import AppDropdown from '../../components/AppDropdown';
import createApiClient from '../common/hooks/apiClient';
const { width, height } = Dimensions.get('screen')
/* ================= CONFIG ================= */
const MOCK_DATA = {
    BUSINESS_DATE: [],
    PORTFOLIO: [],
    PRODUCT: [],
    SUB_PRODUCT: [],
};
const SCHEME_STEPS = [
    { key: 'SCHEME_DETAILS', label: 'Scheme Details' },
    { key: 'LOAN_DETAILS', label: 'Loan Details' },
    { key: 'INTEREST', label: 'Interest' },
    { key: 'AMORTIZATION', label: 'Amortization' },
    { key: 'BILLING_CYCLE', label: 'Billing Cycle' },
    { key: 'FEES', label: 'Fees' },
];


/* ================= ROW ================= */
const ConfigRow = memo(({ item, onEdit, meta }) => (
    <View style={styles.row}>
        <View>
            <Text style={styles.rowText}>{item.name}</Text>
            <Text style={styles.subText}>{item.code}</Text>
            {meta && <Text style={styles.meta}>{meta}</Text>}
        </View>

        <View style={styles.rowRight}>
            <Text style={[styles.status, item.active && styles.active]}>
                {item.active ? 'Active' : 'Inactive'}
            </Text>

            <TouchableOpacity onPress={() => onEdit(item)}>
                <Icon name="create-outline" size={18} color="#2563EB" />
            </TouchableOpacity>
        </View>
    </View>
));



/* ================= SCREEN ================= */
export default function ConfigListScreen({ route }) {
    const { configKey, title } = route.params;
    const api = createApiClient('gold');
    const [activeSchemeStep, setActiveSchemeStep] = useState('SCHEME_DETAILS');

    const isBusinessDate = configKey === 'BUSINESS_DATE';
    const isportfolio = configKey === 'PORTFOLIO'
    const isProduct = configKey === 'PRODUCT';
    const isSubProduct = configKey === 'SUB_PRODUCT';
    const isScheme = configKey === 'SCHEME';
    const isgoldrate = configKey === 'GOLD_RATE'

    const [list, setList] = useState(MOCK_DATA[configKey]);
    const [modalVisible, setModalVisible] = useState(false);
    console.log(list, 'listlistlist')
    /* ---------- Business Date ---------- */
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [getSchemeById, setgetSchemeById] = useState([])
    const [getSchemeLoanInterestAmortizationBySchemeId, setgetSchemeLoanInterestAmortizationBySchemeId] = useState([]);

    console.log(getSchemeLoanInterestAmortizationBySchemeId, 'getSchemeLoanInterestAmortizationBySchemeId')
    const [selectedRecoverymethod, setselectedRecoverymethod] = useState(null)
    /* ---------- Form ---------- */
    const [editingItem, setEditingItem] = useState(null);
    console.log(editingItem, 'editingItemeditingItem')
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [active, setActive] = useState(true);

    const [portfolio, setPortfolio] = useState('');
    const [portfoliodesc, setPortfoliodesc] = useState('');
    const [productType, setProductType] = useState('');
    const [branch, setBranch] = useState('');
    const [branchid, setBranchid] = useState('');
    const [product, setProduct] = useState('');

    const [portfolioId, setPortfolioId] = useState(null);
    const [productTypeId, setProductTypeId] = useState(null);
    const [branchIds, setBranchIds] = useState(null);
    const [selectedproduct, setselectedproduct] = useState(null)

    const [portfolioOptions, setPortfolioOptions] = useState([]);
    const [productTypeOptions, setProductTypeOptions] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const [productdrp, setproductdrp] = useState([])
    console.log(productTypeOptions, 'productTypeOptionsproductTypeOptions')

    //Scheme Details
    const [schemeProductId, setSchemeProductId] = useState(null)
    const [subProductDrp, setsubProductDrp] = useState([])
    const [schemeSubProductId, setSchemeSubProductId] = useState(null)

    const [typeofcredit, settypeofcredit] = useState([])
    const [selectedtypeofcredit, setselectedtypeofcredit] = useState(null)
    const [validFromDate, setValidFromDate] = useState(null);
    const [validTillDate, setValidTillDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showTillPicker, setShowTillPicker] = useState(false);
    const [creditType, setCreditType] = useState(null);

    console.log(typeofcredit, 'typeofcredit')
    const formatDate = (date) =>
        date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString('en-GB')
            : '';


    const parseApiDate = (dateStr) => {
        if (!dateStr) return null;

        // Ensure Android-safe ISO parsing
        return new Date(`${dateStr}T00:00:00`);
    };


    ///Loan Details 
    // ===== Loan Details State =====
    const [minLoanAmount, setMinLoanAmount] = useState('');
    const [maxLoanAmount, setMaxLoanAmount] = useState('');
    const [minTenor, setMinTenor] = useState('');
    const [maxTenor, setMaxTenor] = useState('');
    const [bsicTenor, setbsicTenor] = useState([])
    const [tenorPeriodBasis, setTenorPeriodBasis] = useState(null);

    const [getLookupMasterByLookupTypeRecoveryMethod, setgetLookupMasterByLookupTypeRecoveryMethod] = useState([])
    const [recoveryMethod, setRecoveryMethod] = useState(null);

    const [TypeStartInsallment, setTypeStartInsallment] = useState([])
    const [startInstallmentAfter, setStartInstallmentAfter] = useState(null);

    const [disbursementCancellation, setDisbursementCancellation] = useState('');
    const [maxDisbursementCount, setMaxDisbursementCount] = useState('');

    const [splitDisbursement, setSplitDisbursement] = useState(false);
    const [insuranceProduct, setInsuranceProduct] = useState(false);

    // INTEREST
    // ===== Interest Details State =====
    const [pricingTypedrp, setpricingtypedrp] = useState([])
    const [pricingType, setPricingType] = useState(null);

    const [pricingBasisdrp, setpricingBasisdrp] = useState([])
    const [pricingBasis, setPricingBasis] = useState(null);

    const [interestRateTypedrp, setInterestRateTypedrp] = useState([]);
    const [interestRateType, setInterestRateType] = useState(null);

    const [BasicTieropt, setBasicTieropt] = useState([])
    const [basisForTier, setBasisForTier] = useState(null);

    const [interestRateBasis, setInterestRateBasis] = useState(false);

    // Fixed Interest
    const [defaultInterestRate, setDefaultInterestRate] = useState('');
    const [maxFixMonths, setMaxFixMonths] = useState('');
    const [minInterestRate, setMinInterestRate] = useState('');
    const [maxInterestRate, setMaxInterestRate] = useState('');


    const parseBusinessDate = (dateStr) => {
        if (!dateStr) return new Date(); // fallback

        // If already Date
        if (dateStr instanceof Date) return dateStr;

        // Force ISO format for Android
        return new Date(`${dateStr}T00:00:00`);
    };


    //Amortization
    // ===== Amortization State =====
    const [minInstallmentAmount, setMinInstallmentAmount] = useState('');
    const [maxInstallmentAmount, setMaxInstallmentAmount] = useState('');

    const [RepaymentFrequencydrp, setRepaymentFrequencydrp] = useState([])
    const [repaymentFrequency, setRepaymentFrequency] = useState(null);

    const [InterestCalmethodedrp, setInterestCalmethodedrp] = useState([])
    const [interestCalculationMethod, setInterestCalculationMethod] = useState(null);

    const [bulletPaymentPermitted, setBulletPaymentPermitted] = useState(false);

    const getValueByLabel = (options, label) => {
        if (!label || !Array.isArray(options)) return null;

        return (
            options.find(
                o =>
                    o.label?.toString().trim().toLowerCase() ===
                    label?.toString().trim().toLowerCase()
            )?.value ?? null
        );
    };
    const prefillSchemeDates = (data) => {
        setValidFromDate(parseApiDate(data.validFromDate));
        setValidTillDate(parseApiDate(data.validToDate));
    };

    useEffect(() => {
        if (!getSchemeLoanInterestAmortizationBySchemeId || !typeofcredit.length) return;

        const mapped = getValueByLabel(
            typeofcredit,
            getSchemeLoanInterestAmortizationBySchemeId.typeOfCredit
        );

        setCreditType(prev => (prev === mapped ? prev : mapped));
    }, [getSchemeLoanInterestAmortizationBySchemeId, typeofcredit]);




    useEffect(() => {
        if (!getSchemeLoanInterestAmortizationBySchemeId) return;

        setSchemeProductId(getSchemeLoanInterestAmortizationBySchemeId.productId);
        setSchemeSubProductId(getSchemeLoanInterestAmortizationBySchemeId.subProductId);
        setActive(getSchemeLoanInterestAmortizationBySchemeId.active);
        setMinInstallmentAmount(
            getSchemeLoanInterestAmortizationBySchemeId.minInstallmentAmount?.toString() ?? ''
        );

        setMaxInstallmentAmount(
            getSchemeLoanInterestAmortizationBySchemeId.maxInstallmentAmount?.toString() ?? ''
        );


        setBulletPaymentPermitted(
            !!getSchemeLoanInterestAmortizationBySchemeId.bulletPaymentPermitted
        );
    }, [getSchemeLoanInterestAmortizationBySchemeId]);

    useEffect(() => {
        if (
            !getSchemeLoanInterestAmortizationBySchemeId ||
            !RepaymentFrequencydrp.length ||
            !InterestCalmethodedrp.length
        )
            return;

        const repaymentValue = getValueByLabel(
            RepaymentFrequencydrp,
            getSchemeLoanInterestAmortizationBySchemeId.repaymentFrequency
        );

        const interestCalcValue = getValueByLabel(
            InterestCalmethodedrp,
            getSchemeLoanInterestAmortizationBySchemeId.interestCalculationMethod
        );

        setRepaymentFrequency(repaymentValue);
        setInterestCalculationMethod(interestCalcValue);

        if (
            !getSchemeLoanInterestAmortizationBySchemeId ||
            !bsicTenor.length ||
            !getLookupMasterByLookupTypeRecoveryMethod.length ||
            !TypeStartInsallment.length
        ) {
            return;
        }

        // Text inputs (ALWAYS string)
        setMinLoanAmount(
            getSchemeLoanInterestAmortizationBySchemeId.minLoanAmount?.toString() ?? ''
        );
        setMaxLoanAmount(
            getSchemeLoanInterestAmortizationBySchemeId.maxLoanAmount?.toString() ?? ''
        );
        setMinTenor(
            getSchemeLoanInterestAmortizationBySchemeId.minTenure?.toString() ?? ''
        );
        setMaxTenor(
            getSchemeLoanInterestAmortizationBySchemeId.maxTenure?.toString() ?? ''
        );
        setDisbursementCancellation(
            getSchemeLoanInterestAmortizationBySchemeId.disbursementCancellation?.toString() ?? ''
        );
        setMaxDisbursementCount(
            getSchemeLoanInterestAmortizationBySchemeId.maxNoOfDisbursement?.toString() ?? ''
        );

        // Dropdowns (LABEL → VALUE)
        setTenorPeriodBasis(
            getValueByLabel(
                bsicTenor,
                getSchemeLoanInterestAmortizationBySchemeId.periodBasisForTenure
            )
        );

        setRecoveryMethod(
            getValueByLabel(
                getLookupMasterByLookupTypeRecoveryMethod,
                getSchemeLoanInterestAmortizationBySchemeId.reschedulingBpiRecoveryMethod
            )
        );

        setStartInstallmentAfter(
            getValueByLabel(
                TypeStartInsallment,
                getSchemeLoanInterestAmortizationBySchemeId.startInstallmentAfter
            )
        );

        // Switches
        setSplitDisbursement(
            !!getSchemeLoanInterestAmortizationBySchemeId.splitDisbursementPermitted
        );
        setInsuranceProduct(
            !!getSchemeLoanInterestAmortizationBySchemeId.insuranceProduct
        );

        if (
            !getSchemeLoanInterestAmortizationBySchemeId ||
            !pricingTypedrp.length ||
            !pricingBasisdrp.length ||
            !interestRateTypedrp.length ||
            !BasicTieropt.length
        ) {
            return;
        }

        // Dropdowns (LABEL → VALUE)
        setPricingType(
            getValueByLabel(
                pricingTypedrp,
                getSchemeLoanInterestAmortizationBySchemeId.pricingType
            )
        );

        setPricingBasis(
            getValueByLabel(
                pricingBasisdrp,
                getSchemeLoanInterestAmortizationBySchemeId.pricingBasis
            )
        );

        setInterestRateType(
            getValueByLabel(
                interestRateTypedrp,
                getSchemeLoanInterestAmortizationBySchemeId.interestRateType
            )
        );

        setBasisForTier(
            getValueByLabel(
                BasicTieropt,
                getSchemeLoanInterestAmortizationBySchemeId.basisForTier
            )
        );

        // Switch
        setInterestRateBasis(
            !!getSchemeLoanInterestAmortizationBySchemeId.interestRateBasis
        );

        // Text inputs (ALWAYS string)
        setDefaultInterestRate(
            getSchemeLoanInterestAmortizationBySchemeId.defaultInterestRate?.toString() ?? ''
        );

        setMinInterestRate(
            getSchemeLoanInterestAmortizationBySchemeId.minInterestRate?.toString() ?? ''
        );

        setMaxFixMonths(
            getSchemeLoanInterestAmortizationBySchemeId.maxNoOfFixMonths?.toString() ?? ''
        );

        setMaxInterestRate(
            getSchemeLoanInterestAmortizationBySchemeId.maxInterestRate?.toString() ?? ''
        );
    }, [
        getSchemeLoanInterestAmortizationBySchemeId,
        RepaymentFrequencydrp,
        InterestCalmethodedrp,
    ]);


    const fetchApi = async (url, fallback = []) => {
        try {
            const res = await api.get(url);
            return res?.data?.data ?? fallback;
        } catch (e) {
            console.log(`API Error → ${url}`, e);
            return fallback;
        }
    };
    const fetchLookup = async (lookupType, setter, labelKey = 'lookupName') => {
        const data = await fetchApi(
            `getLookupMasterByLookupType?lookupType=${encodeURIComponent(lookupType)}`
        );

        setter(
            data.map(item => ({
                label: item[labelKey],
                value: item.lookupId,
            }))
        );
    };
    const getBusinessDate = useCallback(async () => {
        const apiDate = (await fetchApi('getBusinessDate'))?.businessDate;
        const parsed = parseBusinessDate(apiDate);
        setDate(!isNaN(parsed?.getTime()) ? parsed : new Date());
    }, []);
    const getAllPortfolios = useCallback(async () => {
        const content = (await fetchApi('getAllPortfolios'))?.content || [];

        setList(
            content.map(p => ({
                id: String(p.portfolioId),
                code: p.portfolioCode,
                name: p.portfolioDescription, // ✅ REQUIRED by UI
                active: p.active,
            }))
        );
    }, []);

    const getAllPortfoliosDRP = async () => {
        const res = await api.get('getAllPortfolios');
        const list = res?.data?.data?.content || [];
        setPortfolioOptions(
            list.map(p => ({
                label: p.portfolioDescription, value: p.portfolioId,

            })));
    };
    const getAllProducts = useCallback(async () => {
        const content = (await fetchApi('getAllProducts'))?.content || [];

        setList(
            content.map(p => ({
                id: String(p.productId),
                code: p.productCode,
                name: p.productName,                 // ✅ UI expects this
                active: p.active,

                // 🔽 EXTRA FIELDS USED ELSEWHERE
                portfolio: p.portfolioId,
                portfolioDescription: p.portfolioDescription,
                branchId: p.branchIds?.[0],
                branchName: p.branchName?.[0],
                productdesc: p.productType,          // used in openEdit
                productTypeId: p.productId,
            }))
        );
    }, []);

    const getAllSubProducts = useCallback(async () => {
        const content = (await fetchApi('getAllSubProducts'))?.content || [];

        setList(
            content.map(item => ({
                id: String(item.subProductId),
                code: item.subProductCode,
                name: item.subProductName,
                active: item.active,
                productTypeId: item.productId,
                productdesc: item.productName,
            }))
        );
    }, []);

    const loadSchemeLookups = async () => {
        await Promise.all([
            fetchLookup('Type of Credit', settypeofcredit, 'lookupCode'),
            fetchLookup('BPI Recovery Method', setgetLookupMasterByLookupTypeRecoveryMethod),
            fetchLookup('Period Basis for Tenor', setbsicTenor),
            fetchLookup('Start Insallment After', setTypeStartInsallment),
            fetchLookup('Basis For Tier', setBasicTieropt),
            fetchLookup('Interest Rate Type', setInterestRateTypedrp),
            fetchLookup('Pricing Type', setpricingtypedrp),
            fetchLookup('Pricing Basis', setpricingBasisdrp),
            fetchLookup('Repayment Frequency', setRepaymentFrequencydrp),
            fetchLookup('Interest Calculation Method', setInterestCalmethodedrp),
        ]);
    };
    const getAllScheme = useCallback(async () => {
        try {
            const content = (await fetchApi('getAllScheme'))?.content || [];

            setList(
                content.map(s => ({
                    id: String(s.schemeId),
                    code: s.schemeCode,
                    name: s.schemeName,
                    active: s.active,
                    productId: s.productId,
                    productName: s.productName,
                    subProductId: s.subProductId,
                    subProductName: s.subProductName,
                }))
            );
        } catch (e) {
            console.log('Error fetching schemes', e);
            setList([]);
        }
    }, []);
    const getAllProductsdrp = useCallback(async () => {
        const content = (await fetchApi('getAllProducts'))?.content || [];
        setproductdrp(
            content.map(p => ({
                label: p.productName,
                value: p.productId,
            }))
        );
    }, []);

    const getAllSubProductsdrp = useCallback(async () => {
        const content = (await fetchApi('getAllSubProducts'))?.content || [];
        setsubProductDrp(
            content.map(p => ({
                label: p.subProductName,
                value: p.subProductId,
            }))
        );
    }, []);

    const getSchemeByIdA = useCallback(async () => {
        if (!editingItem?.id) return;

        try {
            const data = await fetchApi(`getSchemeById/${editingItem.id}`);
            setgetSchemeById(data || {});
        } catch (e) {
            console.log('Error fetching scheme by id', e);
        }
    }, [editingItem?.id]);

    const getSchemeLoanInterestAmortizationBySchemeIdA = useCallback(async () => {
        if (!editingItem?.id) return;

        try {
            const data = await fetchApi(
                `getSchemeLoanInterestAmortizationBySchemeId/${editingItem.id}`
            );

            setgetSchemeLoanInterestAmortizationBySchemeId(data || []);

            if (data) {
                prefillSchemeDates(data);
            }
        } catch (e) {
            console.log('Error fetching scheme amortization', e);
        }
    }, [editingItem?.id]);
    const getProductTypes = useCallback(async () => {
        try {
            const data = await fetchApi(
                'getLookupMasterByLookupType?lookupType=Product%20Type'
            );

            setProductTypeOptions(
                (data || []).map(item => ({
                    label: item.lookupName,
                    value: item.lookupId,
                }))
            );
        } catch (e) {
            console.log('Error fetching product types', e);
            setProductTypeOptions([]);
        }
    }, []);
    const getAllBranches = useCallback(async () => {
        try {
            const content = (await fetchApi('getAllBranch'))?.content || [];

            setBranchOptions(
                content.map(branch => ({
                    label: branch.branchName,
                    value: branch.branchId,
                }))
            );
        } catch (e) {
            console.log('Error fetching branches', e);
            setBranchOptions([]);
        }
    }, []);


    useEffect(() => {
        if (isBusinessDate) getBusinessDate();
    }, [isBusinessDate]);

    useEffect(() => {
        if (isProduct) {
            getAllProducts();
            getAllPortfolios();
            getProductTypes();
            getAllBranches();
        }
    }, [
        isProduct,
        getAllProducts,
        getAllPortfolios,
        getProductTypes,
        getAllBranches,
    ]);
    useEffect(() => {
        if (isportfolio) {
            getAllPortfolios();
        }

    }, [isportfolio])



    useEffect(() => {
        if (isScheme) {
            loadSchemeLookups();
            getAllScheme();

            if (editingItem?.id) {
                getSchemeByIdA();
                getSchemeLoanInterestAmortizationBySchemeIdA();
            }
        }
    }, [isScheme, editingItem?.id]);
    useEffect(() => {
        if (editingItem) {
            console.log('Calling Bro 1MIn')
            getAllSubProductsdrp();
            getAllProductsdrp();
        }
    }, [editingItem])


    /* ================= CREATE / EDIT ================= */
    const openCreate = () => {
        setEditingItem(null);
        setCode('');
        setName('');
        setActive(true);
        setPortfolio('');
        setProductType('');
        setBranch('');
        setProduct('');
        setPortfolioId(null)
        setProductTypeId(null)
        setBranchIds(null)
        setModalVisible(true);
    };
    const normalizedProductTypeOptions = useMemo(() => {
        return productTypeOptions.map(item => ({
            label: item.label,
            value: Number(item.value), // 🔥 CRITICAL FIX
        }));
    }, [productTypeOptions]);

    const openEdit = item => {
        console.log('EDIT ITEM:', item);

        setEditingItem(item);

        // 🔹 Common
        setCode(item.code);
        setName(item.name);
        setActive(item.active);

        /* ================= PRODUCT ================= */
        if (isProduct) {
            setPortfolioId(item.portfolio);
            const matchedProductType = productTypeOptions.find(
                opt =>
                    opt.label?.trim().toLowerCase() ===
                    item.productdesc?.trim().toLowerCase()
            );

            setProductTypeId(item?.productdesc ?? null);
            setProductType(item?.productdesc)
            setPortfolio(item?.portfolioDescription)
            setBranchIds(item.branchId);
            setActive(item.active);
        }


        /* ================= SUB PRODUCT ================= */
        if (isSubProduct) {
            setProduct(item.productTypeId);
            setselectedproduct(item?.productTypeId)
        }
        setActiveSchemeStep('SCHEME_DETAILS'); // 🔥 reset
        setModalVisible(true);
    };




    /* ================= SAVE ================= */
    const saveItem = async () => {
        if (!code.trim() || !name.trim()) return;

        try {
            /* ================= PORTFOLIO ================= */
            if (configKey === 'PORTFOLIO') {
                const payload = {
                    portfolioCode: code,
                    portfolioDescription: name,
                    portfolioCurrency: 'INR',
                    active,
                };

                if (editingItem) {
                    await api.post('createPortfolio', {
                        portfolioId: Number(editingItem.id),
                        ...payload,
                    });
                } else {
                    await api.post('createPortfolio', payload);
                }

                await getAllPortfolios();
                setModalVisible(false);
                setEditingItem(null);
                return;
            }

            /* ================= PRODUCT ================= */
            if (configKey === 'PRODUCT') {
                const payload = {
                    productCode: code,
                    productName: name,
                    productType: productTypeId,
                    loanCurrency: 'INR',
                    active,
                    portfolioId: Number(portfolioId),
                    branchIds: Array.isArray(branchIds)
                        ? branchIds.map(Number)
                        : [],
                };

                if (editingItem) {
                    await api.post('createProduct', {
                        productId: Number(editingItem.id),
                        ...payload,
                    });
                } else {
                    await api.post('createProduct', payload);
                }

                await getAllProducts();
                setModalVisible(false);
                setEditingItem(null);
                return;
            }

            /* ================= SUB PRODUCT ================= */
            if (configKey === 'SUB_PRODUCT') {
                const payload = {
                    subProductCode: code,
                    subProductName: name,
                    active,
                    productId: Number(selectedproduct), // 🔥 REQUIRED
                };

                if (editingItem) {
                    await api.post('createSubProducts', {
                        subProductId: Number(editingItem.subProductId || editingItem.id),
                        ...payload,
                    });
                } else {
                    await api.post('createSubProducts', payload);
                }

                await getAllSubProducts(); // 🔄 refetch
                setModalVisible(false);
                setEditingItem(null);
                return;
            }

        } catch (error) {
            console.log('Save Error:', error);
        }
    };




    /* ================= LIST ================= */
    const metaResolver = useCallback(
        item => {
            if (isProduct) return item.portfolioDescription;
            if (isSubProduct) return `Product: ${item.product}`;
            return null;
        },
        [isProduct, isSubProduct]
    );


    const renderItem = useCallback(
        ({ item }) => (
            <ConfigRow
                item={item}
                onEdit={openEdit}
                meta={metaResolver(item)}
            />
        ),
        [openEdit, metaResolver],
    );

    const formatDateForApi = (date) => {
        if (!(date instanceof Date)) return null;

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    };


    const getLabelByValue = (options, value) => {
        if (!Array.isArray(options) || value == null) return null;

        return options.find(o => o.value === value)?.label ?? null;
    };


    const handleSchemeSubmit = async () => {
        // if (activeSchemeStep !== 'SCHEME_DETAILS') return;

        try {
            if (activeSchemeStep === 'SCHEME_DETAILS') {
                const payload = {
                    schemeId: editingItem ? Number(editingItem.id) : undefined,
                    schemeCode: code,
                    schemeName: name,
                    validFromDate: formatDateForApi(validFromDate),
                    validToDate: formatDateForApi(validTillDate),
                    active,
                    typeOfCredit: getLabelByValue(typeofcredit, creditType), // 🔥 LABEL
                    productId: Number(schemeProductId),
                    subProductId: Number(schemeSubProductId),
                };

                // Optional: remove undefined schemeId for CREATE
                if (!payload.schemeId) delete payload.schemeId;

                await api.post('createScheme', payload);

                await getAllScheme(); // refresh list
                setModalVisible(false);
                setEditingItem(null);
                return;
            }
            if (activeSchemeStep === 'LOAN_DETAILS') {
                const payload = {
                    loanDetailsId: getSchemeLoanInterestAmortizationBySchemeId?.loanDetailsId ? Number(getSchemeLoanInterestAmortizationBySchemeId?.loanDetailsId) : 0,

                    minLoanAmount: String(minLoanAmount),
                    maxLoanAmount: String(maxLoanAmount),

                    minTenure: Number(minTenor),
                    maxTenure: Number(maxTenor),

                    periodBasisForTenure: getLabelByValue(
                        bsicTenor,
                        tenorPeriodBasis
                    ), // e.g. "Months"

                    disbursementCancellation: Number(disbursementCancellation),

                    reschedulingBpiRecoveryMethod: getLabelByValue(
                        getLookupMasterByLookupTypeRecoveryMethod,
                        recoveryMethod
                    ), // "With Next Installment"

                    insuranceProduct: insuranceProduct ? true : false,

                    schemeId: Number(editingItem?.id),

                    maxNoOfDisbursement: Number(maxDisbursementCount),

                    startInstallmentAfter: getLabelByValue(
                        TypeStartInsallment,
                        startInstallmentAfter
                    ), // "First Disbursement"

                    splitDisbursementPermitted: splitDisbursement ? true : false,
                };

                console.log('LOAN DETAILS PAYLOAD', payload);

                await api.post('addLoanDetails', payload);

                // Optional: move to next step
                // setActiveSchemeStep('INTEREST');

                return;
            }
            if (activeSchemeStep === 'INTEREST') {
                const payload = {
                    interestId: getSchemeLoanInterestAmortizationBySchemeId?.interestId ? Number(getSchemeLoanInterestAmortizationBySchemeId.interestId) : 0,

                    pricingType: getLabelByValue(pricingTypedrp, pricingType),
                    pricingBasis: getLabelByValue(pricingBasisdrp, pricingBasis),

                    loanCurrency: 'Rupees (INR)',

                    interestRateType: getLabelByValue(
                        interestRateTypedrp,
                        interestRateType
                    ),

                    basisForTier: getLabelByValue(
                        BasicTieropt,
                        basisForTier
                    ),

                    interestRateBasis: interestRateBasis ? true : false,

                    defaultInterestRate: Number(defaultInterestRate),
                    minInterestRate: Number(minInterestRate),
                    maxNoOfFixMonths: Number(maxFixMonths),
                    maxInterestRate: Number(maxInterestRate),

                    schemeId: Number(editingItem?.id),
                };

                console.log('INTEREST PAYLOAD', payload);

                await api.post('addInterestDetails', payload);

                // optional: move next step
                // setActiveSchemeStep('AMORTIZATION');

                return;
            }
            if (activeSchemeStep === 'AMORTIZATION') {
                const payload = {
                    amortizationId: editingItem?.id || '', // backend accepts empty
                    minInstallmentAmount: String(minInstallmentAmount),
                    maxInstallmentAmount: String(maxInstallmentAmount),
                    repaymentFrequency:
                        getLabelByValue(RepaymentFrequencydrp, repaymentFrequency), // Monthly
                    interestCalculationMethod:
                        getLabelByValue(InterestCalmethodedrp, interestCalculationMethod), // 30/360
                    bulletPaymentPermitted,
                    schemeId: Number(editingItem?.id), // 🔥 REQUIRED
                };

                await api.post('addAmortizationDetails', payload);

                // stay in modal OR move next step (your choice)
                // setActiveSchemeStep('BILLING_CYCLE');

                return;
            }


        } catch (error) {
            console.log('Create Scheme Error:', error);
        }
    };


    /* ================= RENDER ================= */
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{title}</Text>

                    {!isBusinessDate && (
                        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
                            <Icon name="add" size={18} color="#fff" />
                            <Text style={styles.addText}>CREATE</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* BUSINESS DATE */}
                {isBusinessDate && (
                    <TouchableOpacity
                        style={styles.dateCard}
                        onPress={() => setShowPicker(true)}
                    >
                        <Icon name="calendar-outline" size={24} color="#2563EB" />
                        <Text style={styles.dateText}>
                            {date.toLocaleDateString('en-GB')}
                        </Text>

                        {showPicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={(_, d) => {
                                    setShowPicker(false);
                                    if (d) setDate(d);
                                }}
                            />
                        )}
                    </TouchableOpacity>
                )}

                {/* LIST */}
                {!isBusinessDate && (
                    <FlatList
                        data={list}
                        keyExtractor={item => String(item.id)}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        showsVerticalScrollIndicator={false}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews
                        ListEmptyComponent={
                            <Text style={styles.empty}>No records found</Text>
                        }
                    />
                )}

                {/* MODAL */}
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <Text style={styles.modalTitle}>
                                {editingItem ? `Edit ${title}` : `Create ${title}`}
                            </Text>
                            {/* ================= SCHEME MODE ================= */}
                            {isScheme ? (
                                <View style={styles.schemeContainer}>

                                    {/* LEFT STEPS */}
                                    <View style={styles.schemeLeft}>
                                        {SCHEME_STEPS.map(step => (
                                            <TouchableOpacity
                                                key={step.key}
                                                onPress={() => setActiveSchemeStep(step.key)}
                                                style={[
                                                    styles.stepItem,
                                                    activeSchemeStep === step.key && styles.stepActive,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.stepText,
                                                        activeSchemeStep === step.key && styles.stepTextActive,
                                                    ]}
                                                >
                                                    {step.label}
                                                </Text>

                                                <Icon
                                                    name={
                                                        activeSchemeStep === step.key
                                                            ? 'checkmark-circle'
                                                            : 'close-circle'
                                                    }
                                                    size={18}
                                                    color={
                                                        activeSchemeStep === step.key ? '#16A34A' : '#DC2626'
                                                    }
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* RIGHT CONTENT */}
                                    <View style={styles.schemeRight}>
                                        <ScrollView showsVerticalScrollIndicator={false}>

                                            {/* ===== SCHEME DETAILS ===== */}
                                            {activeSchemeStep === 'SCHEME_DETAILS' && (
                                                <>
                                                    <Text style={styles.sectionTitle}>Scheme Details</Text>

                                                    {/* Row 1 */}
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Scheme Code"
                                                            value={code}
                                                            onChangeText={setCode}
                                                            style={styles.inputHalf}
                                                        />
                                                        <TextInput
                                                            placeholder="Scheme Name"
                                                            value={name}
                                                            onChangeText={setName}
                                                            style={styles.inputHalf}
                                                        />
                                                    </View>

                                                    {/* Row 2 */}
                                                    <View style={styles.row2}>
                                                        <AppDropdown
                                                            label="Product"
                                                            data={productdrp}
                                                            value={schemeProductId}
                                                            onChange={setSchemeProductId}
                                                            full
                                                        />
                                                        <AppDropdown
                                                            label="Sub Product"
                                                            data={subProductDrp}
                                                            value={schemeSubProductId}
                                                            onChange={setSchemeSubProductId}
                                                            full
                                                        />
                                                    </View>

                                                    {/* Row 3 */}
                                                    <View style={styles.row2}>
                                                        {/* Valid From Date */}
                                                        <TouchableOpacity
                                                            style={styles.inputHalf}
                                                            onPress={() => setShowFromPicker(true)}
                                                        >
                                                            <Text style={styles.dateText}>
                                                                {validFromDate
                                                                    ? formatDate(validFromDate)
                                                                    : 'Valid From Date *'}
                                                            </Text>
                                                        </TouchableOpacity>

                                                        {/* Valid Till Date */}
                                                        <TouchableOpacity
                                                            style={styles.inputHalf}
                                                            onPress={() => setShowTillPicker(true)}
                                                        >
                                                            <Text style={styles.dateText}>
                                                                {validTillDate
                                                                    ? formatDate(validTillDate)
                                                                    : 'Valid Till Date *'}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    {/* Row 4 */}
                                                    <View style={styles.row2}>
                                                        <AppDropdown
                                                            label="Type of Credit"
                                                            data={typeofcredit}
                                                            value={creditType}
                                                            onChange={setCreditType}
                                                            placeholder="Select Credit Type"
                                                            full
                                                        />
                                                    </View>
                                                    <View style={styles.switchRow}>
                                                        <Text style={{ fontWeight: '700' }}>Active</Text>
                                                        <Switch value={active} onValueChange={setActive} />
                                                    </View>

                                                    {/* Date Pickers */}
                                                    {showFromPicker && (
                                                        <DateTimePicker
                                                            value={validFromDate || new Date()}
                                                            mode="date"
                                                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                                            onChange={(_, date) => {
                                                                setShowFromPicker(false);
                                                                if (date) setValidFromDate(date);
                                                            }}
                                                        />
                                                    )}

                                                    {showTillPicker && (
                                                        <DateTimePicker
                                                            value={validTillDate || new Date()}
                                                            mode="date"
                                                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                                            onChange={(_, date) => {
                                                                setShowTillPicker(false);
                                                                if (date) setValidTillDate(date);
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            )}


                                            {/* ===== LOAN DETAILS ===== */}
                                            {activeSchemeStep === 'LOAN_DETAILS' && (
                                                <>
                                                    <Text style={styles.sectionTitle}>Loan Details</Text>
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Scheme Code"
                                                            value={code}
                                                            onChangeText={setCode}
                                                            style={styles.inputHalf}
                                                        />
                                                        <TextInput
                                                            placeholder="Scheme Name"
                                                            value={name}
                                                            onChangeText={setName}
                                                            style={styles.inputHalf}
                                                        />
                                                    </View>
                                                    {/* Row 1 */}
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Minimum Loan Amount *"
                                                            value={minLoanAmount}
                                                            onChangeText={setMinLoanAmount}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                        <TextInput
                                                            placeholder="Maximum Loan Amount *"
                                                            value={maxLoanAmount}
                                                            onChangeText={setMaxLoanAmount}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                    </View>

                                                    {/* Row 2 */}
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Minimum Tenor *"
                                                            value={minTenor}
                                                            onChangeText={setMinTenor}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                        <TextInput
                                                            placeholder="Maximum Tenor *"
                                                            value={maxTenor}
                                                            onChangeText={setMaxTenor}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                    </View>

                                                    {/* Row 3 */}
                                                    <View style={styles.row2}>
                                                        <AppDropdown
                                                            label="Period Basis for Tenor *"
                                                            data={bsicTenor}
                                                            value={tenorPeriodBasis}
                                                            onChange={setTenorPeriodBasis}
                                                            full
                                                        />
                                                        <AppDropdown
                                                            label="Rescheduling BPI Recovery Method *"
                                                            data={getLookupMasterByLookupTypeRecoveryMethod}
                                                            value={recoveryMethod}
                                                            onChange={setRecoveryMethod}
                                                            full
                                                        />
                                                    </View>

                                                    {/* Row 4 */}
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Disbursement Cancellation *"
                                                            value={disbursementCancellation}
                                                            onChangeText={setDisbursementCancellation}
                                                            style={styles.inputHalf}
                                                        />
                                                        <AppDropdown
                                                            label="Start Installment After *"
                                                            data={TypeStartInsallment}
                                                            value={startInstallmentAfter}
                                                            onChange={setStartInstallmentAfter}
                                                            full
                                                        />
                                                    </View>

                                                    {/* Row 5 */}
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Maximum No of Disbursement *"
                                                            value={maxDisbursementCount}
                                                            onChangeText={setMaxDisbursementCount}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />

                                                        <View style={[styles.switchBox]}>
                                                            <Text style={styles.switchLabel}>Split Disbursement Permitted *</Text>
                                                            <Switch
                                                                value={splitDisbursement}
                                                                onValueChange={setSplitDisbursement}
                                                            />
                                                        </View>
                                                    </View>

                                                    {/* Row 6 */}
                                                    <View style={styles.row2}>
                                                        <View style={[styles.switchBox]}>
                                                            <Text style={styles.switchLabel}>Insurance Product *</Text>
                                                            <Switch
                                                                value={insuranceProduct}
                                                                onValueChange={setInsuranceProduct}
                                                            />
                                                        </View>
                                                    </View>
                                                </>
                                            )}


                                            {/* ===== INTEREST ===== */}
                                            {activeSchemeStep === 'INTEREST' && (
                                                <>
                                                    {/* ===== Interest Details ===== */}
                                                    <Text style={styles.sectionTitle}>Interest Details</Text>
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Scheme Code"
                                                            value={code}
                                                            onChangeText={setCode}
                                                            style={styles.inputHalf}
                                                        />
                                                        <TextInput
                                                            placeholder="Scheme Name"
                                                            value={name}
                                                            onChangeText={setName}
                                                            style={styles.inputHalf}
                                                        />
                                                    </View>
                                                    {/* Row 1 */}
                                                    <View style={styles.row2}>
                                                        <AppDropdown
                                                            label="Pricing Type *"
                                                            data={pricingTypedrp}
                                                            value={pricingType}
                                                            onChange={setPricingType}
                                                            full
                                                        />
                                                        <AppDropdown
                                                            label="Pricing Basis *"
                                                            data={pricingBasisdrp}
                                                            value={pricingBasis}
                                                            onChange={setPricingBasis}
                                                            full
                                                        />
                                                    </View>

                                                    {/* Row 2 */}
                                                    <View style={styles.row2}>
                                                        <AppDropdown
                                                            label="Interest Rate Type *"
                                                            data={interestRateTypedrp}
                                                            value={interestRateType}
                                                            onChange={setInterestRateType}
                                                            full
                                                        />
                                                        <AppDropdown
                                                            label="Basis For Tier *"
                                                            data={BasicTieropt}
                                                            value={basisForTier}
                                                            onChange={setBasisForTier}
                                                            full
                                                        />
                                                    </View>

                                                    {/* Row 3 */}
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            value="Rupees (INR)"
                                                            editable={false}
                                                            style={[
                                                                styles.inputHalf,
                                                                { backgroundColor: '#E5E7EB', color: '#0F172A' },
                                                            ]}
                                                        />

                                                        <View style={[styles.inputHalf, styles.switchBox]}>
                                                            <Text style={styles.switchLabel}>Interest Rate Basis *</Text>
                                                            <Switch
                                                                value={interestRateBasis}
                                                                onValueChange={setInterestRateBasis}
                                                            />
                                                        </View>
                                                    </View>

                                                    {/* ===== Fixed Interest Rate Type ===== */}
                                                    <Text style={styles.subSectionTitle}>Fixed Interest Rate Type</Text>

                                                    {/* Row 4 */}
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Default Interest Rate *"
                                                            value={defaultInterestRate}
                                                            onChangeText={setDefaultInterestRate}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                        <TextInput
                                                            placeholder="Max. No. of Fix Months *"
                                                            value={maxFixMonths}
                                                            onChangeText={setMaxFixMonths}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                    </View>

                                                    {/* Row 5 */}
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Minimum Interest Rate *"
                                                            value={minInterestRate}
                                                            onChangeText={setMinInterestRate}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                        <TextInput
                                                            placeholder="Maximum Interest Rate *"
                                                            value={maxInterestRate}
                                                            onChangeText={setMaxInterestRate}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                    </View>
                                                </>
                                            )}


                                            {/* ===== AMORTIZATION ===== */}
                                            {activeSchemeStep === 'AMORTIZATION' && (
                                                <>
                                                    {/* ===== Installment Details ===== */}
                                                    <Text style={styles.sectionTitle}>Installment Details</Text>
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Scheme Code"
                                                            value={code}
                                                            onChangeText={setCode}
                                                            style={styles.inputHalf}
                                                        />
                                                        <TextInput
                                                            placeholder="Scheme Name"
                                                            value={name}
                                                            onChangeText={setName}
                                                            style={styles.inputHalf}
                                                        />
                                                    </View>
                                                    {/* Row 1 */}
                                                    <View style={styles.row2}>
                                                        <TextInput
                                                            placeholder="Minimum Installment Amount *"
                                                            value={minInstallmentAmount}
                                                            onChangeText={setMinInstallmentAmount}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                        <TextInput
                                                            placeholder="Maximum Installment Amount *"
                                                            value={maxInstallmentAmount}
                                                            onChangeText={setMaxInstallmentAmount}
                                                            keyboardType="numeric"
                                                            style={styles.inputHalf}
                                                        />
                                                    </View>

                                                    {/* Row 2 */}
                                                    <View style={styles.row2}>
                                                        <AppDropdown
                                                            label="Repayment Frequency *"
                                                            data={RepaymentFrequencydrp}
                                                            value={repaymentFrequency}
                                                            onChange={setRepaymentFrequency}
                                                            full
                                                        />
                                                        <AppDropdown
                                                            label="Interest Calculation Method *"
                                                            data={InterestCalmethodedrp}
                                                            value={interestCalculationMethod}
                                                            onChange={setInterestCalculationMethod}
                                                            full
                                                        />
                                                    </View>

                                                    {/* ===== Interest Only ===== */}
                                                    <Text style={styles.subSectionTitle}>Interest Only</Text>

                                                    <View style={styles.row2}>
                                                        <View style={[styles.inputHalf, styles.switchBox]}>
                                                            <Text style={styles.switchLabel}>
                                                                Bullet Payment Permitted *
                                                            </Text>
                                                            <Switch
                                                                value={bulletPaymentPermitted}
                                                                onValueChange={setBulletPaymentPermitted}
                                                            />
                                                        </View>
                                                    </View>
                                                </>
                                            )}

                                            {/* ===== BILLING CYCLE ===== */}
                                            {activeSchemeStep === 'BILLING_CYCLE' && (
                                                <>
                                                    <Text style={styles.sectionTitle}>Billing Cycle</Text>
                                                    <TextInput placeholder="Billing Config" style={styles.inputHalf} />
                                                </>
                                            )}

                                            {/* ===== FEES ===== */}
                                            {activeSchemeStep === 'FEES' && (
                                                <>
                                                    <Text style={styles.sectionTitle}>Fees</Text>
                                                    <TextInput placeholder="Processing Fee" style={styles.inputHalf} />
                                                </>
                                            )}
                                        </ScrollView>

                                        {/* FOOTER */}
                                        <View style={styles.footerRow}>
                                            <TouchableOpacity
                                                style={styles.saveBtn}
                                                onPress={handleSchemeSubmit}
                                            >
                                                <Text style={styles.saveText}>SUBMIT</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.cancelBtn}
                                                onPress={() => setModalVisible(false)}
                                            >
                                                <Text style={styles.cancelText}>CLOSE</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.row2}>
                                        <TextInput
                                            placeholder="Code"
                                            value={code}
                                            onChangeText={setCode}
                                            style={styles.inputHalf}
                                        />

                                        <TextInput
                                            placeholder="Name"
                                            value={name}
                                            onChangeText={setName}
                                            style={styles.inputHalf}
                                        />
                                    </View>
                                    {configKey === 'PORTFOLIO' && (
                                        <View style={styles.row2}>
                                            <TextInput
                                                placeholder="Name"
                                                value={'INR'}
                                                // onChangeText={setName}
                                                style={[styles.inputHalf, { color: '#000', backgroundColor: '#888' }]}
                                                editable={false}
                                            />
                                        </View>
                                    )}

                                    {isProduct && (
                                        <>
                                            {/* Row 1 */}
                                            <View style={styles.row2}>
                                                <AppDropdown
                                                    label="Portfolio"
                                                    data={portfolioOptions}
                                                    value={portfolioId}
                                                    onChange={setPortfolioId}
                                                    placeholder="Select Portfolio"
                                                    full
                                                />

                                                <AppDropdown
                                                    label="Product Type"
                                                    data={normalizedProductTypeOptions}
                                                    value={productTypeId}
                                                    onChange={setProductTypeId}
                                                    placeholder="Select Type"
                                                    full
                                                />
                                            </View>

                                            {/* Row 2 */}
                                            <View style={styles.row2}>
                                                <AppDropdown
                                                    label="Branch"
                                                    data={branchOptions}
                                                    value={branchIds}
                                                    onChange={setBranchIds}
                                                    placeholder="Select Branch"
                                                    // multiple
                                                    full
                                                />
                                            </View>
                                        </>
                                    )}


                                    {isSubProduct && (
                                        <View style={styles.row2}>
                                            <AppDropdown
                                                label="Product"
                                                data={productdrp}
                                                value={selectedproduct}
                                                onChange={setselectedproduct}
                                                placeholder="Select Product"
                                                full
                                            />
                                        </View>
                                    )}

                                    <View style={styles.switchRow}>
                                        <Text style={{ fontWeight: '700' }}>Active</Text>
                                        <Switch value={active} onValueChange={setActive} />
                                    </View>

                                    <TouchableOpacity style={styles.saveBtn} onPress={saveItem}>
                                        <Text style={styles.saveText}>
                                            {editingItem ? 'UPDATE' : 'SAVE'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.cancelBtn}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.cancelText}>CLOSE</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '800' },
    addBtn: {
        flexDirection: 'row',
        backgroundColor: '#2563EB',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
    addText: { color: '#fff', fontWeight: '700', marginLeft: 6 },

    row: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 3,
    },
    rowRight: { alignItems: 'flex-end' },
    rowText: { fontWeight: '700' },
    subText: { color: '#64748B', marginTop: 4 },
    meta: { color: '#475569', marginTop: 4 },
    status: { fontWeight: '700', color: '#DC2626', marginBottom: 6 },
    active: { color: '#16A34A' },

    dateCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
    },
    dateText: { marginLeft: 12, fontWeight: '800' },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 20,
    },
    modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },

    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        width: width * 0.35
    },

    switchRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },

    saveBtn: {
        backgroundColor: '#2563EB',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveText: { color: '#fff', fontWeight: '800' },

    cancelBtn: { marginTop: 10, alignItems: 'center' },
    cancelText: { fontWeight: '700', color: '#64748B' },

    empty: { textAlign: 'center', marginTop: 40, color: '#64748B' },
    row2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10, // RN >= 0.71
        marginBottom: 12,
    },

    inputHalf: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        padding: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        maxHeight: '95%',
    },
    modalHeader: {
        backgroundColor: '#1D4ED8',
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    },
    modalBody: {
        flexDirection: 'row',
        minHeight: 400,
    },
    leftPanel: {
        width: 160,
        backgroundColor: '#F1F5F9',
        padding: 10,
    },
    rightPanel: {
        flex: 1,
        padding: 14,
    },
    stepItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stepActive: {
        borderWidth: 1,
        borderColor: '#2563EB',
        backgroundColor: '#EFF6FF',
    },
    stepText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000'
    },
    stepTextActive: {
        color: '#2563EB',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#2563EB',
        marginBottom: 10,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        padding: 10,
    },
    inputFull: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
    },
    submitBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    submitText: {
        color: '#fff',
        fontWeight: '800',
    },
    closeBtn: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    closeText: {
        color: '#fff',
        fontWeight: '800',
    },
    dateText: {
        color: '#0F172A',
        paddingVertical: 12,
    },
    subSectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2563EB',
        marginVertical: 10,
    },
    switchBox: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    switchLabel: {
        fontWeight: '600',
        color: '#0F172A',
    },

});
