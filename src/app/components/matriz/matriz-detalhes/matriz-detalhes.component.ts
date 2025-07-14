import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject,
} from '@angular/core';
import { Matriz } from '../../../models/matriz';
import { Mensagem } from '../../../models/mensagem';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatrizService } from '../../../services/matriz.service';
import { NgClass } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PermissaoListaComponent } from '../../permissao/permissao-lista/permissao-lista.component';
import { Permissao } from '../../../models/permissao';
import { GlobalService } from '../../../services/global.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-matriz-detalhes',
  imports: [FormsModule, NgxMaskDirective, NgClass, PermissaoListaComponent],
  templateUrl: './matriz-detalhes.component.html',
  styleUrl: './matriz-detalhes.component.scss',
})
export class MatrizDetalhesComponent {
  @Input() matriz: Matriz = new Matriz();
  @Output() retorno = new EventEmitter<Mensagem>();
  @Input() modo!: boolean;

  matrizService = inject(MatrizService);
  toastr = inject(ToastrService);
  modalService = inject(NgbModal);
  globalService = inject(GlobalService);
  modalRef!: NgbModalRef;

  tituloModal!: string;
  enderecoOriginal: string = '';
  @HostListener('document:keydown.enter', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.salvar();
  }

  ngOnChanges() {
    const endereco = this.matriz;
    this.enderecoOriginal = `${endereco.rua}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}`;
  }

  buscar(modalListarPermissaos: any) {
    this.modalRef = this.modalService.open(modalListarPermissaos, {
      size: 'lg',
    });

    this.tituloModal = 'Selecionar grupo permissões';
  }

  retornoPermissao(permissao: Permissao) {
    this.matriz.permissao = permissao;
    this.modalRef.dismiss();
  }

  buscarCEP() {
    if (this.matriz.cep && this.matriz.cep.length === 8) {
      this.globalService.buscarCEP(this.matriz.cep).subscribe({
        next: (dados) => {
          if (dados.erro) {
            this.toastr.error('CEP não encontrado.');
          } else {
            this.matriz.rua = dados.logradouro;
            this.matriz.bairro = dados.bairro;
            this.matriz.cidade = dados.localidade;
            this.matriz.estado = dados.uf;
          }
        },
        error: () => {
          this.toastr.error('Erro ao buscar CEP.');
        },
      });
    } else {
      this.toastr.warning('Digite um CEP válido com 8 dígitos.');
    }
  }

  salvar() {
    if (!this.matriz.nome?.trim()) {
      this.toastr.error('Nome obrigatório!');
      return;
    }

    if (!this.matriz.cnpj?.trim()) {
      this.toastr.error('CNPJ obrigatório!');
      return;
    }

    if (!this.matriz.cep?.trim()) {
      this.toastr.error('CEP obrigatório!');
      return;
    }

    if (!this.matriz.rua?.trim()) {
      this.toastr.error('Rua obrigatório!');
      return;
    }

    if (!this.matriz.numero?.toString().trim()) {
      this.toastr.error('Número obrigatório!');
      return;
    }

    if (!this.matriz.bairro?.trim()) {
      this.toastr.error('Bairro obrigatório!');
      return;
    }

    if (!this.matriz.cidade?.trim()) {
      this.toastr.error('Cidade obrigatório!');
      return;
    }

    if (!this.matriz.estado?.trim()) {
      this.toastr.error('Estado obrigatório!');
      return;
    }

    if (!this.matriz.username?.trim()) {
      this.toastr.error('UserName obrigatório!');
      return;
    }
    if (!this.matriz.permissao) {
      this.toastr.error('Permissão obrigatório!');
      return;
    }
    const senha = this.matriz.password || '';
    const errosSenha: string[] = [];

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

    const enderecoAtual = `${this.matriz.rua}, ${this.matriz.numero}, ${this.matriz.bairro}, ${this.matriz.cidade}, ${this.matriz.estado}`;

    if (enderecoAtual === this.enderecoOriginal) {
      this.matrizService.save(this.matriz).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.retorno.emit(mensagem);
        },
        error: (erro) => {
          this.toastr.error(erro.error.mensagem);
        },
      });
      return;
    }

    this.globalService.buscarCoordenadasPorEndereco(enderecoAtual).subscribe({
      next: (coords) => {
        this.matriz.latitude = coords.lat;
        this.matriz.longitude = coords.lng;
        this.matrizService.save(this.matriz).subscribe({
          next: (mensagem) => {
            this.toastr.success(mensagem.mensagem);
            this.retorno.emit(mensagem);
          },
          error: (erro) => {
            this.toastr.error(erro.error.mensagem);
          },
        });
      },
      error: () => {
        this.toastr.error(
          'Endereço inválido ou não encontrado. Verifique os dados.'
        );
      },
    });
  }
  temMaiuscula(): boolean {
    return /[A-Z]/.test(this.matriz.password || '');
  }

  temMinuscula(): boolean {
    return /[a-z]/.test(this.matriz.password || '');
  }

  temNumero(): boolean {
    return /\d/.test(this.matriz.password || '');
  }

  temEspecial(): boolean {
    return /[\W_]/.test(this.matriz.password || '');
  }

  temTamanho(): boolean {
    return (this.matriz.password || '').length >= 8;
  }

  temEspaco(): boolean {
    return /\s/.test(this.matriz.password || '');
  }
}
