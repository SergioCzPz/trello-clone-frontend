import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-inline-form',
  templateUrl: './inlineForm.component.html',
  styleUrl: './inlineForm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineFormComponent {
  private fb = inject(FormBuilder);

  @Input() title = '';
  @Input() defaultText = 'Not defined';
  @Input() hasButton = false;
  @Input() buttonText = 'Submit';
  @Input() inputPlaceholder = '';
  @Input() inputType = 'input';

  @Output() handleSubmit = new EventEmitter<string>();

  isEditing = false;
  form = this.fb.group({
    title: [''],
  });

  activeEditing(): void {
    if (this.title !== '') {
      this.form.patchValue({ title: this.title });
    }
    this.isEditing = true;
  }

  onSubmit(): void {
    if (this.form.value.title !== '' && this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
    }
    this.isEditing = false;
    this.form.reset();
  }
}
