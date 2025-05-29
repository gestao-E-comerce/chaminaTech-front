import { Endereco } from "./endereco";
import { Matriz } from "./matriz";

export class Cliente {
    id!: number;
    ativo!: boolean;
    nome!: string;
    cpf!: string;
    celular!: string;
    enderecos!: Endereco[];
    matriz!: Matriz;
}