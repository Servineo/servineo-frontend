"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const API = process.env.NEXT_PUBLIC_API_BASE_URL; 

export interface Schedule {
  _id: string;
  starting_time: string;
  finishing_time: string;
  schedule_state: string;
}

// Define la interfaz para las props
interface MobileWeekViewProps {
  fixerId: string;
  requesterId: string;
  selectedDate : Date | null;
}

function groupSchedulesByWeek(fixerSchedules: Schedule[]): Schedule[][]{
    const groupedSchedules: Schedule[][] = [[], [], [], [], [], [], []];

    fixerSchedules.forEach(schedule => {
        const scheduleDate = new Date(schedule.starting_time);
        const dayOfWeek = scheduleDate.getDay();
        
        let targetIndex: number;
        
        if (dayOfWeek === 0) {
            targetIndex = 6;
        } else {
            targetIndex = dayOfWeek - 1;
        }
        
        groupedSchedules[targetIndex].push(schedule);
    });

    return groupedSchedules;
}

// Función para obtener las próximas 4 semanas
function getNextFourWeeks(): { startDate: Date; endDate: Date; days: Date[] }[] {
  const weeks = [];
  const today = new Date();
  
  // Si es fin de semana (sábado = 6, domingo = 0), empezar desde la próxima semana
  let startDate = new Date(today);
  if (today.getDay() === 0 || today.getDay() === 6) {
    startDate.setDate(today.getDate() + (7 - today.getDay()));
  }
  
  // Ajustar al lunes de la semana actual o próxima
  startDate.setDate(startDate.getDate() - (startDate.getDay() - 1));
  
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (i * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4); // Lunes a Viernes
    
    const days = [];
    for (let j = 0; j < 5; j++) { // Solo días de semana (lunes a viernes)
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + j);
      days.push(day);
    }
    
    weeks.push({
      startDate: weekStart,
      endDate: weekEnd,
      days: days
    });
  }
  
  return weeks;
}

// Función para formatear fecha
function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });
}

// Función para obtener el nombre del día
function getDayName(date: Date): string {
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
}

export default function MobileWeekView({ fixerId = "fixer_user_001", requesterId = "req_user_001", selectedDate}: MobileWeekViewProps) {
    const month = selectedDate ? selectedDate.getMonth() + 1 : null;
    const [schedulesByDay, setSchedulesByDay] = useState<Schedule[][]>([[], [], [], [], [], [], []]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    async function fetchWeekSchedule(){
        try {
            setLoading(true);
            //TODO reemplazar luego por el endpoint de Gabo
            const response = await fetch(`${API}/bookings/fixer/${fixerId}/schedules/${month}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const fixerSchedules : Schedule[] = await response.json();
            const fixerSchedulesByWeek = groupSchedulesByWeek(fixerSchedules);
            
            console.log("Schedules grouped by week:", fixerSchedulesByWeek);
            setSchedulesByDay(fixerSchedulesByWeek);
            
        } catch(err) {
            console.error("Error al generar los slots para el fixer:", err);
        } finally {
            setLoading(false);
        }
    }

    // Determinar el estado del día basado en la cantidad de horarios
    function getDayStatus(dayIndex: number): { text: string; color: string; available: boolean } {
        const daySchedules = schedulesByDay[dayIndex] || [];
        
        if (daySchedules.length >= 6) {
            return { text: "Ocupado", color: "text-slate-400", available: false };
        } else {
            return { text: "Horarios Disponibles", color: "text-emerald-600", available: true };
        }
    }

    useEffect(() => {
        fetchWeekSchedule();
    }, [month, fixerId]);

    const weeks = getNextFourWeeks();

    if (loading) {
        return (
            <div className="mx-auto max-w-sm p-4 bg-white">
                <div className="flex justify-center items-center h-32">
                    <p className="text-black">Cargando horarios...</p>
                </div>
            </div>
        );
    }

    return(
        <div className="mx-auto max-w-sm p-4 bg-white min-h-screen">
            <h1 className="text-2xl font-semibold mb-3 text-black">
                Calendario de usuario
            </h1>
            <div className="mb-3">
                <label className="block text-sm mb-1 text-black">Fecha</label>
                <input
                type="date"
                onChange={(e) => {
                    const d = e.target.value;
                    //setDate(d);
                    //fetchDay(d);
                }}
                className="w-full rounded-lg border p-2 text-black bg-white"
                />
            </div>

            {/* Renderizado de las semanas */}
            <div className="space-y-6">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                        {/* Título de la semana */}
                        <h3 className="text-lg font-semibold mb-3 text-center text-black">
                            {formatDate(week.startDate)} - {formatDate(week.endDate)}
                        </h3>
                        
                        {/* Días de la semana */}
                        <div className="space-y-2">
                            {week.days.map((day, dayIndex) => {
                                const dayStatus = getDayStatus(dayIndex);
                                return (
                                    <div 
                                        key={dayIndex} 
                                        className="flex justify-between items-center p-2 border-b border-gray-200 bg-white rounded-lg"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium capitalize text-black">
                                                {getDayName(day)}
                                            </span>
                                            <span className="text-sm text-gray-700">
                                                {formatDate(day)}
                                            </span>
                                        </div>
                                        
                                        {dayStatus.available ? (
                                            <button
                                                className={`font-bold ${dayStatus.color} cursor-default`}
                                                disabled
                                            >
                                                {dayStatus.text}
                                            </button>
                                        ) : (
                                            <span className={`font-bold ${dayStatus.color}`}>
                                                {dayStatus.text}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}