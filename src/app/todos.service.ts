import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs';

export interface Todo {
  id: number | string;
  userId: number | string;
  title: string;
  completed: boolean
};

@Injectable()
export class TodosService {
  todos: Observable<Todo[]>
  private _todos: BehaviorSubject<Todo[]>;
  private baseUrl: string;
  private dataStore: {
    todos: Todo[]
  };

  constructor(private http: HttpClient) {
    this.baseUrl = 'https://jsonplaceholder.typicode.com';
    this.dataStore = { todos: [] };
    this._todos = <BehaviorSubject<Todo[]>>new BehaviorSubject([]);
    this.todos = this._todos.asObservable();
  }

  loadAll() {
    this.http.get<Todo[]>(`${this.baseUrl}/todos`)
      .subscribe(data => {
        let listFilter = [];
        data.forEach(todo => {
          if (todo.userId === 1) {
            listFilter.push(todo)
          }
        })
        console.log(listFilter);
        this.dataStore.todos = listFilter;
        console.log(this.dataStore);
        this._todos.next(Object.assign({}, this.dataStore).todos);
        console.log(this._todos);
        console.log(this.todos);
      }, error => console.log('Could not load todos.'));
  }

  create(todo: Todo) {
    this.http.post<Todo>(`${this.baseUrl}/todos`, (todo))
      .subscribe(data => {
        this.dataStore.todos.push(data);
        this._todos.next(Object.assign({}, this.dataStore).todos);
      }, error => console.log('Could not create todo.'));
  }

  update(todo: Todo) {
    this.http.put<Todo>(`${this.baseUrl}/todos/${todo.id}`, JSON.stringify(todo))
      .subscribe(data => {
        this.dataStore.todos.forEach((t, i) => {
          if (t.id === data.id) { this.dataStore.todos[ i ] = data; }
        });

        this._todos.next(Object.assign({}, this.dataStore).todos);
      }, error => console.log('Could not update todo.'));
  }

  remove(todoId: number) {
    this.http.delete(`${this.baseUrl}/todos/${todoId}`)
      .subscribe(response => {
        this.dataStore.todos.forEach((t, i) => {
          if (t.id === todoId) { this.dataStore.todos.splice(i, 1); }
        });

        this._todos.next(Object.assign({}, this.dataStore).todos);
      }, error => console.log('Could not delete todo.'));
  }
}
