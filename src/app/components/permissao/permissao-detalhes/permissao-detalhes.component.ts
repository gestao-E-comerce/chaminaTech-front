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
    // Definir as permissões visíveis que o usuário tem acesso
    const permissoesVisiveis = [
      'venda',
      'transferirVenda',
      'cadastrarVenda',
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
      'caixa',
      'editarCaixa',
      'deletarCaixa',
      'historicoCaixa',
      'cadastrarSangria',
      'editarSangria',
      'deletarSangria',
      'cadastrarSuprimento',
      'editarSuprimento',
      'deletarSuprimento',
      'categoria',
      'cadastrarCategoria',
      'editarCategoria',
      'deletarCategoria',
      'cliente',
      'cadastrarCliente',
      'editarCliente',
      'deletarCliente',
      'estoque',
      'cadastrarEstoque',
      'editarEstoque',
      'deposito',
      'cadastrarDeposito',
      'editarDeposito',
      'funcionario',
      'cadastrarFuncionario',
      'editarFuncionario',
      'deletarFuncionario',
      'permissao',
      'cadastrarPermissao',
      'editarPermissao',
      'deletarPermissao',
      'materia',
      'cadastrarMateria',
      'editarMateria',
      'deletarMateria',
      'filho',
      'cadastrarFilho',
      'editarFilho',
      'deletarFilho',
      'matriz',
      'cadastrarMatriz',
      'editarMatriz',
      'produto',
      'cadastrarProduto',
      'editarProduto',
      'deletarProduto',
      'editarConfiguracoes',
      'auditoria',
    ];

    // Desmarcar as permissões visíveis
    permissoesVisiveis.forEach((permissao) => {
      if (this.usuario.permissao[permissao]) {
        // Verifica se o usuário tem a permissão
        this.permissao[permissao as keyof Permissao] = false; // Desmarcar
      }
    });
    // Verificar se todas estão ativas
  }
  toggleTodos() {
    // Definindo as permissões visíveis
    const permissoesVisiveis = [
      'venda',
      'transferirVenda',
      'cadastrarVenda',
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
      'caixa',
      'editarCaixa',
      'deletarCaixa',
      'historicoCaixa',
      'cadastrarSangria',
      'editarSangria',
      'deletarSangria',
      'cadastrarSuprimento',
      'editarSuprimento',
      'deletarSuprimento',
      'categoria',
      'cadastrarCategoria',
      'editarCategoria',
      'deletarCategoria',
      'cliente',
      'cadastrarCliente',
      'editarCliente',
      'deletarCliente',
      'estoque',
      'cadastrarEstoque',
      'editarEstoque',
      'deposito',
      'cadastrarDeposito',
      'editarDeposito',
      'funcionario',
      'cadastrarFuncionario',
      'editarFuncionario',
      'deletarFuncionario',
      'permissao',
      'cadastrarPermissao',
      'editarPermissao',
      'deletarPermissao',
      'materia',
      'cadastrarMateria',
      'editarMateria',
      'deletarMateria',
      'filho',
      'cadastrarFilho',
      'editarFilho',
      'deletarFilho',
      'matriz',
      'cadastrarMatriz',
      'editarMatriz',
      'produto',
      'cadastrarProduto',
      'editarProduto',
      'deletarProduto',
      'editarConfiguracoes',
      'auditoria',
    ];

    // Atualiza as permissões visíveis
    permissoesVisiveis.forEach((permissao) => {
      if (this.usuario.permissao[permissao]) {
        // Verifica se o usuário tem a permissão
        this.permissao[permissao as keyof Permissao] = true; // Marca/desmarca
      }
    });
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
  }
  toggleMatriz() {
    const novoValor = !this.permissao.matrizPermissao;
    const permissoesRelacionadas = ['cadastrarMatriz', 'editarMatriz'];

    if (novoValor == false) {
      permissoesRelacionadas.forEach((permissao) => {
        this.permissao[permissao as keyof Permissao] = novoValor;
      });
    }
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
  }
  verificarMatriz() {
    const permissoesMatriz = ['cadastrarMatriz', 'editarMatriz'];

    const matrizAtivo = permissoesMatriz.some(
      (permissao) => this.permissao[permissao as keyof Permissao]
    );

    if (matrizAtivo) {
      this.permissao.matrizPermissao = true;
    } else {
      this.permissao.matrizPermissao = false;
    }
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
