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
    imports: [FormsModule, PermissaoListaComponent, NgClass],
    templateUrl: './admin-funcionario-detalhes.component.html',
    styleUrl: './admin-funcionario-detalhes.component.scss'
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
    if (!this.adminFuncionario.nome?.trim()) {
      this.toastr.error('Nome obrigatório!');
      return;
    } else if (!this.adminFuncionario.username?.trim()) {
      this.toastr.error('UserName obrigatório!');
      return;
    }

    const senha = this.adminFuncionario.password || '';
    const errosSenha: string[] = [];

    if (!this.adminFuncionario.id) {
      // Cadastro: senha é obrigatória
      if (!senha.trim()) {
        this.toastr.error('Senha obrigatória!');
        return;
      }
    }

    // Validar apenas se senha for preenchida
    if (senha.trim()) {
      if (senha.length < 8) {
        errosSenha.push('mínimo de 8 caracteres');
      }
      if (!/[a-z]/.test(senha)) {
        errosSenha.push('1 letra minúscula');
      }
      if (!/[A-Z]/.test(senha)) {
        errosSenha.push('1 letra maiúscula');
      }
      if (!/\d/.test(senha)) {
        errosSenha.push('1 número');
      }
      if (!/[\W_]/.test(senha)) {
        errosSenha.push('1 caractere especial');
      }
      if (/\s/.test(senha)) {
        errosSenha.push('sem espaços');
      }

      if (errosSenha.length > 0) {
        this.toastr.error(
          `Senha inválida: deve conter ${errosSenha.join(', ')}.`
        );
        return;
      }
    }

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
  temMaiuscula(): boolean {
    return /[A-Z]/.test(this.adminFuncionario.password || '');
  }

  temMinuscula(): boolean {
    return /[a-z]/.test(this.adminFuncionario.password || '');
  }

  temNumero(): boolean {
    return /\d/.test(this.adminFuncionario.password || '');
  }

  temEspecial(): boolean {
    return /[\W_]/.test(this.adminFuncionario.password || '');
  }

  temTamanho(): boolean {
    return (this.adminFuncionario.password || '').length >= 8;
  }

  temEspaco(): boolean {
    return /\s/.test(this.adminFuncionario.password || '');
  }
}
