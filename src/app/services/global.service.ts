import { inject, Injectable, Injector } from '@angular/core';
import { Matriz } from '../models/matriz';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Funcionario } from '../models/funcionario';
import { LoginService } from './login.service';
import { AdminService } from './admin.service';
import { UsuarioService } from './usuario.service';
import { Caixa } from '../models/caixa';
import { Admin } from '../models/admin';
import { AdminFuncionario } from '../models/admin-funcionario';
import { Config } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private readonly API_ADMIN_FUNCIONARIO = `${Config.BACKEND_URL}/adminFuncionario`;
  private readonly API_ADMIN = `${Config.BACKEND_URL}/admin`;
  private readonly API_FUNCIONARIO = `${Config.BACKEND_URL}/funcionario`;
  private readonly API_MATRIZ = `${Config.BACKEND_URL}/matriz`;
  private readonly API_CAIXA = `${Config.BACKEND_URL}/caixa`;
  http = inject(HttpClient);
  injector = inject(Injector);
  adminService = inject(AdminService);
  usuarioService = inject(UsuarioService);

  private matriz!: Matriz;
  private matrizObs$: Observable<Matriz> | null = null;
  private admin!: Admin;
  private adminObs$: Observable<Admin> | null = null;
  private usuario!: Usuario;
  private usuarioObs$: Observable<Usuario> | null = null;
  private funcionario!: Funcionario;
  private funcionarioObs$: Observable<Funcionario> | null = null;
  private adminFuncionario!: AdminFuncionario;
  private adminFuncionarioObs$: Observable<AdminFuncionario> | null = null;
  private caixa!: Caixa | null;
  private caixaObs$: Observable<Caixa | null> | null = null;
  private modoTouchSubject!: BehaviorSubject<boolean>;
  modoTouch$!: Observable<boolean>;
  private temaSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    'claro'
  );
  tema$: Observable<string> = this.temaSubject.asObservable();

  constructor() {
    this.initModoTouch();
    this.monitorarTamanhoTela();
    this.initTema();
  }
  initTema(): void {
    const temaLocal = localStorage.getItem('tema') as 'claro' | 'escuro' | null;
    this.setTema(temaLocal || 'claro');
  }

  getTema(): 'claro' | 'escuro' {
    return this.temaSubject.value as 'claro' | 'escuro';
  }

  setTema(tema: 'claro' | 'escuro') {
    this.temaSubject.next(tema);
    localStorage.setItem('tema', tema);

    const root = document.documentElement;
    if (tema === 'escuro') {
      root.classList.add('modo-escuro');
    } else {
      root.classList.remove('modo-escuro');
    }
  }

  private initModoTouch(): void {
    const localValue = localStorage.getItem('modoTouch');

    if (localValue === null) {
      this.setModoTouch(false);
      this.modoTouchSubject = new BehaviorSubject<boolean>(false);
    } else {
      this.modoTouchSubject = new BehaviorSubject<boolean>(
        localValue === 'true'
      );
    }

    this.modoTouch$ = this.modoTouchSubject.asObservable();
  }
  private monitorarTamanhoTela(): void {
    window.addEventListener('resize', () => {
      const largura = window.innerWidth;

      // Só força modoTouch = true quando for tela pequena
      if (largura <= 1024) {
        if (!this.modoTouchSubject.value) {
          this.setModoTouch(true);
        }
      }
    });
  }

  setModoTouch(valor: boolean) {
    localStorage.setItem('modoTouch', valor.toString());
    this.modoTouchSubject.next(valor);
    window.location.reload(); 
  }

  getModoTouch(): boolean {
    return this.modoTouchSubject.value;
  }

  getCaixaAsync(): Observable<Caixa | null> {
    if (this.caixa) return of(this.caixa);
    if (this.caixaObs$) return this.caixaObs$;

    const loginService = this.injector.get(LoginService);
    const usuarioId = loginService.getUser().id;

    this.caixaObs$ = this.buscarCaixaAtivaPorFuncionario(usuarioId).pipe(
      map((caixa) => {
        if (caixa) this.caixa = caixa;
        return caixa;
      }),
      shareReplay(1)
    );

    return this.caixaObs$;
  }
  setCaixa(caixa: Caixa): void {
    this.caixa = caixa;
    this.caixaObs$ = of(caixa); // Atualiza o observable do caixa
  }

  buscarCaixaAtivaPorFuncionario(
    funcionarioId: number
  ): Observable<Caixa | null> {
    return this.http.get<Caixa | null>(
      `${this.API_CAIXA}/caixa-ativa/${funcionarioId}`
    );
  }

  getUsuarioAsync(): Observable<Usuario> {
    if (this.usuario) return of(this.usuario);
    if (this.usuarioObs$) return this.usuarioObs$;

    const loginService = this.injector.get(LoginService);
    const usuarioId = loginService.getUser().id;

    this.usuarioObs$ = this.usuarioService.buscarUsuarioPorId(usuarioId).pipe(
      switchMap((usuario) => {
        this.usuario = usuario;
        return of(usuario);
      }),
      shareReplay(1)
    );

    return this.usuarioObs$;
  }

  getFuncionarioAsync(): Observable<Funcionario> {
    if (this.funcionario) return of(this.funcionario);
    if (this.funcionarioObs$) return this.funcionarioObs$;

    const loginService = this.injector.get(LoginService);
    const usuarioId = loginService.getUser().id;

    this.funcionarioObs$ = this.buscarFuncionarioPorId(usuarioId).pipe(
      switchMap((funcionario) => {
        this.funcionario = funcionario;
        return of(funcionario);
      }),
      shareReplay(1)
    );

    return this.funcionarioObs$;
  }

  getMatrizAsync(): Observable<Matriz> {
    if (this.matriz) return of(this.matriz);
    if (this.matrizObs$) return this.matrizObs$;

    const loginService = this.injector.get(LoginService);
    const usuario = loginService.getUser();

    if (usuario.role === 'MATRIZ') {
      this.matrizObs$ = this.buscarMatrizPorId(usuario.id).pipe(
        switchMap((matriz) => {
          this.matriz = matriz;
          return of(matriz);
        }),
        shareReplay(1)
      );
    } else if (usuario.role === 'FUNCIONARIO') {
      this.matrizObs$ = this.getFuncionarioAsync().pipe(
        switchMap((func) =>
          this.buscarMatrizPorId(func.matriz.id).pipe(
            switchMap((matriz) => {
              this.matriz = matriz;
              return of(matriz);
            })
          )
        ),
        shareReplay(1)
      );
    } else {
      return throwError(() => new Error('Usuário sem papel definido.'));
    }

    return this.matrizObs$;
  }

  buscarMatrizPorId(id: number): Observable<Matriz> {
    return this.http.get<Matriz>(this.API_MATRIZ + '/' + `${id}`);
  }
  buscarFuncionarioPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(this.API_FUNCIONARIO + '/' + `${id}`);
  }

  getAdminAsync(): Observable<Admin> {
    if (this.admin) return of(this.admin);
    if (this.adminObs$) return this.adminObs$;

    const loginService = this.injector.get(LoginService);
    const usuario = loginService.getUser();

    if (usuario.role === 'ADMIN') {
      this.adminObs$ = this.buscarAdminPorId(usuario.id).pipe(
        switchMap((admin) => {
          this.admin = admin;
          return of(admin);
        }),
        shareReplay(1)
      );
    } else if (usuario.role === 'ADMINFUNCIONARIO') {
      this.adminObs$ = this.getAdminFuncionarioAsync().pipe(
        switchMap((func) =>
          this.buscarAdminPorId(func.admin.id).pipe(
            switchMap((admin) => {
              this.admin = admin;
              return of(admin);
            })
          )
        ),
        shareReplay(1)
      );
    } else {
      return throwError(() => new Error('Usuário sem papel definido.'));
    }

    return this.adminObs$;
  }
  getAdminFuncionarioAsync(): Observable<AdminFuncionario> {
    if (this.adminFuncionario) return of(this.adminFuncionario);
    if (this.adminFuncionarioObs$) return this.adminFuncionarioObs$;

    const loginService = this.injector.get(LoginService);
    const usuarioId = loginService.getUser().id;

    this.adminFuncionarioObs$ = this.buscarAdminFuncionarioPorId(
      usuarioId
    ).pipe(
      switchMap((adminFuncionario) => {
        this.adminFuncionario = adminFuncionario;
        return of(adminFuncionario);
      }),
      shareReplay(1)
    );

    return this.adminFuncionarioObs$;
  }

  buscarAdminPorId(id: number): Observable<Admin> {
    return this.http.get<Admin>(this.API_ADMIN + '/' + `${id}`);
  }
  buscarAdminFuncionarioPorId(id: number): Observable<AdminFuncionario> {
    return this.http.get<AdminFuncionario>(
      this.API_ADMIN_FUNCIONARIO + '/' + `${id}`
    );
  }

  buscarCEP(cep: String): Observable<any> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    return this.http.get<any>(url);
  }

  buscarCoordenadasPorEndereco(
    enderecoCompleto: string
  ): Observable<{ lat: number; lng: number }> {
    return this.adminService.buscarChaveApi().pipe(
      switchMap((chave) => {
        // Garante que "Brasil" seja incluído no final
        let enderecoComPais = enderecoCompleto.trim();
        if (!/brasil$/i.test(enderecoComPais)) {
          enderecoComPais += ', Brasil';
        }

        const query = encodeURIComponent(enderecoComPais);
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${chave}`;

        return this.http.get<any>(url).pipe(
          switchMap((resposta) => {
            if (resposta?.results?.length > 0) {
              const coords = resposta.results[0].geometry;
              return of({ lat: coords.lat, lng: coords.lng });
            } else {
              return throwError(
                () =>
                  new Error('Coordenadas não encontradas para este endereço.')
              );
            }
          })
        );
      })
    );
  }

  limparCaixaSalva(): void {
    this.caixa = null;
    this.caixaObs$ = null;
  }

  limparMatrizSalva(): void {
    this.matriz = undefined as any; // simula um "reset" sem usar null
    this.matrizObs$ = null;
  }
}
