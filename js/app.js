import EmployeeAPI from "./api/EmployeeAPI.js";
import EmployeeCollection from "./models/EmployeeCollection.js";
import DataService from "./services/DataService.js";
import TableComponent from "./components/TableComponent.js";
import SearchComponent from "./components/SearchComponent.js";
import PaginationComponent from "./components/PaginationComponent.js";
import { exportCSV, exportJSON } from "./utils/helpers.js";

class App {
  constructor() {
    this.currentPage = 1;
    this.itemsPerPage = 20;
    this.searchTerm = "";
    this.selectedDepartments = [];
  }

  async init() {
    this.api = new EmployeeAPI(
      "https://dummyjson.com/users?limit=100"
    );

    this.collection = new EmployeeCollection();
    this.dataService = new DataService(this.api, this.collection);

    await this.dataService.init();

    this.table = new TableComponent(
      document.getElementById("tableContainer"),
      id => {
        this.dataService.delete(id);
        this.render();
      }
    );

    this.search = new SearchComponent(
      document.getElementById("searchContainer"),
      term => {
        this.searchTerm = term;
        this.render();
      }
    );

    this.pagination = new PaginationComponent(
      document.getElementById("paginationContainer"),
      page => {
        this.currentPage = page;
        this.render();
      }
    );

    this.search.render();
    this.setupFilters();
    this.setupButtons();

    this.render();
  }

setupFilters() {
  const container = document.getElementById("filterContainer");
  const departments = this.collection.getDepartments();

  // Inject custom dropdown HTML
  container.innerHTML = `
    <div class="multi-select-dropdown">
      <div class="select-box" id="selectBox">
        <span id="selectedCount">Select Departments</span>
        <div class="arrow">&#9662;</div>
      </div>
      <div class="options-container hidden" id="optionsContainer">
        ${departments.map(dep => `
          <label>
            <input type="checkbox" value="${dep}"/> ${dep}
          </label>
        `).join("")}
      </div>
    </div>
  `;

  const selectBox = container.querySelector("#selectBox");
  const optionsContainer = container.querySelector("#optionsContainer");
  const selectedCount = container.querySelector("#selectedCount");

  selectBox.addEventListener("click", () => {
    optionsContainer.classList.toggle("hidden");
  });

  const checkboxes = optionsContainer.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      this.selectedDepartments = [...checkboxes]
        .filter(c => c.checked)
        .map(c => c.value);

      if (this.selectedDepartments.length === 0) {
        selectedCount.textContent = "Select Departments";
      } else {
        selectedCount.textContent = this.selectedDepartments.join(", ");
      }

      this.render();
    });
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      optionsContainer.classList.add("hidden");
    }
  });
}


 setupButtons() {
  const modal = document.getElementById("employeeModal");
  const empName = document.getElementById("empName");
  const empEmail = document.getElementById("empEmail");
  const empRole = document.getElementById("empRole");
  const empDept = document.getElementById("empDept");

  const resetModal = () => {
    empName.value = "";
    empEmail.value = "";
    empRole.value = "";
    empDept.value = "";
  };

  const departments = this.collection.getDepartments();
  empDept.innerHTML = '<option value="" disabled selected>Select Department</option>';
  departments.forEach(dep => {
    const option = document.createElement("option");
    option.value = dep;
    option.textContent = dep;
    empDept.appendChild(option);
  });

  document.getElementById("addEmployeeBtn").addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
    resetModal();
  });

  // Save employee
  document.getElementById("saveEmployee").addEventListener("click", () => {
    this.dataService.add({
      name: empName.value,
      email: empEmail.value,
      role: empRole.value,
      department: empDept.value
    });

    modal.classList.add("hidden");
    resetModal();   
    this.render();   
  });

  document.getElementById("exportCSV").addEventListener("click", () =>
    exportCSV(this.collection.employees)
  );

  document.getElementById("exportJSON").addEventListener("click", () =>
    exportJSON(this.collection.employees)
  );
}

  getProcessedData() {
    let data = this.collection.employees;

    if (this.searchTerm)
      data = this.collection.search(this.searchTerm);

    if (this.selectedDepartments.length)
      data = data.filter(emp =>
        this.selectedDepartments.includes(emp.department)
      );

    return data;
  }

  render() {
    const processed = this.getProcessedData();

    const start =
      (this.currentPage - 1) * this.itemsPerPage;
    const paginated =
      processed.slice(start, start + this.itemsPerPage);

    this.table.render(paginated);
    this.pagination.render(
      processed.length,
      this.itemsPerPage,
      this.currentPage
    );
  }
}

new App().init();
