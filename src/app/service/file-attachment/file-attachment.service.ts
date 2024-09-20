import { Injectable } from '@angular/core';
import { env } from 'src/app/environment/env';
import { CommonService } from '../common/common.service';
import { HttpClient } from '@angular/common/http';
// import { File } from 'buffer';
const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root'
})
export class FileAttachmentService {
  api = BASE_API + "file-attachments";
  constructor(
    private common:CommonService,
    private http: HttpClient
  ) { }
  uploadFile(file: File, type: string, category: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('category', category);
    return this.http.post(this.api + '/upload', formData, this.common.gethttpOptions());
  }

  uploadFiles(files: File[], type: string, category: string) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('type', type);
    formData.append('category', category);
    return this.http.post(this.api + '/uploads', formData, this.common.gethttpOptions());
  }

  getfileAttachmentById(id: number) {
    return this.http.get(this.api + '/get-file-attachment/' + id, this.common.gethttpOptions());
  }
}
