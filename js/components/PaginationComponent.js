export default class PaginationComponent {
  constructor(container, onPageChange) {
    this.container = container;
    this.onPageChange = onPageChange;
  }

  render(totalItems, itemsPerPage, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    let buttons = "";
    for (let i = 1; i <= totalPages; i++) {
      buttons += `<button data-page="${i}" 
        class="${i === currentPage ? "active" : ""}">
        ${i}
      </button>`;
    }

    this.container.innerHTML = buttons;

    this.container.querySelectorAll("button")
      .forEach(btn =>
        btn.addEventListener("click", e =>
          this.onPageChange(Number(e.target.dataset.page))
        )
      );
  }
}
