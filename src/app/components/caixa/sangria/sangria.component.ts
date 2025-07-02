import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sangria } from '../../../models/sangria';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Funcionario } from '../../../models/funcionario';
import { LoginService } from '../../../services/login.service';
import { SangriaService } from '../../../services/sangria.service';
import { GlobalService } from '../../../services/global.service';
import { take } from 'rxjs';
import { Matriz } from '../../../models/matriz';
import { FuncionarioService } from '../../../services/funcionario.service';
import { Usuario } from '../../../models/usuario';
import { ListaProdutosSelecionarComponent } from '../../produto/produto-detalhes/selecionar-produtos/lista-produtos-selecionar/lista-produtos-selecionar.component';
import { Produto } from '../../../models/produto';
import { Estoque } from '../../../models/estoque';
import { EstoqueService } from '../../../services/estoque.service';

@Component({
    selector: 'app-sangria',
    imports: [FormsModule, NgClass, ListaProdutosSelecionarComponent],
    templateUrl: './sangria.component.html',
    styleUrl: './sangria.component.scss'
})
export class SangriaComponent implements OnInit {
  @Output() retorno = new EventEmitter<any>();
  @Input() sangria: Sangria = new Sangria();
  @Input() produto!: Produto;
  funcionario: Funcionario = new Funcionario();
  estoque: Estoque = new Estoque();
  matriz!: Matriz;
  usuario!: Usuario;
  funcionarios: Funcionario[] = [];

  funcionarioService = inject(FuncionarioService);
  estoqueService = inject(EstoqueService);
  sangriaService = inject(SangriaService);
  globalService = inject(GlobalService);
  modalService = inject(NgbModal);
  toastr = inject(ToastrService);

  modalRef!: NgbModalRef;

  ngOnInit() {
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
          this.funcionarioService.listarFuncionarios().subscribe({
            next: (list) => {
              this.funcionarios = list.filter((f) => !f.deletado);
            },
          });
        },
      });
    this.globalService
      .getUsuarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
      });
    this.globalService
      .getFuncionarioAsync()
      .pipe(take(1))
      .subscribe({
        next: (funcionario) => {
          this.funcionario = funcionario;
        },
      });
  }
  retornoProduto(produto: any) {
    this.toastr.success('Produto vinculada com sucesso');
    this.estoque.produto = produto;
    this.modalRef.close();
  }
  buscar(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'xl' });
  }
  salvar(modalConfermacao: any, formulario: any) {
    if (!this.sangria.tipo?.trim()) {
      this.toastr.error('Tipo indefinido!!');
      return;
    }
    if (this.sangria.tipo === 'FUNCIONARIO') {
      if (!this.sangria.nomeFuncionario?.trim()) {
        this.toastr.error('Funcionário indefinido!!');
        return;
      }
    }
    if (this.sangria.tipo === 'MERCADORIA') {
      if (this.estoque.produto == null) {
        this.toastr.error('Produto indefinido!');
        return;
      } else if (!this.estoque.quantidade?.toString().trim()) {
        this.toastr.error('Quantidade indefinido!');
        return;
      }
    }
    if (!formulario.valid) {
      this.toastr.error('Formulário inválido. Preencha os campos corretamente');
      Object.keys(formulario.controls).forEach((campo) => {
        formulario.controls[campo].markAsTouched();
      });
    } else {
      this.modalRef = this.modalService.open(modalConfermacao, { size: 'mm' });
    }
  }
  confirmarSangria() {
    this.sangria.funcionario = this.funcionario;
    if(this.matriz.configuracaoImpressao.imprimirSangria) {
      this.sangria.nomeImpressora = this.getNomeImpressora();
    }
    this.sangriaService.save(this.sangria).subscribe({
      next: (mensagem) => {
        this.toastr.success(mensagem.mensagem);
        this.modalService.dismissAll();
        this.retorno.emit('ok');
        if (this.sangria.tipo === 'MERCADORIA') {
          this.estoque.valorTotal = this.sangria.valor;
          this.estoqueService.save(this.estoque).subscribe({
            next: (mensagem) => {},
            error: (erro) => {
              this.toastr.error(erro.error.mensagem);
            },
          });
        }
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
        this.modalRef.close();
      },
    });
  }
  getNomeImpressora(): string | null {
    const valor = localStorage.getItem('identificador');
    if (!valor) return null;

    const partes = valor.split('/');
    return partes.length === 2 ? partes[0] : null;
  }
  byId(item1: any, item2: any) {
    if (item1 != null && item2 != null) return item1.id === item2.id;
    else return item1 === item2;
  }
}
