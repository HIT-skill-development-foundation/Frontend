import { donationService as apiDonationService } from './hitApi';

export const donationService = {
    calculate80gTaxBenefit(amount, taxBracketPercentage = 30) {
    const eligible50Percent = Math.round(Number(amount) * 0.5);
    const estimatedTaxSaved = Math.round(eligible50Percent * (taxBracketPercentage / 100));
    return {
      eligible50Percent,
      estimatedTaxSaved,
    };
  },

    async processDonation({ amount, donorInfo }) {
    const res = await apiDonationService.processDonation({
      amount: Number(amount),
      donorInfo,
    });

    if (res && res.success) {
      const { estimatedTaxSaved } = this.calculate80gTaxBenefit(amount);
      return {
        success: true,
        data: {
          ...res.data,
          taxExemptionEligible: res.data?.taxExemptionEligible ?? estimatedTaxSaved,
        },
      };
    }

    return res;
  },

  getDonations: () => apiDonationService.getDonations(),
};

export default donationService;
