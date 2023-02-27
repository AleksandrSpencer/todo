import {Observable} from "rxjs";
import {Category} from "../../../model/Category";

export interface CommonDAO<T>{
  getAll(): Observable<T[]>;
  get(id: number): Observable<T>;
  update(arg: T): Observable<T>;
  delete(id: number): Observable<T>;

  add(arg: T): Observable<Category> | undefined;

}

