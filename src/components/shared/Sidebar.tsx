'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shapes, Wallet } from 'lucide-react'

const navLinks = [
    {href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard},
    {href: '/accounts', label: 'Accounts', icon: Wallet},
    {href: '/categories', label: 'Categories', icon: Shapes},
]

const Sidebar = () => {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen p-4 border-r bg-gray-100">
            <h1 className="mb-8 text-2xl font-bold">FinTrack</h1>
            <nav>
                <ul>
                    {navLinks.map(link => {
                        const isActive = pathname == link.href
                        const Icon = link.icon

                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center p-3 my-1 transition-colors rounded-lg ${isActive? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                                >
                                    <Icon className="w-5 h-5 mr-3"/>
                                    {link.label}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )

}

export default Sidebar