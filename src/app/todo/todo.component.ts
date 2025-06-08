import { Component, OnInit } from '@angular/core';
import { Todo } from '../shared/models/todo.model';
import { TodoService } from '../shared/services/todo.service';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';

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
    if (this.todos.length > 0) {
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Você deseja apagar TODAS as tarefas? Esta ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, apagar tudo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.todoService.clearAll();
          this.loadTodos();
          Swal.fire(
            'Tudo limpo!',
            'Todas as tarefas foram removidas.',
            'success'
          );
        }
      });
    }
  }

  clearCompletedTasks() {
    if (this.todos.length > 0) {
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Você deseja limpar as tarefas concluídas?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, limpar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.todoService.clearCompletedTasks();
          this.loadTodos();
          Swal.fire(
            'Limpo!',
            'As tarefas concluídas foram removidas.',
            'success'
          );
        }
      });
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
