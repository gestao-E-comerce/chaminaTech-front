import { Permissao } from "./permissao";

export class Usuario {
    id!: number;
    ativo!: boolean;
    deletado!: boolean;
    nome!: string;
    cpf!: string;
    cnpj!: string;
    username!: string;
    celular!: string;
    email!: string;
    password!: string;
    role!: string;
    token!: string;
    permissao!: Permissao;
}