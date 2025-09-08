import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
  } from '@/components/ui/card';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Badge } from '@/components/ui/badge';
  import { BarChart, Users, Scissors, DollarSign } from 'lucide-react';
  
  const kpiData = [
    { title: 'Faturamento Total', value: 'R$ 12.540,00', change: '+15.2%', icon: DollarSign, color: 'text-green-500' },
    { title: 'Total de Agendamentos', value: '320', change: '+8.1%', icon: Scissors, color: 'text-blue-500' },
    { title: 'Novos Clientes', value: '45', change: '+25%', icon: Users, color: 'text-purple-500' },
    { title: 'Taxa de Ocupação', value: '85%', change: '-1.5%', icon: BarChart, color: 'text-orange-500' },
  ];
  
  const recentAppointments = [
    { client: 'Carlos Silva', service: 'Corte Degradê', barber: 'Renato', time: '14:00', status: 'Confirmado' },
    { client: 'Mariana Costa', service: 'Barba e Cabelo', barber: 'Marcos', time: '15:30', status: 'Confirmado' },
    { client: 'João Pereira', service: 'Corte Simples', barber: 'Renato', time: '16:00', status: 'Finalizado' },
    { client: 'Ana Beatriz', service: 'Penteado', barber: 'Júlia', time: '17:00', status: 'Aguardando' },
    { client: 'Pedro Almeida', service: 'Barba', barber: 'Marcos', time: '18:30', status: 'Cancelado' },
  ];
  
  export default function DashboardPage() {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
  
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.change} desde o último mês</p>
              </CardContent>
            </Card>
          ))}
        </div>
  
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Agendamentos Recentes</CardTitle>
              <CardDescription>Confira os últimos agendamentos do dia.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Barbeiro</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAppointments.map((apt, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{apt.client}</TableCell>
                      <TableCell>{apt.service}</TableCell>
                      <TableCell>{apt.barber}</TableCell>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
  
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Atividade dos Barbeiros</CardTitle>
              <CardDescription>Agendamentos por barbeiro hoje.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span>Renato</span>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width: '80%'}}></div></div>
                        <span className="text-sm font-medium">8/10</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span>Marcos</span>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width: '100%'}}></div></div>
                        <span className="text-sm font-medium">10/10</span>
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <span>Júlia</span>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width: '50%'}}></div></div>
                        <span className="text-sm font-medium">5/10</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span>Lucas</span>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{width: '70%'}}></div></div>
                        <span className="text-sm font-medium">7/10</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
