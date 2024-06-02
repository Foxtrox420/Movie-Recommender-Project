document.addEventListener('DOMContentLoaded', (event) => {
    const commentDetailContainer = document.getElementById('comment-detail-container');
    const postReplyButton = document.getElementById('post-reply');
    const commentDetailTemplate = document.getElementById('comment-detail-template');
    const replyTemplate = document.getElementById('reply-template');
  
    const commentId = window.location.hash.substring(1);
  
    const saveComments = (comments) => {
      localStorage.setItem('comments', JSON.stringify(comments));
    };
  
    const loadComments = () => {
      const comments = localStorage.getItem('comments');
      return comments ? JSON.parse(comments) : [];
    };
  
    const renderCommentDetail = (comment, container) => {
      container.innerHTML = '';
      const clone = commentDetailTemplate.content.cloneNode(true);
      const commentElement = clone.querySelector('.comment');
  
      commentElement.id = `comment-${comment.id}`;
      commentElement.querySelector('.comment-username').textContent = comment.username;
      commentElement.querySelector('.vote-count').textContent = comment.votes;
      commentElement.querySelector('.comment-text').textContent = comment.text;
  
      const repliesContainer = document.createElement('div');
      repliesContainer.className = 'replies-container';
      comment.replies.forEach(reply => {
        const replyElement = createReplyElement(reply);
        repliesContainer.appendChild(replyElement);
      });
  
      commentElement.appendChild(repliesContainer);
      container.appendChild(commentElement);
    };
  
    const createReplyElement = (reply) => {
      const clone = replyTemplate.content.cloneNode(true);
      const replyElement = clone.querySelector('.reply');
  
      replyElement.querySelector('.comment-username').textContent = reply.username;
      replyElement.querySelector('.vote-count').textContent = reply.votes;
      replyElement.querySelector('.comment-text').textContent = reply.text;
  
      return replyElement;
    };
  
    let comments = loadComments();
    const comment = comments.find(c => `comment-${c.id}` === commentId);
  
    if (comment) {
      renderCommentDetail(comment, commentDetailContainer);
  
      postReplyButton.addEventListener('click', () => {
        const replyUsername = document.getElementById('reply-username').value;
        const replyText = document.getElementById('reply-text').value;
  
        if (replyUsername && replyText) {
          const reply = {
            id: Date.now(),
            username: replyUsername,
            text: replyText,
            votes: 0
          };
  
          comment.replies.push(reply);
          saveComments(comments);
          renderCommentDetail(comment, commentDetailContainer);
  
          document.getElementById('reply-username').value = '';
          document.getElementById('reply-text').value = '';
        }
      });
    }
  });
  