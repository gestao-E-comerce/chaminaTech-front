import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoVenda } from '../../../../../models/produto-venda';
import { Categoria } from '../../../../../models/categoria';
import { CategoriaService } from '../../../../../services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { Observacoes } from '../../../../../models/observacoes';

@Component({
    selector: 'app-produto-observacao-touch-deve',
    imports: [FormsModule, NgClass],
    templateUrl: './produto-observacao-touch-deve.component.html',
    styleUrl: './produto-observacao-touch-deve.component.scss'
})
export class ProdutoObservacaoTouchDeveComponent {
  @Output() retorno = new EventEmitter<any>();
  @Input() produtoVenda: ProdutoVenda = new ProdutoVenda();
  categoria: Categoria = new Categoria();

  categoriaService = inject(CategoriaService);
  toastr = inject(ToastrService);

  observacoesSelecionadas: Observacoes[] = [];
  quantidadeObs: { [idObs: number]: number } = {};

  ngOnInit() {
    if (this.produtoVenda.observacoesProdutoVenda?.length) {
      this.observacoesSelecionadas = [
        ...this.produtoVenda.observacoesProdutoVenda,
      ];
    }
    if (this.produtoVenda.observacoesProdutoVenda?.length) {
      for (const obs of this.produtoVenda.observacoesProdutoVenda) {
        this.quantidadeObs[obs.id] = (this.quantidadeObs[obs.id] || 0) + 1;
      }
    }

    if (this.produtoVenda.produto.categoria.id) {
      this.categoriaService
        .buscarPorId(this.produtoVenda.produto.categoria.id)
        .subscribe({
          next: (categoriaEncontrada) => {
            this.categoria = categoriaEncontrada;
          },
        });
    }
  }
  adicionarObs(obs: Observacoes) {
    const totalAtual = this.produtoVenda.observacoesProdutoVenda?.length || 0;
    const limite = this.categoria.maxObs ?? 0;

    if (limite > 0 && totalAtual >= limite) {
      this.toastr.warning(`Limite de ${limite} observações atingido.`);
      return;
    }

    if (!this.produtoVenda.observacoesProdutoVenda) {
      this.produtoVenda.observacoesProdutoVenda = [];
    }

    this.produtoVenda.observacoesProdutoVenda.push(obs);
    this.quantidadeObs[obs.id] = (this.quantidadeObs[obs.id] || 0) + 1;
  }

  removerObs(obs: Observacoes) {
    if (!this.produtoVenda.observacoesProdutoVenda?.length) return;

    const index = this.produtoVenda.observacoesProdutoVenda.findIndex(
      (o) => o.id === obs.id
    );
    if (index !== -1) {
      this.produtoVenda.observacoesProdutoVenda.splice(index, 1);
      this.quantidadeObs[obs.id]--;

      if (this.quantidadeObs[obs.id] <= 0) {
        delete this.quantidadeObs[obs.id];
      }
    }
  }

  getQuantidade(obs: Observacoes): number {
    return this.quantidadeObs[obs.id] || 0;
  }
  isObservacaoSelecionada(observacao: Observacoes): boolean {
    return this.observacoesSelecionadas.some((o) => o.id === observacao.id);
  }

  colar(observacao: Observacoes) {
    const index = this.observacoesSelecionadas.findIndex(
      (o) => o.id === observacao.id
    );

    if (index > -1) {
      this.observacoesSelecionadas.splice(index, 1);
    } else {
      // Verifica se atingiu o limite
      const limite = this.categoria.maxObs ?? 0;
      if (limite > 0 && this.observacoesSelecionadas.length >= limite) {
        this.toastr.warning(
          `Limite de ${limite} observações atingido para esta categoria.`
        );
        return;
      }

      this.observacoesSelecionadas.push(observacao);
    }

    this.produtoVenda.observacoesProdutoVenda = [
      ...this.observacoesSelecionadas,
    ];
  }
  salvar() {
    // const obrigatorio = this.categoria.obsObrigatotio === true;

    // const temObservacaoValida = this.observacoesSelecionadas.some(
    //   (obs) => obs.valor !== null && obs.valor !== undefined
    // );

    // if (obrigatorio && !temObservacaoValida) {
    //   this.toastr.warning('Essa categoria exige pelo menos uma observação!');
    //   return;
    // }
    const obrigatorio = this.categoria.obsObrigatotio === true;
    const temValor = this.produtoVenda.observacoesProdutoVenda?.some(
      (o) => o.valor != null
    );

    if (obrigatorio && !temValor) {
      this.toastr.warning(
        'Essa categoria exige pelo menos uma observação com valor!'
      );
      return;
    }
    this.retorno.emit(this.produtoVenda);
  }
}
