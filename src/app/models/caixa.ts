import { Funcionario } from "./funcionario";
import { Matriz } from "./matriz";
import { Sangria } from "./sangria";
import { Suprimento } from "./suprimento";
import { Venda } from "./venda";

export class Caixa {
    id!: number;
    ativo!: boolean;
    valorAbertura!: number;
    saldoDinheiro!: number;
    saldoCredito!: number;
    saldoDebito!: number;
    saldoPix!: number;
    saldo!: number;
    nomeImpressora!: string | null;
    dataAbertura!: Date;
    dataFechamento!: Date;
    funcionario!: Funcionario;
    matriz!: Matriz;
    vendas!: Venda[];
    sangrias!: Sangria[];
    suprimentos!: Suprimento[];
}