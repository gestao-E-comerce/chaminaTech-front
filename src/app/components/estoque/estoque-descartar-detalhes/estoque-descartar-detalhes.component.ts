import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoListComponent } from '../../produto/produto-list/produto-list.component';
import { NgClass } from '@angular/common';
import { EstoqueDescartar } from '../../../models/estoque-descartar';
import { Mensagem } from '../../../models/mensagem';
import { EstoqueService } from '../../../services/estoque.service';
import { ProdutoService } from '../../../services/produto.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-estoque-descartar-detalhes',
    imports: [FormsModule, ProdutoListComponent, NgClass],
    templateUrl: './estoque-descartar-detalhes.component.html',
    styleUrl: './estoque-descartar-detalhes.component.scss'
})
export class EstoqueDescartarDetalhesComponent {
  @Input() estoqueDescartar: EstoqueDescartar = new EstoqueDescartar();
  @Output() retorno = new EventEmitter<Mensagem>();

  estoqueService = inject(EstoqueService);
  produtoService = inject(ProdutoService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  modalRef!: NgbModalRef;

  @HostListener('document:keydown.enter', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.salvar();
  }

  retornoProduto(produto: any) {
    this.toastr.success('Produto vinculada com sucesso');
    this.estoqueDescartar.produto = produto;
    this.modalRef.close();
  }

  buscar(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'xl' });
  }

  salvar() {
    if (this.estoqueDescartar.produto == null) {
      this.toastr.error('Produto Obrigatório!');
      return;
    } else if (this.estoqueDescartar.quantidade == null) {
      this.toastr.error('Quantidade Obrigatório!');
      return;
    } else if (!this.estoqueDescartar.motivo?.trim()) {
      this.toastr.error('Motivo Obrigatório!');
      return;
    }
    this.estoqueService.descartar(this.estoqueDescartar).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.retorno.emit(mensagem);
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }
}
