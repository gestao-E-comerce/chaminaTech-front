import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PermissaoListaComponent } from '../../../permissao/permissao-lista/permissao-lista.component';
import { NgClass } from '@angular/common';
import { AdminFuncionario } from '../../../../models/admin-funcionario';
import { AdminFuncionarioService } from '../../../../services/admin-funcionario';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Mensagem } from '../../../../models/mensagem';
import { Permissao } from '../../../../models/permissao';

@Component({
  selector: 'app-admin-funcionario-detalhes',
  standalone: true,
  imports: [FormsModule, PermissaoListaComponent, NgClass],
  templateUrl: './admin-funcionario-detalhes.component.html',
  styleUrl: './admin-funcionario-detalhes.component.scss',
})
export class AdminFuncionarioDetalhesComponent {
  @Input() adminFuncionario: AdminFuncionario = new AdminFuncionario();
  @Output() retorno = new EventEmitter<Mensagem>();

  adminFuncionarioService = inject(AdminFuncionarioService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  modalRef!: NgbModalRef;

  tituloModal!: string;

  buscar(modalListarPermissaos: any) {
    this.modalRef = this.modalService.open(modalListarPermissaos, {
      size: 'lg',
    });

    this.tituloModal = 'Selecionar grupo permissões';
  }

  retornoPermissao(permissao: Permissao) {
    this.adminFuncionario.permissao = permissao;
    this.modalRef.dismiss();
  }

  salvar() {
    if (!this.adminFuncionario.nome && !this.adminFuncionario.nome.trim()) {
      this.toastr.error('Nome obrigatório!');
      return;
    } else if (
      !this.adminFuncionario.username &&
      !this.adminFuncionario.username.trim()
    ) {
      this.toastr.error('UserName obrigatório!');
      return;
    } else {
      this.adminFuncionarioService.save(this.adminFuncionario).subscribe({
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
