
"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
  } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { PlusCircle, MoreHorizontal } from 'lucide-react';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const paymentSchema = z.object({
    client: z.string().min(1, { message: "Selecione um cliente." }),
    service: z.string().min(1, { message: "Selecione um serviço." }),
    amount: z.coerce.number().min(0.01, { message: "O valor deve ser maior que zero." }),
    method: z.enum(['Dinheiro', 'Cartão', 'Pix', 'Fiado']),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface Payment {
    id: number;
    client: string;
    service: string;
    amount: string;
    date: string;
    method: 'Dinheiro' | 'Cartão' | 'Pix' | 'Fiado';
}
  
const initialPayments: Payment[] = [
    { id: 1, client: 'Carlos Silva', service: 'Corte Degradê', amount: 'R$ 45,00', date: '20/07/2024', method: 'Pix' },
    { id: 2, client: 'Mariana Costa', service: 'Barba e Cabelo', amount: 'R$ 75,00', date: '20/07/2024', method: 'Cartão' },
    { id: 3, client: 'João Pereira', service: 'Corte Simples', amount: 'R$ 35,00', date: '19/07/2024', method: 'Dinheiro' },
    { id: 4, client: 'Ana Beatriz', service: 'Penteado', amount: 'R$ 50,00', date: '19/07/2024', method: 'Fiado' },
    { id: 5, client: 'Pedro Almeida', service: 'Barba', amount: 'R$ 30,00', date: '18/07/2024', method: 'Pix' },
];

const clients = [
    { id: '1', name: 'Carlos Silva' },
    { id: '2', name: 'Mariana Costa' },
    { id: '3', name: 'João Pereira' },
    { id: '4', name: 'Ana Beatriz' },
    { id: '5', name: 'Pedro Almeida' },
];

const services = [
    { id: '1', name: 'Corte Degradê', price: 45.00 },
    { id: '2', name: 'Corte Simples', price: 35.00 },
    { id: '3', name: 'Barba Terapia', price: 40.00 },
    { id: '4', name: 'Barba e Cabelo', price: 75.00 },
    { id: '5', name: 'Penteado', price: 50.00 },
    { id: '6', name: 'Barba', price: 30.00 },
];
  
export default function PaymentsPage() {
    const [payments, setPayments] = React.useState<Payment[]>(initialPayments);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    
    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
          client: '',
          service: '',
          amount: 0,
          method: 'Dinheiro',
        },
    });

    const handleServiceChange = (serviceName: string) => {
        const selectedService = services.find(s => s.name === serviceName);
        if (selectedService) {
            form.setValue('amount', selectedService.price);
        }
    };
    
    const handleAddSubmit = (data: PaymentFormValues) => {
        const newPayment: Payment = {
          id: Math.max(...payments.map(p => p.id), 0) + 1,
          client: data.client,
          service: data.service,
          amount: `R$ ${data.amount.toFixed(2).replace('.', ',')}`,
          method: data.method,
          date: new Date().toLocaleDateString('pt-BR'),
        };
        setPayments([newPayment, ...payments]);
        form.reset();
        setIsAddDialogOpen(false);
    };

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Pagamentos</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { setIsAddDialogOpen(isOpen); if (!isOpen) form.reset(); }}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Registrar Pagamento
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Registrar Novo Pagamento</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do pagamento recebido.
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="client"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o cliente" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.name}>
                                        {client.name}
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
                                 <Select onValueChange={(value) => {
                                     field.onChange(value);
                                     handleServiceChange(value);
                                 }} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o serviço" />
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
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Valor</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="R$ 0,00" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Forma de Pagamento</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a forma de pagamento" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                                        <SelectItem value="Cartão">Cartão</SelectItem>
                                        <SelectItem value="Pix">Pix</SelectItem>
                                        <SelectItem value="Fiado">Fiado (Anotar na conta)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Salvar Pagamento</Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>Visualize todos os pagamentos registrados.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.client}</TableCell>
                    <TableCell>{payment.service}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={payment.method === 'Fiado' ? 'destructive' : 'default'}
                      >
                        {payment.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Gerar Recibo</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
