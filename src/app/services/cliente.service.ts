import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Cliente } from '../models/cliente';
import { Mensagem } from '../models/mensagem';
import { GlobalService } from './global.service';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly API = `${Config.BACKEND_URL}/api/cliente`;
  http = inject(HttpClient);
  globalService = inject(GlobalService);

  listarClientesPorMatrizId(): Observable<Cliente[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Cliente[]>(`${this.API}/lista/${matriz.id}`);
      })
    );
  }

  buscarPorNome(termoPesquisa: string): Observable<Cliente[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Cliente[]>(`${this.API}/porNome?matrizId=${matriz.id}&termoPesquisa=${termoPesquisa}`);
      })
    );
  }
  
  buscarPorCpf(termoPesquisa: string): Observable<Cliente[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Cliente[]>(`${this.API}/porCpf?matrizId=${matriz.id}&termoPesquisa=${termoPesquisa}`);
      })
    );
  }
  
  buscarPorCelular(termoPesquisa: string): Observable<Cliente[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Cliente[]>(`${this.API}/porCelular?matrizId=${matriz.id}&termoPesquisa=${termoPesquisa}`);
      })
    );
  }
  
  buscarPorCep(termoPesquisa: string): Observable<Cliente[]> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        return this.http.get<Cliente[]>(`${this.API}/porCep?matrizId=${matriz.id}&termoPesquisa=${termoPesquisa}`);
      })
    );
  }

  save(cliente: Cliente): Observable<Mensagem> {
    return this.globalService.getMatrizAsync().pipe(
      switchMap((matriz) => {
        cliente.matriz = matriz;
        if (cliente.id) {
          return this.http.put<Mensagem>(`${this.API}/${cliente.id}`, cliente);
        } else {
          return this.http.post<Mensagem>(this.API, cliente);
        }
      })
    );
  }

  deletar(id: number): Observable<Mensagem> {
    return this.http.delete<Mensagem>(`${this.API}/${id}`);
  }
}
