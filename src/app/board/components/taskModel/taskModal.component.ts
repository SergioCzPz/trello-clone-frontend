import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { TaskInterface } from '../../../shared/types/task.interface';
import { FormBuilder } from '@angular/forms';
import { ColumnInterface } from '../../../shared/types/column.interface';
import { TasksService } from '../../../shared/services/task.service';
import { SocketService } from '../../../shared/services/socket.service';
import { SocketEventsEnum } from '../../../shared/types/socketEvents.enum';

@Component({
  selector: 'app-task-model',
  templateUrl: './taskModal.component.html',
  styleUrl: './taskModal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly boardService = inject(BoardService);
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TasksService);
  private readonly socketService = inject(SocketService);

  boardId: string;
  taskId: string;
  task$: Observable<TaskInterface>;
  data$: Observable<{ task: TaskInterface; columns: ColumnInterface[] }>;
  columnForm = this.fb.group({
    columnId: [''],
  });
  unsubscribe$ = new Subject<void>();

  constructor() {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error("Can't get boardId from URL");
    }

    if (!taskId) {
      throw new Error("Can't get taskId from URL");
    }

    this.taskId = taskId;
    this.boardId = boardId;
    this.task$ = this.boardService.tasks$.pipe(
      map(tasks => tasks.find(task => task.id === this.taskId)),
      filter(Boolean),
    );
    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => ({ task, columns })),
    );

    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe(task => {
      this.columnForm.patchValue({ columnId: task.columnId });
    });

    combineLatest([this.task$, this.columnForm.get('columnId')!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (task.columnId === columnId) return;
        if (columnId === null) return;
        this.taskService.updateTask(this.boardId, task.id, { columnId });
      });

    this.socketService
      .listen<string>(SocketEventsEnum.taskDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.goToBoard();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }

  updateTaskName(taskName: string): void {
    this.taskService.updateTask(this.boardId, this.taskId, { title: taskName });
  }

  updateTaskDescription(taskDescription: string): void {
    this.taskService.updateTask(this.boardId, this.taskId, {
      description: taskDescription,
    });
  }

  deleteTask(): void {
    this.taskService.deleteTask(this.boardId, this.taskId);
  }
}
