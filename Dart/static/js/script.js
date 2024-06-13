'use strict';

/**
 * navbar variables
 */

const navOpenBtn = document.querySelector("[data-menu-open-btn]");
const navCloseBtn = document.querySelector("[data-menu-close-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("active");
  });
}

//NavBar
function hideIconBar() {
  var iconBar = document.getElementById("iconBar");
  var navigation = document.getElementById("navigation");
  iconBar.setAttribute("style", "display:none;");
  navigation.classList.remove("hide");
}

function showIconBar() {
  var iconBar = document.getElementById("iconBar");
  var navigation = document.getElementById("navigation");
  iconBar.setAttribute("style", "display:block;");
  navigation.classList.add("hide");
}

//Comment
function showComment() {
  var commentArea = document.getElementById("comment-area");
  commentArea.classList.remove("hide");
}

//Reply
function showReply() {
  var replyArea = document.getElementById("reply-area");
  replyArea.classList.remove("hide");
}

/**
 * header sticky
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 10 ? header.classList.add("active") : header.classList.remove("active");
});

/**
 * go top
 */

const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  window.scrollY >= 500 ? goTopBtn.classList.add("active") : goTopBtn.classList.remove("active");
});

document.addEventListener('DOMContentLoaded', (event) => {
  const postCommentButton = document.getElementById('post-comment');
  const commentsContainer = document.getElementById('comments-container');
  const commentTemplate = document.getElementById('comment-template');

  const saveComments = (comments) => {
    localStorage.setItem('comments', JSON.stringify(comments));
  };

  const loadComments = () => {
    const comments = localStorage.getItem('comments');
    return comments ? JSON.parse(comments) : [];
  };

  const renderComments = (comments, container) => {
    container.innerHTML = '';
    comments.forEach((comment) => {
      const commentElement = createCommentElement(comment);
      container.appendChild(commentElement);
    });
  };

  const createCommentElement = (comment) => {
    const clone = commentTemplate.content.cloneNode(true);
    const commentElement = clone.querySelector('.comment');
    commentElement.id = `comment-${comment.id}`;
    commentElement.querySelector('.comment-username').textContent = comment.username;
    commentElement.querySelector('.vote-count').textContent = comment.votes;
    commentElement.querySelector('.comment-text').textContent = comment.text;

    commentElement.addEventListener('click', () => {
      window.location.href = `/comment.html#comment-${comment.id}`;
    });

    return commentElement;
  };

  let comments = loadComments();
  renderComments(comments, commentsContainer);

  postCommentButton.addEventListener('click', () => {
    const commentText = document.getElementById('comment-text').value;

    if (username && commentText) {
      const comment = {
        id: Date.now(),
        username: username,
        text: commentText,
        votes: 0,
        replies: []
      };

      comments.push(comment);
      saveComments(comments);

      const commentElement = createCommentElement(comment);
      commentsContainer.appendChild(commentElement);

      document.getElementById('username').value = '';
      document.getElementById('comment-text').value = '';
    }
  });
});
