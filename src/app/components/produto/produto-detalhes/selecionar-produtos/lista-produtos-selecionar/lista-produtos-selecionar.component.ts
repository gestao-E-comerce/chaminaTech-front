import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Produto } from '../../../../../models/produto';
import { Categoria } from '../../../../../models/categoria';
import { ToastrService } from 'ngx-toastr';
import { ProdutoService } from '../../../../../services/produto.service';
import { CategoriaService } from '../../../../../services/categoria.service';
import { FormsModule } from '@angular/forms';
import { Observacoes } from '../../../../../models/observacoes';

@Component({
  selector: 'app-lista-produtos-selecionar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lista-produtos-selecionar.component.html',
  styleUrl: './lista-produtos-selecionar.component.scss',
})
export class ListaProdutosSelecionarComponent {
  @Output() retorno = new EventEmitter<any>();
  listaProdutosOrginal: Produto[] = [];
  listaProdutosFiltrada: Produto[] = [];
  listaCategorias: Categoria[] = [];
  @Input() produto!: Produto;
  @Input() observacoes!: Observacoes;

  toastr = inject(ToastrService);
  produtoService = inject(ProdutoService);
  categoriaService = inject(CategoriaService);

  tituloModal!: string;
  indice!: number;
  ativo?: string = '';
  cardapio?: string = '';
  estocavel?: string = '';
  validarExestencia?: string = '';
  categoriaNome?: string = '';
  nome?: string = '';

  ngOnInit() {
    this.filtrarProdutos();
    this.listarCategorias();
  }
  listarCategorias() {
    this.categoriaService.listarCategorias().subscribe({
      next: (lista) => {
        this.listaCategorias = lista;
      },
    });
  }

  vincular(produto: Produto) {
    this.retorno.emit(produto);
  }

  filtrarProdutos() {
    this.nome = this.nome?.toLocaleUpperCase();
    this.produtoService
      .listarProdutos(
        'true',
        this.cardapio,
        this.estocavel,
        'true',
        this.categoriaNome,
        this.nome
      )
      .subscribe({
        next: (lista) => {
          if (this.produto || this.observacoes) {
            lista = lista.filter((produto) => {
              const jaFoiAdicionado =
                this.produto?.produtoCompostos?.some(
                  (pp) => pp.produtoComposto?.id === produto.id && pp.ativo === true
                ) ||
                this.observacoes?.observacaoProdutos?.some(
                  (om) => om.produto?.id === produto.id && om.ativo === true
                );
              const ehProdutoAtual =
                this.produto && this.produto.id === produto.id;

              return !jaFoiAdicionado && !ehProdutoAtual;
            });
          }
          this.listaProdutosOrginal = lista;
          this.listaProdutosFiltrada = lista;
        },
        error: () => {
          this.toastr.error('Erro ao filtrar produtos.');
        },
      });
  }
}
