import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/app/environment/env';
import { CommonService } from '../common/common.service';
const BASE_API = env.baseApi;

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
    api = BASE_API + "favorite";

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {

   }

    getFavorite(page: number, size: number) {
      return this.http.get(this.api + '/get-favorites' + '?page=' + page + '&size=' + size, this.commonService.gethttpOptions());
    }

    saveFavorite(id: Number) {
      return this.http.post(this.api + '/save/' + id,null, this.commonService.gethttpOptions());
    }

    deleteFavorite(id: Number) {
      return this.http.delete(this.api + '/delete/' + id, this.commonService.gethttpOptions());
    }
}
