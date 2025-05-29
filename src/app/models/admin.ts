import { AdminFuncionario } from "./admin-funcionario";
import { Matriz } from "./matriz";
import { Usuario } from "./usuario";

export class Admin extends Usuario{
    chaveApiCoordenades!: string;
    matrizs!: Matriz[];
    adminFuncionarios!: AdminFuncionario[];
}