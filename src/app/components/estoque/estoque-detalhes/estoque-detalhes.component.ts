import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Estoque } from '../../../models/estoque';
import { Mensagem } from '../../../models/mensagem';
import { EstoqueService } from '../../../services/estoque.service';
import { ProdutoService } from '../../../services/produto.service';
import { ToastrService } from 'ngx-toastr';
import { ProdutoListComponent } from '../../produto/produto-list/produto-list.component';
import { NgClass } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-estoque-detalhes',
    imports: [FormsModule, ProdutoListComponent, NgClass],
    templateUrl: './estoque-detalhes.component.html',
    styleUrl: './estoque-detalhes.component.scss'
})
export class EstoqueDetalhesComponent {
  @Output() retorno = new EventEmitter<Mensagem>();
  @Input() estoque: Estoque = new Estoque();

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
    this.estoque.produto = produto;
    this.modalRef.close();
  }

  buscar(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'xl' });
  }

  salvar() {
    if (this.estoque.produto == null) {
      this.toastr.error('Produto Obrigatório!');
      return;
    } else if (this.estoque.quantidade == null) {
      this.toastr.error('Quantidade Obrigatório!');
      return;
    }
    if (
      this.estoque &&
      !this.estoque.produto.estocavel &&
      this.estoque.valorTotal == null
    ) {
      this.toastr.error('Valor Compra Obrigatório!');
      return;
    }
    const temMateriaInvalida = this.estoque.produto?.produtoMaterias?.some(
      (pm) =>
        pm.ativo && (pm.quantidadeGasto == null || pm.quantidadeGasto <= 0)
    );

    const temCompostoInvalido = this.estoque.produto?.produtoCompostos?.some(
      (pc) =>
        pc.ativo && (pc.quantidadeGasto == null || pc.quantidadeGasto <= 0)
    );

    if (temMateriaInvalida) {
      this.toastr.error(
        'Todos os campos de quantidade das matérias devem ser preenchidos e maiores que zero.'
      );
      return;
    }

    if (temCompostoInvalido) {
      this.toastr.error(
        'Todos os campos de quantidade dos produtos compostos devem ser preenchidos e maiores que zero.'
      );
      return;
    }
    this.estoqueService.save(this.estoque).subscribe({
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
