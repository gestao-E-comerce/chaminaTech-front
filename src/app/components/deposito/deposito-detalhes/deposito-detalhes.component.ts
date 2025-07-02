import { Component, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Deposito } from '../../../models/deposito';
import { Mensagem } from '../../../models/mensagem';
import { DepositoService } from '../../../services/deposito.service';
import { ToastrService } from 'ngx-toastr';
import { MateriaService } from '../../../services/materia.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MateriaListComponent } from '../../materia/materia-list/materia-list.component';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-deposito-detalhes',
    imports: [FormsModule, MateriaListComponent, NgClass],
    templateUrl: './deposito-detalhes.component.html',
    styleUrl: './deposito-detalhes.component.scss'
})
export class DepositoDetalhesComponent {
  @Output() retorno = new EventEmitter<Mensagem>();
  @Input() deposito: Deposito = new Deposito();

  depositoService = inject(DepositoService);
  materiaService = inject(MateriaService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  modalRef!: NgbModalRef;

  @HostListener('document:keydown.enter', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.salvar();
  }

  retornoMateria(materia: any) {
    this.toastr.success('Matéria vinculada com sucesso');
    this.deposito.materia = materia;
    this.modalRef.close();
  }

  buscar(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'xl' });
  }

  salvar() {
    if (this.deposito.materia == null) {
      this.toastr.error('Matéria Obrigatório!');
      return;
    } else if (this.deposito.quantidade == null) {
      this.toastr.error('Quantidade Obrigatório!');
      return;
    } else if (this.deposito.valorTotal == null) {
      this.toastr.error('Valor Compra Obrigatório!');
      return;
    }
    this.depositoService.save(this.deposito).subscribe({
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
