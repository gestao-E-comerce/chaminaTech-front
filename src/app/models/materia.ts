import { Matriz } from "./matriz";

export class Materia {
    id!: number;
    ativo!: boolean;
    nome!: string;
    matriz!: Matriz;
    quantidadeDisponivel!: number;
    quantidadeDescartada!: number;
}
