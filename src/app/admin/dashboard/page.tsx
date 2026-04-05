"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, FileSpreadsheet, FileText } from "lucide-react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { StaffBarChart } from "@/components/ui/staff-bar-chart";
import { StaffSelectionTrendsChart } from "@/components/ui/staff-selection-trends-chart";
import { DissatisfactionPieChart } from "@/components/ui/dissatisfaction-pie-chart";
import { DissatisfactionTrendsChart } from "@/components/ui/dissatisfaction-trends-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { StaffSelection } from "@/lib/staff-selection";

function getCurrentMonth(): string {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();
  return `${month} ${year}`;
}

function getLast12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    months.push(`${month} ${year}`);
  }
  return months.reverse();
}

const months = getLast12Months();

interface SelectionTrend {
  month: string;
  [staffName: string]: string | number;
}

interface TrendData {
  reason: string;
  currentCount: number;
  previousCount: number;
  trend: "increasing" | "decreasing" | "stable";
  change: number;
}

interface DissatisfactionTrend {
  month: string;
  count: number;
}

function SummaryCard({
  title,
  description,
  value,
  accentClasses,
  loading,
  error,
}: {
  title: string;
  description: string;
  value: number | string;
  accentClasses: string;
  loading: boolean;
  error: string | null;
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="space-y-3 pb-3">
        <CardDescription className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {title}
        </CardDescription>
        <CardTitle className={`text-4xl font-black tracking-tight ${accentClasses}`}>
          {loading ? "…" : error ? "0" : value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">{error ?? description}</p>
      </CardContent>
    </Card>
  );
}

function SectionCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`border-slate-200 shadow-sm ${className}`}>
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900">{title}</CardTitle>
        <CardDescription className="text-sm text-slate-500">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [staffSelections, setStaffSelections] = useState<StaffSelection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectionTrends, setSelectionTrends] = useState<SelectionTrend[]>([]);
  const [staffNames, setStaffNames] = useState<string[]>([]);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);

  const [goodCount, setGoodCount] = useState(0);
  const [isGoodLoading, setIsGoodLoading] = useState(false);
  const [goodError, setGoodError] = useState<string | null>(null);

  const [dissatisfactionCount, setDissatisfactionCount] = useState(0);
  const [dissatisfactionPieData, setDissatisfactionPieData] = useState<{ reason: string; value: number }[]>([]);
  const [isDissatisfactionLoading, setIsDissatisfactionLoading] = useState(false);
  const [dissatisfactionError, setDissatisfactionError] = useState<string | null>(null);

  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [dissatisfactionTrends, setDissatisfactionTrends] = useState<DissatisfactionTrend[]>([]);
  const [isDissatisfactionTrendsLoading, setIsDissatisfactionTrendsLoading] = useState(false);
  const [dissatisfactionTrendsError, setDissatisfactionTrendsError] = useState<string | null>(null);

  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const fetchSelectionTrends = useCallback(async () => {
    setIsTrendsLoading(true);
    setTrendsError(null);
    try {
      const res = await fetch("/api/staff-selection-trends");
      if (!res.ok) throw new Error("Failed to fetch selection trends");
      const { data, staffNames: names } = await res.json();
      setSelectionTrends(data);
      setStaffNames(names);
    } catch {
      setTrendsError("Could not load selection trends");
      setSelectionTrends([]);
      setStaffNames([]);
    } finally {
      setIsTrendsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSelectionTrends();
  }, [fetchSelectionTrends]);

  useEffect(() => {
    async function fetchStaffSelections() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/staff-selections?month=${encodeURIComponent(selectedMonth)}`);
        if (!res.ok) throw new Error("Failed to fetch staff selections");
        const data = await res.json();
        setStaffSelections(data);
      } catch (err) {
        console.error(err);
        setError("Could not load staff selections");
        setStaffSelections([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStaffSelections();
  }, [selectedMonth]);

  useEffect(() => {
    async function fetchGoodData() {
      setIsGoodLoading(true);
      setGoodError(null);
      try {
        const res = await fetch(`/api/good-summary?month=${encodeURIComponent(selectedMonth)}`);
        if (!res.ok) throw new Error("Failed to fetch good count data");
        const { count } = await res.json();
        setGoodCount(count);
      } catch (err) {
        console.error(err);
        setGoodError("Could not load good count data");
        setGoodCount(0);
      } finally {
        setIsGoodLoading(false);
      }
    }
    fetchGoodData();
  }, [selectedMonth]);

  useEffect(() => {
    async function fetchDissatisfactionData() {
      setIsDissatisfactionLoading(true);
      setDissatisfactionError(null);
      try {
        const res = await fetch(`/api/dissatisfaction-comparison?month=${encodeURIComponent(selectedMonth)}`);
        if (!res.ok) throw new Error("Failed to fetch dissatisfaction data");
        const { totalCount, currentMonth, trends } = await res.json();
        setDissatisfactionCount(totalCount);
        setDissatisfactionPieData(currentMonth);
        setTrendData(trends);
      } catch (err) {
        console.error(err);
        setDissatisfactionError("Could not load dissatisfaction data");
        setDissatisfactionCount(0);
        setDissatisfactionPieData([]);
        setTrendData([]);
      } finally {
        setIsDissatisfactionLoading(false);
      }
    }
    fetchDissatisfactionData();
  }, [selectedMonth]);

  useEffect(() => {
    async function fetchDissatisfactionTrends() {
      setIsDissatisfactionTrendsLoading(true);
      setDissatisfactionTrendsError(null);
      try {
        const res = await fetch("/api/dissatisfaction-trends");
        if (!res.ok) throw new Error("Failed to fetch dissatisfaction trends");
        const { data } = await res.json();
        setDissatisfactionTrends(data);
      } catch (err) {
        console.error(err);
        setDissatisfactionTrendsError("Could not load dissatisfaction trends");
        setDissatisfactionTrends([]);
      } finally {
        setIsDissatisfactionTrendsLoading(false);
      }
    }
    fetchDissatisfactionTrends();
  }, []);

  const handleExportExcel = async (): Promise<void> => {
    setIsExportingExcel(true);
    try {
      if (!staffSelections.length) return;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Staff Selections");
      worksheet.columns = [
        { header: "Staff Name", key: "name", width: 28 },
        { header: "Times Selected", key: "count", width: 18 },
      ];
      staffSelections.forEach((staff) => {
        worksheet.addRow({ name: staff.name, count: staff.count });
      });
      worksheet.getRow(1).font = { bold: true };
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `staff-selections-${selectedMonth.replace(/\s/g, "-")}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Excel export failed:", err);
      alert("Failed to export Excel file.");
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPDF = async (): Promise<void> => {
    setIsExportingPDF(true);
    try {
      if (!staffSelections.length) return;
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Staff Selections - ${selectedMonth}`, 14, 18);
      const tableData = staffSelections.map((staff) => [staff.name, staff.count]);
      autoTable(doc, {
        head: [["Staff Name", "Times Selected"]],
        body: tableData,
        startY: 26,
        theme: "grid",
        headStyles: { fillColor: [24, 24, 27] },
        styles: { fontSize: 11 },
      });
      doc.save(`staff-selections-${selectedMonth.replace(/\s/g, "-")}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to export PDF file.");
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit bg-slate-100 text-slate-600">Dashboard Controls</Badge>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">Monthly overview</CardTitle>
              <CardDescription className="mt-1 text-sm text-slate-500">
                Select a reporting month and export the staff selection report.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-52">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-11 border-slate-200 bg-white text-slate-700 shadow-sm">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="h-11 border-slate-200 bg-white text-slate-700 shadow-sm" onClick={handleExportExcel} disabled={isExportingExcel || isLoading}>
              <FileSpreadsheet className="mr-2 size-4" />
              {isExportingExcel ? "Exporting..." : "Export Excel"}
            </Button>
            <Button className="h-11 bg-slate-900 text-white shadow-sm hover:bg-slate-800" onClick={handleExportPDF} disabled={isExportingPDF || isLoading}>
              <FileText className="mr-2 size-4" />
              {isExportingPDF ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        <SummaryCard title="Monthly Good" description={`Positive feedback in ${selectedMonth}.`} value={goodCount} accentClasses="text-emerald-600" loading={isGoodLoading} error={goodError} />
        <SummaryCard title="Monthly Bad" description={`Negative feedback in ${selectedMonth}.`} value={dissatisfactionCount} accentClasses="text-rose-600" loading={isDissatisfactionLoading} error={dissatisfactionError} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Staff member selections" description="Selection totals for the selected month.">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading staff selections…</div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-rose-600">{error}</div>
          ) : staffSelections.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">No data for this month.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">#</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Staff name</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Times selected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffSelections.map((staff, index) => (
                  <TableRow key={staff.id} className="border-slate-100 hover:bg-slate-50/70">
                    <TableCell className="font-medium text-slate-400">{index + 1}</TableCell>
                    <TableCell className="font-medium text-slate-900">{staff.name}</TableCell>
                    <TableCell className="text-right font-semibold text-slate-700">{staff.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </SectionCard>

        <SectionCard title="Recurring issues analysis" description="Compare dissatisfaction reasons against the previous month.">
          <div className="space-y-3">
            {isDissatisfactionLoading ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading issue trends…</div>
            ) : dissatisfactionError ? (
              <div className="py-12 text-center text-sm text-rose-600">{dissatisfactionError}</div>
            ) : trendData.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">No data available for this month.</div>
            ) : (
              trendData.map((item) => {
                const positive = item.trend === "increasing";
                const negative = item.trend === "decreasing";
                return (
                  <div key={item.reason} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{item.reason}</p>
                        <p className="text-sm text-slate-500">{item.currentCount} reports this month</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={positive ? "bg-rose-100 text-rose-700" : negative ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}
                      >
                        {positive ? <ArrowUpRight className="mr-1 size-3.5" /> : negative ? <ArrowDownRight className="mr-1 size-3.5" /> : null}
                        {item.trend === "stable" ? "Stable" : `${item.change > 0 ? "+" : ""}${item.change}`}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Staff comparison" description="Compare how often staff were selected this month.">
          <div className="h-[300px] rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading chart…</div>
            ) : (
              <StaffBarChart data={staffSelections} />
            )}
          </div>
        </SectionCard>

        <SectionCard title="Dissatisfaction by reason" description="Breakdown of negative feedback reasons for the selected month.">
          <div className="h-[300px] rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            {isDissatisfactionLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading chart…</div>
            ) : dissatisfactionError ? (
              <div className="flex h-full items-center justify-center text-sm text-rose-600">{dissatisfactionError}</div>
            ) : (
              <DissatisfactionPieChart data={dissatisfactionPieData} />
            )}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Selection trends over time" description="Last several months of staff selection activity.">
          <div className="h-[360px] rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            {isTrendsLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading chart…</div>
            ) : trendsError ? (
              <div className="flex h-full items-center justify-center text-sm text-rose-600">{trendsError}</div>
            ) : (
              <StaffSelectionTrendsChart data={selectionTrends} staffNames={staffNames} />
            )}
          </div>
        </SectionCard>

        <SectionCard title="Dissatisfaction trends" description="Last 6 months of negative feedback counts.">
          <div className="h-[360px] rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            {isDissatisfactionTrendsLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading chart…</div>
            ) : dissatisfactionTrendsError ? (
              <div className="flex h-full items-center justify-center text-sm text-rose-600">{dissatisfactionTrendsError}</div>
            ) : (
              <DissatisfactionTrendsChart data={dissatisfactionTrends} />
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
