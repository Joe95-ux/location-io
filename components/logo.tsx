"use client";
import { MapPinned } from 'lucide-react';

type SidebarProps = {
    isSidebarOpen: boolean
}

export default function Logo({isSidebarOpen}: SidebarProps){
    return(
        <div className="flex items-center"> 
            <MapPinned size={22} color="#F26363" className="mr-3"/>
            {isSidebarOpen && <h1 className={`text-[20px] whitespace-nowrap font-medium text-white transition-transform duration-200 ease-linear ${isSidebarOpen ? "translate-x-0 opacity-100": "-translate-x-full opacity-0"}`}>Location-io</h1>}
            
        </div>
    )
}