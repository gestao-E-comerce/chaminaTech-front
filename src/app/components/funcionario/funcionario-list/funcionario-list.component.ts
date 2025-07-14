import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FuncionarioDetalhesComponent } from '../funcionario-detalhes/funcionario-detalhes.component';
import { FormsModule } from '@angular/forms';
import { Funcionario } from '../../../models/funcionario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FuncionarioService } from '../../../services/funcionario.service';
import { Mensagem } from '../../../models/mensagem';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PermissaoListaComponent } from '../../permissao/permissao-lista/permissao-lista.component';
import { Usuario } from '../../../models/usuario';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { Matriz } from '../../../models/matriz';

@Component({
    selector: 'app-funcionario-list',
    imports: [
        FormsModule,
        FuncionarioDetalhesComponent,
        RouterLink,
        PermissaoListaComponent,
    ],
    templateUrl: './funcionario-list.component.html',
    styleUrl: './funcionario-list.component.scss'
})
export class FuncionarioListComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();

  listaFuncionariosOrginal: Funcionario[] = [];
  listaFuncionariosFiltrada: Funcionario[] = [];
  funcionario!: Funcionario;
  usuario!: Usuario;
  matriz!: Matriz;

  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  funcionarioService = inject(FuncionarioService);
  globalService = inject(GlobalService);

  tituloModal!: string;
  ativo?: string | null = null;
  nome?: string = '';
  indice!: number;

  ngOnInit() {
    this.filtrarFuncionarios();

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });

    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
        },
      });
  }

  atualizarListaFuncionario(menssagem: Mensagem) {
    this.modalService.dismissAll();
    this.filtrarFuncionarios();
  }

  cadastrarFuncionario(modalFuncionario: any) {
    this.funcionario = new Funcionario();
    this.modalService.open(modalFuncionario, { size: 'lg' });
    this.tituloModal = 'Cadastrar Funcionário';
  }

  editarFuncionario(modal: any, funcionario: Funcionario, indice: number) {
    this.funcionario = Object.assign({}, funcionario);
    this.indice = indice;

    this.modalService.open(modal, { size: 'lg' });
    this.tituloModal = 'Editar Funcionário';
  }

  deletarFuncionario(modal: any, funcionario: Funcionario, indice: number) {
    this.funcionario = Object.assign({}, funcionario);
    this.indice = indice;

    this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Funcionário';
  }

  confirmarExclusaoFuncionario(funcionario: Funcionario) {
    this.funcionarioService.deletar(funcionario.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarFuncionarios();
        this.modalService.dismissAll();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  ativarOuDesativarFuncionario(funcionario: Funcionario) {
    this.funcionarioService
      .ativarOuDesativarFuncionario(funcionario)
      .subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.filtrarFuncionarios();
        },
        error: (erro) => {
          this.toastr.error(erro.error.mensagem);
        },
      });
  }

  filtrarFuncionarios() {
    this.nome = this.nome?.toLocaleUpperCase();
    this.funcionarioService
      .listarFuncionarios(this.nome, this.ativo)
      .subscribe({
        next: (lista) => {
          this.listaFuncionariosOrginal = lista;
          this.listaFuncionariosFiltrada = lista;
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
