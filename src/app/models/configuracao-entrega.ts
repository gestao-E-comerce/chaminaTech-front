import { Matriz } from "./matriz";
import { TaxaEntregaKm } from "./taxaEntregaKm";

export class ConfiguracaoEntrega {
  id!: number;
  calcular: number = 0;
  taxasEntregaKm: TaxaEntregaKm[] = [];
  matriz!: Matriz;
}
