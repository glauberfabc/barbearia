
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';


const appointmentSchema = z.object({
  clientPhone: z.string().optional(),
  client: z.string().min(1, { message: "O nome do cliente é obrigatório." }),
  service: z.string().min(1, { message: "Selecione um serviço." }),
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
}

const initialAppointments: Appointment[] = [
    { time: '09:00', client: 'João Silva', service: 'Corte Degradê', barber: 'Renato Garcia', status: 'Confirmado' },
    { time: '10:00', client: 'Mariana Costa', service: 'Barba Terapia', barber: 'Marcos Andrade', status: 'Confirmado' },
    { time: '10:30', client: 'Pedro Almeida', service: 'Corte Simples', barber: 'Renato Garcia', status: 'Finalizado' },
    { time: '11:00', client: 'Ana Beatriz', service: 'Penteado', barber: 'Júlia Martins', status: 'Confirmado' },
    { time: '12:00', client: 'Lucas Oliveira', service: 'Barba e Cabelo', barber: 'Marcos Andrade', status: 'Aguardando' },
    { time: '14:00', client: 'Fernanda Lima', service: 'Corte Feminino', barber: 'Júlia Martins', status: 'Confirmado' },
    { time: '15:00', client: 'Ricardo Souza', service: 'Corte Degradê', barber: 'Renato Garcia', status: 'Cancelado' },
];

const barbers = [
    { id: '1', name: 'Renato Garcia' },
    { id: '2', name: 'Marcos Andrade' },
    { id: '3', name: 'Júlia Martins' },
    { id: '4', name: 'Lucas Pereira' },
];

const services = [
    { id: '1', name: 'Corte Degradê', duration: 45 },
    { id: '2', name: 'Corte Simples', duration: 30 },
    { id: '3', name: 'Barba Terapia', duration: 40 },
    { id: '4', name: 'Barba e Cabelo', duration: 75 },
    { id: '5', name: 'Penteado', duration: 50 },
    { id: '6', name: 'Hidratação', duration: 60 },
];

const timeSlots = Array.from({ length: (20 - 8) * 2 }, (_, i) => {
    const hour = 8 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

export function SchedulePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const barberFilterParam = searchParams.get('barber');

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);
  const [barberFilter, setBarberFilter] = React.useState(barberFilterParam || 'todos');

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientPhone: '',
      client: '',
      service: '',
      barber: '',
      time: '',
    },
  });
  
  React.useEffect(() => {
    if (barberFilterParam) {
      setBarberFilter(barberFilterParam);
    }
  }, [barberFilterParam]);


  const onSubmit = (data: AppointmentFormValues) => {
    const newAppointment: Appointment = {
      client: data.client,
      service: data.service,
      barber: data.barber,
      time: data.time,
      status: 'Confirmado',
    };
    const sortedAppointments = [...appointments, newAppointment].sort((a, b) =>
        a.time.localeCompare(b.time)
    );
    setAppointments(sortedAppointments);
    form.reset();
    setIsDialogOpen(false);
  };
  
  const selectedBarberForNewAppointment = form.watch('barber');

  const occupiedTimeSlots = React.useMemo(() => {
    if (!selectedBarberForNewAppointment) {
      return [];
    }
    return appointments
      .filter((apt) => apt.barber === selectedBarberForNewAppointment)
      .map(apt => apt.time);
  }, [appointments, selectedBarberForNewAppointment]);

  const filteredAppointments = React.useMemo(() => {
    if (barberFilter === 'todos') {
      return appointments;
    }
    return appointments.filter(apt => apt.barber === barberFilter);
  }, [appointments, barberFilter]);

  const handleFilterChange = (barberName: string) => {
    setBarberFilter(barberName);
    const params = new URLSearchParams(searchParams.toString());
    if (barberName === 'todos') {
      params.delete('barber');
    } else {
      params.set('barber', barberName);
    }
    router.push(`/dashboard/schedule?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agenda</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select value={barberFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por barbeiro" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todos">Todos os Barbeiros</SelectItem>
                    {barbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.name}>
                        {barber.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Novo Agendamento
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>Novo Agendamento</DialogTitle>
                    <DialogDescription>
                        Preencha os detalhes abaixo para criar um novo agendamento.
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <ScrollArea className="h-auto max-h-[70vh] p-4">
                        <div className="space-y-4">
                          <FormField
                          control={form.control}
                          name="clientPhone"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Telefone do Cliente (Opcional)</FormLabel>
                              <FormControl>
                                  <Input placeholder="(99) 99999-9999" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
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
                          name="service"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Serviço</FormLabel>
                              <Select onValuechange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Selecione um serviço" />
                                  </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                  {services.map((service) => (
                                      <SelectItem key={service.id} value={service.name}>
                                      {service.name}
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
                              name="time"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Horário</FormLabel>
                                  <FormControl>
                                      <RadioGroup
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                          className="grid grid-cols-3 sm:grid-cols-4 gap-2"
                                          disabled={!selectedBarberForNewAppointment}
                                      >
                                          {!selectedBarberForNewAppointment && <p className="col-span-full text-sm text-muted-foreground">Selecione um barbeiro primeiro.</p>}
                                          {selectedBarberForNewAppointment && timeSlots.map((slot) => {
                                              const isOccupied = occupiedTimeSlots.includes(slot);
                                              return (
                                                  <FormItem key={slot}>
                                                      <FormControl>
                                                          <RadioGroupItem value={slot} id={slot} className="peer sr-only" disabled={isOccupied} />
                                                      </FormControl>
                                                      <FormLabel
                                                          htmlFor={slot}
                                                          className={cn(
                                                              "flex h-9 items-center justify-center rounded-md border text-sm font-normal",
                                                              "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                                              !isOccupied && "cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground",
                                                              isOccupied ? "bg-red-200 text-destructive-foreground dark:bg-red-800 cursor-not-allowed" : "bg-green-200 dark:bg-green-800/50 hover:bg-green-300 dark:hover:bg-green-700"
                                                          )}
                                                      >
                                                          {slot}
                                                      </FormLabel>
                                                  </FormItem>
                                              )
                                          })}
                                      </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                          />
                        </div>
                      </ScrollArea>
                      <DialogFooter className="pt-4">
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
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Selecione uma data</CardTitle>
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agendamentos do dia</CardTitle>
            <CardDescription>
              {date ? date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Selecione uma data'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredAppointments.map((apt, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border p-4">
                <div className="font-bold text-primary text-lg">{apt.time}</div>
                <div className="flex-1">
                  <p className="font-semibold">{apt.client}</p>
                  <p className="text-sm text-muted-foreground">{apt.service} com {apt.barber}</p>
                </div>
                <div>
                  <Badge
                    variant={
                      apt.status === 'Confirmado' ? 'default'
                      : apt.status === 'Finalizado' ? 'secondary'
                      : apt.status === 'Cancelado' ? 'destructive'
                      : 'outline'
                    }
                    className="capitalize"
                  >
                    {apt.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            ))}
             {filteredAppointments.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    Nenhum agendamento para este dia.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
