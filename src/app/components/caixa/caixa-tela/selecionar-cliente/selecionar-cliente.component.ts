import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Venda } from '../../../../models/venda';
import { ClienteListComponent } from '../../../cliente/cliente-list/cliente-list.component';
import { VendaService } from '../../../../services/venda.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-selecionar-cliente',
    imports: [FormsModule, ClienteListComponent, NgClass],
    templateUrl: './selecionar-cliente.component.html',
    styleUrl: './selecionar-cliente.component.scss'
})
export class SelecionarClienteComponent implements OnInit {
  @Input() venda: Venda = new Venda();
  @Input() modoRetirada: boolean = false;
  @Output() retorno = new EventEmitter<Venda>();

  vendaNova: Venda = new Venda();

  vendaService = inject(VendaService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);

  modalRef!: NgbModalRef;
  indice!: number;
  tituloModal!: string;

  ngOnInit() {
    this.vendaNova = Object.assign({}, this.venda);
  }

  retornoCliente(cliente: any) {
    this.toastr.success('Cliente vinculado com sucesso');
    this.vendaNova.cliente = cliente;
    this.modalRef.close();
  }

  buscar(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'xl' });
  }

  byId(item1: any, item2: any) {
    if (item1 != null && item2 != null) return item1.id === item2.id;
    else return item1 === item2;
  }

  salvar() {
    if (this.vendaNova.cliente == null) {
      this.toastr.error('Cliente Obrigatório!');
      return;
    }
    if(this.modoRetirada == false && this.vendaNova.endereco == null) {
      this.toastr.error('Endereço Obrigatório!');
      return;
    }
    this.venda.cliente = this.vendaNova.cliente;
    this.venda.endereco = this.vendaNova.endereco;
    this.retorno.emit(this.venda);
  }
}
