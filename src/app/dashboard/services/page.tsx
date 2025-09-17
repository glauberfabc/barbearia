
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
    DropdownMenuSeparator
  } from '@/components/ui/dropdown-menu';
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';

const serviceSchema = z.object({
    name: z.string().min(1, { message: "O nome do serviço é obrigatório." }),
    price: z.string().min(1, { message: "O preço é obrigatório." }),
    duration: z.string().min(1, { message: "A duração é obrigatória." }),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface Service {
    id: number;
    name: string;
    price: string;
    duration: string;
}
  
const initialServices: Service[] = [
    { id: 1, name: 'Corte Degradê', price: 'R$ 45,00', duration: '45 min' },
    { id: 2, name: 'Corte Simples', price: 'R$ 35,00', duration: '30 min' },
    { id: 3, name: 'Barba Terapia', price: 'R$ 40,00', duration: '40 min' },
    { id: 4, name: 'Barba e Cabelo', price: 'R$ 75,00', duration: '1h 15min' },
    { id: 5, name: 'Penteado', price: 'R$ 50,00', duration: '50 min' },
    { id: 6, name: 'Hidratação', price: 'R$ 60,00', duration: '1h' },
];
  
export default function ServicesPage() {
    const [services, setServices] = React.useState<Service[]>(initialServices);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedService, setSelectedService] = React.useState<Service | null>(null);

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
          name: '',
          price: '',
          duration: '',
        },
    });

    React.useEffect(() => {
        if (selectedService) {
            form.reset(selectedService);
        } else {
            form.reset({ name: '', price: '', duration: '' });
        }
    }, [selectedService, form]);

    const handleAddSubmit = (data: ServiceFormValues) => {
        const newService: Service = {
          id: Math.max(...services.map(s => s.id), 0) + 1,
          ...data,
        };
        setServices([...services, newService]);
        form.reset();
        setIsAddDialogOpen(false);
    };

    const handleEditSubmit = (data: ServiceFormValues) => {
        if (selectedService) {
          setServices(services.map(s => s.id === selectedService.id ? { ...s, ...data } : s));
        }
        setIsEditDialogOpen(false);
        setSelectedService(null);
    };

    const handleDeleteService = () => {
        if (selectedService) {
          setServices(services.filter(s => s.id !== selectedService.id));
        }
        setIsDeleteDialogOpen(false);
        setSelectedService(null);
    };

    const openEditDialog = (service: Service) => {
        setSelectedService(service);
        setIsEditDialogOpen(true);
    };
    
    const openDeleteDialog = (service: Service) => {
        setSelectedService(service);
        setIsDeleteDialogOpen(true);
    };

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Serviços</h1>
           <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { setIsAddDialogOpen(isOpen); if (!isOpen) form.reset(); }}>
                <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Serviço
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do novo serviço oferecido.
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nome do Serviço</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Corte Degradê" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Preço</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: R$ 45,00" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Duração</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 45 min" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Salvar Serviço</Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Lista de Serviços</CardTitle>
            <CardDescription>Gerencie os serviços oferecidos pela sua barbearia.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead className="hidden sm:table-cell">Duração</TableHead>
                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        <div className="font-bold">{service.name}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">{service.duration}</div>
                      </TableCell>
                      <TableCell>{service.price}</TableCell>
                      <TableCell className="hidden sm:table-cell">{service.duration}</TableCell>
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
                            <DropdownMenuItem onSelect={() => openEditDialog(service)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onSelect={() => openDeleteDialog(service)}>
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Service Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { setIsEditDialogOpen(isOpen); if (!isOpen) setSelectedService(null); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>Editar Serviço</DialogTitle>
                <DialogDescription>
                    Atualize os dados do serviço.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome do Serviço</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Corte Degradê" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Preço</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: R$ 45,00" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Duração</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: 45 min" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">Salvar Alterações</Button>
                    </DialogFooter>
                </form>
                </Form>
            </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Isso irá remover permanentemente o serviço
                    dos seus registros.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedService(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteService}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

    
