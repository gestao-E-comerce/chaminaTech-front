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
import { Produto } from '../../../models/produto';
import { Mensagem } from '../../../models/mensagem';
import { ProdutoService } from '../../../services/produto.service';
import { ToastrService } from 'ngx-toastr';
import { SelecionarMateriasComponent } from './selecionar-materias/selecionar-materias.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProdutoMateria } from '../../../models/produto-materia';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria';
import { ProdutoComposto } from '../../../models/produto-composto';
import { SelecionarProdutosComponent } from './selecionar-produtos/selecionar-produtos.component';
import { ImpressorasComponent } from './impressoras/impressoras.component';
import { Impressora } from '../../../models/impressora';
import { NgClass } from '@angular/common';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { Matriz } from '../../../models/matriz';

@Component({
    selector: 'app-produto-detalhes',
    imports: [
        FormsModule,
        SelecionarMateriasComponent,
        SelecionarProdutosComponent,
        ImpressorasComponent,
        NgClass,
    ],
    templateUrl: './produto-detalhes.component.html',
    styleUrls: ['./produto-detalhes.component.scss']
})
export class ProdutoDetalhesComponent implements OnInit {
  @Input() produto: Produto = new Produto();
  @Output() retorno = new EventEmitter<Mensagem>();

  produtoService = inject(ProdutoService);
  categoriaService = inject(CategoriaService);
  globalService = inject(GlobalService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);
  modalRef!: NgbModalRef;

  matriz!: Matriz;

  produtoMateria: ProdutoMateria = new ProdutoMateria();
  produtoComposto: ProdutoComposto = new ProdutoComposto();
  indice!: number;
  tituloModal!: string;

  listaCategorias: Categoria[] = [];

  @HostListener('document:keydown.enter', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.salvar();
  }

  ngOnInit() {
    this.carregarCategorias();

    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
        },
      });
  }

  carregarCategorias() {
    this.categoriaService.listarCategorias().subscribe({
      next: (lista) => {
        this.listaCategorias = lista;
      },
    });
  }

  atualizarListaMaterias(materia: ProdutoMateria) {
    if (this.produto.produtoMaterias == null) this.produto.produtoMaterias = [];
    if (this.indice == -1)
      this.produto.produtoMaterias.push(Object.assign({}, materia));
    else {
      this.produto.produtoMaterias[this.indice] = Object.assign({}, materia);
    }
    this.modalRef.dismiss();
  }

  atualizarListaProdutos(produto: ProdutoComposto) {
    if (this.produto.produtoCompostos == null)
      this.produto.produtoCompostos = [];
    if (this.indice == -1)
      this.produto.produtoCompostos.push(Object.assign({}, produto));
    else {
      this.produto.produtoCompostos[this.indice] = Object.assign({}, produto);
    }
    this.modalRef.dismiss();
  }

  retornoImpressora(impressora: Impressora) {
    const jaExiste = this.produto.impressoras.some(
      (imp) => imp.apelidoImpressora === impressora.apelidoImpressora
    );

    if (!jaExiste) {
      this.produto.impressoras.push(impressora);
    }

    this.modalRef.dismiss();
  }

  adicionarImpressora(modalListarImpressoras: any, produto: Produto) {
    this.produto = Object.assign({}, produto);
    this.modalRef = this.modalService.open(modalListarImpressoras, {
      size: 'md',
    });

    this.tituloModal = 'Selecione Impressora';
  }

  deletarImpressora(index: number) {
    this.produto.impressoras.splice(index, 1);
  }

  adicionarMateria(modalListarMaterias: any) {
    this.indice = -1;
    this.produtoMateria = new ProdutoMateria();
    this.modalRef = this.modalService.open(modalListarMaterias, { size: 'md' });

    this.tituloModal = 'Adicionar Matéria';
  }

  editarMateria(modal: any, materia: ProdutoMateria, indice: number) {
    this.produtoMateria = Object.assign({}, materia);
    this.indice = indice;
    this.modalRef = this.modalService.open(modal, { size: 'md' });

    this.tituloModal = 'Editar Matéria';
  }

  deletarMateria(index: number) {
    const materia = this.produto.produtoMaterias[index];
    if (materia.id) {
      materia.ativo = false;
    } else {
      this.produto.produtoMaterias.splice(index, 1);
    }
  }

  adicionarProduto(modalListarProdutos: any) {
    this.indice = -1;
    this.produtoComposto = new ProdutoComposto();
    this.modalRef = this.modalService.open(modalListarProdutos, { size: 'md' });

    this.tituloModal = 'Adicionar Produto';
  }

  editarProduto(modal: any, produto: ProdutoComposto, indice: number) {
    this.produtoComposto = Object.assign({}, produto);
    this.indice = indice;
    this.modalRef = this.modalService.open(modal, { size: 'md' });

    this.tituloModal = 'Editar Produto';
  }

  deletarProduto(index: number) {
    const produto = this.produto.produtoCompostos[index];
    if (produto.id) {
      produto.ativo = false;
    } else {
      this.produto.produtoCompostos.splice(index, 1);
    }
  }

  salvar() {
    if (!this.produto.impressoras?.length) {
      this.produto.deveImprimir = false;
    }
    if (!this.produto.nome?.trim()) {
      this.toastr.error('Nome do produto é obrigatório!');
      return;
    }

    if (this.produto.valor == null) {
      this.toastr.error('Valor do produto é obrigatório!');
      return;
    }

    if (this.produto.codigo == null) {
      this.toastr.error('Código do produto é obrigatório!');
      return;
    }

    if (this.produto.tipo == null) {
      this.toastr.error('Selecione a unidade de venda (Peso ou Unidade)!');
      return;
    }

    if (!this.produto.categoria) {
      this.toastr.error('Categoria é obrigatória!');
      return;
    }

    if (this.produto.validarExestencia == null) {
      this.toastr.error('É necessário definir se o estoque será validado!');
      return;
    }

    if (
      this.produto.validarExestencia === true &&
      this.produto.estocavel == null
    ) {
      this.toastr.error('Informe se o produto é estocável!');
      return;
    }
    this.produtoService.save(this.produto).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.retorno.emit(mensagem);
      },
      error: (erro) => this.toastr.error(erro.error.mensagem),
    });
  }

  byId(item1: any, item2: any) {
    if (item1 != null && item2 != null) return item1.id === item2.id;
    else return item1 === item2;
  }
}
