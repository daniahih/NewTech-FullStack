// let firstName: String = "dania";
// let isHere: Boolean = true;
// let age: Number;
// let array: Number[] = [1, 2, 3];
// let arrayString: String[] = ["misk", "maron"];
// let array2: Array<Number>;

// // let lastName = "hih";
// // lastName = 23;

// let array3: (String | number | boolean | null)[] = ["misk", 2, true];

// let user: User = {
//   id: 12,
//   name: "Dania",
//   age: 23,
// };

// type User = {
//   id: Number;
//   name: String;
//   age: Number;
// };

// type Product = {
// //   id: number;

// //   title?: string;

// //   price: number;
// // };
// const laptop: Product = {
//   id: 1,

//   title: "Laptop",

//   price: 1500,
// };
// const products: Product[] = [
//   {
//     id: 1,
//     title: "Laptop",
//     price: 1500,
//   },

//   {
//     id: 2,
//     title: "Phone",
//     price: 800,
//   },
// ];

// type ID = string | number;
// type Status = "loading" | "success" | "error";

// // let test: Status = "loasin";  checking

// interface Product {
//   id: number;

//   title: string;

//   price: number;
// }
// const phone: Product = {
//   id: 2,

//   title: "Phone",

//   price: 800,
// };

// interface Person {
//   name: string;

//   age: number;
// }

// interface Student extends Person {
//   course?: string;
// }

// console.log(student);

// type Person = {
//   name: string;

//   age: number;
// };

// type Student = Person & {
//   course: string;
// };

// const student: Student = {
//   name: "Ahamd",
//   age: 24,

// };

// interface User {
//   readonly id: number;

//   name: string;
// }
// const user: User = {
//   id: 1,

//   name: "Dania",
// };
// type ID = string | number;

// function printId(id: string | number):void{
//   console.log(id);
// }

// function add(num1:number,num2:number):number{
//     return num1+num2
// }

// type Role = "admin" | "student" | "instructor";

// let test: any;
// test = "misk";
// test = 23;
// test = true;

// function logMessage(message: string): void {
//   console.log(message);
// }

// const multiply = (a: number, b: number): number => {
//   return a * b;
// };

// function greet(name: string, age?: number): void {
//   console.log(name);

//   console.log(age);
// }

// function getFirstNumber(items: number[]) {
//   return items[0];
// }

// function getFirstString(items: string[]): string {
//   return items[0];
// }
// // function getFirst(items: any[]) {
// //   return items[0];
// // }
// function getFirst<T>(items: T[]): T | undefined {
//   return items[0];
// }
// const firstNumber = getFirst([10, 20, 30]);
// const firstName = getFirst(["Dania", "Sara", 10]);

// interface ApiResponse<T> {
//   data: T[];

//   status: number;

//   message: string;
// }
// interface User {
//   id: number;

//   name: string;
// }
// const response: ApiResponse<User> = {
//   data: [
//     {
//       id: 1,
//       name: "Dania",
//     },

//     {
//       id: 2,
//       name: "Sara",
//     },
//   ],
//   status: 200,

//   message: "Success",
// };
// interface User {
//   id?: number;

//   name?: string;

//   email?: string;

//   password?: string;
// }
// // function updateUser(data: Partial<User>) {
// //   console.log(data);
// // }
// // updateUser({});

// async function getUsers(): Promise<User[]> {
//   const response = await fetch("https://jsonplaceholder.typicode.com/users");

//   if (!response.ok) {
//     throw new Error("Failed to fetch users");
//   }

//   const data: User[] = await response.json();

//   return data;
// }

// type ProductCardProps = {
//   id: number;

//   title: string;

//   price: number;
// };
// function ProductCard({
//   id,
//   title,
//   price
// }: ProductCardProps) {

//   return (

//     <div>

//       <h2>
//         {title}
//       </h2>

//       <p>
//         {price}
//       </p>

//     </div>

//   );

// }
