export type InsertCampaign = {
    campaignTitle: string;
    brandName: string;
    id?: number;
    startDate?: string | null;
    endDate?: string | null;
    budget?: number | null;
    imageUrl?: string | null;
    campaignDescription?: string | null;
  };
  