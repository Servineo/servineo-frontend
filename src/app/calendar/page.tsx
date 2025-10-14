
'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import MyCalendarPage from './calendarComponent';
import MobileCalendar from "@/components/calendar/mobile/MobileCalendar";
import MobileList from "@/components/list/MobileList";


export default function CalendarPage() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const today = new Date();
    const events = [
        { title: 'Evento 1', date: new Date(today.getFullYear(), today.getMonth(), 5) },
        { title: 'Evento 2', date: new Date(today.getFullYear(), today.getMonth(), 12) },
        { title: 'Evento 3', date: new Date(today.getFullYear(), today.getMonth(), 12) },
    ];
    return (
        <div className="flex flex-col font-bold bg-white min-h-screen">
            <div className="flex items-center">
                <button
                    onClick={() => router.back()}
                    className="p-2 m-4 text-gray-600 hover:text-black hover:bg-gray-100 transition-colors self-start">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                    </svg>
                </button>
                <h2 className="text-black p-4 text-2xl text-center">Calendario</h2>
            </div>

            <div className="flex justify-center md:block hidden">
                <MyCalendarPage 
                    fixerId={"uuid-fixer-1234"}
                    requesterId={"uuid-user-4567"}
                />
            </div>

            <div className="flex flex-col md:hidden justify-center gap-4" >
                <MobileCalendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    events={events} />
                <div></div>
                <MobileList
                    selectedDate={selectedDate}
                    fixerId={"uuid-fixer-1234"}
                    requesterId={"uuid-user-4567"}

                />
            </div>


        </div>
    );
}
