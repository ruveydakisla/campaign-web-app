"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import axios from "axios"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { Calendar } from "../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"


type FormValues = {
    campaignTitle: string
    brandName: string
    startDate: Date | null
    endDate: Date | null
    budget: number
    campaignDescription: string
}

export function CampaignForm() {
    const [successMessage, setSuccessMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState<FormValues>({
        campaignTitle: "",
        brandName: "",
        startDate: null,
        endDate: null,
        budget: 0,
        campaignDescription: "",
    })

    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "budget" ? parseFloat(value) || 0 : value,
        }))
    }

    const handleDateChange = (name: keyof Pick<FormValues, "startDate" | "endDate">, date: Date | null) => {
        setFormData((prev) => ({ ...prev, [name]: date }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0])
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation: Check required fields
        if (
            !formData.campaignTitle.trim() ||
            !formData.brandName.trim() ||
            !formData.startDate ||
            !formData.endDate ||
            formData.budget <= 0 ||
            !formData.campaignDescription.trim() ||
            !imageFile
        ) {
            toast({
                title: "Please fill in all fields.",
                variant: "destructive",
            })
            return
        }

        let imageUrl = ""

        try {
            const fileName = `${Date.now()}-${imageFile.name}`

            const { data, error } = await supabase.storage
                .from("campaigns")
                .upload(fileName, imageFile)

            if (error) {
                console.error("Upload error:", error.message)
                toast({
                    title: "Görsel yüklenemedi.",
                    variant: "destructive",
                })
                return
            }

            const { data: publicUrlData } = supabase
                .storage
                .from("campaigns")
                .getPublicUrl(fileName)

            imageUrl = publicUrlData.publicUrl
        } catch (error) {
            console.error("Upload error:", error)
            return
        }

        const payload = {
            ...formData,
            imageUrl,
        }

        try {
            const res = await axios.post("/api/campaigns", payload)
            setFormData({
                campaignTitle: "",
                brandName: "",
                startDate: null,
                endDate: null,
                budget: 0,
                campaignDescription: "",
            })
            setImageFile(null)
            toast({
                title: "Başarıyla eklendi!",
                variant: "default",
            })
        } catch (err) {
            console.error("Submit error:", err)
            toast({
                title: "Kampanya eklenirken hata oluştu.",
                variant: "destructive",
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Campaign Title</label>
                <Input
                    name="campaignTitle"
                    value={formData.campaignTitle}
                    onChange={handleChange}
                    placeholder="Title"
                />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Brand Name</label>
                <Input
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    placeholder="Brand name"
                />
            </div>

            <div className="flex flex-col">
                <label className="block mb-1 text-sm font-medium">Campaign Start Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !formData.startDate && "text-muted-foreground"
                            )}
                        >
                            {formData.startDate
                                ? format(formData.startDate, "PPP")
                                : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={formData.startDate || undefined}
                            onSelect={(date) => handleDateChange("startDate", date ?? new Date())}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col">
                <label className="block mb-1 text-sm font-medium">Campaign End Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !formData.endDate && "text-muted-foreground"
                            )}
                        >
                            {formData.endDate
                                ? format(formData.endDate, "PPP")
                                : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={formData.endDate || undefined}
                            onSelect={(date) => handleDateChange("endDate", date ?? new Date())}
                            disabled={(date) =>
                                !!formData.startDate && date < formData.startDate
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Budget</label>
                <Input
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Budget"
                />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Campaign Image</label>
                <Input type="file" onChange={handleFileChange} />
            </div>

            <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">Campaign Description</label>
                <textarea
                    name="campaignDescription"
                    className="w-full border rounded p-2 text-sm"
                    rows={4}
                    value={formData.campaignDescription}
                    onChange={handleChange}
                />
            </div>

            <div className="md:col-span-2">
                <Button type="submit" className="w-full md:w-auto">
                    Submit
                </Button>
            </div>
        </form>

    )
}
