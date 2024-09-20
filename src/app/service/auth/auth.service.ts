import { Injectable } from '@angular/core';
import { env } from 'src/app/environment/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = BASE_API + 'auth';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }),
  };
  constructor(private http: HttpClient, private router: Router) {}
  roles: string[] = [];
  login(token: string) {
    localStorage.setItem('token', token);
    this.httpOptions.headers = this.httpOptions.headers.set(
      'Authorization',
      token
    );
    return this.http.get(this.api + '/login', this.httpOptions);
  }
  logout(actor: boolean) {
    // Xóa token khi người dùng đăng xuất
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('role');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    if (actor) {
      location.reload();
    }
    this.router.navigate(['/']);
  }
  logoutAdmin(actor: boolean) {
    // Xóa token khi người dùng đăng xuất
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('role');
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    if (actor) {
      location.reload();
    }
    this.router.navigate(['/auth/login-admin']);
  }
  isAuthenticated(): boolean {
    // Kiểm tra xem token đã được lưu trữ trong local storage hay không
    const token = localStorage.getItem('token');

    // Nếu token tồn tại, cho rằng người dùng đã đăng nhập
    // Trong trường hợp thực tế, bạn có thể kiểm tra tính hợp lệ của token và thời gian hết hạn
    return token !== null;
  }

  hasRole(role: string): boolean {
    const roleString: string | null = localStorage.getItem('role');
    if (roleString == null || roleString == undefined || roleString == '') {
      return false;
    }
    this.roles = JSON.parse(roleString);
    return this.roles.includes(role);
  }
}
