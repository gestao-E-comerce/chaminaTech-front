import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { Mensagem } from '../../../models/mensagem';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PermissaoListaComponent } from '../../permissao/permissao-lista/permissao-lista.component';
import { AdminFuncionarioDetalhesComponent } from './admin-funcionario-detalhes/admin-funcionario-detalhes.component';
import { AdminFuncionario } from '../../../models/admin-funcionario';
import { AdminFuncionarioService } from '../../../services/admin-funcionario';

@Component({
  selector: 'app-admin-funcionario',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    PermissaoListaComponent,
    AdminFuncionarioDetalhesComponent
],
  templateUrl: './admin-funcionario.component.html',
  styleUrl: './admin-funcionario.component.scss',
})
export class AdminFuncionarioComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();

  listaAdminFuncionariosOrginal: AdminFuncionario[] = [];
  listaAdminFuncionariosFiltrada: AdminFuncionario[] = [];
  adminFuncionario!: AdminFuncionario;
  usuario!: Usuario;

  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  funcionarioService = inject(AdminFuncionarioService);
  globalService = inject(GlobalService);

  tituloModal!: string;
  ativo?: string = '';
  nome?: string = '';
  indice!: number;

  ngOnInit() {
    this.filtrarAdminFuncionarios();

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }

  atualizarListaAdminFuncionario(menssagem: Mensagem) {
    this.modalService.dismissAll();
    this.filtrarAdminFuncionarios();
  }

  cadastrarAdminFuncionario(modalAdminFuncionario: any) {
    this.adminFuncionario = new AdminFuncionario();
    this.modalService.open(modalAdminFuncionario, { size: 'lg' });
    this.tituloModal = 'Cadastrar Funcionário';
  }

  editarAdminFuncionario(modal: any, adminFuncionario: AdminFuncionario, indice: number) {
    this.adminFuncionario = Object.assign({}, adminFuncionario);
    this.indice = indice;

    this.modalService.open(modal, { size: 'lg' });
    this.tituloModal = 'Editar Funcionário';
  }

  deletarAdminFuncionario(modal: any, adminFuncionario: AdminFuncionario, indice: number) {
    this.adminFuncionario = Object.assign({}, adminFuncionario);
    this.indice = indice;

    this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Funcionário';
  }

  confirmarExclusaoAdminFuncionario(adminFuncionario: AdminFuncionario) {
    this.funcionarioService.deletar(adminFuncionario.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarAdminFuncionarios();
        this.modalService.dismissAll();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  ativarOuDesativarAdminFuncionario(funcionario: AdminFuncionario) {
    this.funcionarioService
      .ativarOuDesativarAdminFuncionario(funcionario)
      .subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.filtrarAdminFuncionarios();
        },
      });
  }

  filtrarAdminFuncionarios() {
    this.nome = this.nome?.toLocaleUpperCase();
    this.funcionarioService
      .listarAdminFuncionarios(this.nome, this.ativo)
      .subscribe({
        next: (lista) => {
          this.listaAdminFuncionariosOrginal = lista;
          this.listaAdminFuncionariosFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao filtrar funcionarios.');
        },
      });
  }
  abrirModalPermissaosList(modalListaPermissaos: any) {
    this.modalService.open(modalListaPermissaos, { size: 'lg' });
    this.tituloModal = 'Lista Permissaos';
  }
}
