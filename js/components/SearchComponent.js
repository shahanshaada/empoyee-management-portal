export default class SearchComponent {
  constructor(container, onSearch) {
    this.container = container;
    this.onSearch = onSearch;
  }

  render() {
    this.container.innerHTML =
      `<input id="searchInput" placeholder="Search by name or role" />`;

    this.container.querySelector("#searchInput")
      .addEventListener("input", e =>
        this.onSearch(e.target.value)
      );
  }
}
