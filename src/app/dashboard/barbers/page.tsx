
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
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
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';

const barberSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  phone: z.string().min(1, { message: "O telefone é obrigatório." }),
  status: z.enum(['Ativo', 'Férias', 'Inativo']),
});

type BarberFormValues = z.infer<typeof barberSchema>;

interface Barber {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Ativo' | 'Férias' | 'Inativo';
}

const initialBarbers: Barber[] = [
  { id: 1, name: 'Renato Garcia', email: 'renato@example.com', phone: '(11) 98765-4321', status: 'Ativo' },
  { id: 2, name: 'Marcos Andrade', email: 'marcos@example.com', phone: '(21) 91234-5678', status: 'Ativo' },
  { id: 3, name: 'Júlia Martins', email: 'julia@example.com', phone: '(31) 95555-8888', status: 'Férias' },
  { id: 4, name: 'Lucas Pereira', email: 'lucas@example.com', phone: '(41) 99999-1111', status: 'Inativo' },
];

export default function BarbersPage() {
  const [barbers, setBarbers] = React.useState<Barber[]>(initialBarbers);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedBarber, setSelectedBarber] = React.useState<Barber | null>(null);
  const router = useRouter();

  const form = useForm<BarberFormValues>({
    resolver: zodResolver(barberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'Ativo',
    },
  });

  React.useEffect(() => {
    if (selectedBarber) {
      form.reset(selectedBarber);
    } else {
      form.reset({ name: '', email: '', phone: '', status: 'Ativo' });
    }
  }, [selectedBarber, form]);

  const handleAddSubmit = (data: BarberFormValues) => {
    const newBarber: Barber = {
      id: Math.max(...barbers.map(b => b.id), 0) + 1,
      ...data,
    };
    setBarbers([...barbers, newBarber]);
    form.reset();
    setIsAddDialogOpen(false);
  };
  
  const handleEditSubmit = (data: BarberFormValues) => {
    if (selectedBarber) {
      setBarbers(barbers.map(b => b.id === selectedBarber.id ? { ...b, ...data } : b));
    }
    setIsEditDialogOpen(false);
    setSelectedBarber(null);
  };

  const handleDeleteBarber = () => {
    if (selectedBarber) {
      setBarbers(barbers.filter(b => b.id !== selectedBarber.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedBarber(null);
  };

  const openEditDialog = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsDeleteDialogOpen(true);
  };

  const handleViewSchedule = (barberName: string) => {
    router.push(`/dashboard/schedule?barber=${encodeURIComponent(barberName)}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Barbeiros</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { setIsAddDialogOpen(isOpen); if (!isOpen) form.reset(); }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Barbeiro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Barbeiro</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo profissional da equipe.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do barbeiro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                       <FormControl>
                        <Input placeholder="(99) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Salvar Barbeiro</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Barbeiros</CardTitle>
          <CardDescription>Gerencie os profissionais da sua equipe.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead className="hidden md:table-cell">Contato</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {barbers.map((barber) => (
                  <TableRow key={barber.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://picsum.photos/seed/${barber.id}/100`} />
                          <AvatarFallback>{barber.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="font-bold">{barber.name}</div>
                          <div className="text-sm text-muted-foreground md:hidden">{barber.phone}</div>
                          <div className="text-sm text-muted-foreground hidden md:block">{barber.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{barber.phone}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={barber.status === 'Ativo' ? 'default' : barber.status === 'Férias' ? 'secondary' : 'outline'}>
                        {barber.status}
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
                          <DropdownMenuItem onSelect={() => openEditDialog(barber)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleViewSchedule(barber.name)}>
                             Ver Agenda
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onSelect={() => openDeleteDialog(barber)}>
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

      {/* Edit Barber Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { setIsEditDialogOpen(isOpen); if (!isOpen) setSelectedBarber(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Barbeiro</DialogTitle>
              <DialogDescription>
                Atualize os dados do profissional.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do barbeiro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                       <FormControl>
                        <Input placeholder="(99) 99999-9999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ativo">Ativo</SelectItem>
                          <SelectItem value="Férias">Férias</SelectItem>
                          <SelectItem value="Inativo">Inativo</SelectItem>
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
                    Essa ação não pode ser desfeita. Isso irá remover permanentemente o barbeiro
                    dos seus registros.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedBarber(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteBarber}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
