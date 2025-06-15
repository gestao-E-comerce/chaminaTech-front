import { Matriz } from "./matriz";

export class ConfiguracaoTaxaServico {
  id!: number;
  aplicar!: boolean;
  percentual!: number;
  valorFixo!: number;
  tipo!: string;
  matriz!: Matriz;
}
