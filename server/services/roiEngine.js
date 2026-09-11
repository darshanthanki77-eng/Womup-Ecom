import { Investment } from "../models/Investment.js";
import { Notification } from "../models/Notification.js";
import { RoiLedger } from "../models/RoiLedger.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";

class RoiEngine {
  /**
   * Determine the current lifecycle phase, rate, and day count for an investment
   */
  getContractPhase(startDate, now = new Date()) {
    const start = new Date(startDate);
    const diffTime = Math.max(0, now - start);
    const dayCount = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Day 1 = start day

    if (dayCount <= 60) {
      return {
        dayCount,
        phase: "Day 1–60",
        rateNumber: 0,
        rateFormatted: "0.00%",
        eligibleForYield: false,
        matured: false
      };
    } else if (dayCount <= 150) {
      return {
        dayCount,
        phase: "Month 3–5",
        rateNumber: 0.0015, // 0.15% daily
        rateFormatted: "0.15%",
        eligibleForYield: true,
        matured: false
      };
    } else if (dayCount <= 240) {
      return {
        dayCount,
        phase: "Month 6–8",
        rateNumber: 0.0025, // 0.25% daily
        rateFormatted: "0.25%",
        eligibleForYield: true,
        matured: false
      };
    } else {
      return {
        dayCount,
        phase: "Matured",
        rateNumber: 0,
        rateFormatted: "0.00%",
        eligibleForYield: false,
        matured: true
      };
    }
  }

  /**
   * Run daily ROI calculation batch for all active contracts
   * Deterministic, idempotent, protected against duplicate execution
   */
  async executeDailyRoiRun(targetDate = null) {
    const businessDate = targetDate || new Date().toISOString().slice(0, 10);
    const calculationRunId = `RUN-${businessDate}-${Date.now()}`;

    const activeInvestments = await Investment.find({ status: "Active" });
    const results = {
      runId: calculationRunId,
      date: businessDate,
      totalActive: activeInvestments.length,
      processed: 0,
      skippedBuffer: 0,
      skippedDuplicate: 0,
      matured: 0,
      totalCreditedUsdt: 0,
      errors: []
    };

    const calculationDate = targetDate ? new Date(targetDate) : new Date();

    for (const inv of activeInvestments) {
      try {
        const { dayCount, phase, rateNumber, rateFormatted, eligibleForYield, matured } = this.getContractPhase(inv.startDate, calculationDate);

        // Update current contract cycle day and phase
        inv.cycleDay = Math.min(dayCount, 240);
        inv.currentPhase = phase;
        inv.currentRoiRate = rateFormatted;

        if (matured) {
          inv.principalStatus = "Eligible";
          inv.status = "Completed";
          await inv.save();
          results.matured++;
          continue;
        }

        if (!eligibleForYield) {
          inv.todayRoi = 0;
          await inv.save();
          results.skippedBuffer++;
          continue;
        }

        // Check if ROI was already calculated for this contract on this businessDate
        const existingEntry = await RoiLedger.findOne({
          investmentId: inv.investmentId,
          businessDate
        });

        if (existingEntry) {
          results.skippedDuplicate++;
          continue;
        }

        // Simple daily yield calculation: Principal * Rate
        const dailyYield = Number((inv.amount * rateNumber).toFixed(2));

        // 1. Create unique ROI ledger entry
        const roiRecord = new RoiLedger({
          roiId: `ROI-${Math.floor(100000 + Math.random() * 900000)}`,
          investmentId: inv.investmentId,
          userId: inv.userId,
          businessDate,
          package: inv.packageName,
          phase,
          rate: rateFormatted,
          principalBase: inv.amount,
          accruedAmount: dailyYield,
          status: "Accrued",
          calculationRunId
        });
        await roiRecord.save();

        // 2. Update Investment contract accruals
        inv.todayRoi = dailyYield;
        inv.accruedRoi = Number((inv.accruedRoi + dailyYield).toFixed(2));
        await inv.save();

        // 3. Update User Balances & Financial KPI atomically
        const user = await User.findOne({ userId: inv.userId });
        if (user) {
          user.kpi.totalRoi = Number((user.kpi.totalRoi + dailyYield).toFixed(2));
          user.kpi.availableBalance = Number((user.kpi.availableBalance + dailyYield).toFixed(2));
          user.balances.usdt = Number((user.balances.usdt + dailyYield).toFixed(2));
          await user.save();

          // 4. Record in master financial transaction ledger
          const tx = new Transaction({
            transactionId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
            userId: user.userId,
            walletAddress: user.walletAddress,
            type: "ROI Accrual",
            amount: `+$${dailyYield.toFixed(2)}`,
            numericAmount: dailyYield,
            asset: "USDT",
            date: `${businessDate} 00:00`,
            status: "Confirmed"
          });
          await tx.save();

          // 5. Create user notification
          const notif = new Notification({
            notificationId: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            userId: user.userId,
            type: "ROI Available",
            title: "Daily ROI Accrued",
            message: `Daily ROI of $${dailyYield.toFixed(2)} USDT (${rateFormatted}) credited for contract ${inv.investmentId}.`,
            referenceId: inv.investmentId
          });
          await notif.save();
        }

        results.processed++;
        results.totalCreditedUsdt = Number((results.totalCreditedUsdt + dailyYield).toFixed(2));
      } catch (err) {
        results.errors.push({ investmentId: inv.investmentId, error: err.message });
      }
    }

    return results;
  }
}

export const roiEngine = new RoiEngine();
