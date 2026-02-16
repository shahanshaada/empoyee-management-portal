export default class EmployeeCollection {
  constructor() {
    this.employees = [];
  }

  setEmployees(data) {
    this.employees = data;
  }

  add(employee) {
    this.employees.unshift(employee);
  }

  delete(id) {
    this.employees = this.employees.filter(emp => emp.id !== id);
  }

  search(term) {
    return this.employees.filter(emp =>
      emp.name.toLowerCase().includes(term.toLowerCase()) ||
      emp.role.toLowerCase().includes(term.toLowerCase())
    );
  }

  filterByDepartments(departments) {
    if (!departments.length) return this.employees;
    return this.employees.filter(emp =>
      departments.includes(emp.department)
    );
  }

  getDepartments() {
    return [...new Set(this.employees.map(e => e.department))];
  }
}
