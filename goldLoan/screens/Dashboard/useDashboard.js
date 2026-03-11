import { useEffect, useState, useMemo } from "react";

import { DEFAULT_FILTERS } from "./constants";
import createApiClient from "../../common/hooks/apiClient";

export default function useDashboard() {
    const api = createApiClient('gold');
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [sortBy, setSortBy] = useState("LATEST");
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const mapStageToStatus = stage => {

        if (!stage) return "Pending";

        if (stage === "Disbursed") return "Approved";

        if (
            stage === "Customer Acquisition" ||
            stage === "Valuation" ||
            stage === "LoanDetails" ||
            stage === "Decision"
        ) {
            return "Pending";
        }

        if (stage === "Rejected") return "Rejected";

        return "Pending";

    };
    useEffect(() => {
        fetchLeads();
    }, []);
    // /api/v1/getLogsDetailsByApplicationNumber/{applicationNo}
    const fetchLeads = async () => {
        try {
            setLoading(true);

            const res = await api.get("/getAllApplication");

            const raw = res?.data?.data ?? [];


            const normalized = raw.map(item => {
                console.log(item, 'itemitemitem')
                const applicant =
                    item?.applicant?.find(a => a.applicantTypeCode === "Applicant")
                        ?.consumptionApplicant || {};

                const name = `${applicant.firstName || ""} ${applicant.lastName || ""}`.trim();

                return {
                    id: item.id,
                    name: name || item.applicationNo,
                    amount: item.loanAmount ?? 0,
                    status: mapStageToStatus(item.stage),
                    itemType: item.productName ?? "Gold Loan",
                    itemCategory: item.portfolioDescription ?? "Secured",
                    scheme: item.scheme ?? "Sta ndard",
                    repayment: item.repaymentType ?? "Moncthly",
                    createdTime: item.createdTime
                };

            });
            setLeads(normalized);

        } catch (e) {
            console.error(e);
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = useMemo(() => {

        const f = filters ?? DEFAULT_FILTERS;

        return leads.filter(l => {

            if (f.status !== "ALL" && l.status !== f.status)
                return false;

            if (f.itemType !== "ALL" && l.itemType !== f.itemType)
                return false;

            if (f.itemCategory !== "ALL" && l.itemCategory !== f.itemCategory)
                return false;

            if (f.scheme !== "ALL" && l.scheme !== f.scheme)
                return false;

            if (f.repayment !== "ALL" && l.repayment !== f.repayment)
                return false;

            if (f.minAmount && l.amount < f.minAmount)
                return false;

            if (f.maxAmount && l.amount > f.maxAmount)
                return false;

            if (f.fromDate && l.createdTime < new Date(f.fromDate).getTime())
                return false;

            if (f.toDate && l.createdTime > new Date(f.toDate).getTime())
                return false;

            return true;

        });

    }, [leads, filters]);

    // const kpis = useMemo(() => {
    //     const acc = { total: 0, approved: 0, pending: 0, rejected: 0 };

    //     filteredLeads.forEach(l => {
    //         if (!l) return;

    //         acc.total++;

    //         if (l.status === "Approved") acc.approved++;
    //         if (l.status === "Pending") acc.pending++;
    //         if (l.status === "Rejected") acc.rejected++;
    //     });

    //     return acc;
    // }, [filteredLeads]);
    const kpis = useMemo(() => ({
        total: filteredLeads.length,
        approved: filteredLeads.filter(l => l.status === "Approved").length,
        pending: filteredLeads.filter(l => l.status === "Pending").length,
        rejected: filteredLeads.filter(l => l.status === "Rejected").length
    }), [filteredLeads]);

    const itemTypes = useMemo(() => {

        const unique = [...new Set(leads.map(l => l.itemType))];

        return [
            { label: "All", value: "ALL" },
            ...unique.map(i => ({
                label: i,
                value: i
            }))
        ];

    }, [leads]);

    const schemes = useMemo(() => {

        const unique = [...new Set(leads.map(l => l.scheme))];

        return [
            { label: "All", value: "ALL" },
            ...unique.map(i => ({
                label: i,
                value: i
            }))
        ];

    }, [leads]);

    const repaymentTypes = useMemo(() => {

        const unique = [...new Set(leads.map(l => l.repayment))];

        return [
            { label: "All", value: "ALL" },
            ...unique.map(i => ({
                label: i,
                value: i
            }))
        ];

    }, [leads]);

    const todayMetrics = useMemo(() => {

        const today = new Date().toDateString();

        let todayLeads = 0;
        let todayDisbursed = 0;
        let totalDisbursed = 0;

        leads.forEach(l => {

            const created = l.createdTime
                ? new Date(l.createdTime).toDateString()
                : null;
            console.log(created, 'createdcreated')
            if (created === today) {
                todayLeads++;

                if (l.status === "Disbursed") {
                    todayDisbursed += l.amount;
                }
            }

            if (l.status === "Disbursed") {
                totalDisbursed += l.amount;
            }

        });
        console.log(todayDisbursed, 'todayDisbursedtodayDisbursed')
        return {
            todayLeads,
            todayDisbursed,
            totalDisbursed
        };

    }, [leads]);
    return {
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
    };
}