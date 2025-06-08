import { Component, OnInit } from '@angular/core';
import { Todo } from '../shared/models/todo.model';
import { TodoService } from '../shared/services/todo.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  showCompletedTasks: boolean = true;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  addTodo(newTodoTitle: string) {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      title: newTodoTitle,
      completed: false
    };

    this.todoService.addTodo(newTodo);
  }

  updateTodo(updatedTodo: Todo) {
    this.todoService.updateTodo(updatedTodo);
  }

  deleteTodo(todoId: number) {
    this.todoService.deleteTodo(todoId);
  }

  clearAll() {
    if (this.todos.length > 0 && confirm('Tem certeza que deseja limpar todas as tarefas?')) {
      this.todoService.clearAll();
      this.loadTodos();
    }
  }

  clearCompletedTasks() {
    if (this.todos.length > 0 && confirm('Tem certeza que deseja limpar as tarefas concluídas?')) {
      this.todoService.clearCompletedTasks();
      this.loadTodos();
    }
  }

  toggleCompletedTasks() {
    this.showCompletedTasks = !this.showCompletedTasks;
    this.loadTodos();
    this.todos = this.filteredTodos();
  }

  filteredTodos() {
    return this.showCompletedTasks ? this.todos : this.todos.filter(todo => !todo.completed);
  }

  get labelClearAll() {
    return 'Limpar Todas Tarefas'
  }

  handleEdit(todo: Todo) {
    this.todoService.setTaskToEdit(todo);
  }

  sortByName() {
    this.todos.sort((a, b) => a.title.localeCompare(b.title));
  }

  exportToPDF() {
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text('Lista de Tarefas', 10, y);
    y += 10;

    this.todos.forEach(todo => {
      doc.setFontSize(12);
      const taskText = `${todo.completed ? '[x]' : '[ ]'} ${todo.title}`;
      doc.text(taskText, 10, y);
      y += 7;
    });

    doc.save('lista-de-tarefas.pdf');
  }
}
