import { Caixa } from "./caixa";
import { Permissao } from "./permissao";
import { Matriz } from "./matriz";
import { Usuario } from "./usuario";

export class Funcionario extends Usuario{
    salario!: number;
    matriz!: Matriz;
    caixas!: Caixa[];
    preferenciaImpressaoProdutoNovo!: string;
    preferenciaImpressaoProdutoDeletado!: string;
}