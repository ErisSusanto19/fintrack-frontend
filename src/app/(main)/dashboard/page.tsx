'use client';

import { useAppSelector } from "@/store/hooks";

const DashboardPage = () => {

    const { user } = useAppSelector(state => state.auth);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <h1 className="text-4xl font-bold">Welcome to your Dashboard!</h1>
            {user? (
                    <p className="mt-4 text-xl">Hello, {user.fullName}</p>
                ) : (
                    <p className="mt-4 text-xl">Loading user data...</p>
                )
            }
        </div>
    )

}

export default DashboardPage;