import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoVenda } from '../../../../models/produto-venda';
import { Categoria } from '../../../../models/categoria';
import { CategoriaService } from '../../../../services/categoria.service';
import { Observacoes } from '../../../../models/observacoes';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-produto-observacao',
    imports: [FormsModule, NgClass],
    templateUrl: './produto-observacao.component.html',
    styleUrl: './produto-observacao.component.scss'
})
export class ProdutoObservacaoComponent {
  @Output() retorno = new EventEmitter<any>();
  @Input() produtoVenda: ProdutoVenda = new ProdutoVenda();
  categoria: Categoria = new Categoria();

  categoriaService = inject(CategoriaService);
  toastr = inject(ToastrService);

  observacoesSelecionadas: Observacoes[] = [];

  ngOnInit() {
    if (this.produtoVenda.observacoesProdutoVenda?.length) {
      this.observacoesSelecionadas = [
        ...this.produtoVenda.observacoesProdutoVenda,
      ];
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
    const obrigatorio = this.categoria.obsObrigatotio === true;

    const temObservacaoValida = this.observacoesSelecionadas.some(
      (obs) => obs.valor !== null && obs.valor !== undefined
    );

    if (obrigatorio && !temObservacaoValida) {
      this.toastr.warning(
        'Essa categoria exige pelo menos uma observação!'
      );
      return;
    }
    this.retorno.emit(this.produtoVenda);
  }
}
