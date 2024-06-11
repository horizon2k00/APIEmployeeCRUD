interface employee {
  [index: string]: number | string;
  empId: number;
  name: string;
  position: string;
  department: string;
  salary: number;
  email: string;
  password: string;
  age: number;
  privilege: string;
  joinDate: string;
  rating: number;
}
interface changeLog {
  empId: number;
  createdAt: number;
  before: any;
  after: any;
  id: any;
  updatedAt: any;
}
type numberKey = "salary" | "empId" | "age" | "rating";


export { employee, changeLog, numberKey };
