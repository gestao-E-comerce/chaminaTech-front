import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mensagem } from '../../../models/mensagem';
import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { ObservacaoDetalhesComponent } from '../observacao-detalhes/observacao-detalhes.component';
import { Observacoes } from '../../../models/observacoes';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-categoria-detalhes',
    imports: [FormsModule, ObservacaoDetalhesComponent, NgClass],
    templateUrl: './categoria-detalhes.component.html',
    styleUrl: './categoria-detalhes.component.scss'
})
export class CategoriaDetalhesComponent {
  @Output() retorno = new EventEmitter<Mensagem>();
  @Input() categoria: Categoria = new Categoria();

  categoriaService = inject(CategoriaService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);

  observacoes: Observacoes = new Observacoes();
  indice!: number;
  tituloModal!: string;
  modalRef!: NgbModalRef;

  @HostListener('document:keydown.enter', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.salvar();
  }

  atualizarListaObservacoes(observacoes: Observacoes) {
    if (this.categoria.observacoesCategoria == null)
      this.categoria.observacoesCategoria = [];
    if (this.indice == -1)
      this.categoria.observacoesCategoria.push(Object.assign({}, observacoes));
    else {
      this.categoria.observacoesCategoria[this.indice] = Object.assign(
        {},
        observacoes
      );
    }
    this.modalRef.dismiss();
  }

  adicionarObservacao(modalListarObservacoes: any) {
    this.indice = -1;
    this.observacoes = new Observacoes();
    this.modalRef = this.modalService.open(modalListarObservacoes, {
      size: 'lg',
    });

    this.tituloModal = 'Adicionar Observação';
  }

  editarObservacao(
    modalListarObservacoes: any,
    observacoes: Observacoes,
    indice: number
  ) {
    this.observacoes = Object.assign({}, observacoes);
    this.indice = indice;
    this.modalRef = this.modalService.open(modalListarObservacoes, {
      size: 'lg',
    });

    this.tituloModal = 'Editar Observação';
  }

  deletarObservacao(index: number) {
    const obs = this.categoria.observacoesCategoria[index];
    if (obs.id) {
      obs.ativo = false;
    } else {
      this.categoria.observacoesCategoria.splice(index, 1);
    }
  }

  salvar() {
    if (!this.categoria.nome?.trim()) {
      this.toastr.error('Nome obrigatório!');
      return;
    } else {
      this.categoriaService.save(this.categoria).subscribe({
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
}
