"use client";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<number>>(new Set());
  const [editableCampaigns, setEditableCampaigns] = useState<Map<number, boolean>>(new Map());
  const [editedData, setEditedData] = useState<Map<number, Campaign>>(new Map());
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/campaigns");
      setCampaigns(res.data.data); // Veriyi state'e kaydediyoruz
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const deleteByID = async (id: number) => {
    try {
      await axios.delete(`/api/campaigns/${id}`);
      await fetchData();
      toast({ title: 'Deleted successfully' })


    } catch (err) {
      toast({ title: 'Error deleting campaign', variant: 'destructive' })

    } finally {
      setConfirmDeleteId(null);
    }
  };
  const updateByID = async (id: number) => {
    !expandedCampaigns.has(id) && toggleExpand(id);
    setEditableCampaigns((prev) => new Map(prev).set(id, true)); // Enable editing for this campaign
  };

  const saveChanges = async (id: number) => {
    const updatedCampaign = editedData.get(id);
    if (updatedCampaign) {
      await axios.put(`/api/campaigns/${id}`, updatedCampaign);
      setEditableCampaigns((prev) => new Map(prev).set(id, false)); // Disable editing after save
      await fetchData();
    }
  };

  const cancelChanges = (id: number) => {
    setEditableCampaigns((prev) => new Map(prev).set(id, false)); // Disable editing on cancel
    setEditedData((prev) => {
      const newData = new Map(prev);
      newData.delete(id); // Remove the changes for the campaign
      return newData;
    });
  };

  const handleInputChange = (id: number, field: keyof Campaign, value: string | number) => {
    setEditedData((prev) => {
      const newData = new Map(prev);
      const existing = newData.get(id);
      const original = campaigns.find((c) => c.id === id);

      if (!original) return prev; // Orijinal kampanya bulunamazsa değişiklik yapma

      const campaign: Campaign = {
        ...original,
        ...existing,
        [field]: value,
      };

      newData.set(id, campaign);
      return newData;
    });
  };


  const toggleExpand = (id: number) => {
    setExpandedCampaigns((prev) => {
      const newExpandedCampaigns = new Set(prev);
      if (newExpandedCampaigns.has(id)) {
        newExpandedCampaigns.delete(id);
      } else {
        newExpandedCampaigns.add(id);
      }
      return newExpandedCampaigns;
    });
  };

  useEffect(() => {
    fetchData(); // Sayfa yüklendiğinde kampanyaları çek
  }, []);

  return (
    <div className="w-full  px-4 sm:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Campaigns</h2>
        <Link
          href="/protected/add-campaign"
          className="border  text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add
        </Link>
      </div>
      <div className="space-y-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="p-4 border  border-gray-300 rounded-md shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="text-lg ">{campaign.campaignTitle}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {!editableCampaigns.get(campaign.id) ? (
                  <Button
                    onClick={() => updateByID(campaign.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Update
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => saveChanges(campaign.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => cancelChanges(campaign.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Cancel
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => setConfirmDeleteId(campaign.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </Button>
              </div>
            </div>

            <Button
              onClick={() => toggleExpand(campaign.id)}
              className="text-sm text-gray-500 flex items-center"
            >
              {expandedCampaigns.has(campaign.id) ? "▲" : "▼"} Expand
            </Button>

            {expandedCampaigns.has(campaign.id) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <strong>Brand Name:</strong>
                  <input
                    type="text"
                    value={editableCampaigns.get(campaign.id) ? editedData.get(campaign.id)?.brandName : campaign.brandName}
                    onChange={(e) => handleInputChange(campaign.id, "brandName", e.target.value)}
                    disabled={!editableCampaigns.get(campaign.id)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div>
                  <strong>Start Date:</strong>
                  <input
                    type="date"
                    value={editableCampaigns.get(campaign.id) ? editedData.get(campaign.id)?.startDate : campaign.startDate}
                    onChange={(e) => handleInputChange(campaign.id, "startDate", e.target.value)}
                    disabled={!editableCampaigns.get(campaign.id)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div>
                  <strong>End Date:</strong>
                  <input
                    type="date"
                    value={editableCampaigns.get(campaign.id) ? editedData.get(campaign.id)?.endDate : campaign.endDate}
                    onChange={(e) => handleInputChange(campaign.id, "endDate", e.target.value)}
                    disabled={!editableCampaigns.get(campaign.id)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div>
                  <strong>Budget:</strong>
                  <input
                    type="number"
                    value={editableCampaigns.get(campaign.id) ? editedData.get(campaign.id)?.budget : campaign.budget}
                    onChange={(e) => handleInputChange(campaign.id, "budget", e.target.value)}
                    disabled={!editableCampaigns.get(campaign.id)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="sm:col-span-2">
                  <strong>Description:</strong>
                  <textarea
                    value={editableCampaigns.get(campaign.id) ? editedData.get(campaign.id)?.campaignDescription : campaign.campaignDescription}
                    onChange={(e) => handleInputChange(campaign.id, "campaignDescription", e.target.value)}
                    disabled={!editableCampaigns.get(campaign.id)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="sm:col-span-2">
                  {campaign.imageUrl && (
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.campaignTitle}
                      className="w-full sm:w-48 h-auto object-cover rounded-md"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-black rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this campaign?</h3>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteByID(confirmDeleteId)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

}
