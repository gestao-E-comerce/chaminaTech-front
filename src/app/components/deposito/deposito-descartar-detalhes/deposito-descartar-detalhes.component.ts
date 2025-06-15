import { Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MateriaListComponent } from '../../materia/materia-list/materia-list.component';
import { NgClass } from '@angular/common';
import { DepositoDescartar } from '../../../models/deposito-descartar';
import { Mensagem } from '../../../models/mensagem';
import { DepositoService } from '../../../services/deposito.service';
import { MateriaService } from '../../../services/materia.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deposito-descartar-detalhes',
  standalone: true,
  imports: [FormsModule, MateriaListComponent, NgClass],
  templateUrl: './deposito-descartar-detalhes.component.html',
  styleUrl: './deposito-descartar-detalhes.component.scss',
})
export class DepositoDescartarDetalhesComponent {
  @Output() retorno = new EventEmitter<Mensagem>();
  @Input() depositoDescartar: DepositoDescartar = new DepositoDescartar();

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
    this.depositoDescartar.materia = materia;
    this.modalRef.close();
  }

  buscar(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'xl' });
  }

  salvar() {
    if (this.depositoDescartar.materia == null) {
      this.toastr.error('Matéria Obrigatório!');
      return;
    } else if (this.depositoDescartar.quantidade == null) {
      this.toastr.error('Quantidade Obrigatório!');
      return;
    } else if (!this.depositoDescartar.motivo?.trim()) {
      this.toastr.error('Motivo Obrigatório!');
      return;
    }
    this.depositoService.descartar(this.depositoDescartar).subscribe({
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
