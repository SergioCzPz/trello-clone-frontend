import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { filter, Observable } from 'rxjs';
import { BoardInterface } from '../../../shared/types/board.interface';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  private readonly boardsService = inject(BoardsService);
  private readonly boardService = inject(BoardService);
  private readonly route = inject(ActivatedRoute);

  boardId: string;
  board$: Observable<BoardInterface>;

  constructor() {
    const boardId = this.route.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error('Cannot get boardID from url');
    }

    this.boardId = boardId;
    this.board$ = this.boardService.board$.pipe(filter(Boolean));
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe(board => {
      console.log(board);
      this.boardService.setBoard(board);
    });
  }
}
