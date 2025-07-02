import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observacoes } from '../../../models/observacoes';
import { ToastrService } from 'ngx-toastr';
import { SelecionarMateriasComponent } from '../../produto/produto-detalhes/selecionar-materias/selecionar-materias.component';
import { SelecionarProdutosComponent } from '../../produto/produto-detalhes/selecionar-produtos/selecionar-produtos.component';
import { ObservacaoProduto } from '../../../models/observacao-produto';
import { ObservacaoMateria } from '../../../models/observacao-materia';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from '../../../models/categoria';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-observacao-detalhes',
    imports: [
        FormsModule,
        SelecionarMateriasComponent,
        SelecionarProdutosComponent,
        NgClass,
    ],
    templateUrl: './observacao-detalhes.component.html',
    styleUrl: './observacao-detalhes.component.scss'
})
export class ObservacaoDetalhesComponent {
  @Output() retorno = new EventEmitter<Observacoes>();
  @Input() observacoes: Observacoes = new Observacoes();

  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  modalRef!: NgbModalRef;

  observasaoMateria: ObservacaoMateria = new ObservacaoMateria();
  observasaoProduto: ObservacaoProduto = new ObservacaoProduto();

  indice!: number;
  tituloModal!: string;

  @HostListener('document:keydown.enter', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.salvar();
  }

  atualizarListaProdutos(produto: ObservacaoProduto) {
    if (this.observacoes.observacaoProdutos == null) {
      this.observacoes.observacaoProdutos = [];
    }
    if (this.indice == -1)
      this.observacoes.observacaoProdutos.push(Object.assign({}, produto));
    else {
      this.observacoes.observacaoProdutos[this.indice] = Object.assign(
        {},
        produto
      );
    }
    this.modalRef.dismiss();
  }

  atualizarListaMaterias(materia: ObservacaoMateria) {
    if (this.observacoes.observacaoMaterias == null) {
      this.observacoes.observacaoMaterias = [];
    }
    if (this.indice == -1)
      this.observacoes.observacaoMaterias.push(Object.assign({}, materia));
    else {
      this.observacoes.observacaoMaterias[this.indice] = Object.assign(
        {},
        materia
      );
    }
    this.modalRef.dismiss();
  }

  adicionarMateria(modalListarMaterias: any) {
    this.indice = -1;
    this.observasaoMateria = new ObservacaoMateria();
    this.modalRef = this.modalService.open(modalListarMaterias, { size: 'md' });

    this.tituloModal = 'Adicionar Matéria';
  }

  editarMateria(
    modalListarMaterias: any,
    materia: ObservacaoMateria,
    indice: number
  ) {
    this.observasaoMateria = Object.assign({}, materia);
    this.indice = indice;
    this.modalRef = this.modalService.open(modalListarMaterias, { size: 'md' });

    this.tituloModal = 'Editar Matéria';
  }

  deletarMateria(index: number) {
    const materia = this.observacoes.observacaoMaterias[index];
    if (materia.id) {
      materia.ativo = false;
    } else {
      this.observacoes.observacaoMaterias.splice(index, 1);
    }
  }

  adicionarProduto(modalListarProdutos: any) {
    this.indice = -1;
    this.observasaoProduto = new ObservacaoProduto();
    this.modalRef = this.modalService.open(modalListarProdutos, { size: 'md' });

    this.tituloModal = 'Adicionar Produto';
  }

  editarProduto(modal: any, produto: ObservacaoProduto, indice: number) {
    this.observasaoProduto = Object.assign({}, produto);
    this.indice = indice;
    this.modalRef = this.modalService.open(modal, { size: 'lg' });

    this.tituloModal = 'Editar Produto';
  }

  deletarProduto(index: number) {
    const produto = this.observacoes.observacaoProdutos[index];
    if (produto.id) {
      produto.ativo = false;
    } else {
      this.observacoes.observacaoProdutos.splice(index, 1);
    }
  }

  salvar() {
    if (!this.observacoes.observacao?.trim()) {
      this.toastr.error('Texto do observação é obrigatório!');
      return;
    }
    if (this.observacoes.validarExestencia == null) {
      this.toastr.error('É necessário definir se o estoque será validado!');
      return;
    }

    if (
      this.observacoes.validarExestencia === true &&
      this.observacoes.extra == null
    ) {
      this.toastr.error('Informe se o observacoes é adicionar ou tirar!');
      return;
    }
    this.retorno.emit(this.observacoes);
    this.toastr.success('Observação adicionada com sucesso');
  }
}
