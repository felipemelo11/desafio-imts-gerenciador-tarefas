import { Component, OnInit } from '@angular/core';
import { Todo } from '../../shared/models/todo.model';
import { TodoService } from 'src/app/shared/services/todo.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  newTaskTitle: string = '';
  isEditing = false;
  private todoId: number | null = null;

  constructor(private todoService: TodoService) { }

  addTask() {
    if (!this.newTaskTitle.trim()) {
      return;
    }

    if (this.isEditing) {
      const updatedTodo: Todo = {
        id: this.todoId!,
        title: this.newTaskTitle,
        completed: false
      };
      this.todoService.updateTodo(updatedTodo);
      this.todoService.setTaskToEdit(null);
    } else {
      const titles = this.newTaskTitle.split('|');

      titles.forEach(title => {
        const trimmedTitle = title.trim();
        if (trimmedTitle) {
          const newTodo: Todo = {
            id: this.todoService.getTodoNewId(),
            title: trimmedTitle,
            completed: false
          };
          this.todoService.addTodo(newTodo);
        }
      });
    }
    this.newTaskTitle = '';
  }

  ngOnInit(): void {
    this.todoService.taskToEdit$.subscribe(todo => {
      if (todo) {
        this.isEditing = true;
        this.todoId = todo.id;
        this.newTaskTitle = todo.title;
      } else {
        this.isEditing = false;
        this.todoId = null;
        this.newTaskTitle = '';
      }
    });
  }
}
