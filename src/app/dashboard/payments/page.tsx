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
  import { PlusCircle, MoreHorizontal, Check, ChevronsUpDown, X } from 'lucide-react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';


const paymentSchema = z.object({
    client: z.string().min(1, { message: "Selecione um cliente." }),
    services: z.array(z.string()).min(1, { message: "Selecione pelo menos um serviço." }),
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
    { value: 'Carlos Silva', label: 'Carlos Silva' },
    { value: 'Mariana Costa', label: 'Mariana Costa' },
    { value: 'João Pereira', label: 'João Pereira' },
    { value: 'Ana Beatriz', label: 'Ana Beatriz' },
    { value: 'Pedro Almeida', label: 'Pedro Almeida' },
    { value: 'Ricardo Gomes', label: 'Ricardo Gomes' },
    { value: 'Felipe Melo', label: 'Felipe Melo' },
];

const serviceOptions = [
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
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = React.useState(false);
    const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);
    
    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
          client: '',
          services: [],
          amount: 0,
          method: 'Dinheiro',
        },
    });

    const watchServices = form.watch('services');

    React.useEffect(() => {
        if (watchServices) {
            const total = watchServices.reduce((acc, currentService) => {
                const service = serviceOptions.find(s => s.name === currentService);
                return acc + (service ? service.price : 0);
            }, 0);
            form.setValue('amount', total);
        }
    }, [watchServices, form]);
    
    const handleAddSubmit = (data: PaymentFormValues) => {
        const newPayment: Payment = {
          id: Math.max(...payments.map(p => p.id), 0) + 1,
          client: data.client,
          service: data.services.join(', '),
          amount: `R$ ${data.amount.toFixed(2).replace('.', ',')}`,
          method: data.method,
          date: new Date().toLocaleDateString('pt-BR'),
        };
        setPayments([newPayment, ...payments]);
        form.reset();
        setIsAddDialogOpen(false);
    };

    const openDetailsDialog = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsDetailsDialogOpen(true);
    }

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
                <DialogContent className="sm:max-w-md">
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
                                <FormItem className="flex flex-col">
                                <FormLabel>Cliente</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? clients.find(
                                                        (client) => client.value === field.value
                                                    )?.label
                                                    : "Selecione o cliente"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[375px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar cliente..." />
                                            <CommandList>
                                                <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                                                <CommandGroup>
                                                    {clients.map((client) => (
                                                        <CommandItem
                                                            value={client.label}
                                                            key={client.value}
                                                            onSelect={() => {
                                                                form.setValue("client", client.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    client.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {client.label}
                                                        </CommandItem>
                                                    ))}
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
                            name="services"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Serviços</FormLabel>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant="outline"
                                    className="w-full justify-start font-normal h-auto"
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
                                <PopoverContent className="w-[375px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Buscar serviço..." />
                                        <CommandList>
                                            <CommandEmpty>Nenhum serviço encontrado.</CommandEmpty>
                                            <CommandGroup>
                                                {serviceOptions.map((option) => {
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
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Valor Total</FormLabel>
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
                  <TableHead>Serviço(s)</TableHead>
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
                          <DropdownMenuItem onSelect={() => openDetailsDialog(payment)}>
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>Gerar Recibo</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                 {payments.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            Nenhum pagamento registrado.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={(isOpen) => { setIsDetailsDialogOpen(isOpen); if (!isOpen) setSelectedPayment(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes do Pagamento</DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre a transação.
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4 py-4">
                <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Cliente</span>
                    <span className="font-semibold">{selectedPayment.client}</span>
                </div>
                <Separator />
                <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Serviço(s)</span>
                    <span className="font-semibold">{selectedPayment.service}</span>
                </div>
                <Separator />
                <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Valor Total</span>
                    <span className="font-semibold">{selectedPayment.amount}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                    <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Data</span>
                        <span className="font-semibold">{selectedPayment.date}</span>
                    </div>
                     <div className="flex flex-col space-y-1 items-end">
                        <span className="text-sm text-muted-foreground">Forma de Pagamento</span>
                        <Badge 
                            variant={selectedPayment.method === 'Fiado' ? 'destructive' : 'default'}
                        >
                            {selectedPayment.method}
                        </Badge>
                    </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Fechar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    );
  }
