// YOUR CODE HERE:

$(document).ready(function() {
  app.init();
});

var app = {
  
  friends: [],
  
  rooms: [],
  
  init: function() {
    $.ajaxSetup({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      contentType: 'application/json'
    });
    this.fetch();
    
    // $('#fetchMessages').on('click', () => this.fetch());
    
    $('#message').on('keydown', (e) => {
      if (e.keyCode === 13) {
        var message = this.createMessage(e.target.value); 
        console.log(message);       
        this.send(message);
        $('#message').val('');
      }
    });
    
    $('#chats').on('click', '.username', (e) => {
      this.handleUsernameClick(e);
    });
    
    $('#send .submit').on('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(e);
    });
    
    $('#roomSelect').on('change', (e) => {
      $('#chats').empty();
      this.fetch();
    });
    
    $('#createNewRoom').on('click', (e) => {
      var newRoomName = $('#newRoomName').val();
      if (this.rooms.indexOf(newRoomName) === -1 && newRoomName) {
        this.rooms.push(newRoomName);
        var html = `<option name=${newRoomName}>${newRoomName}</option>`;
        $('#roomSelect').append(html);
      }        
      $('#newRoomName').val('');
    });
    
  },
  
  fetch: function() {
    // this.renderMessage = this.renderMessage.bind(this);
    $.ajax({
      type: 'GET',
      success: data => {
        this.addRooms(data.results);
        var currentRoom = $('#roomSelect').val();
        var messages = data.results.filter(val => {
          return val.roomname === currentRoom;
        });
        messages.forEach(message => {
          this.renderMessage(message);
        });
      }
    });
  },
  
  addRooms: function(messages) {
    var html = '';
    messages.forEach(message => {
      if (this.rooms.indexOf(message.roomname) === -1 && message.roomname) {
        this.rooms.push(message.roomname);
        html += `<option name=${message.roomname}>${message.roomname}</option>`;
      }
    });
    if (html === '') {
      return null;
    }
    $('#roomSelect').append(html);  
  },
  
  
  createMessage: function(text) {
    var url = new URL(window.location.href);
    var username = url.searchParams.get('username');
    var room = $('#roomSelect').val();
    var message = {
      username: 'chris',
      text,
      roomname: room
    };
    return message;
  },
  
  send: function(message) {
    console.log('sendMSG', message);
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
    var html = `<div class="messageContainer">
    <div class="username">${message.username}</div>
    <div class="contents">${message.text}</div>
    </div>`;
    $('#chats').append(html);
  },
  
  renderRoom: function(room) {
    var html = `<option value=${room}>${room}</option>`;
    $('#roomSelect').append(html);
  },
  
  handleSubmit: function() {
    var message = this.createMessage($('#messageInput').val());
    this.send(message);
    $('#message').val('');
  },
  
  handleUsernameClick: function(e) {
    if (this.friends.indexOf(e.target.innerText) === -1) {
      this.friends.push(e.target.innerText);
      console.log(this.friends); 
    }
  }
};