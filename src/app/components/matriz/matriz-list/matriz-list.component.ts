import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Matriz } from '../../../models/matriz';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mensagem } from '../../../models/mensagem';
import { MatrizDetalhesComponent } from '../matriz-detalhes/matriz-detalhes.component';
import { AdminService } from '../../../services/admin.service';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { MatrizService } from '../../../services/matriz.service';
import { PermissaoListaComponent } from '../../permissao/permissao-lista/permissao-lista.component';

@Component({
  selector: 'app-matriz-list',
  standalone: true,
  imports: [
    MatrizDetalhesComponent,
    FormsModule,
    RouterLink,
    PermissaoListaComponent,
  ],
  templateUrl: './matriz-list.component.html',
  styleUrl: './matriz-list.component.scss',
})
export class MatrizListComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();

  listaMatrizesOrginal: Matriz[] = [];
  listaMatrizesFiltrada: Matriz[] = [];
  matriz: Matriz = new Matriz();
  usuario!: Usuario;

  globalService = inject(GlobalService);
  adminService = inject(AdminService);
  matrizService = inject(MatrizService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);

  tituloModal!: string;
  ativo?: string = '';
  nome?: string = '';

  ngOnInit() {
    this.filtrarMatrizes();

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }

  filtrarMatrizes() {
    this.nome = this.nome?.toLocaleUpperCase();
    this.adminService
      .listarMatrizes(this.nome, this.ativo)
      .subscribe({
        next: (lista) => {
          this.listaMatrizesOrginal = lista;
          this.listaMatrizesFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao filtrar matrizes.');
        },
      });
  }

  atualizarListaMatriz(menssagem: Mensagem) {
    this.modalService.dismissAll();
    this.filtrarMatrizes();
    this.retorno.emit('ok');
  }

  ativarOuDesativarMatriz(matriz: Matriz) {
    this.matrizService.ativarOuDesativarMatriz(matriz).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarMatrizes();
      },
    });
  }

  cadastrarMatriz(modalMatriz: any) {
    this.matriz = new Matriz();
    this.modalService.open(modalMatriz, { size: 'fullscreen' });

    this.tituloModal = 'Cadastrar Matriz';
  }

  editarMatriz(modal: any, matriz: Matriz, indice: number) {
    this.matriz = Object.assign({}, matriz);

    this.modalService.open(modal, { size: 'fullscreen' });
    this.tituloModal = 'Editar Matriz';
  }
  abrirModalPermissaosList(modalListaPermissaos: any) {
    this.modalService.open(modalListaPermissaos, { size: 'lg' });
    this.tituloModal = 'Lista Permissaos';
  }
}
