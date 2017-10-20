// YOUR CODE HERE:

$(document).ready(function() {
  app.init();
});

var app = {
  
  friends: [],
  
  init: function() {
    $.ajaxSetup({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      contentType: 'application/json'
    });
    
    $('#fetchMessages').on('click', () => this.fetch());
    $('#messageInput').on('keydown', (e) => {
      if (e.keyCode === 13) {
        // for accessing names in url window.location.href
        // file:///Users/student/hrsf84-chatterbox-client/client/index.html?username=chris%20&%20james
        var url = new URL(window.location.href);
        var username = url.searchParams.get('username');
        var message = {
          username: username,
          text: e.target.value,
          roomname: ''
        };
        this.send(message);
      }
    });
  },
  
  fetch: function() {
    // this.renderMessage = this.renderMessage.bind(this);
    $.ajax({
      type: 'GET',
      success: data => {
        data.results.forEach(message => {
          this.renderMessage(message);
        });
      }
    });
  },
  
  send: function(message) {
    $.ajax({
      type: 'POST',
      data: JSON.stringify(message),
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  
  clearMessages: function() {
    $('#chats').empty();
  },
  
  renderMessage: function(message) {
    var html = `<div class="message">${message.username}: ${message.text}</div>`;
    $('#chats').append(html);
  },
  
  renderRoom: function(room) {
    var html = `<option value=${room}>${room}</option>`;
    $('#roomSelect').append(html);
  },
  
  handleSubmit: function() {
    
  },
  
  handleUsernameClick: function(e) {
    
  }
};