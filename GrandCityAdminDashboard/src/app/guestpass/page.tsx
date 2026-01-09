'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function GuestPassPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden lg:pl-72">
                <header className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        ☰
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">GuestPass</div>
                </header>

                <main className="flex-1 overflow-hidden">
                    <iframe
                        src="/_proxy/guestpass/"
                        className="w-full h-full border-0"
                        title="GuestPass Application"
                    />
                </main>
            </div>
        </div>
    );
}
