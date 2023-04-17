class Item {
    constructor(id, title, date, description) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.description = description;
        this.isSelected = false;
    }
}

class ItemStorage {
    itemName = 'savedItems';

    getAll() {
        const savedValue = localStorage.getItem(this.itemName);
        return savedValue == null ? [] : JSON.parse(savedValue);
    }

    get(id) {
        const items = this.getAll();
        return items.find(x => x.id === id);
    }

    saveAll(items) {
        localStorage.setItem(this.itemName, JSON.stringify(items));
    }

    createOrUpdate(item) {
        const savedItems = this.getAll();
        const savedItem = savedItems.find(x => x.id === item.id);
        if (savedItem) {
            savedItem.title = item.title;
            savedItem.date = item.date;
            savedItem.description = item.description;
        } else {
            savedItems.push(item);
        }

        this.saveAll(savedItems);
    }
}

class SelectedIdStorage {
    key = 'selectedItemsIds';

    isSelected(id) {
        const savedIds = this.getAll();
        return savedIds.includes(id);

    }

    add(id) {
        const savedIds = this.getAll();
        if (!savedIds.includes(id)) {
            savedIds.push(id);
            this.saveAll(savedIds);
        }
    }

    remove(id) {
        const savedIds = this.getAll();
        const filteredIds = savedIds.filter(idNotToDelete => idNotToDelete !== id)
        this.saveAll(filteredIds);
        //або через findIdex() і  Splice()

    }

    getAll() {
        const savedValue = localStorage.getItem(this.key);
        return savedValue == null ? [] : JSON.parse(savedValue);
    }

    saveAll(ids) {
        localStorage.setItem(this.key, JSON.stringify(ids));
    }
}

const storage = new ItemStorage();
const selectedIdStorage = new SelectedIdStorage();

function navigateToNewItem() {
    location.href = 'file:///C:/Users/Admin/Documents/GitHub/home-work/src/item.html';
}

function generateNewId() {
    const allIds = storage.getAll().map(x => x.id);
    let maxId = allIds.length === 0 ? 0 : Math.max(...allIds);
    return maxId + 1;
}

function createItem() {
    const id = generateNewId();
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const item = new Item(id, title, date, description);
    storage.createOrUpdate(item);
    //console.log(storage.getAll()); redirect to index.html 
    navigateToNewList();
}

function showItems() {
    const items = storage.getAll();
    // create and insert every item to container
    items.forEach(element => createAndInsertItem(element));
}

function createAndInsertItem(item) {
    // <div class="item">
    //     <input type="checkbox" id="item1" name="item1" value="Home_routine">
    //     <label class="item-name" for="item1" title="Prepare for Easter">Prepare for Easter</label>
    //     <button class="material-icons icon-font-size" onclick="editFunction">edit</button>
    // </div>
    const rootElement = document.createElement('div');
    rootElement.setAttribute('class', 'item');
    const inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'checkbox');
    inputElement.setAttribute('id', `item${item.id}`);
    inputElement.checked = selectedIdStorage.isSelected(item.id);         //onclick - checked - saved to localstorage/ value checked v inputelement
    //inputElement
    //inputElement.value = selectedIdStorage.add(item.id);
    // TODO: Hot to say selected items? => inputElement.value
    const labelElement = document.createElement('label');
    labelElement.setAttribute('class', 'item-name');
    labelElement.setAttribute('for', `item${item.id}`);
    labelElement.setAttribute('title', item.title);
    labelElement.innerText = item.title;
    const buttonElement = document.createElement('button');
    buttonElement.innerText = 'edit';
    buttonElement.setAttribute('class', 'material-icons icon-font-size');
    buttonElement.addEventListener("click", () => editFunction(item.id));
    rootElement.appendChild(inputElement);
    rootElement.appendChild(labelElement);
    rootElement.appendChild(buttonElement);
    const container = document.getElementById('container');
    container.appendChild(rootElement);
    //document.body.insertBefore(element, container);

}

function editFunction(id) {
    location.href = `file:///C:/Users/Admin/Documents/GitHub/home-work/src/item.html?id=${id}`;
}

function navigateToNewList() {
    location.href = 'file:///C:/Users/Admin/Documents/GitHub/home-work/src/index.html';
}

function itemIsLoaded() {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id && storage.get(+id)) {
        document.getElementById('createButton')?.remove();
    } else {
        document.getElementById('updateButton')?.remove();

    }
}
// Task 16. Edit item
//1. In update mode write property of object to html elements.
//2. Add cancel button in update mode (redirect to main page).
//3. Implement logic for updateItem function.