import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { BoardInterface } from '../../../shared/types/board.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsComponent implements OnInit, OnDestroy {
  private readonly boardsService = inject(BoardsService);
  boards: BoardInterface[] = [];
  unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.boardsService
      .getBoards()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(boards => {
        this.boards = boards;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createBoard(title: string): void {
    this.boardsService
      .createBoard(title)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(createdBoard => {
        this.boards = [...this.boards, createdBoard];
      });
  }
}
