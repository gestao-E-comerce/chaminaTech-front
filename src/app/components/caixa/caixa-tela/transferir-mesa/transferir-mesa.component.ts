import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Venda } from '../../../../models/venda';
import { ProdutoVenda } from '../../../../models/produto-venda';
import { Observacoes } from '../../../../models/observacoes';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-transferir-mesa',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './transferir-mesa.component.html',
  styleUrl: './transferir-mesa.component.scss',
})
export class TransferirMesaComponent implements OnInit {
  @Output() retorno = new EventEmitter<{
    venda: Venda;
    vendaTransferir: Venda;
  }>();
  @Input() venda: Venda = new Venda();
  @Input() vendaTransferir: Venda = new Venda();
  isSalvarDisabled: boolean = true;
  tudoSelecionado: boolean = false;

  toastr = inject(ToastrService);

  ngOnInit() {
    setTimeout(() => {
      this.venda.produtoVendas.forEach((produtoVenda) => {
        produtoVenda.quantidadeTransferir = 0;
        produtoVenda.selecionado = false;
      });
      this.updateSalvarDisabledState();
      this.checarSeTodosEstaoSelecionados();
    }, 0);
  }

  salvar() {
    if (!this.vendaTransferir.produtoVendas) {
      this.vendaTransferir.produtoVendas = [];
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

        this.vendaTransferir.produtoVendas.push(novoProdutoVenda);
        produtoFoiSelecionado = true;

        produtoVenda.quantidade -= produtoVenda.quantidadeTransferir;
        produtoVenda.quantidadeTransferir = 0;

        if (produtoVenda.quantidade === 0) {
          produtoVenda.ativo = false;
        }
      }
    }
    this.vendaTransferir.produtoVendas.forEach((pv) => {
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
      vendaTransferir: this.vendaTransferir,
    });
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
    this.checarSeTodosEstaoSelecionados();
  }
  atualizarQuantidadeTransferir(produtoVenda: any) {
    if (produtoVenda.selecionado) {
      produtoVenda.quantidadeTransferir = produtoVenda.quantidade;
    } else {
      produtoVenda.quantidadeTransferir = 0;
    }
    this.updateSalvarDisabledState();
    this.checarSeTodosEstaoSelecionados();
  }
  updateSalvarDisabledState() {
    this.isSalvarDisabled = !this.venda.produtoVendas.some(
      (produtoVenda) => produtoVenda.quantidadeTransferir > 0
    );
  }

  marcarTodos(event: Event) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    this.tudoSelecionado = isChecked;

    this.venda.produtoVendas.forEach((produtoVenda) => {
      produtoVenda.selecionado = isChecked;
      produtoVenda.quantidadeTransferir = isChecked
        ? produtoVenda.quantidade
        : 0;
    });

    this.updateSalvarDisabledState();
  }
  checarSeTodosEstaoSelecionados() {
    // Se tiver ao menos 1 produto e todos estiverem selecionados, tudoSelecionado = true
    const todos =
      this.venda.produtoVendas.length > 0 &&
      this.venda.produtoVendas.every((pv) => pv.selecionado);
    this.tudoSelecionado = todos;
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
}
