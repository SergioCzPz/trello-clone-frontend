import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BoardsService } from '../../../shared/services/boards.service';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardsComponent implements OnInit {
  private readonly boardsService = inject(BoardsService);

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe(boards => {
      console.log(boards);
    });
  }
}
