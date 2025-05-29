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
import { CaixaConfiguracaoComponent } from './components/caixa-configuracao/caixa-configuracao.component';
import { ProdutoListComponent } from './components/produto/produto-list/produto-list.component';
import { CategoriaListComponent } from './components/categoria/categoria-list/categoria-list.component';
import { confTelaGuard } from './guards/conf-tela.guard';
import { AdminConfigComponent } from './components/admin/admin-config/admin-config.component';
import { AdminFuncionarioComponent } from './components/admin/admin-funcionario/admin-funcionario.component';
import { AuditoriaComponent } from './components/auditoria/auditoria.component';

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
    path: 'config',
    component: ConfiguracaoComponent,
    canActivate: [rotaguardGuard],
    canDeactivate: [confTelaGuard],
  },
  {
    path: 'caixaConf',
    component: CaixaConfiguracaoComponent,
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
