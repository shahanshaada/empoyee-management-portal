import Employee from "../models/Employee.js";

export default class DataService {
  constructor(api, collection) {
    this.api = api;
    this.collection = collection;
  }

  async init() {
    const raw = await this.api.fetchEmployees();
    const employees = raw.map(e => new Employee(e));
    this.collection.setEmployees(employees);
  }

  getAll() {
    return this.collection.employees;
  }

  add(data) {
    const newEmp = new Employee({
      id: Date.now(),
      ...data
    });
    this.collection.add(newEmp);
  }

  delete(id) {
    this.collection.delete(id);
  }
}
