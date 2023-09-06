import React from 'react';
// eslint-disable-next-line
import { Component } from 'react';
import { useState, useEffect } from 'react';
import './App.css'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/books'

})

function Clock(){
  const [date, setDate] = useState(new Date());
  
  function refreshClock() {
    setDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);
  return (
    <span>
      {date.toLocaleTimeString()}
    </span>
  );
}

function checkOut() {
  let inputID = document.getElementById("bookID").value;
  let fName = document.getElementById("fName").value;
  console.log(inputID + fName)

  fetch(`http://localhost:3000/books/${inputID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      avail: false,
      who: `${fName}`,
      due: "1/5/23"
    })
  })
  .then(response => response.text())
  .then(text => window.location.reload())
}

function checkIn() {
  let inputID = document.getElementById("bookId").value;
  let fName = document.getElementById("fName").value;
  console.log(inputID + fName)

  fetch(`http://localhost:3000/books/${inputID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      avail: true,
      who: "",
      due: ""
    })
  })
  .then(response => response.text())
  .then(text => window.location.reload())
}

function getAvailBooks() {
  fetch('http://localhost:3000/books?avail=true', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
.then(response => response.text())
.then(text => alert(text))

}


function getCheckedOutBooks() {
  fetch('http://localhost:3000/books?avail=false', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
.then(response => response.text())
.then(text => alert(text))

}

function header() {
    return (
      <div className="header">
        <h3>Check-Out A Book!</h3>
        <p><b>{Clock()}</b></p>
        <div className="header-body">
        <label htmlFor="bookID"><b>Book ID: </b></label>
        <input type="text" id="bookID" name="bookID"></input>
        </div>
        <div>
        <br></br>
        <label htmlFor="fName"><b>First Name: </b></label>
        <input type="text" id="fName" name="fName"></input>
        </div>
        <div>
          <br></br>
        <button onClick={checkOut} className="small-btn">Submit</button>
        </div>
      </div>  
    );
  }
       

function footer() {
    return (
      <div className="footer">
        <h2>Check-In A Book!</h2>
        <div className="footer-body">
        <label htmlFor="bookId"><b>Book ID: </b></label>
        <input type="text" id="bookId" name="bookId"></input>
        </div>
        <div>
        <br></br>
        <button className="small-btn" onClick={checkIn}>Submit</button>
        </div>
      </div>   
    );
  }  


class Left extends React.Component{
  // var count = 0;
  state = {
    books: []
  }
  constructor() {
    super();
    api.get('/?avail=true').then(res => {
      console.log(res.data)
      this.setState({ books: res.data })
    })
  }
  render() {
    return (
        <div className="left-header">
          <h1><button onClick={getAvailBooks} className="btn">List Available Books</button></h1>
          <div className="left-body">
            {this.state.books.map(book => <p key={book.id}><b>[ID: {book.id}]  {book.title}</b></p>)}
            </div>
          </div>

         );
  }
  
}

class Right extends React.Component{
  // var count = 0;
  state = {
    books: []
  }
  constructor() {
    super();
    api.get('/?avail=false').then(res => {
      console.log(res.data)
      this.setState({ books: res.data })
    })
  }
  render() {
    return (
        <div className="left-header">
          <h1><button onClick={getCheckedOutBooks} className="btn">List Checked Out Books</button></h1>
          <div className="left-body">
            {this.state.books.map(book => <p key={book.id}><b>[ID: {book.id}] {book.title}</b></p>)}
            </div>
          </div>

         );
  }
  
}

function App () {
  
    return (
      <div className="app">
        {header()}
      <div className="main-section">
        <div className="left-box">
          <Left />
        </div>
        <div className="right-box">
          <Right />
        </div>
      </div>
        {footer()}

    </div>
    );
  }    
  


export default App;
