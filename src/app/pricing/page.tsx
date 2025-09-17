import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
import { Check, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';


const barberFlowFeatures = [
  "Agendamento Online 24/7",
  "Gestão de Barbeiros e Serviços",
  "Controle de Clientes e Fiados",
  "Gestão de Produtos e Vendas",
  "Análise de Desempenho com IA",
  "Página de Agendamento Personalizável"
];

const customFeatures = [
    "Tudo do plano BarberFlow",
    "Domínio próprio (suabarbearia.com)",
    "Funcionalidades sob medida",
    "Design exclusivo para sua marca",
    "Automação com WhatsApp",
    "Suporte prioritário"
  ];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold">BarberFlow</span>
          </Link>
          <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
            <Link href="/#features">Funcionalidades</Link>
            <Link href="/pricing">Preços</Link>
            <Link href="/contact">Contato</Link>
          </nav>
          <div className="hidden flex-1 items-center justify-end space-x-4 md:flex">
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Demo</Link>
            </Button>
          </div>
          <div className="flex flex-1 items-center justify-end md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-6 text-lg font-medium mt-8">
                    <SheetClose asChild>
                        <Link href="/#features">Funcionalidades</Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link href="/pricing">Preços</Link>
                    </SheetClose>
                    <SheetClose asChild>
                        <Link href="/contact">Contato</Link>
                    </SheetClose>
                </nav>
                <div className="absolute bottom-4 right-4 left-4 flex flex-col gap-2">
                    <Button asChild variant="outline" size="lg">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild size="lg">
                        <Link href="/dashboard">Demo</Link>
                    </Button>
                    <div className="mt-4 flex justify-center">
                        <ThemeToggle />
                    </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container space-y-12 py-16 md:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
              Escolha o plano perfeito para sua barbearia.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Comece com o essencial ou crie uma solução totalmente personalizada. Sem contratos, cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-start justify-center">
            <Card className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl border-primary border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">BarberFlow Completo</CardTitle>
                <CardDescription>A solução completa para gerenciar e crescer seu negócio.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <div className="text-center">
                  <span className="text-4xl font-bold">R$99</span>
                  <p className="text-muted-foreground">Pagamento único</p>
                </div>
                <ul className="space-y-3">
                  {barberFlowFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" size="lg">
                  <Link href="/dashboard">Começar com BarberFlow Completo</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">App Personalizado</CardTitle>
                <CardDescription>Uma solução exclusiva com a identidade da sua marca.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <div className="text-center">
                  <span className="text-2xl font-bold">Preços a consultar</span>
                  <p className="text-muted-foreground text-sm">Entre em contato para um orçamento</p>
                </div>
                <ul className="space-y-3">
                    {customFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                        </li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="outline" size="lg">
                  <Link href="/contact">Consultar Preços</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <div className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold">BarberFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BarberFlow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
