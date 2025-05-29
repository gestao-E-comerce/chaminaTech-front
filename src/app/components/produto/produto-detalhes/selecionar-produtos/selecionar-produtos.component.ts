import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoComposto } from '../../../../models/produto-composto';
import { ProdutoService } from '../../../../services/produto.service';
import { ToastrService } from 'ngx-toastr';
import { Produto } from '../../../../models/produto';
import { Observacoes } from '../../../../models/observacoes';
import { ObservacaoProduto } from '../../../../models/observacao-produto';
import { NgClass } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProdutoListComponent } from '../../produto-list/produto-list.component';
import { ListaProdutosSelecionarComponent } from "./lista-produtos-selecionar/lista-produtos-selecionar.component";

@Component({
  selector: 'app-selecionar-produtos',
  standalone: true,
  imports: [FormsModule, NgClass, ListaProdutosSelecionarComponent],
  templateUrl: './selecionar-produtos.component.html',
  styleUrl: './selecionar-produtos.component.scss',
})
export class SelecionarProdutosComponent implements OnInit {
  @Output() retornoProdutoComposto = new EventEmitter<ProdutoComposto>();
  @Output() retornoObservacaoProduto = new EventEmitter<ObservacaoProduto>();

  @Input() produtoComposto: ProdutoComposto = new ProdutoComposto();
  @Input() observacaoProduto: ObservacaoProduto = new ObservacaoProduto();
  @Input() produto!: Produto;
  @Input() observacoes!: Observacoes;

  produtoService = inject(ProdutoService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  modalRef!: NgbModalRef;

  listaProdutos: Produto[] = [];

  produtoCompostoLocal: ProdutoComposto = new ProdutoComposto();
  obcervacaoProdutoLocal: ObservacaoProduto = new ObservacaoProduto();
  ativo?: string = '';

  ngOnInit() {
    if (this.produtoComposto) {
      this.produtoCompostoLocal = Object.assign({}, this.produtoComposto);
    }
    if (this.observacaoProduto) {
      this.obcervacaoProdutoLocal = Object.assign({}, this.observacaoProduto);
    }

  }
  retornoProduto(produto: any) {
    this.toastr.success('Matéria vinculada com sucesso');
    if (this.produtoComposto) {
      this.produtoCompostoLocal.produtoComposto = produto;
    }
    if (this.observacaoProduto) {
      this.obcervacaoProdutoLocal.produto = produto;
    }
    this.modalRef.close();
  }

  buscar(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'xl' });
  }

  salvarProdutoComposto() {
    if (!this.produtoCompostoLocal?.produtoComposto) return;
    if (
      this.produto &&
      this.produto.estocavel == false &&
      this.produtoCompostoLocal.quantidadeGasto == null
    ) {
      this.toastr.error('Quantidade Gasto Obrigatório!');
      return;
    }

    this.retornoProdutoComposto.emit(this.produtoCompostoLocal);
    this.toastr.success('Produto adicionado com sucesso');
  }
  salvarObservacaoProduto() {
    if (!this.obcervacaoProdutoLocal?.produto) return;
    if (
      this.observacoes &&
      this.observacoes.extra == true &&
      this.obcervacaoProdutoLocal.quantidadeGasto == null
    ) {
      this.toastr.error('Quantidade Gasto Obrigatório!');
      return;
    }

    this.retornoObservacaoProduto.emit(this.obcervacaoProdutoLocal);
    this.toastr.success('Produto adicionado com sucesso');
  }
}