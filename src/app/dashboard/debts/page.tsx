
"use client";

import React from 'react';
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
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface Debt {
    id: number;
    client: string;
    service: string;
    amount: string;
    date: string;
}
  
const initialDebts: Debt[] = [
    { id: 4, client: 'Ana Beatriz', service: 'Penteado', amount: 'R$ 50,00', date: '19/07/2024' },
    { id: 6, client: 'Ricardo Gomes', service: 'Corte e Barba', amount: 'R$ 75,00', date: '17/07/2024' },
    { id: 7, client: 'Felipe Melo', service: 'Corte Degradê', amount: 'R$ 45,00', date: '15/07/2024' },
];
  
export default function DebtsPage() {
    const [debts, setDebts] = React.useState<Debt[]>(initialDebts);

    const handleSettleDebt = (debtId: number) => {
        setDebts(debts.filter(d => d.id !== debtId));
        // Aqui você poderia adicionar uma lógica para registrar o pagamento
    };
    
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Controle de Fiados</h1>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Clientes com Pagamentos Pendentes</CardTitle>
            <CardDescription>Gerencie os clientes que optaram por pagar depois.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor Pendente</TableHead>
                  <TableHead>Data do Serviço</TableHead>
                  <TableHead>
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debts.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell className="font-medium">{debt.client}</TableCell>
                    <TableCell>{debt.service}</TableCell>
                    <TableCell>{debt.amount}</TableCell>
                    <TableCell>{debt.date}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleSettleDebt(debt.id)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Marcar como Pago
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {debts.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            Nenhum cliente com pagamento pendente.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
