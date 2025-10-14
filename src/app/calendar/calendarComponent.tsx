'use client';

import React, { useRef, useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views, SlotInfo, Event as RBCEvent, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import AppointmentForm, { AppointmentFormHandle } from "../../components/appointments/forms/AppointmentForm"; 

import EditAppointmentForm, { EditAppointmentFormHandle, ExistingAppointment } from "../../components/appointments/forms/EditAppointmentForm";
import { generateAvailableSlotsFromAPI, SlotEvent } from "../../utils/generateSlots";

moment.locale('es');
const localizer = momentLocalizer(moment);

interface MyEvent {
    title: string;
    start: Date;
    end: Date;
    id: string;
    booked: boolean;
    color?: string;
    cancelledByUser?: boolean;
    editable?: boolean;
}

interface PropList {
    fixerId: string,
    requesterId: string
}

export default function MyCalendarPage({
  fixerId,
  requesterId,
} : PropList) {
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const formRef = useRef<AppointmentFormHandle | null>(null); // Cambiar el tipo de ref
    const editFormRef = useRef<EditAppointmentFormHandle | null>(null);

    // 🔹 Cargar slots desde la API cuando cambie el mes
    useEffect(() => {
        loadSlotsFromAPI();
    }, [currentDate.getMonth(), currentDate.getUTCFullYear(), fixerId, requesterId]);

    async function loadSlotsFromAPI() {
        try {
            setLoading(true);
            const currentMonth = currentDate.getMonth();
            console.log(`Cargando slots para fixer ${fixerId}, mes ${currentMonth}`);

            const slots: SlotEvent[] = await generateAvailableSlotsFromAPI(fixerId, requesterId, currentDate);

            // Convertir SlotEvent a MyEvent
            const myEvents: MyEvent[] = slots.map(slot => ({
                title: slot.title,
                start: slot.start,
                end: slot.end,
                id: slot.id,
                booked: slot.booked,
                color: slot.color,
                cancelledByUser: slot.cancelledByUser,
                editable: slot.editable
            }));

            setEvents(myEvents);
            console.log(`Se cargaron ${myEvents.length} slots desde la API`);
        } catch (error) {
            console.error("Error al cargar slots desde API:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }

    function handleSelectEvent(ev: MyEvent) {
        if (ev.booked && ev.editable) {
            handleEditExistingAppointment(ev);
        } else if (!ev.booked) {
            formRef.current?.open(ev.start.toISOString(), { eventId: ev.id, title: ev.title });
        }
    }

    function handleSelectSlot(slotInfo: SlotInfo) {
        // No permitir hacer clic en slots en vistas MONTH y WEEK
        if (currentView === Views.MONTH || currentView === Views.WEEK) {
            return;
        }

        // En vista DAY: verificar si la fecha que se está viendo es anterior a la actual
        if (currentView === Views.DAY) {
            const viewedDate = new Date(currentDate);
            viewedDate.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (viewedDate < today) {
                return;
            }




        }

        const start = slotInfo.start;
        const day = start.getDay();
        const hour = start.getHours();

        // Validar día laboral (lunes a viernes)
        if (day < 1 || day > 5) return;

        // Validar horario laboral (8-12 y 14-18)
        if (!((hour >= 8 && hour < 12) || (hour >= 14 && hour < 18))) return;





        const dtISO = start.toISOString();

        // Buscar si ya existe un evento en este slot
        let existing = events.find(e =>
            e.start.getTime() === start.getTime() &&
            !e.booked
        );

        // Si no existe, crear un slot disponible temporal
        if (!existing) {
            const newEvent: MyEvent = {
                title: "Disponible",
                start,
                end: new Date(start.getTime() + 60 * 60 * 1000),
                booked: false,
                id: `temp-${dtISO}`,
                color: "#16A34A"
            };

            setEvents(prev => [...prev, newEvent]);
            existing = newEvent;
        }

        // Abrir formulario para el slot disponible
        if (existing && !existing.booked) {
            formRef.current?.open(dtISO, { eventId: existing.id, title: existing.title });
        }
    }

    function handleEditExistingAppointment(event: MyEvent) {
        if (!event.booked || !event.editable) return;

        const existingAppointment: ExistingAppointment = {
            id: event.id,
            datetime: event.start.toISOString(),
            client: "Cliente Ejemplo",
            contact: "+591 77777777",
            modality: "virtual",
            description: event.title,
            meetingLink: "https://meet.example.com/abc123"
        };

        editFormRef.current?.open(existingAppointment);
    }

    // Manejar cambio de navegación en el calendario
    const handleNavigate = (newDate: Date) => {
        setCurrentDate(newDate);
    };

    useEffect(() => {
        const onCreated = (ev: any) => {
            const { datetime, id, meta } = ev.detail || {};
            if (!datetime) return;

            const normalized = moment(datetime).toDate();
            const normalizedISO = normalized.toISOString();

            setEvents(prev => {
                let found = false;
                const next = prev.map(item => {
                    if (new Date(item.start).toISOString() === normalizedISO) {
                        found = true;
                        return {
                            ...item,
                            booked: true,
                            id: id || item.id,
                            title: meta?.description || "Cita reservada",
                            color: "#F59E0B",
                            editable: true
                        };
                    }
                    return item;
                });
                if (!found) {
                    const newEvent: MyEvent = {
                        title: meta?.description || "Cita reservada",
                        start: normalized,
                        end: new Date(normalized.getTime() + 60 * 60 * 1000),
                        booked: true,
                        id: id || String(Date.now()),
                        color: "#F59E0B",
                        editable: true
                    };
                    return [...next, newEvent];
                }
                return next;
            });

            setTimeout(() => loadSlotsFromAPI(), 1000);
        };

        window.addEventListener("booking:created", onCreated);
        return () => window.removeEventListener("booking:created", onCreated);
    }, []);

    function eventStyleGetter(event: MyEvent) {
        const backgroundColor = event.color || "#10B981";

        return {
            style: {
                backgroundColor,
                color: "#fff",
                borderRadius: 12,
                border: "none",
                padding: "2px 6px",
                opacity: event.cancelledByUser ? 0.6 : 1,
            }
        };
    }

    const dayPropGetter = (date: Date) => {
        const day = date.getDay();
        const isWeekend = day === 0 || day === 6;
        const today = new Date();
        const isToday = date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getUTCFullYear() === today.getUTCFullYear();

        if (currentView === Views.DAY) {
            const viewedDate = new Date(date);
            viewedDate.setHours(0, 0, 0, 0);

            const todayNormalized = new Date();
            todayNormalized.setHours(0, 0, 0, 0);

            if (viewedDate < todayNormalized) {
                return {
                    style: {
                        backgroundColor: '#f8f9fa',
                        color: '#adb5bd',
                        cursor: 'not-allowed'
                    }


                };
            }
        }

        if (isToday && currentView === Views.MONTH) {
            return {
                style: {
                    backgroundColor: '#2B6AE0',
                    color: '#fff'
                }
            };
        }

        if (isWeekend) {
            return {
                style: {
                    backgroundColor: '#f0f0f0',
                    color: '#999',
                    cursor: 'default'
                }
            };
        }

        return {
            style: {
                backgroundColor: '#fff',
                color: '#333'
            }
        };
    };

    const handleViewChange = (view: View) => {
        setCurrentView(view);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4 text-black">Mi Calendario</h1>

            {loading && (
                <div className="text-center py-4">
                    <div className="text-slate-500">Cargando slots desde la API...</div>
                </div>
            )}

            <div style={{ height: '600px', margin: '20px' }}>
                <Calendar
                    className="bg-[#F1F5F8] text-black rounded-2xl"
                    localizer={localizer}
                    events={events as RBCEvent[]}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%', borderRadius: 16 }}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    defaultView={Views.MONTH}
                    selectable
                    onSelectEvent={(event) => handleSelectEvent(event as MyEvent)}
                    onSelectSlot={(slotInfo) => handleSelectSlot(slotInfo)}
                    eventPropGetter={(event) => eventStyleGetter(event as MyEvent)}
                    dayPropGetter={dayPropGetter}
                    min={new Date(0, 0, 0, 8, 0, 0)}
                    max={new Date(0, 0, 0, 18, 0, 0)}
                    popup
                    onView={handleViewChange}
                    onNavigate={handleNavigate}
                />
            </div>
            <AppointmentForm ref={formRef} />
            <EditAppointmentForm ref={editFormRef} />
        </div>
    );
}
