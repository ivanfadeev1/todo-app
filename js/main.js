const themeButton = document.getElementById("theme-button");
const todoList = document.getElementById("todo-list");
const todoItemTemplate =
  document.getElementById("todo-item-template").content.firstElementChild;
const clearCompletedButton = document.getElementById("clear-completed-button");
const itemsCounter = document.getElementById("items-counter");
const newTodoInput = document.getElementById("new-todo-input");
const addButton = document.getElementById("add-button");
const filterTabs = document.getElementById("filter-tabs");

function updateTheme() {
  const [moonIcon, sunIcon] = themeButton.children;

  if (document.documentElement.classList.contains("dark")) {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
    localStorage.theme = "dark";
  } else {
    moonIcon.classList.remove("hidden");
    sunIcon.classList.add("hidden");
    localStorage.theme = "light";
  }
}

function handleThemeButtonClick() {
  document.documentElement.classList.toggle("dark");
  updateTheme();
}

function toggleItemsCounter() {
  const isCompletedFilterTabActive =
    document.querySelector(".filter--active").dataset.filterTab === "completed";

  if (isCompletedFilterTabActive) {
    itemsCounter.classList.add("counter--hidden");
  } else {
    itemsCounter.classList.remove("counter--hidden");
  }
}

function filterTodoList(filter) {
  const todoItems = Array.from(todoList.children);

  switch (filter) {
    case "all":
      todoItems.forEach((todoItem) => todoItem.classList.remove("hidden"));
      break;
    case "active":
      todoItems.forEach((todoItem) =>
        todoItem.classList.contains("item--checked")
          ? todoItem.classList.add("hidden")
          : todoItem.classList.remove("hidden"),
      );
      break;
    case "completed":
      todoItems.forEach((todoItem) =>
        todoItem.classList.contains("item--checked")
          ? todoItem.classList.remove("hidden")
          : todoItem.classList.add("hidden"),
      );
      break;
    default:
  }

  toggleItemsCounter();
}

function handleFilterTabClick(event) {
  const filterTab = event.target.closest("[data-filter-tab]");
  if (!filterTab) return;

  const currentActive = document.querySelector(".filter--active");
  if (currentActive) {
    currentActive.classList.remove("filter--active");
  }
  filterTab.classList.add("filter--active");

  filterTodoList(filterTab.dataset.filterTab);
}

function toggleClearCompletedButton() {
  const checkedItemsPresent =
    todoList.querySelectorAll(".item--checked").length > 0;

  if (checkedItemsPresent) {
    clearCompletedButton.classList.remove("hidden");
  } else {
    clearCompletedButton.classList.add("hidden");
  }
}

function handleClearCompletedButtonClick() {
  const checkedItems = Array.from(todoList.querySelectorAll(".item--checked"));

  checkedItems.forEach((checkedItem) => {
    checkedItem.remove();
  });

  toggleClearCompletedButton();
}

function updateItemsCounter() {
  const checkedItemsNumber = todoList.querySelectorAll(".item--checked").length;
  const uncheckedItemsNumber = todoList.children.length - checkedItemsNumber;

  itemsCounter.textContent = `${uncheckedItemsNumber} items left`;
}

function handleInputChange(event) {
  const targetInput = event.target;
  const targetItem = targetInput.closest("[data-todo-item]");

  if (targetInput.checked) {
    targetItem.classList.add("item--checked");
  } else {
    targetItem.classList.remove("item--checked");
  }

  updateItemsCounter();
  toggleClearCompletedButton();
}

function handleRemoveButtonClick(event) {
  const removeButton = event.target.closest("[data-remove-button]");
  if (!removeButton) return;

  const targetItem = removeButton.closest("[data-todo-item]");
  targetItem.remove();

  updateItemsCounter();
  toggleClearCompletedButton();
}

function handleTodoIndicatorKeydown(event) {
  if (event.key !== "Enter") return;

  const todoInput = event.currentTarget.previousElementSibling;
  todoInput.checked = !todoInput.checked;

  todoInput.dispatchEvent(new Event("change", { bubbles: true }));
}

function createAndAddNewTodoItem(text) {
  const todoItem = todoItemTemplate.cloneNode(true);
  const todoItemText = todoItem.querySelector("[data-todo-text]");
  todoItemText.textContent = text;
  todoList.prepend(todoItem);
  filterTodoList(document.querySelector(".filter--active").dataset.filterTab);

  const todoIndicator = todoItem.querySelector("[data-todo-indicator]");
  todoIndicator.addEventListener("keydown", handleTodoIndicatorKeydown);
}

function handleAddButtonClick() {
  if (!newTodoInput.value) return;
  createAndAddNewTodoItem(newTodoInput.value);
  newTodoInput.value = "";
  updateItemsCounter();
}

function handleNewTodoInputKeydown(event) {
  if (event.key !== "Enter") return;
  handleAddButtonClick();
}

/* Drag and drop */

let currentDroppable = null;
let isBelowLastItem = false;

function handleDragAndDrop(event) {
  event.preventDefault();

  const targetItem = event.target.closest("[data-todo-item]");

  const shiftX = event.clientX - targetItem.getBoundingClientRect().left;
  const shiftY = event.clientY - targetItem.getBoundingClientRect().top;

  const currentWidth = getComputedStyle(targetItem).width;
  const currentHeight = getComputedStyle(targetItem).height;

  const prepareItem = () => {
    targetItem.style.position = "absolute";
    targetItem.style.zIndex = 1000;
    targetItem.style.width = currentWidth;
    targetItem.style.transition = "none";
    targetItem.classList.add("ondrag");
    document.body.append(targetItem);
  };

  const moveAt = (pageX, pageY) => {
    targetItem.style.left = `${pageX - shiftX}px`;
    targetItem.style.top = `${pageY - shiftY}px`;
  };

  const updateCurrentDroppable = (element, isLastItem = false) => {
    const droppableBelow = isLastItem
      ? targetItem.previousSibling
      : element?.closest("[data-todo-item]") ||
        element?.closest("#buttons-container") ||
        targetItem.nextSibling;

    if (!droppableBelow) return;

    if (droppableBelow.id === "buttons-container") {
      currentDroppable.style.margin = "0";
      todoList.lastChild.style.margin = "0";
      todoList.lastChild.style.marginBottom = currentHeight;
      isBelowLastItem = true;
      currentDroppable = todoList.lastChild;
      return;
    }

    if (droppableBelow === todoList.lastChild && isBelowLastItem) {
      todoList.lastChild.style.margin = "0";
      todoList.lastChild.style.marginTop = currentHeight;
      isBelowLastItem = false;
      return;
    }

    if (currentDroppable !== droppableBelow) {
      if (currentDroppable === null) {
        droppableBelow.style.transition = "none";
        setTimeout(() => {
          droppableBelow.style.transition = "";
        });
      }
      if (currentDroppable) {
        currentDroppable.style.margin = "0";
      }
      currentDroppable = droppableBelow;
      if (isLastItem) {
        currentDroppable.style.marginBottom = currentHeight;
        isBelowLastItem = true;
      } else {
        currentDroppable.style.marginTop = currentHeight;
      }
    }
  };

  const toggleItemsTransition = (disable = false) => {
    const todoItems = Array.from(todoList.children);

    if (disable) {
      todoItems.forEach((todoItem) =>
        todoItem.classList.remove("duration-500"),
      );
    } else {
      todoItems.forEach((todoItem) => todoItem.classList.add("duration-500"));
    }
  };

  const handlePointerMove = (event) => {
    toggleItemsTransition();

    if (!targetItem.classList.contains("ondrag")) {
      updateCurrentDroppable(null, targetItem === todoList.lastChild);
      prepareItem();
    }
    moveAt(event.pageX, event.pageY);

    targetItem.hidden = true;
    targetItem.style.pointerEvents = "none";
    filterTabs.hidden = true;
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    targetItem.hidden = false;
    targetItem.style.pointerEvents = "";
    filterTabs.hidden = false;

    if (!elemBelow) return;
    updateCurrentDroppable(elemBelow);
  };

  const moveToNewSlot = () => {
    const currentDroppableCoords = currentDroppable.getBoundingClientRect();
    targetItem.style.left = `${currentDroppableCoords.left + window.scrollX}px`;
    if (currentDroppable === todoList.lastChild && isBelowLastItem) {
      targetItem.style.top = `${currentDroppableCoords.bottom + window.scrollY}px`;
    } else {
      targetItem.style.top = `${currentDroppableCoords.top - targetItem.offsetHeight + window.scrollY}px`;
    }
  };

  const insertItem = () => {
    targetItem.classList.remove("ondrag");
    targetItem.style.position = "";
    targetItem.style.top = "0";
    targetItem.style.left = "0";
    currentDroppable.style.margin = "0";

    if (currentDroppable === todoList.lastChild && isBelowLastItem) {
      currentDroppable.after(targetItem);
    } else {
      currentDroppable.before(targetItem);
    }

    currentDroppable = null;
    toggleItemsTransition(true);
    targetItem.removeEventListener("transitionend", insertItem);
  };

  const handlePointerUp = () => {
    document.removeEventListener("pointermove", handlePointerMove);
    targetItem.removeEventListener("pointerup", handlePointerUp);

    if (!document.querySelector(".ondrag")) return;

    targetItem.style.transition = "";
    moveToNewSlot();

    targetItem.addEventListener("transitionend", insertItem);
  };

  document.addEventListener("pointermove", handlePointerMove);
  targetItem.addEventListener("pointerup", handlePointerUp);
}

updateTheme();

themeButton.addEventListener("click", handleThemeButtonClick);
document.addEventListener("click", handleFilterTabClick);
todoList.addEventListener("change", handleInputChange);
todoList.addEventListener("click", handleRemoveButtonClick);
clearCompletedButton.addEventListener("click", handleClearCompletedButtonClick);
addButton.addEventListener("click", handleAddButtonClick);
newTodoInput.addEventListener("keydown", handleNewTodoInputKeydown);
todoList.addEventListener("pointerdown", handleDragAndDrop);

createAndAddNewTodoItem("Complete Todo App on Frontend Mentor");
createAndAddNewTodoItem("Pick up groceries");
createAndAddNewTodoItem("Read for 1 hour");
createAndAddNewTodoItem("10 minutes meditation");
createAndAddNewTodoItem("Jog around the park 3x");
createAndAddNewTodoItem("Complete online JavaScript course");

todoList.firstChild.classList.add("item--checked");
toggleClearCompletedButton();
