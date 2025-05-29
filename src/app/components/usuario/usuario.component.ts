import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../../models/login';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss',
})
export class UsuarioComponent {
  login: Login = new Login();

  loginService = inject(LoginService);
  toastr = inject(ToastrService);
  activeModal = inject(NgbActiveModal);

  logar() {
    if (!this.login.username || !this.login.senha) {
      this.toastr.error('Preencha os dados corretamente');
      return;
    }
  
    const usuarioAnterior = this.loginService.getUser(); // pega usuário atual salvo
  
    this.loginService.logar(this.login).subscribe({
      next: (usuario) => {
        // ⚠️ Verifica se o usuário logado é o mesmo
        if (usuario.id != usuarioAnterior.id) {
          this.toastr.error('Você deve reautenticar com o mesmo usuário.');
          return; // não fecha o modal e não envia token
        }
  
        // Se for o mesmo usuário, segue o fluxo
        this.loginService.adken(usuario.token);
        this.activeModal.close(usuario.token);
      },
      error: (erro) => {
        this.toastr.error(erro.error.mensagem);
      },
    });
  }
  
}