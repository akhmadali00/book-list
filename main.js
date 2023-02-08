class Book{
    constructor(title, author){
        this.title = title;
        this.author = author;
    }
}
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];   
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBookToStorage(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static deleteBookFromStorage(title){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.title === title){
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}
class UI{
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }
    static addBookToList(book){
        const books = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td><button class='btn btn-danger delete'>X</button></td>
        `
        books.appendChild(row);
    }
    static removeBook(book){
        book.parentElement.remove();
    }
    static showAlerts(message, className){
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(message));
        div.className = `alert alert-${className}`;
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => {
            div.remove()
        }, 2000);
    }
    static clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
    }
}
//Add book
document.getElementById('book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    if(title === '' || author === ''){
        UI.showAlerts('Please fill in the fields!', 'danger');
    }else{
        const book = new Book(title, author);
        UI.addBookToList(book);
        Store.addBookToStorage(book);
        UI.showAlerts('New book added!', 'success');
        UI.clearFields();
    }
})
//Remove book
document.getElementById('book-list').addEventListener('click', (e) => {
    if(e.target.classList.contains('delete')){
        UI.removeBook(e.target.parentElement);
        Store.deleteBookFromStorage(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
        UI.showAlerts('Book removed!', 'success');
    }
})

//Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks)