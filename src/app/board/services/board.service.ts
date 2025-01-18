import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardInterface } from '../../shared/types/board.interface';
import { SocketService } from '../../shared/services/socket.service';
import { SocketEventsEnum } from '../../shared/types/socketEvents.enum';
import { ColumnInterface } from '../../shared/types/column.interface';
import { TaskInterface } from '../../shared/types/task.interface';

@Injectable()
export class BoardService {
  private readonly socketService = inject(SocketService);
  board$ = new BehaviorSubject<BoardInterface | null>(null);
  columns$ = new BehaviorSubject<ColumnInterface[]>([]);
  tasks$ = new BehaviorSubject<TaskInterface[]>([]);

  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }

  setColumns(columns: ColumnInterface[]): void {
    this.columns$.next(columns);
  }

  setTasks(tasks: TaskInterface[]): void {
    this.tasks$.next(tasks);
  }

  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId });
  }

  addColumn(column: ColumnInterface): void {
    const updateColumns = [...this.columns$.getValue(), column];
    this.columns$.next(updateColumns);
  }

  addTask(task: TaskInterface): void {
    const updatedTasks = [...this.tasks$.getValue(), task];
    this.tasks$.next(updatedTasks);
  }

  updateBoard(updatedBoard: BoardInterface): void {
    const board = this.board$.getValue();
    if (board === null) {
      throw new Error('Board is not initialized');
    }
    this.board$.next({ ...board, title: updatedBoard.title });
  }

  updateColumn(updatedColumn: ColumnInterface): void {
    const updatedColumns = this.columns$.getValue().map(column => {
      if (column.id === updatedColumn.id) {
        return { ...column, title: updatedColumn.title };
      }
      return column;
    });
    this.columns$.next(updatedColumns);
  }

  deleteColumn(columnId: string): void {
    const updatedColumns = this.columns$
      .getValue()
      .filter(column => column.id !== columnId);
    this.columns$.next(updatedColumns);
  }
}
