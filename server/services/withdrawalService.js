import { Notification } from "../models/Notification.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { Withdrawal } from "../models/Withdrawal.js";
import { blockchainService } from "./blockchainService.js";

class WithdrawalService {
  /**
   * Request a new withdrawal with atomic balance locking
   */
  async createWithdrawalRequest(user, requestedAmount, destinationAddress) {
    const minAmount = 50.0;
    const amount = parseFloat(requestedAmount);

    if (isNaN(amount) || amount < minAmount) {
      throw new Error(`Minimum withdrawal amount is $${minAmount.toFixed(2)} USDT.`);
    }

    if (amount > user.kpi.availableBalance) {
      throw new Error(`Insufficient available balance. You have $${user.kpi.availableBalance.toFixed(2)} USDT available.`);
    }

    const fee = Number((amount * 0.01).toFixed(2)); // 1% fee
    const finalAmount = Number((amount - fee).toFixed(2));
    const dest = destinationAddress || user.walletAddress;

    // Atomic balance lock: deduct from available, add to locked
    user.kpi.availableBalance = Number((user.kpi.availableBalance - amount).toFixed(2));
    user.kpi.lockedBalance = Number(((user.kpi.lockedBalance || 0) + amount).toFixed(2));
    user.balances.usdt = Number((user.balances.usdt - amount).toFixed(2));
    await user.save();

    const record = new Withdrawal({
      withdrawalId: `WTH-${Math.floor(5500 + Math.random() * 500)}`,
      userId: user.userId,
      walletAddress: user.walletAddress,
      amount,
      asset: "USDT",
      fee,
      finalAmount,
      destination: dest,
      txHash: "Pending Blockchain Mining",
      status: "Pending",
      date: new Date().toISOString().slice(0, 10)
    });
    await record.save();

    // Master transaction log
    const tx = new Transaction({
      transactionId: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: user.userId,
      walletAddress: user.walletAddress,
      type: "Withdrawal",
      amount: `-$${amount.toFixed(2)}`,
      numericAmount: -amount,
      asset: "USDT",
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      status: "Pending"
    });
    await tx.save();

    // Notification
    const notif = new Notification({
      notificationId: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.userId,
      type: "Withdrawal Submitted",
      title: "Withdrawal Request Received",
      message: `Withdrawal request for $${amount.toFixed(2)} USDT ($${finalAmount.toFixed(2)} net) submitted successfully.`,
      referenceId: record.withdrawalId
    });
    await notif.save();

    return record;
  }

  /**
   * Admin approves and broadcasts payout on BNB Smart Chain
   */
  async approveWithdrawal(withdrawalId, adminId = "SUPER_ADMIN") {
    const withdrawal = await Withdrawal.findOne({ withdrawalId });
    if (!withdrawal) throw new Error("Withdrawal request not found");
    if (withdrawal.status !== "Pending") throw new Error(`Withdrawal is already ${withdrawal.status}`);

    const user = await User.findOne({ userId: withdrawal.userId });
    if (!user) throw new Error("User associated with withdrawal not found");

    // Execute on-chain payout
    const payoutResult = await blockchainService.processOnChainPayout(
      withdrawal.destination,
      withdrawal.finalAmount
    );

    // Update withdrawal record
    withdrawal.status = "Completed";
    withdrawal.txHash = payoutResult.txHash;
    withdrawal.approvedBy = adminId;
    await withdrawal.save();

    // Release locked balance and update paidRoi
    user.kpi.lockedBalance = Math.max(0, Number(((user.kpi.lockedBalance || 0) - withdrawal.amount).toFixed(2)));
    user.kpi.paidRoi = Number((user.kpi.paidRoi + withdrawal.finalAmount).toFixed(2));
    await user.save();

    // Update pending transaction
    await Transaction.findOneAndUpdate(
      { userId: user.userId, type: "Withdrawal", status: "Pending" },
      { status: "Confirmed", txHash: payoutResult.txHash, blockNumber: payoutResult.blockNumber }
    );

    // Notification
    const notif = new Notification({
      notificationId: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.userId,
      type: "Withdrawal Completed",
      title: "Withdrawal Processed & Confirmed",
      message: `Your withdrawal of $${withdrawal.finalAmount.toFixed(2)} USDT has been confirmed on BSC at block #${payoutResult.blockNumber}.`,
      referenceId: withdrawal.withdrawalId
    });
    await notif.save();

    return withdrawal;
  }

  /**
   * Admin rejects withdrawal and refunds locked balance back to available
   */
  async rejectWithdrawal(withdrawalId, reason, adminId = "SUPER_ADMIN") {
    const withdrawal = await Withdrawal.findOne({ withdrawalId });
    if (!withdrawal) throw new Error("Withdrawal request not found");
    if (withdrawal.status !== "Pending") throw new Error(`Withdrawal is already ${withdrawal.status}`);

    const user = await User.findOne({ userId: withdrawal.userId });
    if (user) {
      // Refund locked balance back to available
      user.kpi.lockedBalance = Math.max(0, Number(((user.kpi.lockedBalance || 0) - withdrawal.amount).toFixed(2)));
      user.kpi.availableBalance = Number((user.kpi.availableBalance + withdrawal.amount).toFixed(2));
      user.balances.usdt = Number((user.balances.usdt + withdrawal.amount).toFixed(2));
      await user.save();
    }

    withdrawal.status = "Rejected";
    withdrawal.rejectionReason = reason || "Administrative compliance check";
    withdrawal.approvedBy = adminId;
    await withdrawal.save();

    // Mark transaction failed
    await Transaction.findOneAndUpdate(
      { userId: withdrawal.userId, type: "Withdrawal", status: "Pending" },
      { status: "Failed" }
    );

    return withdrawal;
  }
}

export const withdrawalService = new WithdrawalService();
