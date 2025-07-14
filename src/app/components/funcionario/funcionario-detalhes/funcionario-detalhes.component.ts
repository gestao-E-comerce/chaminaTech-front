import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Funcionario } from '../../../models/funcionario';
import { Mensagem } from '../../../models/mensagem';
import { FuncionarioService } from '../../../services/funcionario.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PermissaoListaComponent } from '../../permissao/permissao-lista/permissao-lista.component';
import { Permissao } from '../../../models/permissao';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-funcionario-detalhes',
  imports: [FormsModule, PermissaoListaComponent, NgClass],
  templateUrl: './funcionario-detalhes.component.html',
  styleUrl: './funcionario-detalhes.component.scss',
})
export class FuncionarioDetalhesComponent {
  @Input() funcionario: Funcionario = new Funcionario();
  @Output() retorno = new EventEmitter<Mensagem>();

  funcionarioService = inject(FuncionarioService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  modalRef!: NgbModalRef;

  tituloModal!: string;

  @HostListener('document:keydown.enter', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.salvar();
  }

  buscar(modalListarPermissaos: any) {
    this.modalRef = this.modalService.open(modalListarPermissaos, {
      size: 'lg',
    });

    this.tituloModal = 'Selecionar grupo permissões';
  }

  retornoPermissao(permissao: Permissao) {
    this.funcionario.permissao = permissao;
    this.modalRef.dismiss();
  }

  salvar() {
    if (!this.funcionario.nome?.trim()) {
      this.toastr.error('Nome obrigatório!');
      return;
    } else if (!this.funcionario.username?.trim()) {
      this.toastr.error('UserName obrigatório!');
      return;
    }

    const senha = this.funcionario.password || '';
    const errosSenha: string[] = [];

    if (!this.funcionario.id) {
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

    this.funcionarioService.save(this.funcionario).subscribe({
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
    return /[A-Z]/.test(this.funcionario.password || '');
  }

  temMinuscula(): boolean {
    return /[a-z]/.test(this.funcionario.password || '');
  }

  temNumero(): boolean {
    return /\d/.test(this.funcionario.password || '');
  }

  temEspecial(): boolean {
    return /[\W_]/.test(this.funcionario.password || '');
  }

  temTamanho(): boolean {
    return (this.funcionario.password || '').length >= 8;
  }

  temEspaco(): boolean {
    return /\s/.test(this.funcionario.password || '');
  }
}
