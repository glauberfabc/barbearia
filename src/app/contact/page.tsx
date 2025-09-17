import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
import { Phone, Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const whatsappLink = "https://wa.me/5511950141570";

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
          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Comece Agora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container space-y-12 py-16 md:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
              Entre em Contato
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Estamos aqui para ajudar! Se você tem alguma dúvida sobre nossos planos, funcionalidades ou precisa de um orçamento para um app personalizado, não hesite em nos contatar.
            </p>
          </div>

          <div className="mx-auto max-w-lg">
            <Card>
              <CardHeader>
                <CardTitle>Fale Conosco</CardTitle>
                <CardDescription>
                  A maneira mais rápida de obter uma resposta é através do WhatsApp.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button asChild size="lg" className="w-full">
                  <Link href={whatsappLink} target="_blank">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Iniciar Conversa no WhatsApp
                  </Link>
                </Button>
                <div className="flex items-center justify-center space-x-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+55 11 95014-1570</span>
                  </div>
                </div>
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
