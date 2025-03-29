import {Department} from "./departement.model";

export interface Employee {
  id: number;
  nom: string;
  email: string;
  age: number;
  department: Department;
  photo: string;
}
