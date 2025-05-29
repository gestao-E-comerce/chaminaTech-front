import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Produto } from '../../../models/produto';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProdutoService } from '../../../services/produto.service';
import { Mensagem } from '../../../models/mensagem';
import { ProdutoDetalhesComponent } from '../produto-detalhes/produto-detalhes.component';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { NgClass } from '@angular/common';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { Matriz } from '../../../models/matriz';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [FormsModule, ProdutoDetalhesComponent, RouterLink, NgClass],
  templateUrl: './produto-list.component.html',
  styleUrl: './produto-list.component.scss',
})
export class ProdutoListComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  @Input() modoVincular: boolean = false;
  listaProdutosOrginal: Produto[] = [];
  listaProdutosFiltrada: Produto[] = [];
  listaCategorias: Categoria[] = [];
  produto!: Produto;
  usuario!: Usuario;
  matriz!: Matriz;
  screenWidth!: boolean;

  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  produtoService = inject(ProdutoService);
  categoriaService = inject(CategoriaService);
  globalService = inject(GlobalService);
  modalRef!: NgbModalRef;

  tituloModal!: string;
  indice!: number;
  ativo?: string = '';
  cardapio?: string = '';
  estocavel?: string = '';
  validarExestencia?: string = '';
  categoriaNome?: string = '';
  nome?: string = '';

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth >= 768;
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth >= 768;
    this.filtrarProdutos();
    this.listarCategorias();

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
  abrirModalDetalhes(produto: Produto, indice: number, modalDetalhes: any) {
    this.produto = Object.assign({}, produto);
    this.indice = indice;
    this.modalRef = this.modalService.open(modalDetalhes, {
      size: 'fullscreen',
    });
  }
  listarCategorias() {
    this.categoriaService.listarCategorias().subscribe({
      next: (lista) => {
        this.listaCategorias = lista;
      },
    });
  }

  atualizarListaProduto(menssagem: Mensagem) {
    this.modalRef.close();
    this.filtrarProdutos();
  }

  cadastrarProduto(modalProduto: any) {
    this.produto = new Produto();
    this.modalRef = this.modalService.open(modalProduto, {
      size: 'fullscreen',
      scrollable: true,
    });

    this.tituloModal = 'Cadastrar Produto';
  }

  editarProduto(modal: any, produto: Produto, indice: number) {
    this.produto = Object.assign({}, produto);
    this.indice = indice;

    this.modalRef = this.modalService.open(modal, {
      size: 'fullscreen',
      scrollable: true,
    });
    this.tituloModal = 'Editar Produto';
  }

  deletarProduto(modal: any, produto: Produto, indice: number) {
    this.produto = Object.assign({}, produto);
    this.indice = indice;

    this.modalRef = this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Produto';
  }

  copiar(modal: any, produto: Produto) {
    this.produto = {
      ...produto,
      id: undefined as unknown as number,
      produtoMaterias:
        produto.produtoMaterias?.map((pm) => ({
          ...pm,
          id: undefined as unknown as number,
          produto: undefined as unknown as Produto,
        })) || [],
      produtoCompostos:
        produto.produtoCompostos?.map((pc) => ({
          ...pc,
          id: undefined as unknown as number,
          produto: undefined as unknown as Produto,
        })) || [],
    };

    this.modalRef = this.modalService.open(modal, {
      size: 'fullscreen',
      scrollable: true,
    });
    this.tituloModal = 'Copiar Produto';
  }

  confirmarExclusaoProduto(produto: Produto) {
    this.produtoService.deletar(produto.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarProdutos();
        this.modalService.dismissAll();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  ativarOuDesativarProduto(produto: Produto) {
    this.produtoService.ativarOuDesativarProduto(produto).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarProdutos();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  vincular(produto: Produto) {
    this.retorno.emit(produto);
  }

  filtrarProdutos() {
    if (this.modoVincular) {
      this.ativo = 'true';
      this.validarExestencia = 'true';
      this.estocavel = 'true';
    }
    this.nome = this.nome?.toLocaleUpperCase();
    this.produtoService
      .listarProdutos(
        this.ativo,
        this.cardapio,
        this.estocavel,
        this.validarExestencia,
        this.categoriaNome,
        this.nome
      )
      .subscribe({
        next: (lista) => {
          this.listaProdutosOrginal = lista;
          this.listaProdutosFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao filtrar produtos.');
        },
      });
  }
}
