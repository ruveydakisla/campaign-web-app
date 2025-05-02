import { ReactElement } from "react";


export default function Layout({ children }: { children: ReactElement }) {
    return (
        <div >
            <main className="">{children}</main>
        </div>
    )
}