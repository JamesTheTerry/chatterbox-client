// YOUR CODE HERE:

$(document).ready(function() {
  app.init();
});

var app = {
  
  friends: [],
  
  rooms: [],
  
  init: function() {
    $.ajaxSetup({
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages'
      // contentType: 'application/json'
    });
    this.fetch();
    this.addEventHandlers(); 
  },
  
  fetch: function() {
    // this.renderMessage = this.renderMessage.bind(this);
    $.ajax({
      type: 'GET',
      data: 'order=-createdAt',
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
    messages.forEach((message, i) => {
      if (this.rooms.indexOf(message.roomname) === -1 && message.roomname) {
        this.rooms.push(message.roomname);
        $('#roomSelect').append(`<option id=${this.rooms.length - 1} class="room"></option>`);
        $(`#${this.rooms.length - 1}`).text(message.roomname);
      }
    });      
  },
  
  
  createMessage: function(text) {
    var url = new URL(window.location.href);
    var username = url.searchParams.get('username');
    var room = $('#roomSelect').val();
    var message = {
      username: username,
      text,
      roomname: room
    };
    return message;
  },
  
  send: function(message) {
    $.ajax({
      type: 'POST',
      data: message,
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
  
  //this.rooms.indexOf(newRoomName) === -1
  renderMessage: function(message) {
    var usernameClasses = 'username';
    var messageClasses = 'contents';
    if (this.friends.indexOf(message.username) !== -1) {
      usernameClasses += ' friend';
      messageClasses += ' friendMessage';
    }
    
    var html = `<div id=${message.objectId} class="messageContainer">
    <div class="usernameContainer">
      <div class="${usernameClasses}"></div>
      <div class="time">${moment(message.timeCreatedAt).format('hh:mma')}</div>
    </div>
    <div class="${messageClasses}"></div>
    </div>`;
    $('#chats').prepend(html);
    $(`#${message.objectId} .username`).text(message.username || 'literally noone');
    $(`#${message.objectId} .contents`).text(message.text);
  },
  
  renderRoom: function(room) {
    var html = `<option value=${room}>${room}</option>`;
    $('#roomSelect').append(html);
  },
  
  handleSubmit: function(e) {
    e.preventDefault();
    if ($('#message').val().length === 0) {
      return;
    }
    var message = this.createMessage($('#message').val());
    this.send(message);
    $('#message').val('');
    $('#chats').empty();
    this.fetch();
  },
  
  handleUsernameClick: function(e) {
    if (this.friends.indexOf(e.target.innerText) === -1) {
      this.friends.push(e.target.innerText);
      console.log(this.friends); 
      console.log(e.target);
      $(e.target).addClass('friend');
      $('#chats').empty();
      this.fetch();
    }
  },
  
  addEventHandlers: function() {
    // $('#message').on('keydown', (e) => {
    //   // console.log($('#message').val());
    //   if (e.keyCode === 13 && $('#message').val().length > 0) {
    //     var url = new URL(window.location.href);
    //     var username = url.searchParams.get('username');
    //     var room = $('#roomSelect').val();
    //     var message = {
    //       username: username,
    //       text: e.target.value,
    //       roomname: room
    //     };
    //     console.log(message);       
    //     this.send(message);
    //     $('#message').val('');
    //   }
    // });
    
    $('#chats').on('click', '.username', (e) => {
      this.handleUsernameClick(e);
    });
    
    $('#send').submit(this.handleSubmit.bind(this));
    
    $('#roomSelect').on('change', (e) => {
      $('#chats').empty();
      this.fetch();
    });
    
    $('#createNewRoom').on('click', (e) => {
      var newRoomName = $('#newRoomName').val();
      if (this.rooms.indexOf(newRoomName) === -1 && newRoomName) {
        this.rooms.push(newRoomName);
        $('#roomSelect').append(`<option id='${this.rooms.length - 1}'></option>`);
        $(`#${this.rooms.length - 1}`).text(newRoomName);
        
        // this can be hacked
        // $('#roomSelect').append(`<option id='${this.rooms.length - 1}'>${newRoomName}</option>`);
      }
      $('#newRoomName').val('');
    });
  }
};