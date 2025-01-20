import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';
import { BoardInterface } from '../../../shared/types/board.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsComponent implements OnInit, OnDestroy {
  private readonly boardsService = inject(BoardsService);
  boards: WritableSignal<BoardInterface[]> = signal([]);
  unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.boardsService
      .getBoards()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(boards => {
        this.boards.set(boards);
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
        this.boards.set([...this.boards(), createdBoard]);
      });
  }
}
