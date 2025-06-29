import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { rotaguardGuard } from './guards/rotaguard.guard';
import { MatrizListComponent } from './components/matriz/matriz-list/matriz-list.component';
import { MateriaListComponent } from './components/materia/materia-list/materia-list.component';
import { DepositoListComponent } from './components/deposito/deposito-list/deposito-list.component';
import { EstoqueListComponent } from './components/estoque/estoque-list/estoque-list.component';
import { FuncionarioListComponent } from './components/funcionario/funcionario-list/funcionario-list.component';
import { CaixaComponent } from './components/caixa/caixa.component';
import { ClienteListComponent } from './components/cliente/cliente-list/cliente-list.component';
import { ConfiguracaoComponent } from './components/matriz/configuracao/configuracao.component';
import { CaixaTelaComponent } from './components/caixa/caixa-tela/caixa-tela.component';
import { caixaTelaGuard } from './guards/caixa-tela.guard';
import { ProdutoListComponent } from './components/produto/produto-list/produto-list.component';
import { CategoriaListComponent } from './components/categoria/categoria-list/categoria-list.component';
import { AdminConfigComponent } from './components/admin/admin-config/admin-config.component';
import { AdminFuncionarioComponent } from './components/admin/admin-funcionario/admin-funcionario.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';
import { ConfiguracaoPerfilComponent } from './components/matriz/configuracao/configuracao-perfil/configuracao-perfil.component';
import { ConfiguracaoEntregaComponent } from './components/matriz/configuracao/configuracao-entrega/configuracao-entrega.component';
import { ConfiguracaoRetiradaComponent } from './components/matriz/configuracao/configuracao-retirada/configuracao-retirada.component';
import { ConfiguracaoImpressaoComponent } from './components/matriz/configuracao/configuracao-impressao/configuracao-impressao.component';
import { ConfiguracaoTaxaServicoComponent } from './components/matriz/configuracao/configuracao-taxa-servico/configuracao-taxa-servico.component';
import { confTelaGuard } from './guards/conf-tela.guard';
import { HistoricosComponent } from './components/historicos/historicos.component';
import { HistoricoCaixaComponent } from './components/historicos/historico-caixa/historico-caixa.component';
import { HistoricoVendaComponent } from './components/historicos/historico-venda/historico-venda.component';
import { HistoricoConsumoComponent } from './components/historicos/historico-consumo/historico-consumo.component';
import { RelatorioComponent } from './components/relatorio/relatorio.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'caixa', redirectTo: 'home', pathMatch: 'full' },
  { path: 'venda', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [rotaguardGuard] },
  {
    path: 'matriz',
    component: MatrizListComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'produto',
    component: ProdutoListComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'categoria',
    component: CategoriaListComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'materia',
    component: MateriaListComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'deposito',
    component: DepositoListComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'estoque',
    component: EstoqueListComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'funcionario',
    component: FuncionarioListComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'cliente',
    component: ClienteListComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: '',
    component: ConfiguracaoComponent,
    canActivate: [rotaguardGuard],
    canDeactivate: [confTelaGuard],
    children: [
      {
        path: 'config/perfil',
        component: ConfiguracaoPerfilComponent,
        canActivate: [rotaguardGuard],
        canDeactivate: [confTelaGuard],
      },
      {
        path: 'config/entrega',
        component: ConfiguracaoEntregaComponent,
        canActivate: [rotaguardGuard],
        canDeactivate: [confTelaGuard],
      },
      {
        path: 'config/retirada',
        component: ConfiguracaoRetiradaComponent,
        canActivate: [rotaguardGuard],
        canDeactivate: [confTelaGuard],
      },
      {
        path: 'config/impressao',
        component: ConfiguracaoImpressaoComponent,
        canActivate: [rotaguardGuard],
        canDeactivate: [confTelaGuard],
      },
      {
        path: 'config/taxa',
        component: ConfiguracaoTaxaServicoComponent,
        canActivate: [rotaguardGuard],
        canDeactivate: [confTelaGuard],
      },
    ],
  },
  {
    path: 'relatorios',
    component: RelatorioComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'historicos',
    component: HistoricosComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'historicos/hisCaixas',
    component: HistoricoCaixaComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'historicos/hisVendas',
    component: HistoricoVendaComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'historicos/hisConsumos',
    component: HistoricoConsumoComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'caixa',
    component: CaixaComponent,
    canActivate: [rotaguardGuard],
    children: [
      {
        path: ':tipoCaixa',
        component: CaixaTelaComponent,
        canActivate: [rotaguardGuard],
        canDeactivate: [caixaTelaGuard],
      },
    ],
  },
  {
    path: 'venda',
    component: CaixaComponent,
    canActivate: [rotaguardGuard],
    children: [
      {
        path: ':tipoCaixa',
        component: CaixaTelaComponent,
        canActivate: [rotaguardGuard],
        canDeactivate: [caixaTelaGuard],
      },
    ],
  },
  {
    path: 'matriz',
    component: MatrizListComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'conf',
    component: AdminConfigComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'funcionarios',
    component: AdminFuncionarioComponent,
    canActivate: [rotaguardGuard],
  },
  {
    path: 'audit',
    component: AuditoriaComponent,
    canActivate: [rotaguardGuard],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
