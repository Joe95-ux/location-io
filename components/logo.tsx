"use client";
import { MapPinned } from 'lucide-react';

type SidebarProps = {
    isSidebarOpen: boolean
}

export default function Logo({isSidebarOpen}: SidebarProps){
    return(
        <div className="flex items-center"> 
            <MapPinned size={22} color="#F26363" className="mr-3"/>
            {isSidebarOpen && <h1 className="text-[20px] font-medium text-white">Location-io</h1>}
            
        </div>
    )
}