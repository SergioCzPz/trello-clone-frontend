import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineFormComponent } from './components/inlineForm/inlineForm.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [InlineFormComponent],
  declarations: [InlineFormComponent],
})
export class InlineFormModule {}
