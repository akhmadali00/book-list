// Book Class: Represents a Book
class Book{
    constructor(title, author){
        this.title = title
        this.author = author
    }
}
// UI Class: Handle UI Tasks
class UI{
    static displayBooks(){
        const book = Store.getBooks();
        book.forEach((book) => UI.addBookToList(book));

    }
    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td><button class='btn btn-danger delete'>X</button></td>
        `;
        list.appendChild(row);
    }
    static deleteBook(book){
        if(book.classList.contains('delete')){
            book.parentElement.parentElement.remove(); 
        }
    }
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //Make alert vanish
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 2000);
    }
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
    }
}
// Store Class: Handles Storage
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
    static addBook(book){
        const books = Store.getBooks();
        books.unshift(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(title){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.title === title){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault();
    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    //Validate
    if(title === '' || author === ''){
        UI.showAlert('Iltimos kataklarni to\'ldiring!', 'danger')
    }else{
        //Instantiate book
        const book = new Book(title, author);
        //Add book to UI
        UI.addBookToList(book);
        //Add book to store
        Store.addBook(book);
        //Show success alert
        UI.showAlert('Kitob muvaffaqiyatli qo\'shildi!', 'success')
        //Clear fields
        UI.clearFields();
    }
})

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    //Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
    //Book removed alert
    UI.showAlert('Kitob muvaffaqiyatli o\'chirildi!', 'success');
})
