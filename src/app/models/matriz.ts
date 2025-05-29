import { Categoria } from "./categoria";
import { Cliente } from "./cliente";
import { Deposito } from "./deposito";
import { Estoque } from "./estoque";
import { Funcionario } from "./funcionario";
import { GestaoCaixa } from "./gestao-caixa";
import { Identificador } from "./identificador";
import { Impressora } from "./impressora";
import { Materia } from "./materia";
import { Produto } from "./produto";
import { TaxaEntregaKm } from "./taxaEntregaKm";
import { Usuario } from "./usuario";
import { Venda } from "./venda";

export class Matriz extends Usuario{
    funcionarios!: Funcionario[];
    filhos!: Matriz[];
    matriz!: Matriz;
    depositos!: Deposito[];
    estoques!: Estoque[];
    materias!: Materia[];
    produtos!: Produto[];
    vendas!: Venda[];
    categorias!: Categoria[];
    clientes!: Cliente[];
    gestaoCaixas!: GestaoCaixa[];
    impressoras: Impressora[] = [];
    forcarRemocaoImpressora: boolean = false;
    identificador: Identificador[] = [];
    usarImpressora: boolean = true;
    imprimirComprovanteRecebementoBalcao: boolean = true;
    imprimirComprovanteRecebementoEntrega: boolean = true;
    imprimirComprovanteRecebementoMesa: boolean = true;
    imprimirComprovanteRecebementoRetirada: boolean = true;
    imprimirComprovanteDeletarVenda: boolean = true;
    imprimirComprovanteDeletarProduto: boolean = true;
    imprimirConferenciaRetirada: boolean = true;
    imprimirConferenciaEntrega: boolean = true;
    imprimirNotaFiscal: number = 0;
    imprimirCadastrar: number = 0;
    imprimirDeletar: number = 0;
    mostarMotivoDeletarVenda: boolean = true;
    mostarMotivoDeletarProduto: boolean = true;

    calcular: number = 0;
    taxasEntregaKm: TaxaEntregaKm[] = [];
    tempoEstimadoRetidara!: number;

    estado!: string;
    cidade!: string;
    bairro!: string;
    cep!: string;
    rua!: string;
    numero!: number;
    latitude?: number;
    longitude?: number;
}