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
  import { Badge } from '@/components/ui/badge';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  
  const barbers = [
    { id: 1, name: 'Renato Garcia', email: 'renato@example.com', phone: '(11) 98765-4321', status: 'Ativo' },
    { id: 2, name: 'Marcos Andrade', email: 'marcos@example.com', phone: '(21) 91234-5678', status: 'Ativo' },
    { id: 3, name: 'Júlia Martins', email: 'julia@example.com', phone: '(31) 95555-8888', status: 'Férias' },
    { id: 4, name: 'Lucas Pereira', email: 'lucas@example.com', phone: '(41) 99999-1111', status: 'Inativo' },
  ];
  
  export default function BarbersPage() {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Barbeiros</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Barbeiro
          </Button>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Lista de Barbeiros</CardTitle>
            <CardDescription>Gerencie os profissionais da sua equipe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
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
                        <div>
                          <div className="font-bold">{barber.name}</div>
                          <div className="text-sm text-muted-foreground">{barber.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{barber.phone}</TableCell>
                    <TableCell>
                      <Badge variant={barber.status === 'Ativo' ? 'default' : 'outline'}>
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
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Ver Agenda</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
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
