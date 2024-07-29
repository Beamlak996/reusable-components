import { Sidebar } from "@/components/reusable/sidebar/sidebar"

export const RootLayout = ({children}: {children: React.ReactNode}) => {
    return (
      <div className="flex gap-5">
        <Sidebar />
        <main className="flex-1 py-4">{children}</main>
      </div>
    );
}