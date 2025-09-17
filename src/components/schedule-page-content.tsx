
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Check, ChevronsUpDown, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { usePaymentStore } from '@/stores/payment-store';


const appointmentSchema = z.object({
  client: z.string().min(1, { message: "O nome do cliente é obrigatório." }),
  services: z.array(z.string()).min(1, { message: "Selecione pelo menos um serviço." }),
  barber: z.string().min(1, { message: "Selecione um barbeiro." }),
  time: z.string().min(1, { message: "O horário é obrigatório." }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface Appointment {
    time: string;
    client: string;
    service: string;
    barber: string;
    status: 'Confirmado' | 'Finalizado' | 'Cancelado' | 'Aguardando';
    duration: number; // in minutes
}

const initialAppointments: Appointment[] = [
    { time: '09:00', client: 'João Silva', service: 'Corte Degradê', barber: 'Renato Garcia', status: 'Confirmado', duration: 45 },
    { time: '10:00', client: 'Mariana Costa', service: 'Barba Terapia', barber: 'Marcos Andrade', status: 'Confirmado', duration: 40 },
    { time: '10:30', client: 'Pedro Almeida', service: 'Corte Simples', barber: 'Renato Garcia', status: 'Finalizado', duration: 30 },
    { time: '11:00', client: 'Ana Beatriz', service: 'Penteado', barber: 'Júlia Martins', status: 'Confirmado', duration: 50 },
    { time: '12:00', client: 'Lucas Oliveira', service: 'Barba e Cabelo', barber: 'Marcos Andrade', status: 'Aguardando', duration: 75 },
    { time: '14:00', client: 'Fernanda Lima', service: 'Hidratação', barber: 'Júlia Martins', status: 'Confirmado', duration: 60 },
    { time: '15:00', client: 'Ricardo Souza', service: 'Corte Degradê', barber: 'Renato Garcia', status: 'Cancelado', duration: 45 },
];

const barbers = [
    { id: '1', name: 'Renato Garcia' },
    { id: '2', name: 'Marcos Andrade' },
    { id: '3', name: 'Júlia Martins' },
    { id: '4', name: 'Lucas Pereira' },
];

const services = [
    { id: '1', name: 'Corte Degradê', duration: 45, price: 45.00 },
    { id: '2', name: 'Corte Simples', duration: 30, price: 35.00 },
    { id: '3', name: 'Barba Terapia', duration: 40, price: 40.00 },
    { id: '4', name: 'Barba e Cabelo', duration: 75, price: 75.00 },
    { id: '5', name: 'Penteado', duration: 50, price: 50.00 },
    { id: '6', name: 'Hidratação', duration: 60, price: 60.00 },
];

const timeSlots = Array.from({ length: (20 - 8) * 2 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
        case 'Confirmado': return 'bg-blue-500/20 border-blue-500';
        case 'Finalizado': return 'bg-green-500/20 border-green-500';
        case 'Cancelado': return 'bg-red-500/20 border-red-500 line-through';
        case 'Aguardando': return 'bg-yellow-500/20 border-yellow-500';
        default: return 'bg-muted';
    }
}

export function SchedulePageContent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);
  const [selectedSlot, setSelectedSlot] = React.useState<{barber: string, time: string} | null>(null);
  const router = useRouter();
  const { setInitialPayment } = usePaymentStore();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      client: '',
      services: [],
      barber: '',
      time: '',
    },
  });

  const openNewAppointmentDialog = (barber: string, time: string) => {
    setSelectedSlot({ barber, time });
    form.reset({
        barber,
        time,
        client: '',
        services: []
    });
    setIsDialogOpen(true);
  }

  const onSubmit = (data: AppointmentFormValues) => {
    const totalDuration = data.services.reduce((acc, serviceName) => {
        const serviceDetails = services.find(s => s.name === serviceName);
        return acc + (serviceDetails?.duration || 0);
    }, 0);

    const newAppointment: Appointment = {
      client: data.client,
      service: data.services.join(', '),
      barber: data.barber,
      time: data.time,
      status: 'Confirmado',
      duration: totalDuration,
    };
    const sortedAppointments = [...appointments, newAppointment].sort((a, b) =>
        a.time.localeCompare(b.time)
    );
    setAppointments(sortedAppointments);
    form.reset();
    setIsDialogOpen(false);
    setSelectedSlot(null);
  };
  
  const handleAppointmentClick = (appointment: Appointment) => {
    const serviceNames = appointment.service.split(', ');
    const amount = serviceNames.reduce((acc, currentService) => {
        const service = services.find(s => s.name === currentService);
        return acc + (service ? service.price : 0);
    }, 0);

    setInitialPayment({
        client: appointment.client,
        services: serviceNames,
        amount: amount,
    });
    router.push('/dashboard/payments');
  };

  const getAppointmentForSlot = (barberName: string, time: string) => {
    return appointments.find(apt => apt.barber === barberName && apt.time <= time && time < addMinutes(apt.time, apt.duration));
  }
  
  const isSlotOccupied = (barberName: string, time: string) => {
    return appointments.some(apt => apt.barber === barberName && apt.time <= time && time < addMinutes(apt.time, apt.duration));
  }
  
  const addMinutes = (time: string, minutes: number) => {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes, 0, 0);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agenda</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedSlot(null); }}>
            <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md flex flex-col">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                  <DialogDescription>
                      Preencha os detalhes abaixo para criar um novo agendamento.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow overflow-hidden flex flex-col">
                    <ScrollArea className="flex-grow pr-6 -mr-6">
                      <div className="space-y-4">
                        <FormField
                        control={form.control}
                        name="client"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome do Cliente</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do Cliente" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="barber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Barbeiro</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um barbeiro" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {barbers.map((barber) => (
                                        <SelectItem key={barber.id} value={barber.name}>
                                        {barber.name}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="services"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Serviços</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    className="w-full justify-start font-normal h-auto min-h-10"
                                    >
                                    <div className="flex flex-wrap items-center gap-2">
                                        {field.value.length > 0 ? (
                                        field.value.map((serviceName) => (
                                            <Badge
                                            key={serviceName}
                                            variant="secondary"
                                            className="gap-1.5"
                                            >
                                            {serviceName}
                                            <button
                                                onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                field.onChange(
                                                    field.value.filter((s) => s !== serviceName)
                                                );
                                                }}
                                                className="rounded-full hover:bg-muted-foreground/20"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            </Badge>
                                        ))
                                        ) : (
                                        <span className="text-muted-foreground">Selecione os serviços</span>
                                        )}
                                    </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                    <Command>
                                        <CommandInput placeholder="Buscar serviço..." />
                                        <CommandList>
                                            <CommandEmpty>Nenhum serviço encontrado.</CommandEmpty>
                                            <CommandGroup>
                                                {services.map((option) => {
                                                    const isSelected = field.value.includes(option.name);
                                                    return(
                                                        <CommandItem
                                                            key={option.id}
                                                            onSelect={() => {
                                                                if (isSelected) {
                                                                    field.onChange(field.value.filter(s => s !== option.name));
                                                                } else {
                                                                    field.onChange([...field.value, option.name]);
                                                                }
                                                            }}
                                                        >
                                                            <div className={cn(
                                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                                            )}>
                                                                <Check className={cn("h-4 w-4")} />
                                                            </div>
                                                            <span>{option.name}</span>
                                                        </CommandItem>
                                                    )}
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Horário</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um horário" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {timeSlots.map((slot) => (
                                       <SelectItem key={slot} value={slot} disabled={isSlotOccupied(form.getValues('barber'), slot)}>
                                          {slot}
                                       </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                        />
                      </div>
                    </ScrollArea>
                    <DialogFooter className="flex-shrink-0 pt-4">
                      <DialogClose asChild>
                          <Button type="button" variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button type="submit">Salvar Agendamento</Button>
                    </DialogFooter>
                  </form>
                </Form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 h-full">
         <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>{date ? date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'Selecione uma data'}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle>Agenda do Dia</CardTitle>
             <CardDescription>
                {date ? date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Selecione uma data'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full">
                <div className="grid grid-cols-[60px_repeat(auto-fit,_minmax(150px,_1fr))] h-full">
                    {/* Time Column */}
                    <div className="col-start-1 col-end-2 row-start-1 sticky top-0 bg-background z-10">
                        <div className="h-12 border-b flex items-center justify-center font-semibold">Horas</div>
                        {timeSlots.map(time => (
                            <div key={time} className="h-20 flex items-center justify-center border-b border-r text-sm text-muted-foreground">
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Barbers Columns */}
                    <div className="col-start-2 col-end-[-1] row-start-1 grid grid-cols-subgrid">
                        {barbers.map((barber, barberIndex) => (
                            <div key={barber.id} className={cn("grid grid-rows-[auto_repeat(24,_80px)] col-start-", barberIndex + 1, "col-end-", barberIndex + 2)}>
                                <div className="h-12 border-b flex items-center justify-center font-semibold text-center sticky top-0 bg-background z-10 border-r">
                                    {barber.name}
                                </div>
                                <div className="row-start-2 row-end-[-1] col-start-1 col-end-2 grid grid-rows-subgrid">
                                    {timeSlots.map((time, timeIndex) => {
                                        const appointment = getAppointmentForSlot(barber.name, time);
                                        const isFirstSlot = appointment && appointment.time === time;

                                        if (appointment && isFirstSlot) {
                                            const durationInSlots = Math.ceil(appointment.duration / 30);
                                            return (
                                                <div 
                                                    key={time} 
                                                    className={cn("border-b border-r p-2 overflow-hidden relative cursor-pointer", getStatusColor(appointment.status))}
                                                    style={{ gridRow: `${timeIndex + 1} / span ${durationInSlots}`}}
                                                    onClick={() => handleAppointmentClick(appointment)}
                                                >
                                                    <p className="font-semibold text-sm truncate">{appointment.client}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{appointment.service}</p>
                                                </div>
                                            )
                                        }

                                        if (isSlotOccupied(barber.name, time)) {
                                            return null;
                                        }
                                        
                                        return (
                                            <div 
                                                key={time} 
                                                className="border-b border-r cursor-pointer hover:bg-muted/50"
                                                onClick={() => openNewAppointmentDialog(barber.name, time)}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    