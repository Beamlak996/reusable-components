import { Sidebar } from "@/components/reusable/sidebar/sidebar"

export const RootLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex gap-5" >
            <Sidebar />
            <main className="max-w-5xl flex-1 mx-auto py-4 bg-[#f1f1f1] min-h-screen" >
                {children}
            </main>
        </div>
    )
}