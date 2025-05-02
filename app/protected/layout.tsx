import { Toaster } from "@/components/ui/toaster";
import { ReactElement } from "react";


export default function Layout({ children }: { children: ReactElement }) {
    return (
        <div className=" p-8 border border-white rounded-xl">
            <main className="">{children}</main>
            <Toaster />
        </div>
    )
}