import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoVenda } from '../../../../../models/produto-venda';
import { Categoria } from '../../../../../models/categoria';
import { CategoriaService } from '../../../../../services/categoria.service';
import { Observacoes } from '../../../../../models/observacoes';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-produto-observacao-touch',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './produto-observacao-touch.component.html',
  styleUrl: './produto-observacao-touch.component.scss',
})
export class ProdutoObservacaoTouchComponent {
  @Output() retorno = new EventEmitter<any>();
  @Input() produtosVendas: ProdutoVenda[] = [];

  categoria: Categoria = new Categoria();
  categoriaService = inject(CategoriaService);
  toastr = inject(ToastrService);

  observacoesSelecionadas: Observacoes[] = [];
  observacaoManual: string = '';
  produtosSelecionados: ProdutoVenda[] = [];

  ngOnInit() {
    if (this.produtosVendas.length) {
      const primeiraProduto = this.produtosVendas[0];
      if (primeiraProduto.produto?.categoria?.id) {
        this.categoriaService
          .buscarPorId(primeiraProduto.produto.categoria.id)
          .subscribe({
            next: (categoriaEncontrada) => {
              this.categoria = categoriaEncontrada;
              if (this.produtosVendas.length === 1) {
                this.produtosSelecionados = [...this.produtosVendas];
              }
            },
          });
      }
    }
  }

  selecionarProdutoVenda(produto: ProdutoVenda) {
    const index = this.produtosSelecionados.findIndex((p) => p === produto);
    if (index > -1) {
      this.produtosSelecionados.splice(index, 1);
    } else {
      this.produtosSelecionados.push(produto);
    }
  }

  isProdutoSelecionado(produto: ProdutoVenda): boolean {
    return this.produtosSelecionados.includes(produto);
  }

  isObservacaoSelecionada(observacao: Observacoes): boolean {
    return this.observacoesSelecionadas.some((o) => o.id === observacao.id);
  }

  selecionarObservacao(observacao: Observacoes) {
    const index = this.observacoesSelecionadas.findIndex(
      (o) => o.id === observacao.id
    );

    if (index > -1) {
      this.observacoesSelecionadas.splice(index, 1);
    } else {
      this.observacoesSelecionadas.push(observacao);
    }
  }

  getObservacoesFormatadas(produto: ProdutoVenda): string {
    const observacoesLista =
      produto.observacoesProdutoVenda
        ?.map((o: Observacoes) => o.observacao)
        .join(', ') || '';
    const observacaoIndividual = produto.observacaoProdutoVenda
      ? (observacoesLista ? ', ' : '') + produto.observacaoProdutoVenda
      : '';
    return observacoesLista + observacaoIndividual;
  }

  salvar() {
    if (!this.produtosSelecionados.length) {
      this.toastr.error('Selecione pelo menos um produto antes de salvar!');
      return;
    }

    this.retorno.emit({
      observacoesSelecionadas: [...this.observacoesSelecionadas],
      observacaoManual: this.observacaoManual,
      produtosSelecionados: [...this.produtosSelecionados],
    });
  }
}
