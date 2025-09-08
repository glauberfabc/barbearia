"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const appointmentSchema = z.object({
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
    { time: '09:00', client: 'João Silva', service: 'Corte Degradê', barber: 'Renato', status: 'Confirmado' },
    { time: '10:00', client: 'Mariana Costa', service: 'Barba Terapia', barber: 'Marcos', status: 'Confirmado' },
    { time: '10:30', client: 'Pedro Almeida', service: 'Corte Simples', barber: 'Renato', status: 'Finalizado' },
    { time: '11:00', client: 'Ana Beatriz', service: 'Penteado', barber: 'Júlia', status: 'Confirmado' },
    { time: '12:00', client: 'Lucas Oliveira', service: 'Barba e Cabelo', barber: 'Marcos', status: 'Aguardando' },
    { time: '14:00', client: 'Fernanda Lima', service: 'Corte Feminino', barber: 'Júlia', status: 'Confirmado' },
    { time: '15:00', client: 'Ricardo Souza', service: 'Corte Degradê', barber: 'Renato', status: 'Cancelado' },
];

const barbers = [
    { id: '1', name: 'Renato Garcia' },
    { id: '2', name: 'Marcos Andrade' },
    { id: '3', name: 'Júlia Martins' },
    { id: '4', name: 'Lucas Pereira' },
  ];

const services = [
    { id: '1', name: 'Corte Degradê' },
    { id: '2', name: 'Corte Simples' },
    { id: '3', name: 'Barba Terapia' },
    { id: '4', name: 'Barba e Cabelo' },
    { id: '5', name: 'Penteado' },
    { id: '6', name: 'Hidratação' },
  ];

export default function SchedulePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      client: '',
      service: '',
      barber: '',
      time: '',
    },
  });

  const onSubmit = (data: AppointmentFormValues) => {
    const newAppointment: Appointment = {
      ...data,
      status: 'Confirmado',
    };
    const sortedAppointments = [...appointments, newAppointment].sort((a, b) =>
        a.time.localeCompare(b.time)
    );
    setAppointments(sortedAppointments);
    form.reset();
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
              <DialogDescription>
                Preencha os detalhes abaixo para criar um novo agendamento.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do Cliente" {...field} />
                      </FormControl>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Selecione uma data</CardTitle>
          </CardHeader>
          <CardContent>
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
            {appointments.map((apt, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                <div className="font-bold text-primary">{apt.time}</div>
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
             {appointments.length === 0 && (
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
