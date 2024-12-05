import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

    /**
   * Método que verifica se o usuário pode acessar uma rota protegida.
   * @returns {boolean} Retorna `true` se o usuário está logado, ou redireciona para a página de login e retorna `false`.
   */
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Permite o acesso à rota
    } else {
      this.router.navigate(['/login']); // Redireciona para a página de login se o usuário não estiver autenticado
      return false; // Bloqueia o acesso à rota
    }
  }

  
}

