"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, FileSpreadsheet, FileText, TrendingDown, TrendingUp } from "lucide-react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { StaffBarChart } from "@/components/ui/staff-bar-chart";
import { StaffSelectionTrendsChart } from "@/components/ui/staff-selection-trends-chart";
import { DissatisfactionPieChart } from "@/components/ui/dissatisfaction-pie-chart";
import { DissatisfactionTrendsChart } from "@/components/ui/dissatisfaction-trends-chart";
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
  accentClass,
  loading,
  error,
}: {
  title: string;
  description: string;
  value: number;
  accentClass: string;
  loading: boolean;
  error: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className={`text-4xl ${accentClass}`}>{loading ? "…" : error ? "0" : value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{error ?? description}</p>
      </CardContent>
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
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle>Monthly overview</CardTitle>
            <CardDescription>Select a reporting month and export the staff selection report.</CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-52">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleExportExcel} disabled={isExportingExcel || isLoading}>
              <FileSpreadsheet className="mr-2 size-4" />
              {isExportingExcel ? "Exporting..." : "Export Excel"}
            </Button>
            <Button onClick={handleExportPDF} disabled={isExportingPDF || isLoading}>
              <FileText className="mr-2 size-4" />
              {isExportingPDF ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title='Monthly "Good" Count'
          description={`Total positive feedback received in ${selectedMonth}.`}
          value={goodCount}
          accentClass="text-emerald-600"
          loading={isGoodLoading}
          error={goodError}
        />
        <SummaryCard
          title='Monthly "Bad" Count'
          description={`Total negative feedback received in ${selectedMonth}.`}
          value={dissatisfactionCount}
          accentClass="text-rose-600"
          loading={isDissatisfactionLoading}
          error={dissatisfactionError}
        />
        <Card>
          <CardHeader>
            <CardDescription>Current month export state</CardDescription>
            <CardTitle className="text-2xl">{selectedMonth}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Export the current month as Excel or PDF after reviewing the dashboard data.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Quick actions</CardDescription>
            <CardTitle className="text-2xl">Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Download className="size-4" /> PDF and Excel exports ready</div>
            <div className="flex items-center gap-2"><TrendingUp className="size-4" /> Monitor monthly staff trends</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Staff member selections</CardTitle>
            <CardDescription>Selection totals for the currently selected month.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading staff selections…</div>
            ) : error ? (
              <div className="py-12 text-center text-sm text-destructive">{error}</div>
            ) : staffSelections.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No data for this month.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff name</TableHead>
                    <TableHead className="text-right">Times selected</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffSelections.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell className="text-right">{staff.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recurring issues analysis</CardTitle>
            <CardDescription>Compare dissatisfaction reasons against the previous month.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isDissatisfactionLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">Loading issue trends…</div>
            ) : dissatisfactionError ? (
              <div className="py-12 text-center text-sm text-destructive">{dissatisfactionError}</div>
            ) : trendData.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">No data available for this month.</div>
            ) : (
              trendData.map((item) => {
                const positive = item.trend === "increasing";
                const negative = item.trend === "decreasing";
                return (
                  <div key={item.reason} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.reason}</p>
                        <p className="text-sm text-muted-foreground">{item.currentCount} reports this month</p>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${positive ? "text-rose-600" : negative ? "text-emerald-600" : "text-muted-foreground"}`}>
                        {positive ? <TrendingUp className="size-4" /> : negative ? <TrendingDown className="size-4" /> : null}
                        {item.trend === "stable" ? "Stable" : `${item.change > 0 ? "+" : ""}${item.change}`}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Staff comparison</CardTitle>
            <CardDescription>Compare how often staff were selected this month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading chart…</div>
            ) : (
              <StaffBarChart data={staffSelections} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dissatisfaction by reason</CardTitle>
            <CardDescription>Breakdown of negative feedback reasons for the selected month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isDissatisfactionLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading chart…</div>
            ) : dissatisfactionError ? (
              <div className="flex h-full items-center justify-center text-sm text-destructive">{dissatisfactionError}</div>
            ) : (
              <DissatisfactionPieChart data={dissatisfactionPieData} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Selection trends over time</CardTitle>
            <CardDescription>Last several months of staff selection activity.</CardDescription>
          </CardHeader>
          <CardContent className="h-[360px]">
            {isTrendsLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading chart…</div>
            ) : trendsError ? (
              <div className="flex h-full items-center justify-center text-sm text-destructive">{trendsError}</div>
            ) : (
              <StaffSelectionTrendsChart data={selectionTrends} staffNames={staffNames} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dissatisfaction trends</CardTitle>
            <CardDescription>Last 6 months of negative feedback counts.</CardDescription>
          </CardHeader>
          <CardContent className="h-[360px]">
            {isDissatisfactionTrendsLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading chart…</div>
            ) : dissatisfactionTrendsError ? (
              <div className="flex h-full items-center justify-center text-sm text-destructive">{dissatisfactionTrendsError}</div>
            ) : (
              <DissatisfactionTrendsChart data={dissatisfactionTrends} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
