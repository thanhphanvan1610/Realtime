const express = require('express');
const socket = require('socket.io');
const moment = require('moment');
// const MongoClient = require('mongodb').MongoClient;

// const mongoURI = 'mongodb://localhost:27017'; // Thay đổi URI kết nối MongoDB tại đây
// const dbName = 'mydatabase'; // Thay đổi tên cơ sở dữ liệu tại đây

// // Kết nối MongoDB
// MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
//   if (err) {
//     console.error('Lỗi kết nối MongoDB:', err);
//     return;
//   }

//   console.log('Đã kết nối thành công đến MongoDB...');

//   const db = client.db(dbName);

//   // Lưu thông tin người dùng khi nhập tên
//   socket.on('username', (username) => {
//     socket.username = username;

//     // Lưu thông tin người dùng vào cơ sở dữ liệu
//     db.collection('users').insertOne({
//       username: socket.username,
//       socketId: socket.id
//     }, (err, result) => {
//       if (err) {
//         console.error('Lỗi khi lưu thông tin người dùng:', err);
//       } else {
//         console.log('Thông tin người dùng đã được lưu trữ:', result.ops[0]);
//       }
//     });
//   });

//   // Lưu tin nhắn vào cơ sở dữ liệu
//   socket.on('chat', (message) => {
//     const timestamp = moment().format('HH:mm');

//     // Lưu tin nhắn vào cơ sở dữ liệu
//     db.collection('messages').insertOne({
//       username: socket.username,
//       message: message,
//       timestamp: timestamp
//     }, (err, result) => {
//       if (err) {
//         console.error('Lỗi khi lưu tin nhắn:', err);
//       } else {
//         console.log('Tin nhắn đã được lưu trữ:', result.ops[0]);
//       }
//     });

//   });

// });

const app = express();
const server = app.listen(3000, () => {
  console.log('Server đang lắng nghe tại cổng 3000...');
  
});

app.use(express.static('public'));

const io = socket(server);

io.on('connection', (socket) => {
  console.log('Có một kết nối mới:', socket.id);

  // Lưu trữ thông tin người dùng (tên và ID socket) khi nhập tên
  socket.on('username', (username) => {
    socket.username = username;
  });

  // Gửi tin nhắn
  socket.on('chat', (message) => {
    const timestamp = moment().format('HH:mm');
    io.emit('chat', {
      username: socket.username,
      message: message,
      timestamp: timestamp,
      status: 'Đã gửi'
    });
  });

  // Tạo một biến cờ để kiểm tra tin nhắn đã nhận
let messageReceived = false;

// Ghi lại khi tin nhắn đã nhận và gửi lại cho người gửi
socket.on('messageReceived', () => {
  if (!messageReceived) {
    const timestamp = moment().format('HH:mm');
    socket.emit('status', {
      username: socket.username,
      timestamp: timestamp,
      status: 'Đã nhận'
    });
    messageReceived = true;
  }
});

// Tạo một biến cờ để kiểm tra tin nhắn đã xem
let messageSeen = false;

// Ghi lại khi tin nhắn đã xem và gửi lại cho người gửi
socket.on('messageSeen', () => {
  if (!messageSeen) {
    const timestamp = moment().format('HH:mm');
    socket.emit('status', {
      username: socket.username,
      timestamp: timestamp,
      status: 'Đã xem'
    });
    messageSeen = true;
  }
});

// Đặt lại trạng thái tin nhắn đã nhận và đã xem khi người dùng đăng xuất
socket.on('disconnect', () => {
  messageReceived = false;
  messageSeen = false;
});
// đã gửi
socket.on('status', (data) => {
    const statusElement = document.createElement('div');
    statusElement.innerHTML = `<span class="status">${data.username} ${data.status} lúc ${data.timestamp}</span>`;
    messages.appendChild(statusElement);
  });
  
});
