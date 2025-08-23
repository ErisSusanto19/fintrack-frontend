'use client';

import Sidebar from "@/components/shared/Sidebar";
import { useAppSelector } from "@/store/hooks";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MainLayout = ({children}: {children: React.ReactNode}) => {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth)
    const token = useAppSelector(state => state.auth.token)

    useEffect(() => {
        if(token == null){
            router.replace('/login')
        }
    }, [token, router])

    if(token == null){
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin"/>
            </div>
        )
    }

    return (
        <div className="flex">
            <Sidebar/>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}

export default MainLayout;