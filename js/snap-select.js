
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
    customDropdown.classList.add("snap-drpd");
    this.dropdown.insertAdjacentElement("afterend", customDropdown);

    const selected = this.selected
    selected.classList.add("snap-drpd-sel");
    customDropdown.appendChild(selected);
    selected.tabIndex = this.dropdown.tabIndex
    selected.addEventListener("keydown", (e) => {
      if(this.handleKeyDown(e.key)) e.preventDefault()
    });

    let menu = this.menu;

    menu.classList.add("snap-drpd-menu");
    customDropdown.appendChild(menu);
    selected.addEventListener("click", () => {
      this.toggleDropdown(menu)
    });

    const search = document.createElement("input");
    search.placeholder = "Search...";
    search.type = "text";
    search.classList.add("snap-drpd-search");
    menu.appendChild(search);

    const menuInnerWrapper = document.createElement("div");
    menuInnerWrapper.classList.add("snap-drpd-inn");
    menu.appendChild(menuInnerWrapper);

    optionsArr.forEach((option) => {
      const item = document.createElement("div");
      item.classList.add("snap-drpd-item");
      item.dataset.value = option.value;
      item.textContent = option.textContent;
      menuInnerWrapper.appendChild(item);

      item.addEventListener("click", () => {
        this.setSelected(item)
      });

      if(option.selected)  this.setSelected(item)
    });

    if(!this.selectedItem) {
      this.setSelected( menuInnerWrapper.querySelector("div"))
    }

    search.addEventListener("input", () => {
      this.filterItems(search.value)
    });

    menu.addEventListener("keydown", (e) => {
      if(this.handleSearchKeyDown(e.key)) e.preventDefault()
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
    this.clearActive()
  }


  setSelected(item) {
    if(!item) return
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
        div.style.display = "";
      }
    });
    item.classList.add("is-select");
    if(this.selectedItem !== undefined && this.selectedItem !== item) {
      const changeEvent = new Event('change');
      this.dropdown.dispatchEvent(changeEvent);
    }
    this.selectedItem = item
  }

  filterItems(value) {
    let itemsArr = this.optionsArr
    let menu = this.menu

    const customOptions = menu.querySelectorAll(".snap-drpd-inn div");
    value = value.toLowerCase();
    const filteredItems = itemsArr.filter((item) =>
      item.textContent.toLowerCase().includes(value)
    );
    const indexesArr = filteredItems.map((item) => itemsArr.indexOf(item));

    itemsArr.forEach((option) => {
      if (!indexesArr.includes(itemsArr.indexOf(option))) {
        customOptions[itemsArr.indexOf(option)].style.display = "none";
      } else {
        if (customOptions[itemsArr.indexOf(option)].offsetParent === null) {
           customOptions[itemsArr.indexOf(option)].style.display = ""
        }
      }
    });
  }

  closeIfClickedOutside(target) {
    let menu = this.menu
    if (
      target.closest(".snap-drpd") === null &&
      target.target !== this &&
      menu.offsetParent !== null
    ) {
      menu.style.display = "none";
    }
  }

  handleSearchKeyDown(keyCode) {
    console.log(keyCode)
    const items = this.menu.querySelectorAll(".snap-drpd-item:not([style*='display: none'])");
    let isHandled = false
    if (keyCode === 'ArrowDown') {
      this.currentFocus = this.currentFocus === items.length - 1 ? 0 : this.currentFocus + 1;
      this.addActive(items);
      isHandled = true
    } else if (keyCode === "ArrowUp") {
      this.currentFocus = this.currentFocus <= 0 ? items.length - 1 : this.currentFocus - 1;
      this.addActive(items);
      isHandled = true
    } else if (keyCode === "Enter") {
      if (this.currentFocus > -1 && this.currentFocus < items.length) {
        items[this.currentFocus].click();
      }
      isHandled = true
    } else if (keyCode === "Escape") {
      this.toggleDropdown()
    }

    return isHandled
  }

  handleKeyDown(keyCode) {
    console.log(keyCode)
    let isHandled = false
    if (keyCode === 'ArrowDown') {
      this.setSelected(this.selectedItem.nextSibling)
      isHandled = true
    } else if (keyCode === "ArrowUp") {
      this.setSelected(this.selectedItem.previousSibling)
      isHandled = true
    } else if (keyCode === "Enter") {
      this.toggleDropdown()
      isHandled = true
    }
    return isHandled
  }

  clearActive() {
    if(this.activeItem) this.activeItem.classList.remove("active")
    this.currentFocus = -1
    this.activeItem = null
  }

  addActive(items) {
    if (!items || this.currentFocus >= items.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = items.length - 1;

    if(items.length === 0) { return }
    let item = items[this.currentFocus]

    if(this.activeItem) this.activeItem.classList.remove("active")

    item.classList.add("active")
    item.scrollIntoView({ block: "nearest" });
    this.activeItem = item
  }

}
