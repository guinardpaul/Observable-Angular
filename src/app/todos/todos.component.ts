import { Component, OnInit } from '@angular/core';
import { Todo, TodosService } from '../todos.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: [ './todos.component.css' ]
})
export class TodosComponent implements OnInit {
  listTodos: Observable<Todo[]>;
  todo: Todo = { id: 0, title: '', userId: 1, completed: false };

  constructor(private todoService: TodosService) { }

  ngOnInit() {
    this.listTodos = this.todoService.todos;

    this.todoService.loadAll();
  }

  onSubmit() {
    this.todoService.create(this.todo);
    this.todo = { id: 0, title: '', userId: 1, completed: false };
  }

  deleteTodo(todoId: number) {
    this.todoService.remove(todoId);
  }
}

