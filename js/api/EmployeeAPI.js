export default class EmployeeAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchEmployees() {
    const response = await fetch(this.baseURL);
    const result = await response.json();

    return result.users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.company.title,
      department: user.company.department
    }));
  }
}
