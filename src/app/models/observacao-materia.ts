import { Materia } from "./materia";
import { Observacoes } from "./observacoes";

export class ObservacaoMateria {
    id!: number;
    ativo: boolean = true;
    observacoes!: Observacoes;
    materia!: Materia;
    quantidadeGasto!: number;
}