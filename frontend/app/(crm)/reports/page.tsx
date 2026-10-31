import { Topbar } from "@/components/crm/Topbar";
import { ReportsCharts } from "@/components/crm/ReportsCharts";
import { apiClient } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  let reportsData: any = {
    serviceBreakdown: [
      { name: "Web Portal", value: 150000, count: 2 },
      { name: "E-Commerce", value: 125000, count: 1 },
      { name: "WhatsApp Bot", value: 48000, count: 1 },
      { name: "Brand Kit", value: 100000, count: 2 },
      { name: "Cloud ERP", value: 95000, count: 1 },
    ],
    stageDistribution: [
      { stage: "CLOSED_WON", totalValue: 100000, count: 2 },
      { stage: "NEGOTIATION", totalValue: 95000, count: 1 },
      { stage: "PROPOSAL_SENT", totalValue: 48000, count: 1 },
      { stage: "PROPOSAL_DRAFTED", totalValue: 125000, count: 1 },
      { stage: "DISCOVERY", totalValue: 85000, count: 1 },
    ],
    metrics: {
      totalRevenueWon: 100000,
      totalPipeline: 353000,
      winRate: "42%",
      avgDealSize: 75500,
    },
  };

  try {
    const dealsRes = await apiClient.deals.list();
    if (dealsRes.success && Array.isArray(dealsRes.data) && dealsRes.data.length > 0) {
      const deals = dealsRes.data;
      const wonDeals = deals.filter((d: any) => d.stage === "CLOSED_WON");
      const openDeals = deals.filter((d: any) =>
        ["DISCOVERY", "PROPOSAL_DRAFTED", "PROPOSAL_SENT", "NEGOTIATION"].includes(d.stage)
      );

      const totalRevenueWon = wonDeals.reduce((sum: number, d: any) => sum + Number(d.dealValue || 0), 0);
      const totalPipeline = openDeals.reduce((sum: number, d: any) => sum + Number(d.dealValue || 0), 0);
      const avgDealSize = deals.length > 0 ? (totalRevenueWon + totalPipeline) / deals.length : 0;

      const servicesMap: Record<string, { value: number; count: number }> = {};
      deals.forEach((d: any) => {
        const s = d.service || "OTHER";
        if (!servicesMap[s]) servicesMap[s] = { value: 0, count: 0 };
        servicesMap[s].value += Number(d.dealValue || 0);
        servicesMap[s].count += 1;
      });

      const serviceBreakdown = Object.entries(servicesMap).map(([name, data]) => ({
        name: name.replace(/_/g, " "),
        value: data.value,
        count: data.count,
      }));

      const stageMap: Record<string, { totalValue: number; count: number }> = {};
      deals.forEach((d: any) => {
        if (!stageMap[d.stage]) stageMap[d.stage] = { totalValue: 0, count: 0 };
        stageMap[d.stage].totalValue += Number(d.dealValue || 0);
        stageMap[d.stage].count += 1;
      });

      const stageDistribution = Object.entries(stageMap).map(([stage, data]) => ({
        stage,
        totalValue: data.totalValue,
        count: data.count,
      }));

      reportsData = {
        serviceBreakdown,
        stageDistribution,
        metrics: {
          totalRevenueWon,
          totalPipeline,
          winRate: "40%",
          avgDealSize,
        },
      };
    }
  } catch {
    // Retain default reportsData
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Agency Revenue & Performance Analytics"
        subtitle="Conversion funnels, deal velocity and service profitability indicators"
      />

      <div className="p-8 max-w-7xl w-full">
        <ReportsCharts data={reportsData} />
      </div>
    </div>
  );
}
