import cron from "node-cron";
import { Investment } from "../models/Investment.js";
import { roiEngine } from "../services/roiEngine.js";

export const initCronJobs = () => {
  console.log("[Cron] Initializing automated background workers...");

  // 1. Daily ROI Accrual Worker - Runs every day at 00:00 UTC
  cron.schedule("0 0 * * *", async () => {
    console.log(`[Cron] Executing scheduled daily ROI run at ${new Date().toISOString()}...`);
    try {
      const result = await roiEngine.executeDailyRoiRun();
      console.log(`[Cron] Daily ROI run completed. Credited: $${result.totalCreditedUsdt} USDT across ${result.processed} contracts.`);
    } catch (err) {
      console.error("[Cron] Daily ROI run encountered error:", err.message);
    }
  }, {
    timezone: "UTC"
  });

  // 2. Contract Maturity & Day Counter Worker - Runs every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("[Cron] Running contract maturity checker...");
    try {
      const activeInvestments = await Investment.find({ status: "Active" });
      const now = new Date();

      for (const inv of activeInvestments) {
        const { dayCount, phase, rateFormatted, matured } = roiEngine.getContractPhase(inv.startDate, now);
        inv.cycleDay = Math.min(dayCount, 240);
        inv.currentPhase = phase;
        inv.currentRoiRate = rateFormatted;

        if (matured) {
          inv.principalStatus = "Eligible";
          inv.status = "Completed";
          console.log(`[Cron] Contract ${inv.investmentId} has reached Day 240 maturity. Principal eligible.`);
        }
        await inv.save();
      }
    } catch (err) {
      console.error("[Cron] Maturity checker error:", err.message);
    }
  });

  console.log("[Cron] Scheduled workers active: Daily 00:00 UTC ROI, 6-Hour Maturity Monitor.");
};
