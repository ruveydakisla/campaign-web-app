"use client";
import { CampaignForm } from "@/components/campaign/addForm";

type Campaign = {
    id: number;
    campaignTitle: string;
    brandName: string;
    startDate: string;
    endDate: string;
    budget: number;
    campaignDescription: string;
    imageUrl: string;
};

export default function Page() {
    return (
        <div>
            <h1 className="mb-6 text-xl font-semibold">Add Campaign</h1>
            <CampaignForm />
        </div>
    );
}
