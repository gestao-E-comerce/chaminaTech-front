import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { DepositoDetalhesComponent } from '../deposito-detalhes/deposito-detalhes.component';
import { FormsModule } from '@angular/forms';
import { Deposito } from '../../../models/deposito';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DepositoService } from '../../../services/deposito.service';
import { Mensagem } from '../../../models/mensagem';
import { Materia } from '../../../models/materia';
import { MateriaService } from '../../../services/materia.service';
import { Usuario } from '../../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { DepositoDescartarDetalhesComponent } from '../deposito-descartar-detalhes/deposito-descartar-detalhes.component';
import { DepositoDescartar } from '../../../models/deposito-descartar';

@Component({
    selector: 'app-deposito-list',
    imports: [
        FormsModule,
        DepositoDetalhesComponent,
        DatePipe,
        RouterLink,
        DepositoDescartarDetalhesComponent,
    ],
    templateUrl: './deposito-list.component.html',
    styleUrl: './deposito-list.component.scss'
})
export class DepositoListComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  listaDepositosDescartadosOrginal: DepositoDescartar[] = [];
  listaDepositosDescartadosFiltrada: DepositoDescartar[] = [];
  listaDepositosOrginal: Deposito[] = [];
  listaDepositosFiltrada: Deposito[] = [];
  listaMateriasOrginal: Materia[] = [];
  listaMateriasFiltrada: Materia[] = [];
  depositoDescartar: DepositoDescartar = new DepositoDescartar();
  deposito: Deposito = new Deposito();
  usuario: Usuario = new Usuario();
  screenWidth!: boolean;

  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  depositoService = inject(DepositoService);
  globalService = inject(GlobalService);
  materiaService = inject(MateriaService);
  modalRef!: NgbModalRef;

  indice!: number;
  tituloModal!: string;
  termoPesquisa!: '';
  ativo?: string = '';
  materiaNome?: string = '';
  lista: string = 'depositos'; // 'depositos' ou 'materias'

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth >= 768;
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth >= 768;
    this.filtrarDepositos();

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }
  abrirModalDetalhes(deposito: Deposito, indice: number, modalDetalhes: any) {
    this.deposito = Object.assign({}, deposito);
    this.indice = indice;
    this.modalRef = this.modalService.open(modalDetalhes, {
      size: 'fullscreen',
    });
  }

  atualizarListaDeposito(menssagem: Mensagem) {
    this.modalService.dismissAll();
    this.defenirListar();
  }

  atualizarListaDepositoDescartar(menssagem: Mensagem) {
    this.modalService.dismissAll();
    this.defenirListar();
  }

  descartarMateria(modalDeposito: any) {
    this.depositoDescartar = new DepositoDescartar();
    this.modalRef = this.modalService.open(modalDeposito, { size: 'lg' });
    this.tituloModal = 'Descartar Deposito';
  }
  cadastrarDeposito(modalDeposito: any) {
    this.deposito = new Deposito();
    this.modalRef = this.modalService.open(modalDeposito, { size: 'lg' });
    this.tituloModal = 'Cadastrar Deposito';
  }

  editarDeposito(modal: any, deposito: Deposito, indice: number) {
    this.deposito = Object.assign({}, deposito);
    this.indice = indice;
    this.modalRef = this.modalService.open(modal, { size: 'lg' });
    this.tituloModal = 'Editar Deposito';
  }

  ativarOuDesativarDeposito(deposito: Deposito) {
    this.depositoService.ativarOuDesativarDeposito(deposito).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarDepositos();
      },
    });
  }

  defenirListar() {
    if (this.lista === 'materias') {
      this.filtrarMaterias();
    } else if (this.lista === 'depositos') {
      this.filtrarDepositos();
    } else if (this.lista === 'depositosDescartados') {
      this.filtrarDepositosDescartados();
    } else if (this.lista === 'materiasDescartadas') {
      this.filtrarMateriasDescartados();
    }
  }

  filtrarDepositos() {
    this.materiaNome = this.materiaNome?.toLocaleUpperCase();
    this.depositoService
      .listarDepositos(this.materiaNome, this.ativo)
      .subscribe({
        next: (lista) => {
          this.listaDepositosOrginal = lista;
          this.listaDepositosFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao filtrar depositos.');
        },
      });
  }
  filtrarMaterias() {
    this.materiaNome = this.materiaNome?.toLocaleUpperCase();
    this.materiaService.listarMateriasDeposito(this.materiaNome).subscribe({
      next: (lista) => {
        this.listaMateriasOrginal = lista;
        this.listaMateriasFiltrada = lista;
      },
      error: () => {
        this.toastr.error('Erro ao listar matérias.');
      },
    });
  }
  filtrarDepositosDescartados() {
    this.materiaNome = this.materiaNome?.toLocaleUpperCase();
    this.depositoService
      .listarDepositosDescartados(this.materiaNome)
      .subscribe({
        next: (lista) => {
          this.listaDepositosDescartadosOrginal = lista;
          this.listaDepositosDescartadosFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao filtrar depositos.');
        },
      });
  }
  filtrarMateriasDescartados() {
    this.materiaNome = this.materiaNome?.toLocaleUpperCase();
    this.materiaService
      .listarMateriasDepositoDescartar(this.materiaNome)
      .subscribe({
        next: (lista) => {
          this.listaMateriasOrginal = lista;
          this.listaMateriasFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao listar matérias.');
        },
      });
  }
}
