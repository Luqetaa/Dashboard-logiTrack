import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Globe, Shield, Palette, User, Building2 } from "lucide-react"

/**
 * Settings page with profile, company, notifications, appearance, and security sections.
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Perfil</CardTitle>
          </div>
          <CardDescription>Suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">AD</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-medium">Admin LogiTrack</p>
              <p className="text-sm text-muted-foreground">admin@logitrack.com.br</p>
              <Badge variant="secondary" className="text-xs">Admin</Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input defaultValue="Administrador" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="admin@logitrack.com.br" />
            </div>
          </div>
          <Button>Salvar alterações</Button>
        </CardContent>
      </Card>

      {/* Company */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Empresa</CardTitle>
          </div>
          <CardDescription>Dados da empresa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da empresa</label>
              <Input defaultValue="LogiTrack Ltda" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CNPJ</label>
              <Input defaultValue="12.345.678/0001-90" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Notificações</CardTitle>
          </div>
          <CardDescription>Configurações de alertas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Novos pedidos", desc: "Receba alertas de novos pedidos", active: true },
              { label: "Pedidos atrasados", desc: "Alertas quando um pedido estiver atrasado", active: true },
              { label: "Relatórios semanais", desc: "Resumo semanal por email", active: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <div
                  className={cn(
                    "w-10 h-6 rounded-full relative cursor-pointer transition-colors",
                    item.active ? "bg-primary" : "bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                      item.active ? "translate-x-5" : "translate-x-1"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Aparência</CardTitle>
          </div>
          <CardDescription>Personalize o visual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Tema</p>
              <p className="text-xs text-muted-foreground">Use o botão no header para alternar</p>
            </div>
            <Badge variant="outline">Automático</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Idioma</p>
              <p className="text-xs text-muted-foreground">Interface do sistema</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Português (BR)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Segurança</CardTitle>
          </div>
          <CardDescription>Proteja sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Autenticação de dois fatores</p>
              <p className="text-xs text-muted-foreground">Segurança adicional na sua conta</p>
            </div>
            <Button variant="outline" size="sm">Ativar</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Alterar senha</p>
              <p className="text-xs text-muted-foreground">Última alteração: 30 dias atrás</p>
            </div>
            <Button variant="outline" size="sm">Alterar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ")
}
