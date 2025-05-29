import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Permissao } from '../../../models/permissao';
import { ToastrService } from 'ngx-toastr';
import { PermissaoService } from '../../../services/permissao.service';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PermissaoDetalhesComponent } from '../permissao-detalhes/permissao-detalhes.component';
import { Mensagem } from '../../../models/mensagem';
import { Usuario } from '../../../models/usuario';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-permissao-lista',
  standalone: true,
  imports: [FormsModule, PermissaoDetalhesComponent],
  templateUrl: './permissao-lista.component.html',
  styleUrl: './permissao-lista.component.scss',
})
export class PermissaoListaComponent {
  @Output() retornoPermissao = new EventEmitter<any>();

  permissao: Permissao = new Permissao();
  usuario!: Usuario;

  toastr = inject(ToastrService);
  permissaoService = inject(PermissaoService);
  modalService = inject(NgbModal);
  globalService = inject(GlobalService);
  modalRef!: NgbModalRef;

  listaPermissaos: Permissao[] = [];
  tituloModal!: string;
  indice!: number;

  ngOnInit() {
    
    this.globalService
    .getUsuarioAsync()
    .pipe(take(1))
    .subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.listarPermissaos();
        },
      });
  }

  listarPermissaos() {
    if (
      this.usuario &&
      (this.usuario.role === 'ADMIN' ||
        this.usuario.role === 'ADMINFUNCIONARIO')
    ) {
      this.permissaoService.listarPermissaosPorUsuarioIdAdmin().subscribe({
        next: (lista) => {
          this.listaPermissaos = lista;
        },
      });
    } else {
      this.permissaoService.listarPermissaosPorUsuarioId().subscribe({
        next: (lista) => {
          this.listaPermissaos = lista;
        },
      });
    }
  }

  atualizarListaPermissaos(menssagem: Mensagem) {
    this.modalRef.dismiss();
    this.listarPermissaos();
  }

  cadastrarPermissao(modalPermissao: any) {
    this.permissao = new Permissao();
    this.modalRef = this.modalService.open(modalPermissao, {
      size: 'fullscreen',
    });
    this.tituloModal = 'Cadastrar grupo permissões';
  }
  editarPermissao(modal: any, permissao: Permissao, indice: number) {
    this.permissao = Object.assign({}, permissao);
    this.indice = indice;

    this.modalRef = this.modalService.open(modal, { size: 'fullscreen' });
    this.tituloModal = 'Editar Permissão';
  }

  deletarPermissao(modal: any, permissao: Permissao, indice: number) {
    this.permissao = Object.assign({}, permissao);
    this.indice = indice;

    this.modalRef = this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Permissão';
  }

  confirmarExclusaoPermissao(permissao: Permissao) {
    this.permissaoService.deletar(permissao.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.listarPermissaos();
        this.modalRef.close();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  vincular(permissao: Permissao) {
    this.retornoPermissao.emit(permissao);
  }

  copiar(modal: any, permissao: Permissao) {
    this.permissao = { ...permissao, id: undefined as unknown as number };

    this.modalRef = this.modalService.open(modal, { size: 'xl' });
    this.tituloModal = 'Copiar Permissão';
  }
}
