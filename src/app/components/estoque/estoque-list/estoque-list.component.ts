import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstoqueDetalhesComponent } from '../estoque-detalhes/estoque-detalhes.component';
import { Estoque } from '../../../models/estoque';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EstoqueService } from '../../../services/estoque.service';
import { Mensagem } from '../../../models/mensagem';
import { Produto } from '../../../models/produto';
import { ProdutoService } from '../../../services/produto.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../models/usuario';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { EstoqueDescartar } from '../../../models/estoque-descartar';
import { EstoqueDescartarDetalhesComponent } from '../estoque-descartar-detalhes/estoque-descartar-detalhes.component';

@Component({
    selector: 'app-estoque-list',
    imports: [
        FormsModule,
        EstoqueDetalhesComponent,
        DatePipe,
        RouterLink,
        EstoqueDescartarDetalhesComponent,
    ],
    templateUrl: './estoque-list.component.html',
    styleUrl: './estoque-list.component.scss'
})
export class EstoqueListComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  listaEstoquesDescartadosOrginal: EstoqueDescartar[] = [];
  listaEstoquesDescartadosFiltrada: EstoqueDescartar[] = [];
  listaEstoquesOrginal: Estoque[] = [];
  listaEstoquesFiltrada: Estoque[] = [];
  listaProdutosOrginal: Produto[] = [];
  listaProdutosFiltrada: Produto[] = [];
  estoqueDescartar: EstoqueDescartar = new EstoqueDescartar();
  estoque: Estoque = new Estoque();
  usuario: Usuario = new Usuario();
  screenWidth!: boolean;

  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  estoqueService = inject(EstoqueService);
  globalService = inject(GlobalService);
  produtoService = inject(ProdutoService);
  modalRef!: NgbModalRef;

  indice!: number;
  tituloModal!: string;
  termoPesquisa!: '';
  ativo?: string = '';
  produtoNome?: string = '';
  lista: string = 'estoques'; // 'estoques' ou 'produtos'

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth >= 768;
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth >= 768;
    this.filtrarEstoques();

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }

  abrirModalDetalhes(estoque: Estoque, indice: number, modalDetalhes: any) {
    this.estoque = Object.assign({}, estoque);
    this.indice = indice;
    this.modalRef = this.modalService.open(modalDetalhes, {
      size: 'fullscreen',
    });
  }

  atualizarListaEstoque(menssagem: Mensagem) {
    this.modalService.dismissAll();
    this.defenirListar();
  }

  atualizarListaEstoqueDescartar(menssagem: Mensagem) {
    this.modalService.dismissAll();
    this.defenirListar();
  }

  descartarProduto(modalEstoque: any) {
    this.estoqueDescartar = new EstoqueDescartar();
    this.modalRef = this.modalService.open(modalEstoque, { size: 'lg' });
    this.tituloModal = 'Descartar Estoque';
  }

  cadastrarEstoque(modalEstoque: any) {
    this.estoque = new Estoque();
    this.modalRef = this.modalService.open(modalEstoque, { size: 'lg' });
    this.tituloModal = 'Cadastrar Estoque';
  }

  editarEstoque(modal: any, estoque: Estoque, indice: number) {
    this.estoque = Object.assign({}, estoque);
    this.indice = indice;
    this.modalRef = this.modalService.open(modal, { size: 'lg' });
    this.tituloModal = 'Editar Estoque';
  }

  ativarOuDesativarEstoque(estoque: Estoque) {
    this.estoqueService.ativarOuDesativarEstoque(estoque).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarEstoques();
      },
    });
  }

  defenirListar() {
    if (this.lista === 'produtos') {
      this.filtrarProdutos();
    } else if (this.lista === 'estoques') {
      this.filtrarEstoques();
    } else if (this.lista === 'estoquesDescartados') {
      this.filtrarEstoquesDescartados();
    } else if (this.lista === 'produtosDescartados') {
      this.filtrarProdutosDescartados();
    }
  }

  filtrarEstoques() {
    this.produtoNome = this.produtoNome?.toLocaleUpperCase();
    this.estoqueService.listarEstoques(this.produtoNome, this.ativo).subscribe({
      next: (lista) => {
        this.listaEstoquesOrginal = lista;
        this.listaEstoquesFiltrada = lista;
      },
      error: () => {
        this.toastr.error('Erro ao filtrar estoques.');
      },
    });
  }
  filtrarProdutos() {
    this.produtoNome = this.produtoNome?.toLocaleUpperCase();
    this.produtoService.listarProdutosEstoque(this.produtoNome).subscribe({
      next: (lista) => {
        this.listaProdutosOrginal = lista;
        this.listaProdutosFiltrada = lista;
      },
      error: () => {
        this.toastr.error('Erro ao listar produtos.');
      },
    });
  }
  filtrarEstoquesDescartados() {
    this.produtoNome = this.produtoNome?.toLocaleUpperCase();
    this.estoqueService.listarEstoquesDescartar(this.produtoNome).subscribe({
      next: (lista) => {
        this.listaEstoquesDescartadosOrginal = lista;
        this.listaEstoquesDescartadosFiltrada = lista;
      },
      error: () => {
        this.toastr.error('Erro ao filtrar estoques.');
      },
    });
  }
  filtrarProdutosDescartados() {
    this.produtoNome = this.produtoNome?.toLocaleUpperCase();
    this.produtoService
      .listarProdutosEstoqueDescartar(this.produtoNome)
      .subscribe({
        next: (lista) => {
          this.listaProdutosOrginal = lista;
          this.listaProdutosFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao listar produtos.');
        },
      });
  }
}
