import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
import { Calendar, Users, BarChart, Scissors, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-bold">BarberFlow</span>
          </Link>
          <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
            <Link href="#features">Funcionalidades</Link>
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
                        <Link href="#features">Funcionalidades</Link>
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
        <section className="relative h-[80vh] min-h-[600px] w-full">
          <Image
            src="https://i.postimg.cc/FzJZb87C/man-with-beard-sits-chair-with-sign-that-says-he-has-beard-it.jpg"
            alt="Barbearia estilosa"
            data-ai-hint="stylish barbershop"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              Gerencie sua barbearia com <span className="text-primary">facilidade</span>.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white md:text-xl">
              Tudo o que você precisa para agendar clientes, gerenciar sua equipe e crescer seu negócio. Simples, moderno e poderoso.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard">Demo</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/pricing">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="container space-y-12 py-16 md:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
              Uma plataforma, todas as ferramentas.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              BarberFlow foi desenhado para simplificar o dia a dia da sua barbearia, economizando seu tempo e otimizando seus lucros.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <Calendar className="h-8 w-8" />
                </div>
                <CardTitle>Agendamento Online</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Permita que seus clientes agendem 24/7 através de uma página personalizada para sua barbearia.
              </CardContent>
            </Card>
            <Card className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle>Gestão de Equipe</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Controle horários, serviços e desempenho de cada barbeiro de forma simples e visual.
              </CardContent>
            </Card>
            <Card className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <BarChart className="h-8 w-8" />
                </div>
                <CardTitle>Análises Inteligentes</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Receba insights sobre seus serviços mais populares, horários de pico e faturamento com nossa IA.
              </CardContent>
            </Card>
            <Card className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                  <Scissors className="h-8 w-8" />
                </div>
                <CardTitle>Página Personalizada</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                Deixe a página de agendamento com a cara da sua barbearia, com seu logo e suas cores.
              </CardContent>
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
