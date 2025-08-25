import { setLogout } from "@/store/features/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { persistor } from "@/store/store";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import * as authApi from '@/store/features/auth/auth.api'
import { toast } from "sonner";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

const Header = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {user, refreshToken} = useAppSelector(state => state.auth);

    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

    const handleLogout = async () => {
        if(!refreshToken){
            console.error("No refresh token found to invalidate on server.");
            dispatch(setLogout())
            await persistor.purge()
            router.push('/login')
            return
        }

        try {
            await authApi.logout({ refreshToken })
            toast.success("You have been logged out successfully")
        } catch (error) {
            toast.error("Could not log out from server, logging out locally")
        } finally {
            dispatch(setLogout())
            await persistor.purge()
            router.push('/login')
        }
    }

    return (
        <header className="flex items-center justify-end w-full p-4 bg-white border-b">
            <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'}>
                            <UserCircle className="w-5 h-5 mr-2"/>
                            Hi, {user?.fullName || 'User'}
                            <ChevronDown className="w-4 h-4 ml-1"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <AlertDialogTrigger>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 cursor-pointer">
                                <LogOut className="w-4 h-5 mr-2"/>
                                Logout
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure want to logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be return to login page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="bg-red-500">Logout</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </header>
    )
}

export default Header;