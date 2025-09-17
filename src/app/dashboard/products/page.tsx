
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaymentStore } from '@/stores/payment-store';

const productSchema = z.object({
    name: z.string().min(1, { message: "O nome do produto é obrigatório." }),
    price: z.string().min(1, { message: "O preço é obrigatório." }),
    stock: z.coerce.number().min(0, { message: "O estoque não pode ser negativo." }),
    status: z.enum(['Em estoque', 'Estoque baixo', 'Sem estoque']),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Product {
    id: number;
    name: string;
    price: string;
    stock: number;
    status: 'Em estoque' | 'Estoque baixo' | 'Sem estoque';
}
  
const initialProducts: Product[] = [
    { id: 1, name: 'Pomada Modeladora', price: 'R$ 30,00', stock: 15, status: 'Em estoque' },
    { id: 2, name: 'Gel Fixador', price: 'R$ 20,00', stock: 22, status: 'Em estoque' },
    { id: 3, name: 'Cerveja Artesanal', price: 'R$ 15,00', stock: 5, status: 'Estoque baixo' },
    { id: 4, name: 'Refrigerante', price: 'R$ 5,00', stock: 50, status: 'Em estoque' },
    { id: 5, name: 'Shampoo para Barba', price: 'R$ 40,00', stock: 0, status: 'Sem estoque' },
];
  
export default function ProductsPage() {
    const [products, setProducts] = React.useState<Product[]>(initialProducts);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const router = useRouter();
    const { setInitialPayment } = usePaymentStore();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
          name: '',
          price: '',
          stock: 0,
          status: 'Em estoque',
        },
    });

    React.useEffect(() => {
        if (selectedProduct) {
            form.reset({
                ...selectedProduct,
                stock: Number(selectedProduct.stock)
            });
        } else {
            form.reset({ name: '', price: '', stock: 0, status: 'Em estoque' });
        }
    }, [selectedProduct, form]);

    const handleAddSubmit = (data: ProductFormValues) => {
        const newProduct: Product = {
          id: Math.max(...products.map(p => p.id), 0) + 1,
          ...data
        };
        setProducts([...products, newProduct]);
        form.reset();
        setIsAddDialogOpen(false);
    };

    const handleEditSubmit = (data: ProductFormValues) => {
        if (selectedProduct) {
          setProducts(products.map(p => p.id === selectedProduct.id ? { ...p, ...data } : p));
        }
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = () => {
        if (selectedProduct) {
          setProducts(products.filter(p => p.id !== selectedProduct.id));
        }
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
    };

    const handleRegisterSale = (product: Product) => {
        const priceNumber = parseFloat(product.price.replace('R$', '').replace(',', '.').trim());
        setInitialPayment({
            services: [product.name],
            amount: priceNumber,
        });
        router.push('/dashboard/payments');
    };

    const openEditDialog = (product: Product) => {
        setSelectedProduct(product);
        setIsEditDialogOpen(true);
    };
    
    const openDeleteDialog = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteDialogOpen(true);
    };
    
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Produtos</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { setIsAddDialogOpen(isOpen); if (!isOpen) form.reset(); }}>
                <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Produto
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>Adicionar Novo Produto</DialogTitle>
                    <DialogDescription>
                        Preencha os dados do novo item do estoque.
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Nome do Produto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Pomada Modeladora" {...field} />
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
                                    <Input placeholder="Ex: R$ 30,00" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Estoque</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Ex: 15" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Salvar Produto</Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
            <CardDescription>Gerencie o estoque de produtos da sua barbearia.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead className="hidden sm:table-cell">Estoque</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="font-bold">{product.name}</div>
                        <div className="text-sm text-muted-foreground sm:hidden">
                            Estoque: {product.stock}
                        </div>
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell className="hidden sm:table-cell">{product.stock}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                              product.status === 'Em estoque' ? 'default'
                              : product.status === 'Estoque baixo' ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {product.status}
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
                            <DropdownMenuItem onSelect={() => openEditDialog(product)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleRegisterSale(product)}>Registrar Venda</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onSelect={() => openDeleteDialog(product)}>
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

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { setIsEditDialogOpen(isOpen); if (!isOpen) setSelectedProduct(null); }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                <DialogTitle>Editar Produto</DialogTitle>
                <DialogDescription>
                    Atualize os dados do produto.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nome do Produto</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Pomada Modeladora" {...field} />
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
                                <Input placeholder="Ex: R$ 30,00" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Estoque</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Ex: 15" {...field} />
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
                                <SelectItem value="Em estoque">Em estoque</SelectItem>
                                <SelectItem value="Estoque baixo">Estoque baixo</SelectItem>
                                <SelectItem value="Sem estoque">Sem estoque</SelectItem>
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
                    Essa ação não pode ser desfeita. Isso irá remover permanentemente o produto
                    dos seus registros.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedProduct(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProduct}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
