import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MateriaDetalhesComponent } from '../materia-detalhes/materia-detalhes.component';
import { Materia } from '../../../models/materia';
import { MateriaService } from '../../../services/materia.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Mensagem } from '../../../models/mensagem';
import { Usuario } from '../../../models/usuario';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Produto } from '../../../models/produto';
import { Observacoes } from '../../../models/observacoes';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-materia-list',
  standalone: true,
  imports: [MateriaDetalhesComponent, FormsModule, RouterLink, NgClass],
  templateUrl: './materia-list.component.html',
  styleUrl: './materia-list.component.scss',
})
export class MateriaListComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  @Input() modoVincular: boolean = false;
  @Input() produto!: Produto;
  @Input() observacoes!: Observacoes;

  listaMateriasOrginal: Materia[] = [];
  listaMateriasFiltrada: Materia[] = [];
  materia!: Materia;
  usuario!: Usuario;

  materiaService = inject(MateriaService);
  globalService = inject(GlobalService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  modalRef!: NgbModalRef;

  tituloModal!: string;
  indice!: number;
  nome?: string = '';
  ativo?: string = '';

  ngOnInit() {
    this.filtrarMaterias();

    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
  }

  atualizarListaMateria(menssagem: Mensagem) {
    this.modalRef.close();
    this.filtrarMaterias();
  }

  cadastrarMateria(modalMateria: any) {
    this.materia = new Materia();
    this.modalRef = this.modalService.open(modalMateria, { size: 'md' });
    this.tituloModal = 'Cadastrar Matéria';
  }

  editarMateria(modalMateria: any, materia: Materia, indice: number) {
    this.materia = Object.assign({}, materia);
    this.indice = indice;

    this.modalRef = this.modalService.open(modalMateria, { size: 'md' });
    this.tituloModal = 'Editar Matéria';
  }

  deletarMateria(modal: any, materia: Materia, indice: number) {
    this.materia = Object.assign({}, materia);
    this.indice = indice;

    this.modalRef = this.modalService.open(modal, { size: 'sm' });
    this.tituloModal = 'Deletar Funcionário';
  }

  confirmarExclusaoMateria(materia: Materia) {
    this.materiaService.deletar(materia.id).subscribe({
      next: (mensagem: Mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarMaterias();
        this.modalRef.close();
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }

  ativarOuDesativarMateria(materia: Materia) {
    this.materiaService.ativarOuDesativarMateria(materia).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.filtrarMaterias();
      },
    });
  }

  vincular(materia: Materia) {
    this.retorno.emit(materia);
  }

  filtrarMaterias() {
    if (this.modoVincular) {
      this.ativo = 'true';
    }
    this.nome = this.nome?.toLocaleUpperCase();
    this.materiaService.listarMaterias(this.nome, this.ativo).subscribe({
      next: (lista) => {
        if (this.produto || this.observacoes) {
          lista = lista.filter((materia) => {
            const jaFoiAdicionado =
              this.produto?.produtoMaterias?.some(
                (pp) => pp.materia?.id === materia.id
              ) ||
              this.observacoes?.observacaoMaterias?.some(
                (om) => om.materia?.id === materia.id
              );
            return !jaFoiAdicionado;
          });
        }
        this.listaMateriasOrginal = lista;
        this.listaMateriasFiltrada = lista;
      },
      error: () => {
        this.toastr.error('Erro ao filtrar materiais.');
      },
    });
  }
}
