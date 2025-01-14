import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardInterface } from '../types/board.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class BoardsService {
  private readonly http = inject(HttpClient);

  getBoards(): Observable<BoardInterface[]> {
    const url = environment.apiUrl + '/boards';
    return this.http.get<BoardInterface[]>(url);
  }

  createBoard(title: string): Observable<BoardInterface> {
    const url = environment.apiUrl + '/boards';
    return this.http.post<BoardInterface>(url, { title });
  }
}