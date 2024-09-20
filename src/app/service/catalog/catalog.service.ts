import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/app/environment/env';
const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  api = BASE_API + "catalog";
  constructor(private http: HttpClient) {

   }

   getBrands() {
    return this.http.get(this.api + '/get-brands');
   }

   getStylists() {
    return this.http.get(this.api + '/get-stylists');
   }
}
