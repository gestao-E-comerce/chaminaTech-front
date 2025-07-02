import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Produto } from '../../../../models/produto';
import { CategoriaService } from '../../../../services/categoria.service';
import { ProdutoService } from '../../../../services/produto.service';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from '../../../../models/categoria';

@Component({
    selector: 'app-selecionar-produtos',
    imports: [FormsModule, NgClass],
    templateUrl: './selecionar-produtos.component.html',
    styleUrl: './selecionar-produtos.component.scss'
})
export class SelecionarProdutosComponent implements OnInit {
  @ViewChild('campoPesquisa', { static: false })
  campoPesquisa!: ElementRef<HTMLInputElement>;
  @Output() retorno = new EventEmitter<Produto>();
  @Input() produto: Produto = new Produto();

  categoriaService = inject(CategoriaService);
  produtoService = inject(ProdutoService);
  toastr = inject(ToastrService);

  categoriaSelecionada: Categoria | null = null;
  indiceSelecionado: number = -1;

  listaCategorias: Categoria[] = [];
  listaProdutosFiltrada: Produto[] = [];
  listaProdutosOrginal: Produto[] = [];
  ativo?: string = '';
  cardapio?: string = '';
  nome?: string = '';
  estocavel?: string = '';
  validarExestencia?: string = '';
  categoriaNome?: string = '';

  ngOnInit() {
    this.focoCampoPesquisa();
    this.filtrarProdutos();
    this.carregarCategorias();
  }
  focoCampoPesquisa() {
    setTimeout(() => {
      if (this.campoPesquisa && this.campoPesquisa.nativeElement) {
        this.campoPesquisa.nativeElement.focus();
        this.campoPesquisa.nativeElement.value = '';
      }
    }, 0);
  }
  carregarCategorias() {
    this.categoriaService.listarCategorias((this.ativo = 'true')).subscribe({
      next: (lista) => {
        this.listaCategorias = lista;
      },
    });
  }
  filtrarPorCategoria(categoria: Categoria) {
    this.categoriaSelecionada = categoria;
    this.categoriaNome = categoria.nome;
    this.filtrarProdutos();
  }
  removerFiltroCategoria() {
    this.categoriaSelecionada = null;
    this.listaProdutosFiltrada = [...this.listaProdutosOrginal];
    this.indiceSelecionado = -1;
  }
  selecionarProduto(produto: Produto) {
    this.produto = produto;
    this.retorno.emit(this.produto);
  }
  clonarProdutoSelecionado() {
    if (
      this.indiceSelecionado >= 0 &&
      this.indiceSelecionado < this.listaProdutosFiltrada.length
    ) {
      const produtoClonado = {
        ...this.listaProdutosFiltrada[this.indiceSelecionado],
      }; // Clona o objeto
      this.retorno.emit(produtoClonado);
    }
  }
  filtrarProdutos() {
    this.nome = this.nome?.toLocaleUpperCase();
    this.produtoService
      .listarProdutos(
        'true',
        'true',
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
  navegarLista(event: KeyboardEvent) {
    if (this.listaProdutosFiltrada.length === 0) return;

    switch (event.key) {
      case 'ArrowDown': // Seta para baixo
        event.preventDefault();
        if (this.indiceSelecionado < this.listaProdutosFiltrada.length - 1) {
          this.indiceSelecionado++;
        }
        break;

      case 'ArrowUp': // Seta para cima
        event.preventDefault();
        if (this.indiceSelecionado > 0) {
          this.indiceSelecionado--;
        }
        break;

      case 'Enter': // Enter
        event.preventDefault();
        if (
          this.indiceSelecionado === -1 &&
          this.listaProdutosFiltrada.length > 0
        ) {
          // Se ainda não há seleção, foca no primeiro resultado
          this.indiceSelecionado = 0;
        } else {
          this.clonarProdutoSelecionado();
        }
        break;
    }
  }
}
