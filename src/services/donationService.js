export const donationService = {
  /**
   * Calculate 50% 80G tax exemption savings based on slab
   */
  calculate80gTaxBenefit(amount, taxBracketPercentage = 30) {
    const eligible50Percent = Math.round(Number(amount) * 0.5);
    const estimatedTaxSaved = Math.round(eligible50Percent * (taxBracketPercentage / 100));
    return {
      eligible50Percent,
      estimatedTaxSaved,
    };
  },

  /**
   * Simulates Razorpay / Instant UPI Webhook settlement with delay & cryptographic receipt generation
   */
  async processDonation({ amount, donorInfo }) {
    // Artificial latency for realistic gateway processing & loader display
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const randomTxn = `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}_HITDON`;
    const randomReceipt = `HIT/80G/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    const randomUpiRef = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    const { estimatedTaxSaved } = this.calculate80gTaxBenefit(amount);

    return {
      success: true,
      data: {
        txnId: randomTxn,
        receiptNo: randomReceipt,
        date: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        donorName: donorInfo.name || 'Philanthropic Patron',
        donorPan: donorInfo.pan || 'ABCDE1234F',
        donorEmail: donorInfo.email || 'donor@charity.org',
        donorPhone: donorInfo.phone || '+91 94520-78192',
        donorAddress: donorInfo.address || 'Kasba Khas, Ghosi, Mau, Uttar Pradesh - 275105',
        amount: Number(amount),
        purpose: donorInfo.purpose || 'Rural Youth IT & Computer Infrastructure',
        taxExemptionEligible: estimatedTaxSaved,
        mode: 'UPI Instant Settlement (Razorpay Webhook)',
        bankRef: randomUpiRef,
      },
    };
  },
};

export default donationService;
