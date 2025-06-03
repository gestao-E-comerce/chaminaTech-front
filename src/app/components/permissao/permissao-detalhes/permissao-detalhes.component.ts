import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Permissao } from '../../../models/permissao';
import { Mensagem } from '../../../models/mensagem';
import { PermissaoService } from '../../../services/permissao.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';
import { Matriz } from '../../../models/matriz';
import { take } from 'rxjs';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-permissao-detalhes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './permissao-detalhes.component.html',
  styleUrl: './permissao-detalhes.component.scss',
})
export class PermissaoDetalhesComponent {
  @Output() retorno = new EventEmitter<Mensagem>();
  @Input() permissao: Permissao = new Permissao();

  permissaoService = inject(PermissaoService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);

  matriz!: Matriz;
  usuario!: Usuario;

  ngOnInit() {
    this.globalService
      .getMatrizAsync()
      .pipe(take(1))
      .subscribe({
        next: (matriz) => {
          this.matriz = matriz;
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
  }

  desmarcarTodos() {
    Object.keys(this.permissao).forEach((key) => {
      if (typeof this.permissao[key] === 'boolean') {
        this.permissao[key] = false;
      }
    });
  }
  toggleTodos() {
    const novoValor = !this.permissao.todos;
    Object.keys(this.permissao).forEach((key) => {
      if (typeof this.permissao[key as keyof Permissao] === 'boolean') {
        this.permissao[key as keyof Permissao] = novoValor;
      }
    });
  }
  toggleCadastrar() {
    const novoValor = !this.permissao.cadastrar;
    const permissoesRelacionadas = [
      'cadastrarProduto',
      'cadastrarCategoria',
      'cadastrarFuncionario',
      'cadastrarCliente',
      'cadastrarEstoque',
      'cadastrarDeposito',
      'cadastrarMateria',
      'cadastrarFilho',
      'cadastrarMatriz',
      'cadastrarVenda',
    ];

    permissoesRelacionadas.forEach((permissao) => {
      this.permissao[permissao as keyof Permissao] = novoValor;
    });

    this.verificarVenda();
    this.verificarCategoria();
    this.verificarCliente();
    this.verificarEstoque();
    this.verificarDeposito();
    this.verificarFuncionario();
    this.verificarMateria();
    this.verificarFilho();
    this.verificarMatriz();
    this.verificarProduto();
    this.verificarTodosAtivos();
  }
  toggleEditar() {
    const novoValor = !this.permissao.editar;
    const permissoesRelacionadas = [
      'editarProduto',
      'editarCategoria',
      'editarFuncionario',
      'editarCliente',
      'editarEstoque',
      'editarDeposito',
      'editarMateria',
      'editarFilho',
      'editarMatriz',
      'editarProdutoVenda',
    ];

    permissoesRelacionadas.forEach((permissao) => {
      this.permissao[permissao as keyof Permissao] = novoValor;
    });

    this.verificarVenda();
    this.verificarCategoria();
    this.verificarCliente();
    this.verificarEstoque();
    this.verificarDeposito();
    this.verificarFuncionario();
    this.verificarMateria();
    this.verificarFilho();
    this.verificarMatriz();
    this.verificarProduto();
    this.verificarTodosAtivos();
  }
  toggleDeletar() {
    const novoValor = !this.permissao.deletar;
    const permissoesRelacionadas = [
      'deletarProduto',
      'deletarCategoria',
      'deletarFuncionario',
      'deletarCliente',
      'deletarEstoque',
      'deletarMateria',
      'deletarFilho',
      'deletarVenda',
      'deletarProdutoVenda',
    ];

    permissoesRelacionadas.forEach((permissao) => {
      this.permissao[permissao as keyof Permissao] = novoValor;
    });

    this.verificarVenda();
    this.verificarCategoria();
    this.verificarCliente();
    this.verificarEstoque();
    this.verificarDeposito();
    this.verificarFuncionario();
    this.verificarMateria();
    this.verificarFilho();
    this.verificarProduto();
    this.verificarTodosAtivos();
  }
  toggleVenda() {
    const novoValor = !this.permissao.venda;
    const permissoesRelacionadas = [
      'cadastrarVenda',
      'transferirVenda',
      'deletarVenda',
      'liberarVenda',
      'historicoVenda',
      'imprimir',
      'vendaBalcao',
      'vendaMesa',
      'vendaEntrega',
      'vendaRetirada',
      'deletarProdutoVenda',
      'editarProdutoVenda',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });

      this.permissao.caixa = false;
      this.permissao.cadastrarSangria = false;
      this.permissao.editarSangria = false;
      this.permissao.deletarSangria = false;
      this.permissao.cadastrarSuprimento = false;
      this.permissao.editarSuprimento = false;
      this.permissao.deletarSuprimento = false;
      this.permissao.historicoCaixa = false;
      this.permissao.editarCaixa = false;
      this.permissao.deletarCaixa = false;
    }
    this.verificarTodosAtivos();
  }
  toggleCaixa() {
    const novoValor = !this.permissao.caixa;
    const permissoesRelacionadas = [
      'cadastrarSangria',
      'editarSangria',
      'deletarSangria',
      'cadastrarSuprimento',
      'editarSuprimento',
      'deletarSuprimento',
      'historicoCaixa',
      'editarCaixa',
      'deletarCaixa',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    } else {
      this.permissao.venda = true;
    }

    this.verificarTodosAtivos();
  }
  toggleCategoria() {
    const novoValor = !this.permissao.categoria;
    const permissoesRelacionadas = [
      'cadastrarCategoria',
      'editarCategoria',
      'deletarCategoria',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }
  toggleCliente() {
    const novoValor = !this.permissao.cliente;
    const permissoesRelacionadas = [
      'cadastrarCliente',
      'editarCliente',
      'deletarCliente',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }
  toggleEstoque() {
    const novoValor = !this.permissao.estoque;
    const permissoesRelacionadas = [
      'cadastrarEstoque',
      'editarEstoque',
      'deletarEstoque',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }
  toggleDeposito() {
    const novoValor = !this.permissao.deposito;
    const permissoesRelacionadas = [
      'cadastrarDeposito',
      'editarDeposito',
      'deletarDeposito',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }
  toggleFuncionario() {
    const novoValor = !this.permissao.funcionario;
    const permissoesRelacionadas = [
      'cadastrarFuncionario',
      'editarFuncionario',
      'deletarFuncionario',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }

  togglePermissao() {
    const novoValor = !this.permissao.permissao;
    const permissoesRelacionadas = [
      'cadastrarPermissao',
      'editarPermissao',
      'deletarPermissao',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }

  toggleMateria() {
    const novoValor = !this.permissao.materia;
    const permissoesRelacionadas = [
      'cadastrarMateria',
      'editarMateria',
      'deletarMateria',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }
  toggleFilho() {
    const novoValor = !this.permissao.filho;
    const permissoesRelacionadas = [
      'cadastrarFilho',
      'editarFilho',
      'deletarFilho',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }
  toggleMatriz() {
    const novoValor = !this.permissao.matriz;
    const permissoesRelacionadas = [
      'cadastrarMatriz',
      'editarMatriz',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }
  toggleProduto() {
    const novoValor = !this.permissao.produto;
    const permissoesRelacionadas = [
      'cadastrarProduto',
      'editarProduto',
      'deletarProduto',
    ];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
    this.verificarTodosAtivos();
  }
  transferirVenda() {
    const novoValor = !this.permissao.transferirVenda;
    const permissoesRelacionadas = ['cadastrarVenda'];

    permissoesRelacionadas.forEach((permissao) => {
      this.permissao[permissao as keyof Permissao] = novoValor;
    });
  }
  verificarVenda() {
    const permissoesVenda = [
      'cadastrarVenda',
      'transferirVenda',
      'deletarVenda',
      'liberarVenda',
      'historicoVenda',
      'imprimir',
      'vendaBalcao',
      'vendaMesa',
      'vendaEntrega',
      'vendaRetirada',
      'deletarProdutoVenda',
      'editarProdutoVenda',
    ];

    const vendaAtivo = permissoesVenda.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    this.permissao.venda = vendaAtivo;
    this.verificarTodosAtivos();
  }
  verificarCaixa() {
    const permissoesCaixa = [
      'sangria',
      'suprimento',
      'historicoCaixa',
      'editarCaixa',
      'deletarCaixa',
    ];

    const caixaAtivo = permissoesCaixa.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    this.permissao.caixa = caixaAtivo;
    if (caixaAtivo) {
      this.permissao.venda = true;
    }
    this.verificarTodosAtivos();
  }
  verificarCategoria() {
    const permissoesCategoria = [
      'cadastrarCategoria',
      'editarCategoria',
      'deletarCategoria',
    ];

    const categoriaAtivo = permissoesCategoria.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (categoriaAtivo) {
      this.permissao.categoria = true;
    } else {
      this.permissao.categoria = false;
    }
    this.verificarTodosAtivos();
  }
  verificarCliente() {
    const permissoesCliente = [
      'cadastrarCliente',
      'editarCliente',
      'deletarCliente',
    ];

    const clienteAtivo = permissoesCliente.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (clienteAtivo) {
      this.permissao.cliente = true;
    } else {
      this.permissao.cliente = false;
    }
    this.verificarTodosAtivos();
  }
  verificarEstoque() {
    const permissoesEstoque = ['cadastrarEstoque', 'editarEstoque'];

    const estoqueAtivo = permissoesEstoque.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (estoqueAtivo) {
      this.permissao.estoque = true;
    } else {
      this.permissao.estoque = false;
    }
    this.verificarTodosAtivos();
  }
  verificarDeposito() {
    const permissoesDeposito = ['cadastrarDeposito', 'editarDeposito'];

    const depositoAtivo = permissoesDeposito.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (depositoAtivo) {
      this.permissao.deposito = true;
    } else {
      this.permissao.deposito = false;
    }
    this.verificarTodosAtivos();
  }
  verificarFuncionario() {
    const permissoesFuncionario = [
      'cadastrarFuncionario',
      'editarFuncionario',
      'deletarFuncionario',
    ];

    const funcionarioAtivo = permissoesFuncionario.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (funcionarioAtivo) {
      this.permissao.funcionario = true;
    } else {
      this.permissao.funcionario = false;
    }
    this.verificarTodosAtivos();
  }
  verificarPermissao() {
    const permissoesPermissao = [
      'cadastrarPermissao',
      'editarPermissao',
      'deletarPermissao',
    ];

    const permissaoAtivo = permissoesPermissao.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (permissaoAtivo) {
      this.permissao.permissao = true;
    } else {
      this.permissao.permissao = false;
    }
    this.verificarTodosAtivos();
  }
  verificarMateria() {
    const permissoesMateria = [
      'cadastrarMateria',
      'editarMateria',
      'deletarMateria',
    ];

    const materiaAtivo = permissoesMateria.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (materiaAtivo) {
      this.permissao.materia = true;
    } else {
      this.permissao.materia = false;
    }
    this.verificarTodosAtivos();
  }
  verificarFilho() {
    const permissoesFilho = ['cadastrarFilho', 'editarFilho', 'deletarFilho'];

    const filhoAtivo = permissoesFilho.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (filhoAtivo) {
      this.permissao.filho = true;
    } else {
      this.permissao.filho = false;
    }
    this.verificarTodosAtivos();
  }
  verificarMatriz() {
    const permissoesMatriz = ['cadastrarMatriz', 'editarMatriz'];

    const matrizAtivo = permissoesMatriz.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (matrizAtivo) {
      this.permissao.matriz = true;
    } else {
      this.permissao.matriz = false;
    }
    this.verificarTodosAtivos();
  }
  verificarProduto() {
    const permissoesProduto = [
      'cadastrarProduto',
      'editarProduto',
      'deletarProduto',
    ];

    const produtoAtivo = permissoesProduto.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (produtoAtivo) {
      this.permissao.produto = true;
    } else {
      this.permissao.produto = false;
    }
    this.verificarTodosAtivos();
  }
  verificarTodosAtivos() {
    const todasAtivas = Object.keys(this.permissao).every(
      (key) =>
        key === 'todos' ||
        typeof this.permissao[key] !== 'boolean' ||
        this.permissao[key] === true
    );

    this.permissao.todos = todasAtivas ? true : false;

    this.verificarCadastrar();
    this.verificarEditar();
    this.verificarDeletar();
  }
  verificarCadastrar() {
    const permissoesCadastrar = [
      'cadastrarVenda',
      'cadastrarProduto',
      'cadastrarCategoria',
      'cadastrarFuncionario',
      'cadastrarCliente',
      'cadastrarEstoque',
      'cadastrarDeposito',
      'cadastrarMateria',
      'cadastrarFilho',
      'cadastrarMatriz',
    ];

    const cadastrarDesmarcado = permissoesCadastrar.some(
      (permissao) => this.permissao[permissao as keyof Permissao] === false
    );

    if (cadastrarDesmarcado) {
      this.permissao.cadastrar = false;
    } else {
      this.permissao.cadastrar = true;
    }
  }
  verificarEditar() {
    const permissoesEditar = [
      'editarProduto',
      'editarCategoria',
      'editarFuncionario',
      'editarCliente',
      'editarEstoque',
      'editarDeposito',
      'editarMateria',
      'editarFilho',
      'editarMatriz',
      'editarProdutoVenda',
    ];

    const editarDesmarcado = permissoesEditar.some(
      (permissao) => this.permissao[permissao as keyof Permissao] === false
    );

    if (editarDesmarcado) {
      this.permissao.editar = false;
    } else {
      this.permissao.editar = true;
    }
  }
  verificarDeletar() {
    const permissoesDeletar = [
      'deletarVenda',
      'deletarProduto',
      'deletarCategoria',
      'deletarFuncionario',
      'deletarCliente',
      'deletarDeposito',
      'deletarMateria',
      'deletarFilho',
      'deletarProdutoVenda',
    ];

    const deletarDesmarcado = permissoesDeletar.some(
      (permissao) => this.permissao[permissao as keyof Permissao] === false
    );

    if (deletarDesmarcado) {
      this.permissao.deletar = false;
    } else {
      this.permissao.deletar = true;
    }
  }
  salvar() {
    if (this.matriz && this.matriz.usarImpressora == false) {
      this.permissao.imprimir = false;
    }
    if (
      this.usuario &&
      this.usuario.role !== 'ADMIN' &&
      this.usuario &&
      this.usuario.role !== 'ADMINFUNCIONARIO'
    ) {
      this.permissaoService.save(this.permissao).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.retorno.emit(mensagem);
        },
        error: (erro) => {
          this.toastr.error(erro.error.mensagem);
        },
      });
    } else {
      this.permissaoService.saveAdmin(this.permissao).subscribe({
        next: (mensagem) => {
          this.toastr.success(mensagem.mensagem);
          this.retorno.emit(mensagem);
        },
        error: (erro) => {
          this.toastr.error(erro.error.mensagem);
        },
      });
    }
  }
}
