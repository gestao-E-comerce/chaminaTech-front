import { Categoria } from "./categoria";
import { Impressora } from "./impressora";
import { Matriz } from "./matriz";
import { ProdutoComposto } from "./produto-composto";
import { ProdutoMateria } from "./produto-materia";

export class Produto {
    id!: number;
    ativo!: boolean;
    cardapio!: boolean;
    nome!: string;
    valor!: number;
    tipo!: boolean;
    codigo!: number;
    validarExestencia!: boolean;
    estocavel!: boolean;
    deveImprimir!: boolean;
    produtoMaterias: ProdutoMateria[] = [];
    produtoCompostos: ProdutoComposto[] = [];
    matriz!: Matriz;
    categoria!: Categoria;
    quantidadeTotal!: number;
    impressoras: Impressora[] = [];
    quantidadeDisponivel!: number;
    quantidadeDescartada!: number;
}