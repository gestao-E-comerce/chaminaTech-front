import { Component, inject } from '@angular/core';
import { Login } from '../../models/login';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { GlobalService } from '../../services/global.service';

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        NgClass
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  login: Login = new Login();
  roteador = inject(Router);
  loginService = inject(LoginService);
  globalService = inject(GlobalService);
  toastr = inject(ToastrService);

  constructor() {
   this.loginService.removerToken();
   history.pushState(null, '', '/login');
   window.history.replaceState(null, '', window.location.href);
  }

  logar() {
    if (!this.login.username || !this.login.senha) {
      this.toastr.error('Prenche os dados corretamente');
    } else {
      this.loginService.logar(this.login).subscribe({
        next: usuario => {
          console.log(usuario);
          this.globalService.setUsuario(usuario);
          this.loginService.adken(usuario.token);
          window.location.replace('/home');
        },
        error: erro => {
          this.toastr.error(erro.error.mensagem);
        }
      });
    }
  }
}