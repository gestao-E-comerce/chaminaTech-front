import { Matriz } from "./matriz";
import { Observacoes } from "./observacoes";
import { Produto } from "./produto";

export class Categoria {
    id!: number;
    ativo!: boolean;
    nome!: string;
    obsObrigatotio!: boolean;
    maxObs!: number;
    produtos!: Produto[];
    matriz!: Matriz;
    observacoesCategoria!: Observacoes[];
}