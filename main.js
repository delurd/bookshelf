const inputBookTitle = document.getElementById("inputBookTitle");
const inputBookAuthor = document.getElementById("inputBookAuthor");
const inputBookYear = document.getElementById("inputBookYear");
const bookSubmit = document.getElementById("inputBook");
const inputBookIsComplete = document.getElementById("inputBookIsComplete");
const searchButton = document.querySelector("#searchBook");

let booksData = [];
const localStorageKey = "BOOKS_DATA";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadFromStorage();
  }

  bookSubmit.addEventListener("submit", function (event) {
    event.preventDefault();

    const generateId = +new Date();

    if (isStorageExist) {
      booksData.push({
        id: generateId,
        title: inputBookTitle.value,
        author: inputBookAuthor.value,
        year: inputBookYear.value,
        isComplete: inputBookIsComplete.checked,
      });

      saveToStorage();

    }
  });

  tampilDataBuku();



  const searchSection = document.querySelector(".search_section");
  searchSection.addEventListener("mouseover", () => {
    searchSection.classList.add("hover");
  });

  const mainClick = document.querySelector("main");
  mainClick.addEventListener("click", () => {
    searchSection.classList.remove("hover");
  });

  searchButton.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchValue = document.getElementById("searchBookTitle").value;
    if (searchValue == "") {
      tampilDataBuku();
    } else {
      tampilSearch(searchValue);
    }
  });
});

function tampilSearch(judul) {
  const arrSearch = [];

  for (const bookData of booksData) {
    const lowerTitle = bookData.title.toLowerCase();
    const lowerJudul = judul.toLowerCase();
    if (lowerTitle.includes(lowerJudul)) {
      arrSearch.push(bookData);
    }
  }

  tampilDataBuku("search", arrSearch);
}

function saveToStorage() {
  const arrData = booksData;
  localStorage.setItem(localStorageKey, JSON.stringify(arrData));

  tampilDataBuku();
}

function tampilDataBuku(type = "default", data = []) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  let parseToArrData = [];

  if (type == "default") {
    // parseToArrData = JSON.parse(localStorage.getItem(localStorageKey));
    parseToArrData = booksData;
  } else {
    parseToArrData = data;
  }
  

  completeBookshelfList.innerHTML = "";
  incompleteBookshelfList.innerHTML = "";

  for (const bookData of parseToArrData) {
    if (bookData.isComplete) {
      completeBookshelfList.append(generateHTMLBookItem(bookData));
    } else {
      incompleteBookshelfList.append(generateHTMLBookItem(bookData));
    }
  }
}

function generateHTMLBookItem(dataBuku) {
  const artikel = document.createElement("article");
  artikel.classList.add("book_item");

  const divDesc = document.createElement("div");
  const title = document.createElement("a");
  const penulis = document.createElement("a");
  const breek = document.createElement("br");

  title.classList.add("h3");
  title.innerText = dataBuku.title;
  penulis.innerText = "Penulis : " + dataBuku.author;

  divDesc.append(title, breek, penulis);

  const pTahun = document.createElement("p");
  pTahun.innerText = "Tahun : " + dataBuku.year;

  const divButton = document.createElement("div");
  divButton.classList.add("action");

  if (dataBuku.isComplete) {
    const btnUncomplete = document.createElement("button");
    btnUncomplete.classList.add("green");
    btnUncomplete.innerText = "Belum selesai dibaca";
    btnUncomplete.addEventListener("click", function () {
      addToIncomplete(dataBuku.id);
    });
    divButton.append(btnUncomplete);
  } else {
    const btnComplete = document.createElement("button");
    btnComplete.classList.add("green");
    btnComplete.innerText = "Selesai dibaca";
    btnComplete.addEventListener("click", function () {
      addToComplete(dataBuku.id);
    });

    divButton.append(btnComplete);
  }

  const btnEdit = document.createElement("button");
  btnEdit.classList.add("orange");
  btnEdit.innerHTML =
    '<i class="fa fa-pencil" aria-hidden="true" alt="Search">';
  btnEdit.addEventListener("click", function () {
    editBuku(dataBuku.id);
  });
  divButton.append(btnEdit);

  const btnHapus = document.createElement("button");
  btnHapus.classList.add("red");
  btnHapus.innerHTML =
    '<i class="fa fa-trash" aria-hidden="true" alt="Search">';
  btnHapus.addEventListener("click", function () {
    hapusBuku(dataBuku.id);
  });
  divButton.append(btnHapus);

  artikel.append(divDesc, pTahun, divButton);

  return artikel;
}

function addToComplete(id) {
  const bukunya = getDataBuku(id);

  bukunya.isComplete = true;

  saveToStorage();
  tampilDataBuku();
}

function addToIncomplete(id) {
  const bukunya = getDataBuku(id);

  bukunya.isComplete = false;

  saveToStorage();
  tampilDataBuku();
}

function hapusBuku(id) {
  const bukunya = getDataBuku(id);
  
  const indexInArray = booksData.indexOf(bukunya);

 
  if (indexInArray !== -1) {
    booksData.splice(indexInArray, 1);
  }
 
  saveToStorage();
  tampilDataBuku();

}

function editBuku(id) {
  alert;
  const bukunya = getDataBuku(id);
  const alertEdit = document.querySelector("#alertEdit");
  const inputEdit = document.querySelectorAll("#alertEdit input");
  const alertEditClose = document.querySelector("#alertEditClose");

  const editBookTitle = document.getElementById("editBookTitle");
  const editBookAuthor = document.getElementById("editBookAuthor");
  const editBookYear = document.getElementById("editBookYear");
  const editBookIsComplete = document.getElementById("editBookIsComplete");
  const editBookSubmit = document.getElementById("editBook");

  for (bg of inputEdit) {
    bg.style.backgroundColor = "aliceblue";
  }

  editBookTitle.value = bukunya.title;
  editBookAuthor.value = bukunya.author;
  editBookYear.value = bukunya.year;
  editBookIsComplete.checked = bukunya.isComplete;

  alertEdit.classList.add("show");
  alertEditClose.addEventListener("click", () => {
    alertEdit.classList.remove("show");
  });
  editBookSubmit.addEventListener("submit", (e) => {
    e.preventDefault();

    bukunya.title = editBookTitle.value;
    bukunya.author = editBookAuthor.value;
    bukunya.year = editBookYear.value;
    bukunya.isComplete = editBookIsComplete.checked;

    saveToStorage();
    tampilDataBuku();

    alertEdit.classList.remove("show");
  });
}

function getDataBuku(id) {
  for (const bookData of booksData) {
    if (bookData.id === id) {
      return bookData;
    }
  }
}

function loadFromStorage() {
  const parseToArrData = JSON.parse(localStorage.getItem(localStorageKey));
  parseToArrData;
  if (parseToArrData !== null) {
    for (data of parseToArrData) {
      booksData.push(data);
    }
  }
}
