import { Notification } from "../models/Notification.js";
import { Referral } from "../models/Referral.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";

class ReferralEngine {
  /**
   * Determine commission percent based on investment package and amount
   */
  getCommissionRate(packageName, amount) {
    if (amount >= 3000 || packageName.toLowerCase().includes("black")) {
      return { percent: 5.0, rateNumber: 0.05, rateFormatted: "5.0%" };
    } else if (amount >= 1000 || packageName.toLowerCase().includes("gold")) {
      return { percent: 3.0, rateNumber: 0.03, rateFormatted: "3.0%" };
    } else {
      return { percent: 1.5, rateNumber: 0.015, rateFormatted: "1.5%" };
    }
  }

  /**
   * Process and award referral commission when a downline investment is confirmed
   */
  async processReferralCommission(investorUser, investment) {
    if (!investorUser.referredBy) {
      return null; // No sponsor
    }

    // Find sponsor by referralCode
    const sponsor = await User.findOne({
      referralCode: investorUser.referredBy.toUpperCase()
    });

    if (!sponsor) {
      return null;
    }

    // Check if commission already awarded for this specific investment
    const existingRef = await Referral.findOne({
      referrerId: sponsor.referralCode,
      referredId: investorUser.referralCode,
      investmentId: investment.investmentId
    });

    if (existingRef) {
      return existingRef; // Prevent duplicate commission
    }

    const { rateNumber, rateFormatted } = this.getCommissionRate(
      investment.packageName,
      investment.amount
    );

    const commissionAmount = Number((investment.amount * rateNumber).toFixed(2));

    // 1. Create Referral Record
    const referralRecord = new Referral({
      referralId: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      referrerId: sponsor.referralCode,
      referredId: investorUser.referralCode,
      referredWallet: investorUser.shortAddress || investorUser.walletAddress,
      referredUser: investorUser.name,
      investmentId: investment.investmentId,
      packageId: investment.packageId,
      packageName: investment.packageName,
      investmentAmount: investment.amount,
      rate: rateFormatted,
      commission: commissionAmount,
      status: "Paid",
      date: new Date().toISOString().slice(0, 10)
    });
    await referralRecord.save();

    // 2. Credit Sponsor Balances atomically
    sponsor.kpi.referralEarnings = Number((sponsor.kpi.referralEarnings + commissionAmount).toFixed(2));
    sponsor.kpi.availableBalance = Number((sponsor.kpi.availableBalance + commissionAmount).toFixed(2));
    sponsor.balances.usdt = Number((sponsor.balances.usdt + commissionAmount).toFixed(2));
    await sponsor.save();

    // 3. Create Master Transaction Record for Sponsor
    const tx = new Transaction({
      transactionId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: sponsor.userId,
      walletAddress: sponsor.walletAddress,
      type: "Referral Commission",
      amount: `+$${commissionAmount.toFixed(2)}`,
      numericAmount: commissionAmount,
      asset: "USDT",
      txHash: investment.txHash,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "Confirmed"
    });
    await tx.save();

    // 4. Send Sponsor Notification
    const notif = new Notification({
      notificationId: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: sponsor.userId,
      type: "Referral Commission",
      title: "New Referral Commission Paid",
      message: `You earned +$${commissionAmount.toFixed(2)} USDT (${rateFormatted}) from referee ${investorUser.name} (${investment.packageName}).`,
      referenceId: investment.investmentId
    });
    await notif.save();

    return referralRecord;
  }
}

export const referralEngine = new ReferralEngine();
