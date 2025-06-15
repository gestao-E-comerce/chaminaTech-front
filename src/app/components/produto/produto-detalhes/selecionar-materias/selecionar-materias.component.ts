import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ProdutoMateria } from '../../../../models/produto-materia';
import { MateriaService } from '../../../../services/materia.service';
import { Materia } from '../../../../models/materia';
import { Produto } from '../../../../models/produto';
import { Observacoes } from '../../../../models/observacoes';
import { ObservacaoMateria } from '../../../../models/observacao-materia';
import { NgClass } from '@angular/common';
import { MateriaListComponent } from '../../../materia/materia-list/materia-list.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-selecionar-materias',
  standalone: true,
  imports: [FormsModule, NgClass, MateriaListComponent],
  templateUrl: './selecionar-materias.component.html',
  styleUrl: './selecionar-materias.component.scss',
})
export class SelecionarMateriasComponent implements OnInit {
  @Output() retornoProdutoMateria = new EventEmitter<ProdutoMateria>();
  @Output() retornoObservacaoMateria = new EventEmitter<ObservacaoMateria>();

  @Input() produtoMateria: ProdutoMateria = new ProdutoMateria();
  @Input() observacaoMateria: ObservacaoMateria = new ObservacaoMateria();
  @Input() produto!: Produto;
  @Input() observacoes!: Observacoes;

  materiaService = inject(MateriaService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  modalRef!: NgbModalRef;

  produtoMateriaLocal: ProdutoMateria = new ProdutoMateria();
  obcervacaoMateriaLocal: ObservacaoMateria = new ObservacaoMateria();
  ativo?: string = '';

  @HostListener('document:keydown.enter', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.produto != null) {
      this.salvarProdutoMateria();
    }
    if (this.observacoes != null) {
      this.salvarObservacaoMateria();
    }
  }
  ngOnInit() {
    if (this.produtoMateria) {
      this.produtoMateriaLocal = Object.assign({}, this.produtoMateria);
    }
    if (this.observacaoMateria) {
      this.obcervacaoMateriaLocal = Object.assign({}, this.observacaoMateria);
    }
  }

  retornoMateria(materia: any) {
    this.toastr.success('Matéria vinculada com sucesso');
    if (this.produtoMateria) {
      this.produtoMateriaLocal.materia = materia;
    }
    if (this.observacaoMateria) {
      this.obcervacaoMateriaLocal.materia = materia;
    }
    this.modalRef.close();
  }

  buscar(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'xl' });
  }

  salvarProdutoMateria() {
    if (!this.produtoMateriaLocal?.materia) return;
    if (
      this.produto.estocavel == false &&
      this.produtoMateriaLocal.quantidadeGasto == null
    ) {
      this.toastr.error('Quantidade Gasto Obrigatório!');
      return;
    }

    this.retornoProdutoMateria.emit(this.produtoMateriaLocal);
    this.toastr.success('Matéria adicionada com sucesso');
  }
  salvarObservacaoMateria() {
    if (!this.obcervacaoMateriaLocal?.materia) return;
    if (
      this.observacoes.extra == true &&
      this.obcervacaoMateriaLocal.quantidadeGasto == null
    ) {
      this.toastr.error('Quantidade Gasto Obrigatório!');
      return;
    }

    this.retornoObservacaoMateria.emit(this.obcervacaoMateriaLocal);
    this.toastr.success('Matéria adicionada com sucesso');
  }
}
