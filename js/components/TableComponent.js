export default class TableComponent {
  constructor(container, onDelete) {
    this.container = container;
    this.onDelete = onDelete;
    this.rowHeight = 50;
    this.visibleCount = 15;
  }

  render(data) {
    this.data = data;

    this.container.innerHTML = `
      <div class="table-wrapper" id="virtualContainer">
        <div style="height:${data.length * this.rowHeight}px; position:relative">
          <table class="virtual-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="virtualBody"></tbody>
          </table>
        </div>
      </div>
    `;

    this.virtualBody = this.container.querySelector("#virtualBody");
    this.virtualContainer = this.container.querySelector("#virtualContainer");

    this.virtualContainer.addEventListener("scroll", () =>
      this.updateRows()
    );

    this.updateRows();
  }

  updateRows() {
    const scrollTop = this.virtualContainer.scrollTop;
    const startIndex = Math.floor(scrollTop / this.rowHeight);
    const endIndex = startIndex + this.visibleCount;

    const visibleData = this.data.slice(startIndex, endIndex);

    this.virtualBody.style.transform =
      `translateY(${startIndex * this.rowHeight}px)`;

    this.virtualBody.innerHTML = visibleData
      .map(emp => `
        <tr style="height:${this.rowHeight}px">
          <td>${emp.name}</td>
          <td>${emp.email}</td>
          <td>${emp.role}</td>
          <td>${emp.department}</td>
          <td>
            <button data-id="${emp.id}" class="deleteBtn">Delete</button>
          </td>
        </tr>
      `).join("");

    this.attachDelete();
  }

  attachDelete() {
    this.virtualBody.querySelectorAll(".deleteBtn")
      .forEach(btn => {
        btn.addEventListener("click", e => {
          const id = Number(e.target.dataset.id);
          if (confirm("Are you sure?")) {
            this.onDelete(id);
          }
        });
      });
  }
}
