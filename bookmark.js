// Function to save a new bookmark
function saveBookmark() {
    const bookmarkNameInput = document.getElementById("bookmarkName");
    const bookmarkURLInput = document.getElementById("bookmarkURL");
    const bookmarkTagsInput = document.getElementById("bookmarkTags");

    const bookmarkName = bookmarkNameInput.value;
    const bookmarkURL = bookmarkURLInput.value;
    const bookmarkTags = bookmarkTagsInput.value.split(',').map(tag => tag.trim());

    const bookmarkData = {
        name: bookmarkName,
        url: bookmarkURL,
        tags: bookmarkTags
    };

    // Save bookmark to localStorage
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.push(bookmarkData);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    bookmarkNameInput.value = "";
    bookmarkURLInput.value = "";
    bookmarkTagsInput.value = "";

    // Refresh the bookmarks display
    getBookmarks();
}

// Function to fetch bookmarks from localStorage and update the bookmark list
function getBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const bookmarkListContainer = document.getElementById("bookmarkList");
    bookmarkListContainer.innerHTML = ""; // Clear the current list

    bookmarks.forEach((bookmark, index) => {
        const newBookmarkElement = document.createElement("div");
        newBookmarkElement.classList.add("bookmark");

        const bookmarkTitleElement = document.createElement("a");
        bookmarkTitleElement.textContent = bookmark.name;
        bookmarkTitleElement.href = bookmark.url;
        bookmarkTitleElement.target = "_blank";

        const bookmarkTagsElement = document.createElement("p");
        bookmarkTagsElement.textContent = "Tags: " + bookmark.tags.join(", ");

        const readLaterButton = document.createElement("button");
        readLaterButton.textContent = "Add to Read Later";
        readLaterButton.onclick = function() {
            moveToReadLater(index);
        };

        newBookmarkElement.appendChild(bookmarkTitleElement);
        newBookmarkElement.appendChild(bookmarkTagsElement);
        newBookmarkElement.appendChild(readLaterButton);

        bookmarkListContainer.appendChild(newBookmarkElement);
    });
}

// Function to move a bookmark to the Read Later queue
function moveToReadLater(index) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    let readLater = JSON.parse(localStorage.getItem('readLater')) || [];

    readLater.push(bookmarks[index]);
    bookmarks.splice(index, 1); // Remove the bookmark from bookmarks list

    localStorage.setItem('readLater', JSON.stringify(readLater));
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Refresh both lists
    getBookmarks();
    getReadLaterQueue();
}

// Function to fetch Read Later queue from localStorage and update the list
function getReadLaterQueue() {
    const readLater = JSON.parse(localStorage.getItem('readLater')) || [];
    const readLaterListContainer = document.getElementById("readLaterList");
    readLaterListContainer.innerHTML = ""; // Clear the current list

    readLater.forEach((bookmark, index) => {
        const newBookmarkElement = document.createElement("div");
        newBookmarkElement.classList.add("bookmark");

        const bookmarkTitleElement = document.createElement("a");
        bookmarkTitleElement.textContent = bookmark.name;
        bookmarkTitleElement.href = bookmark.url;
        bookmarkTitleElement.target = "_blank";

        const bookmarkTagsElement = document.createElement("p");
        bookmarkTagsElement.textContent = "Tags: " + bookmark.tags.join(", ");

        const revertButton = document.createElement("button");
        revertButton.textContent = "Revert to Your Bookmarks";
        revertButton.onclick = function() {
            revertToBookmarks(index);
        };

        newBookmarkElement.appendChild(bookmarkTitleElement);
        newBookmarkElement.appendChild(bookmarkTagsElement);
        newBookmarkElement.appendChild(revertButton);

        readLaterListContainer.appendChild(newBookmarkElement);
    });
}

// Function to revert a bookmark back to the bookmarks list from Read Later queue
function revertToBookmarks(index) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    let readLater = JSON.parse(localStorage.getItem('readLater')) || [];

    bookmarks.push(readLater[index]);
    readLater.splice(index, 1); // Remove the bookmark from Read Later queue

    localStorage.setItem('readLater', JSON.stringify(readLater));
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Refresh both lists
    getBookmarks();
    getReadLaterQueue();
}

// Function to filter bookmarks based on the search query
function filterBookmarks() {
    const searchQuery = document.getElementById("searchQuery").value.toLowerCase();
    const bookmarks = document.getElementsByClassName("bookmark");

    for (let bookmark of bookmarks) {
        const name = bookmark.firstChild.textContent.toLowerCase();
        const tags = bookmark.lastChild.textContent.toLowerCase();

        if (name.includes(searchQuery) || tags.includes(searchQuery)) {
            bookmark.style.display = "";
        } else {
            bookmark.style.display = "none";
        }
    }
}

// Get bookmarks and Read Later queue on page load
document.addEventListener('DOMContentLoaded', function() {
    getBookmarks();
    getReadLaterQueue();
});
