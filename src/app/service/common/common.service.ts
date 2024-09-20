import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  page!: PaginationInfo;
  
  constructor(private http: HttpClient) {
  }

  getHtmlContent(url: string): Promise<string> {
    return this.http.get(url, { responseType: 'text' })
      .toPromise()
      .then((response: string | undefined) => {
        if (response !== undefined) {
          return response;
        } else {
          throw new Error('Empty response');
        }
      })
      .catch(error => {
        console.error('Error loading HTML content:', error);
        throw error;
      });
  }

  gethttpOptions() {
    const token = localStorage.getItem('token')?.trim();
      if (token) {
      return {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin': 'http://localhost:4200/',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Authorization': 'Bearer ' + token,
          'accept': '*/*'
        })
      };
    }
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': 'http://localhost:4200/',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'accept': '*/*'
      })
    };

  }

  getHttpUpload(){
    const token = localStorage.getItem('token')?.trim();
    if (token) {
      return {
        headers: new HttpHeaders({
          'Authorization':`Bearer `+ token,
          'Access-Control-Allow-Origin': 'http://localhost:4200/',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
        }),
      };
    }
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': 'http://localhost:4200/',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'accept': '*/*'
      })
    };
  }

  pagination(page: PaginationInfo): PaginationInfo {
    this.page = page;
    const half = Math.floor(this.page.pageMax / 2);
    let start = Math.max(1, this.page.pageNumber - half);
    let end = Math.min(this.page.pageTotal, this.page.pageNumber + half);

    if (this.page.pageNumber - start < half) {
      end = Math.min(this.page.pageTotal, end + (half - (this.page.pageNumber - start)));
    }

    if (end - this.page.pageNumber < half) {
      start = Math.max(1, start - (half - (end - this.page.pageNumber)));
    }
    if (start < 1) {
      start = 1;
    }

    if (end > this.page.pageTotal) {
      end = this.page.pageTotal;
    }
    this.page.pages = [];

    for (let i = start; i <= end; i++) {
      this.page.pages.push(i);
    }
    return this.page;
  }
}
