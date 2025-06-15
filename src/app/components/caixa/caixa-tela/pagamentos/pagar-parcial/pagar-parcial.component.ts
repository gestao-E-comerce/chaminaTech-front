import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Venda } from '../../../../../models/venda';
import { Observacoes } from '../../../../../models/observacoes';
import { ProdutoVenda } from '../../../../../models/produto-venda';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pagar-parcial',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagar-parcial.component.html',
  styleUrl: './pagar-parcial.component.scss',
})
export class PagarParcialComponent implements OnInit {
  @Output() retorno = new EventEmitter<{ venda: Venda; vendaParcial: Venda }>();
  @Input() venda: Venda = new Venda();
  @Input() vendaParcial: Venda = new Venda();
  isSalvarDisabled: boolean = true;

  toastr = inject(ToastrService);

  ngOnInit() {
    setTimeout(() => {
      this.venda.produtoVendas.forEach((produtoVenda) => {
        produtoVenda.quantidadeTransferir = 0;
        produtoVenda.selecionado = false;
      });
      this.updateSalvarDisabledState();
    }, 0);
  }
  incrementarQuantidade(produtoVenda: any) {
    if (produtoVenda.quantidadeTransferir < produtoVenda.quantidade) {
      produtoVenda.quantidadeTransferir++;
      this.updateSalvarDisabledState();
    }
    this.atualizarSelecionado(produtoVenda);
  }
  decrementarQuantidade(produtoVenda: any) {
    if (produtoVenda.quantidadeTransferir > 0) {
      produtoVenda.quantidadeTransferir--;
      this.updateSalvarDisabledState();
    }
    this.atualizarSelecionado(produtoVenda);
  }
  atualizarSelecionado(produtoVenda: any) {
    produtoVenda.selecionado =
      produtoVenda.quantidadeTransferir === produtoVenda.quantidade;
    this.updateSalvarDisabledState();
  }
  atualizarQuantidadeTransferir(produtoVenda: any) {
    if (produtoVenda.selecionado) {
      produtoVenda.quantidadeTransferir = produtoVenda.quantidade;
    } else {
      produtoVenda.quantidadeTransferir = 0;
    }
    this.updateSalvarDisabledState();
  }
  updateSalvarDisabledState() {
    const totalItens = this.venda.produtoVendas.reduce(
      (acc, produto) => acc + produto.quantidade,
      0
    );

    const totalSelecionados = this.venda.produtoVendas.reduce(
      (acc, produto) => acc + produto.quantidadeTransferir,
      0
    );
    this.isSalvarDisabled =
      totalSelecionados === 0 || totalSelecionados === totalItens;
  }
  getObservacoesFormatadas(produto: any): string {
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
    console.log(this.venda);
    if (!this.vendaParcial.produtoVendas) {
      this.vendaParcial.produtoVendas = [];
    }

    let produtoFoiSelecionado = false;

    for (let i = 0; i < this.venda.produtoVendas.length; i++) {
      const produtoVenda = this.venda.produtoVendas[i];

      if (produtoVenda.quantidadeTransferir > 0) {
        const novoProdutoVenda = new ProdutoVenda();
        novoProdutoVenda.quantidade = produtoVenda.quantidadeTransferir;
        novoProdutoVenda.produto = produtoVenda.produto;
        novoProdutoVenda.funcionario = produtoVenda.funcionario;
        novoProdutoVenda.observacoesProdutoVenda = [
          ...produtoVenda.observacoesProdutoVenda,
        ];
        novoProdutoVenda.observacaoProdutoVenda =
          produtoVenda.observacaoProdutoVenda;

        this.vendaParcial.produtoVendas.push(novoProdutoVenda);
        produtoFoiSelecionado = true;

        produtoVenda.quantidade -= produtoVenda.quantidadeTransferir;
        produtoVenda.quantidadeTransferir = 0;

        if (produtoVenda.quantidade === 0) {
          this.venda.produtoVendas.splice(i, 1);
          i--;
        }
      }
    }
    this.vendaParcial.produtoVendas.forEach((pv) => {
      delete (pv as any)['selecionado'];
    });
    this.venda.produtoVendas.forEach((pv) => {
      delete (pv as any)['selecionado'];
    });

    if (!produtoFoiSelecionado) {
      this.toastr.error('Selecione um produto!');
      return;
    }

    this.retorno.emit({
      venda: this.venda,
      vendaParcial: this.vendaParcial,
    });
  }
}
