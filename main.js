const bookshelfs = [];
const RENDER_EVENT = 'render-bookshelf';
const ADD_EVENT = 'add-bookshelf';
const CHANGE_EVENT = 'change-bookshelf';
const DELETE_EVENT = 'delete-bookshelf';
const STORAGE_KEY = 'BOOKSHELF-APPS';
const SEARCH_EVENT = 'search-bookshelf';

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, writer, year, isComplete){
    return {
        id,
        title,
        writer,
        year,
        isComplete
    }
}

function findBook(bookId){
    for(bookItem of bookshelfs){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId){
    for(index in bookshelfs){
        if(bookshelfs[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData(event){
    if(isStorageExist()){
        const parsed = JSON.stringify(bookshelfs);
        localStorage.setItem(STORAGE_KEY, parsed);
        if(event == "add"){
            document.dispatchEvent(new Event(ADD_EVENT));
        }else if(event == "change"){
            document.dispatchEvent(new Event(CHANGE_EVENT));
        }else if(event == "remove"){
            document.dispatchEvent(new Event(DELETE_EVENT));
        }
    }
}

function loadDataFromStorage(){
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if(data !== null){
        for(const bookshelf of data){
            bookshelfs.push(bookshelf);
        }
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function insertBook(bookshelfObject){
    const {id, title, writer, year, icComplete} = bookshelfObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textWriter = document.createElement('p');
    textWriter.innerText = `author: ${writer} | Year: ${year}`;

    const divLeft = document.createElement('div');
    divLeft.classList.add('col-sm-8');
    divLeft.append(textTitle, textWriter);

    const textContainer = document.createElement('article');
    textContainer.setAttribute('id', `book-${id}`);
    textContainer.classList.add('book_item');
    textContainer.classList.add('row');
    textContainer.append(divLeft);

    const container = document.createElement('div');
    container.setAttribute('class', 'action');
    container.classList.add('col-sm-4');

    if(bookshelfObject.isComplete){
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerHTML="Not Completed";
        undoButton.addEventListener('click', function(){
            undoBookFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerHTML="Delete";
        trashButton.addEventListener('click', function(){
            removeBookFromCompleted(id);
        })

        container.append(undoButton, trashButton);
    }else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerHTML="Completed";
        checkButton.addEventListener('click', function(){
            addBookToCompleted(id);
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerHTML="Delete";
        trashButton.addEventListener('click', function(){
            removeBookFromCompleted(id);
        })

        container.append(checkButton, trashButton);
    }

    textContainer.append(container);

    return textContainer;
}

function addBookToCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData("change");
}

function removeBookFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    bookshelfs.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData("remove");
}

function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData("change");
}

document.addEventListener(RENDER_EVENT, function(){
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for(var bookshelf of bookshelfs){
        const bookshelfElement = insertBook(bookshelf);
        if(bookshelf.isComplete){
            completeBookshelfList.append(bookshelfElement);
        }else{
            incompleteBookshelfList.append(bookshelfElement);
        }
    }
});

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('inputBook');
    const searchBook = document.getElementById('searchBook');

    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    searchBook.addEventListener('submit', function(event){
        event.preventDefault();
        search();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
})

function search(){
    const searchTitle = document.getElementById('searchBookTitle').value;
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    document.dispatchEvent(new Event(RENDER_EVENT));

    if(data !== null){
        for(const bookshelf of data){
            if(bookshelf.title != searchTitle){
                var article = document.getElementById(`book-${bookshelf.id}`);
                console.log(bookshelf.isComplete);
                if(bookshelf.isComplete == false){
                    var box = document.getElementById('incompleteBookshelfList');
                    box.removeChild(article);
                }else{
                    var box = document.getElementById('completeBookshelfList');
                    box.removeChild(article);
                }
            }
        }
    }
}

document.addEventListener(SEARCH_EVENT, function(){
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for(var bookshelf of bookshelfs){
        const bookshelfElement = insertBook(bookshelf);
        if(bookshelf.isComplete){
            completeBookshelfList.append(bookshelfElement);
        }else{
            incompleteBookshelfList.append(bookshelfElement);
        }
    }
});


document.addEventListener(ADD_EVENT, (e)=>{
    alert('New Book Has Been Added!');
})

document.addEventListener(CHANGE_EVENT, (e)=>{
    alert('Book Properties Has Been Changed!');
})

document.addEventListener(DELETE_EVENT, (e)=>{
    alert('Book Has Been Removed!');
})

function addBook(){
    const textTitle = document.getElementById('inputBookTitle').value;
    const textAuthor = document.getElementById('inputBookAuthor').value;
    const textYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const bookshelfObject = generateBookObject(generateID, textTitle, textAuthor, textYear, isComplete);
    bookshelfs.push(bookshelfObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData("add");
}