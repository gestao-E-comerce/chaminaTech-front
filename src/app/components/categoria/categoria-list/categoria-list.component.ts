import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Mensagem } from '../../../models/mensagem';
import { CategoriaDetalhesComponent } from '../categoria-detalhes/categoria-detalhes.component';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { Categoria } from '../../../models/categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { take } from 'rxjs';
import { GlobalService } from '../../../services/global.service';
import { Observacoes } from '../../../models/observacoes';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [FormsModule, CategoriaDetalhesComponent, RouterLink],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.scss',
})
export class CategoriaListComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  listaCategoriasOrginal: Categoria[] = [];
  listaCategoriasFiltrada: Categoria[] = [];
  categoria!: Categoria;
  usuario!: Usuario;

  categoriaService = inject(CategoriaService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  globalService = inject(GlobalService);
  modalRef!: NgbModalRef;

  indice!: number;
  tituloModal!: string;
  nome?: string = '';
  ativo?: string = '';

  ngOnInit() {
    this.filtrarCategorias();

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }

  atualizarListaCategoria(mensagem: Mensagem) {
    this.modalRef.dismiss();
    this.filtrarCategorias();
  }

  cadastrarCategoria(modalCategoria: any) {
    this.categoria = new Categoria();
    this.modalRef = this.modalService.open(modalCategoria, { size: 'xl' });

    this.tituloModal = 'Cadastrar Categoria';
  }

  editarCategoria(modal: any, categoria: Categoria, indice: number) {
    this.categoria = Object.assign({}, categoria);
    this.indice = indice;
    this.modalRef = this.modalService.open(modal, { size: 'xl' });

    this.tituloModal = 'Editar Categoria';
  }

  deletarCategoria(modal: any, categoria: Categoria, indice: number) {
    this.categoria = Object.assign({}, categoria);
    this.indice = indice;
    this.modalRef = this.modalService.open(modal, { size: 'sm' });

    this.tituloModal = 'Deleter Categoria';
  }
  copiar(modal: any, categoria: Categoria) {
    this.categoria = {
      ...categoria,
      id: undefined as unknown as number,
      produtos: [],
      observacoesCategoria: categoria.observacoesCategoria?.map(obs => ({
      ...obs,
      id: undefined as unknown as number,
      categoria: undefined as unknown as Categoria,
      observacaoMaterias: obs.observacaoMaterias?.map(mat => ({
        ...mat,
        id: undefined as unknown as number,
        observacoes: undefined as unknown as Observacoes
      })) || [],
      observacaoProdutos: obs.observacaoProdutos?.map(prod => ({
        ...prod,
        id: undefined as unknown as number,
        observacoes: undefined as unknown as Observacoes
      })) || [],
    })) || []
    };

    this.modalRef = this.modalService.open(modal, { size: 'xl' });
    this.tituloModal = 'Copiar Categoria';
  }

  confirmarExclusaoCategoria(categoria: Categoria) {
    this.categoriaService.deletar(categoria.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarCategorias();
        this.modalRef.close();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  ativarOuDesativarCategoria(categoria: Categoria) {
    this.categoriaService.ativarOuDesativarCategoria(categoria).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarCategorias();
      },
    });
  }

  filtrarCategorias() {
    this.nome = this.nome?.toLocaleUpperCase();
    this.categoriaService.listarCategorias(this.ativo, this.nome).subscribe({
      next: (lista) => {
        this.listaCategoriasOrginal = lista;
        this.listaCategoriasFiltrada = lista;
      },
      error: () => {
        this.toastr.error('Erro ao filtrar categorias.');
      },
    });
  }
}
