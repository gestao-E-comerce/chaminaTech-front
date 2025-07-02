import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteDetalhesComponent } from '../cliente-detalhes/cliente-detalhes.component';
import { Cliente } from '../../../models/cliente';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClienteService } from '../../../services/cliente.service';
import { Mensagem } from '../../../models/mensagem';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Usuario } from '../../../models/usuario';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-cliente-list',
    imports: [
        FormsModule,
        ClienteDetalhesComponent,
        RouterLink,
        NgClass,
        NgxMaskPipe,
        NgxMaskDirective,
    ],
    templateUrl: './cliente-list.component.html',
    styleUrl: './cliente-list.component.scss'
})
export class ClienteListComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  @Input() modoVincular: boolean = false;
  @Input() modoRetirada: boolean = false;
  screenWidth!: boolean;

  listaClientesOriginal: Cliente[] = [];
  listaClientesFiltrada: Cliente[] = [];
  cliente: Cliente = new Cliente();
  usuario!: Usuario;

  modalService = inject(NgbModal);
  clienteService = inject(ClienteService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);

  tituloModal!: string;
  termoPesquisa!: '';
  indice!: number;
  modalRef!: NgbModalRef;
  filtroTipo: string = 'nome';

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth >= 768;
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth >= 768;
    this.listarClientes();

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }

  listarClientes() {
    this.clienteService.listarClientesPorMatrizId().subscribe({
      next: (lista) => {
        this.listaClientesOriginal = lista;
        this.listaClientesFiltrada = lista;
      },
    });
  }

  abrirModalDetalhes(cliente: Cliente, indice: number, modalDetalhes: any) {
    this.cliente = Object.assign({}, cliente);
    this.indice = indice;
    this.modalRef = this.modalService.open(modalDetalhes, {
      size: 'fullscreen',
    });
  }

  atualizarListaCliente(menssagem: Mensagem) {
    this.modalRef.close();
    this.listarClientes();
  }

  cadastrarCliente(modalCliente: any) {
    this.cliente = new Cliente();
    this.modalRef = this.modalService.open(modalCliente, { size: 'xl' });
    this.tituloModal = 'Cadastrar Cliente';
  }

  editarCliente(modal: any, cliente: Cliente, indice: number) {
    this.cliente = Object.assign({}, cliente);
    this.indice = indice;

    this.modalRef = this.modalService.open(modal, { size: 'xl' });
    this.tituloModal = 'Editar Cliente';
  }

  deletarCliente(modal: any, cliente: Cliente, indice: number) {
    this.cliente = Object.assign({}, cliente);
    this.indice = indice;

    this.modalRef = this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Cliente';
  }

  confirmarExclusaoCliente(cliente: Cliente) {
    this.clienteService.deletar(cliente.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.listarClientes();
        this.modalRef.close();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  vincular(cliente: Cliente) {
    this.retorno.emit(cliente);
  }

  getInputMode(): string {
    switch (this.filtroTipo) {
      case 'cpf':
      case 'celular':
      case 'cep':
        return 'numeric';
      default:
        return 'text';
    }
  }

  getInputMask(): string | null {
    switch (this.filtroTipo) {
      case 'cpf':
        return '000.000.000-00';
      case 'celular':
        return '(00) 00000-0000';
      case 'cep':
        return '00000-000';
      default:
        return null;
    }
  }

  realizarPesquisa(termoPesquisa: string) {
    termoPesquisa = termoPesquisa.trim();
    termoPesquisa = termoPesquisa.toLocaleUpperCase();
    if (!termoPesquisa) {
      this.listarClientes(); // Se não tem termo, lista todos
      return;
    }

    switch (this.filtroTipo) {
      case 'nome':
        this.clienteService.buscarPorNome(termoPesquisa).subscribe({
          next: (lista) => (this.listaClientesFiltrada = lista),
        });
        break;

      case 'cpf':
        this.clienteService.buscarPorCpf(termoPesquisa).subscribe({
          next: (lista) => (this.listaClientesFiltrada = lista),
        });
        break;

      case 'celular':
        this.clienteService.buscarPorCelular(termoPesquisa).subscribe({
          next: (lista) => (this.listaClientesFiltrada = lista),
        });
        break;

      case 'cep':
        this.clienteService.buscarPorCep(termoPesquisa).subscribe({
          next: (lista) => (this.listaClientesFiltrada = lista),
        });
        break;

      default:
        this.toastr.error('Filtro inválido.');
        break;
    }
  }
}
