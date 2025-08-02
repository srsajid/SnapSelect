const form = document.querySelector(".form");
const dropdowns = document.querySelectorAll(".dropdown");



// Check if Form Element Exist on Page
if (form !== null) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}

class SnapSelect {
  constructor(dropdown) {
    const options = dropdown.querySelectorAll("option");
    this.optionsArr = Array.prototype.slice.call(options);
    this.dropdown = dropdown
    this.menu = document.createElement("div")
    this.selected = document.createElement("div");
    this.currentFocus = -1;
    this.init()
  }

  init() {

    const optionsArr = this.optionsArr

    const customDropdown = document.createElement("div");
    customDropdown.classList.add("dropdown");
    this.dropdown.insertAdjacentElement("afterend", customDropdown);

    const selected = this.selected
    selected.classList.add("dropdown-select");
    selected.textContent = optionsArr[0].textContent;
    customDropdown.appendChild(selected);

    let menu = this.menu;

    menu.classList.add("dropdown-menu");
    customDropdown.appendChild(menu);
    selected.addEventListener("click", () => {
      this.toggleDropdown(menu)
    });

    const search = document.createElement("input");
    search.placeholder = "Search...";
    search.type = "text";
    search.classList.add("dropdown-menu-search");
    menu.appendChild(search);

    const menuInnerWrapper = document.createElement("div");
    menuInnerWrapper.classList.add("dropdown-menu-inner");
    menu.appendChild(menuInnerWrapper);

    optionsArr.forEach((option) => {
      const item = document.createElement("div");
      item.classList.add("dropdown-menu-item");
      item.dataset.value = option.value;
      item.textContent = option.textContent;
      menuInnerWrapper.appendChild(item);

      item.addEventListener("click", () => {
          this.setSelected(item)
      });
    });

    menuInnerWrapper.querySelector("div").classList.add("selected");

    search.addEventListener("input", () => {
      this.filterItems(search.value)
    });

    menu.addEventListener("keydown", (e) => {
      this.handleKeyDown(e, menuInnerWrapper);
    });

    document.addEventListener("click", (e) => {
      this.closeIfClickedOutside(e.target)
    });
    this.dropdown.style.display = "none";
  }

  toggleDropdown() {
    let menu = this.menu
    if (menu.offsetParent !== null) {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
      menu.querySelector("input").focus();
    }
  }


  setSelected(item) {
    const value = item.dataset.value;
    this.selected.textContent = item.textContent;
    this.dropdown.value = value;

    this.menu.style.display = "none";
    this.menu.querySelector("input").value = "";
    this.menu.querySelectorAll("div").forEach((div) => {
      if (div.classList.contains("is-select")) {
        div.classList.remove("is-select");
      }
      if (div.offsetParent === null) {
        div.style.display = "block";
      }
    });
    item.classList.add("is-select");
  }

  filterItems(value) {
    let itemsArr = this.optionsArr
    let menu = this.menu

    const customOptions = menu.querySelectorAll(".dropdown-menu-inner div");
    value = value.toLowerCase();
    const filteredItems = itemsArr.filter((item) =>
      item.value.toLowerCase().includes(value)
    );
    const indexesArr = filteredItems.map((item) => itemsArr.indexOf(item));

    itemsArr.forEach((option) => {
      if (!indexesArr.includes(itemsArr.indexOf(option))) {
        customOptions[itemsArr.indexOf(option)].style.display = "none";
      } else {
        if (customOptions[itemsArr.indexOf(option)].offsetParent === null) {
          customOptions[itemsArr.indexOf(option)].style.display = "block";
        }
      }
    });
  }

  closeIfClickedOutside(target) {
    let menu = this.menu
    if (
      target.closest(".dropdown") === null &&
      target.target !== this &&
      menu.offsetParent !== null
    ) {
      menu.style.display = "none";
    }
  }

handleSearchKeyDown(e, menuInnerWrapper) {
    const items = menuInnerWrapper.querySelectorAll(".dropdown-menu-item:not([style*='display: none'])");
    if (e.keyCode === 40) { 
      e.preventDefault();
      this.currentFocus = this.currentFocus === items.length - 1 ? 0 : this.currentFocus + 1;
      this.addActive(items);
    } else if (e.keyCode === 38) {
      e.preventDefault();
      this.currentFocus = this.currentFocus <= 0 ? items.length - 1 : this.currentFocus - 1;
      this.addActive(items);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (this.currentFocus > -1 && this.currentFocus < items.length) {
        items[this.currentFocus].click();
      }
    }
}

  handleKeyDown(e, menuInnerWrapper) {
    this.handleSearchKeyDown(e, menuInnerWrapper);
  }

  addActive(items) {
    if (!items || this.currentFocus >= items.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = items.length - 1;

    items.forEach((item, index) => {
      item.classList.remove("is-select");
      if (index === this.currentFocus) {
        item.classList.add("is-select");
        item.scrollIntoView({ block: "nearest" });
      }
    });

  }

}


// Loop Dropdowns and Create Custom Dropdown for each Select Element
if (dropdowns.length > 0) {
  dropdowns.forEach((dropdown) => {
    new SnapSelect(dropdown);
  });
}
