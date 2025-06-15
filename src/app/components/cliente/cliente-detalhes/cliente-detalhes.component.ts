import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../models/cliente';
import { Mensagem } from '../../../models/mensagem';
import { ClienteService } from '../../../services/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { EnderecoDetalhesComponent } from '../endereco-detalhes/endereco-detalhes.component';
import { Endereco } from '../../../models/endereco';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cliente-detalhes',
  standalone: true,
  imports: [FormsModule, EnderecoDetalhesComponent, NgClass, NgxMaskDirective],
  templateUrl: './cliente-detalhes.component.html',
  styleUrl: './cliente-detalhes.component.scss',
})
export class ClienteDetalhesComponent implements OnInit {
  @Input() cliente: Cliente = new Cliente();
  @Output() retorno = new EventEmitter<Mensagem>();
  @Input() modoRetirada!: boolean;

  clienteService = inject(ClienteService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  changeDetector = inject(ChangeDetectorRef);

  endereco: Endereco = new Endereco();
  modalRef!: NgbModalRef;
  indice!: number;
  tituloModal!: string;
  documento!: number;

  @HostListener('document:keydown.enter', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.salvar();
  }

  ngOnInit(): void {
    if (this.cliente && this.cliente.cpf != null) {
      if (this.cliente.cpf.length == 11) {
        this.documento = 1;
      } else if (this.cliente.cpf.length == 14) {
        this.documento = 2;
      }
    }
  }

  atualizarLista(endereco: Endereco) {
    if (this.cliente.enderecos == null) {
      this.cliente.enderecos = [];
    }
    if (endereco.id >= 0) {
      let index = this.cliente.enderecos.findIndex(
        (item) => endereco.id === item.id
      );
      this.cliente.enderecos[index] = Object.assign({}, endereco);
    } else {
      this.cliente.enderecos.push(Object.assign({}, endereco));
    }
    this.modalRef.dismiss();
  }

  cadastrarEndereco(modalEndereco: any) {
    this.endereco = new Endereco();
    this.modalRef = this.modalService.open(modalEndereco, { size: 'lg' });

    this.tituloModal = 'Cadastrar Endereço';
  }

  editarEndereco(modal: any, endereco: Endereco, indice: number) {
    this.endereco = Object.assign({}, endereco);
    this.indice = indice;

    this.modalRef = this.modalService.open(modal, { size: 'lg' });

    this.tituloModal = 'Editar Cliente';
  }

  deletarEndereco(modal: any, endereco: Endereco, indice: number) {
    this.endereco = Object.assign({}, endereco);
    this.indice = indice;

    this.modalRef = this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Cliente';
  }

  confirmarExclusaoEndereco(index: number) {
    this.cliente.enderecos.splice(index, 1);
    this.modalRef.close();
  }

  validarCPF(cpf: string): boolean {
    if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0,
      resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf[10]);
  }

  validarCNPJ(cnpj: string): boolean {
    if (!cnpj || cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  }

  validarCelular(celular: string): boolean {
    if (!celular) return false;

    if (this.cliente.celular.length !== 11) return false;

    return true;
  }

  salvar() {
    const cpfLimpo = this.cliente.cpf?.replace(/\D/g, '') || '';

    if (!this.cliente.nome?.trim()) {
      this.toastr.error('Nome obrigatório!');
      return;
    }
    if (!this.validarCelular(this.cliente.celular)) {
      this.toastr.error('Celular inválido!');
      return;
    }

    if (cpfLimpo) {
      if (cpfLimpo.length === 11) {
        if (!this.validarCPF(cpfLimpo)) {
          this.toastr.error('CPF inválido!');
          return;
        }
      } else if (cpfLimpo.length === 14) {
        if (!this.validarCNPJ(cpfLimpo)) {
          this.toastr.error('CNPJ inválido!');
          return;
        }
      } else {
        this.toastr.error('CPF/CNPJ incompleto ou inválido!');
        return;
      }

      this.cliente.cpf = cpfLimpo; // salva sem máscara
    }

    this.clienteService.save(this.cliente).subscribe({
      next: (cliente) => {
        this.toastr.success(cliente.mensagem);
        this.retorno.emit(cliente);
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }
}
