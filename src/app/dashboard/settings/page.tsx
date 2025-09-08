import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
  } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Upload } from 'lucide-react';
  
  export default function SettingsPage() {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Configurações da Barbearia</h1>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle>Aparência da Página</CardTitle>
            <CardDescription>Personalize a página de agendamento com a identidade da sua marca.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo da Barbearia</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-md border flex items-center justify-center bg-muted">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <Input id="logo" type="file" className="max-w-sm" />
              </div>
              <p className="text-sm text-muted-foreground">Recomendado: 200x200px, PNG ou JPG.</p>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Cor Primária</Label>
                <div className="flex items-center gap-2">
                  <Input id="primary-color" type="color" defaultValue="#1A237E" className="w-14 p-1"/>
                  <Input type="text" defaultValue="#1A237E" className="max-w-xs" />
                </div>
                <p className="text-sm text-muted-foreground">Usada em botões principais e links.</p>
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="accent-color">Cor de Destaque</Label>
                 <div className="flex items-center gap-2">
                  <Input id="accent-color" type="color" defaultValue="#FF5722" className="w-14 p-1"/>
                  <Input type="text" defaultValue="#FF5722" className="max-w-xs" />
                </div>
                <p className="text-sm text-muted-foreground">Usada para detalhes e chamadas de ação.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar Alterações</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
