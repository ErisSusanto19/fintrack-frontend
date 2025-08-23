'user client';

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    const AuthComponent = (props: P) => {
        const router = useRouter()
        const { isAuthenticated } = useAppSelector(state => state.auth)

        useEffect(() => {
            if(!isAuthenticated){
                router.replace('/login')
            }
        }, [isAuthenticated, router])

        return isAuthenticated? <WrappedComponent {...props}/> : null
    }

    return AuthComponent;
}

export default withAuth;