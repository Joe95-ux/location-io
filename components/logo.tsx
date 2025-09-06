import { MapPinned } from 'lucide-react';

type SidebarProps = {
    isSidebarOpen: boolean
}

export default function Logo({isSidebarOpen}: SidebarProps){
    return(
        <div className="flex items-center w-full py-5 mb-5 btm-border transition-all duration-300"> 
            <MapPinned size={20} color="#F26363" className="mr-3"/>
            {!isSidebarOpen && <h1 className="text-[20px] font-bold text-white">Location-io</h1>}
            
        </div>
    )
}