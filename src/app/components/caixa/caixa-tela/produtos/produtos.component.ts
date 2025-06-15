import { Component, inject, Input } from '@angular/core';
import { Venda } from '../../../../models/venda';
import { Observacoes } from '../../../../models/observacoes';
import { FormsModule } from '@angular/forms';
import { ProdutoVenda } from '../../../../models/produto-venda';
import { ImpressaoService } from '../../../../services/impressao.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss',
})
export class ProdutosComponent {
  @Input() modalRef!: NgbModalRef;
  @Input() venda!: Venda;

  impressaoService = inject(ImpressaoService);
  toastr = inject(ToastrService);

  isSalvarDisabled: boolean = true;
  tudoSelecionado: boolean = false;
  produtosCopia: ProdutoVenda[] = [];

  ngOnInit() {
    this.produtosCopia = this.venda.produtoVendas.map(produto => ({
      ...produto,
      produto: { ...produto.produto },
      selecionado: false
    }));
  }

  marcarTodos(event: any) {
    this.tudoSelecionado = event.target.checked;
    this.produtosCopia.forEach(produto => produto.selecionado = this.tudoSelecionado);
    this.updateSalvarDisabledState();
  }

  atualizarQuantidade(produto: ProdutoVenda) {
    this.tudoSelecionado = this.produtosCopia.every(p => p.selecionado);
    this.updateSalvarDisabledState();
  }

  updateSalvarDisabledState() {
    this.isSalvarDisabled = !this.produtosCopia.some(produto => produto.selecionado);
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
    const produtosSelecionados = this.produtosCopia.filter(produto => produto.selecionado);
    if (produtosSelecionados.length > 0) {
      this.impressaoService.imprimirProdutos({ venda: this.venda, produtos: produtosSelecionados }).subscribe({
          next: (mensagem) => {
            this.toastr.success(mensagem.mensagem);
            this.modalRef.close();
          }
    });
    }
  }
}
