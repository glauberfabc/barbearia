"use client";

import { useState, useTransition } from 'react';
import { runFlow } from '@genkit-ai/next/client';
import type { PredictSchedulingOutput } from '@/ai/flows/predictive-scheduling';
import { predictScheduling } from '@/ai/flows/predictive-scheduling';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, BarChart2, PieChart as PieChartIcon, Clock, Scissors, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const mockHistoricalData = JSON.stringify(
  [
    { date: '2023-10-02', time: '10:00', barber: 'Renato', service: 'Corte Degradê' },
    { date: '2023-10-02', time: '11:00', barber: 'Marcos', service: 'Barba Terapia' },
    { date: '2023-10-03', time: '14:00', barber: 'Renato', service: 'Corte Degradê' },
    { date: '2023-10-03', time: '17:00', barber: 'Júlia', service: 'Penteado' },
    { date: '2023-10-04', time: '18:00', barber: 'Marcos', service: 'Barba e Cabelo' },
    { date: '2023-10-05', time: '16:00', barber: 'Renato', service: 'Corte Degradê' },
    { date: '2023-10-05', time: '16:30', barber: 'Marcos', service: 'Barba Terapia' },
    { date: '2023-10-06', time: '19:00', barber: 'Renato', service: 'Corte Degradê' },
  ],
  null,
  2
);

const chartData = [
  { barber: 'Renato', appointments: 124, fill: "var(--color-renato)" },
  { barber: 'Marcos', appointments: 98, fill: "var(--color-marcos)" },
  { barber: 'Júlia', appointments: 72, fill: "var(--color-julia)" },
  { barber: 'Lucas', appointments: 54, fill: "var(--color-lucas)" },
];
const chartConfig = {
  appointments: { label: "Agendamentos" },
  renato: { label: "Renato", color: "hsl(var(--chart-1))" },
  marcos: { label: "Marcos", color: "hsl(var(--chart-2))" },
  julia: { label: "Júlia", color: "hsl(var(--chart-3))" },
  lucas: { label: "Lucas", color: "hsl(var(--chart-4))" },
};

const pieChartData = [
    { service: "Corte Degradê", value: 45, fill: "var(--color-corte-degrade)"},
    { service: "Barba e Cabelo", value: 30, fill: "var(--color-barba-cabelo)" },
    { service: "Barba Terapia", value: 25, fill: "var(--color-barba-terapia)" },
    { service: "Corte Simples", value: 20, fill: "var(--color-corte-simples)" },
]
const pieChartConfig = {
    "corte-degrade": { label: "Corte Degradê", color: "hsl(var(--chart-1))" },
    "barba-cabelo": { label: "Barba e Cabelo", color: "hsl(var(--chart-2))" },
    "barba-terapia": { label: "Barba Terapia", color: "hsl(var(--chart-3))" },
    "corte-simples": { label: "Corte Simples", color: "hsl(var(--chart-4))" },
}


export function AnalyticsDashboard() {
  const [historicalData, setHistoricalData] = useState(mockHistoricalData);
  const [prediction, setPrediction] = useState<PredictSchedulingOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAnalysis = () => {
    startTransition(async () => {
        setPrediction(null);
        const result = await runFlow(predictScheduling, { historicalBookingData: historicalData });
        if (result) {
            setPrediction(result);
        }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            Otimização com IA
          </CardTitle>
          <CardDescription>
            Use nossa inteligência artificial para analisar dados históricos e receber sugestões para otimizar sua agenda e equipe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label htmlFor="historicalData" className="font-medium">
              Dados Históricos de Agendamento (JSON)
            </label>
            <Textarea
              id="historicalData"
              value={historicalData}
              onChange={(e) => setHistoricalData(e.target.value)}
              rows={10}
              placeholder="Cole aqui os dados históricos no formato JSON..."
              className="font-code text-sm"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalysis} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Analisar Dados
          </Button>
        </CardFooter>
      </Card>

      {isPending && (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
            <Loader2 className="mr-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analisando dados e gerando insights...</p>
        </div>
      )}

      {prediction && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Horários de Pico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{prediction.peakHours}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Scissors className="h-5 w-5 text-primary" /> Serviços Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{prediction.popularServices}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Agenda Sugerida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{prediction.suggestedSchedule}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-primary"/>
                    Agendamentos por Barbeiro
                </CardTitle>
                <CardDescription>Total de agendamentos no último mês.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="barber" tickLine={false} tickMargin={10} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="appointments" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary"/>
                    Serviços Mais Realizados
                </CardTitle>
                <CardDescription>Distribuição dos serviços mais populares.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                 <ChartContainer config={pieChartConfig} className="min-h-[200px] w-full">
                    <PieChart>
                         <ChartTooltip content={<ChartTooltipContent nameKey="service" />} />
                        <Pie data={pieChartData} dataKey="value" nameKey="service" innerRadius={50} outerRadius={80}>
                             {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
