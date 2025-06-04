import { Usuario } from "./usuario";

export class Permissao {
  [key: string]: any;

  id!: number;
  nome!: string;
  usuario!: Usuario;
  
  venda: boolean = false;
  transferirVenda: boolean = false;
  cadastrarVenda: boolean = false;
  deletarVenda: boolean = false;
  liberarVenda: boolean = false;
  historicoVenda: boolean = false;
  imprimir: boolean = false;

  vendaBalcao: boolean = false;
  vendaMesa: boolean = false;
  vendaEntrega: boolean = false;
  vendaRetirada: boolean = false;

  deletarProdutoVenda: boolean = false;
  editarProdutoVenda: boolean = false;

  caixa: boolean = false;
  editarCaixa: boolean = false;
  deletarCaixa: boolean = false;
  historicoCaixa: boolean = false;

  cadastrarSangria: boolean = false;
  editarSangria: boolean = false;
  deletarSangria: boolean = false;

  cadastrarSuprimento: boolean = false;
  editarSuprimento: boolean = false;
  deletarSuprimento: boolean = false;

  categoria: boolean = false;
  cadastrarCategoria: boolean = false;
  editarCategoria: boolean = false;
  deletarCategoria: boolean = false;

  cliente: boolean = false;
  cadastrarCliente: boolean = false;
  editarCliente: boolean = false;
  deletarCliente: boolean = false;

  estoque: boolean = false;
  cadastrarEstoque: boolean = false;
  editarEstoque: boolean = false;

  deposito: boolean = false;
  cadastrarDeposito: boolean = false;
  editarDeposito: boolean = false;

  funcionario: boolean = false;
  cadastrarFuncionario: boolean = false;
  editarFuncionario: boolean = false;
  deletarFuncionario: boolean = false;

  permissao: boolean = false;
  cadastrarPermissao: boolean = false;
  editarPermissao: boolean = false;
  deletarPermissao: boolean = false;

  materia: boolean = false;
  cadastrarMateria: boolean = false;
  editarMateria: boolean = false;
  deletarMateria: boolean = false;

  filho: boolean = false;
  cadastrarFilho: boolean = false;
  editarFilho: boolean = false;
  deletarFilho: boolean = false;

  matrizPermissao: boolean = false;
  cadastrarMatriz: boolean = false;
  editarMatriz: boolean = false;

  produto: boolean = false;
  cadastrarProduto: boolean = false;
  editarProduto: boolean = false;
  deletarProduto: boolean = false;

  editarConfiguracoes: boolean = false;
  auditoria: boolean = false;
}