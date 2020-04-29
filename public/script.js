let email = document.querySelector("#email");
let password = document.querySelector("#password");
let login = document.querySelector("#login");
let logout = document.querySelector("#logout");
let signup = document.querySelector("#signup");
let signInSignUp = document.querySelector("#signInSignUp");
let imgArray = [];
let messageContainer = document.querySelector("#messageContainer");
let formContainer = document.querySelector("#formContainer");

function toggleForm(){
  if(formContainer.classList.contains("hide")){
    formContainer.classList.remove("hide");
    signInSignUp.style.letterSpacing=".4em";
    signInSignUp.style.transition = "letter-spacing .5s linear";
  }else{
    signInSignUp.style.letterSpacing="inherit";
    signInSignUp.style.transition = "letter-spacing .5s linear";
    formContainer.classList.add("hide");
  }
}

login.addEventListener("click", (e) => {
  let emailValue = email.value;
  let passwordValue = password.value;
  let auth = firebase.auth();
  auth.signInWithEmailAndPassword(emailValue,passwordValue).catch((e) => {
    messageContainer.innerHTML = e.message;
  })
});

signup.addEventListener("click", (e) => {
  let emailValue = email.value;
  let passwordValue = password.value;
  let auth = firebase.auth();
  auth.createUserWithEmailAndPassword(emailValue,passwordValue).catch((e) => {
    messageContainer.innerHTML = e.message;
  })
});

logout.addEventListener("click", (e) => {
  firebase.auth().signOut();
})


let postContainer = document.querySelector("#postContainer");
let addPost = document.querySelector("#addPost");

firebase.auth().onAuthStateChanged(user => {
  if(user){
    document.querySelector("#addYour").classList.remove("hide");
    addPost.classList.remove("hide");
    logout.classList.remove("hide");
    formContainer.classList.add("hide");
    signInSignUp.classList.add("hide");
    emailHolder.innerHTML="<span style = 'text-decoration:underline;'>"+firebase.auth().currentUser.email+"</span>";
  }else{
    document.querySelector("#addYour").classList.add("hide");
    addPost.classList.add("hide");
    logout.classList.add("hide");
    // formContainer.classList.remove("hide");
    emailHolder.innerHTML = "to add your post:";
    signInSignUp.classList.remove("hide");
  }
});

let submit = document.querySelector("#submit");
let title = document.querySelector("#title");
let code = document.querySelector(".body");


const database = firebase.database();


function writeNewPost(username, title, code, imgArray) {
  // A post entry.
  var postData = {
    username: username,
    title: title,
    code: code,
    images: imgArray
  };

  // Get a key for a new Post.
  var newPostKey = database.ref().child('archive').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;
  updates['/user-posts/' + username + '/' + newPostKey] = postData;

  return database.ref().update(updates);
  
}

//canvas
canvas=document.getElementById('gc');
var context =canvas.getContext('2d');
context.fillStyle="white";
context.fillRect(0,0,canvas.width,canvas.height);
let color = "#444";
let pencil = document.querySelector("#pencil");
let eraser = document.querySelector("#eraser");
let clear = document.querySelector("#clear");
clear.addEventListener("click", ()=>{
  context.fillStyle = "white";
  context.fillRect(0,0,canvas.width,canvas.height);
})


pencil.addEventListener("click", () =>{
  if(!pencil.classList.contains("selected")){
    pencil.classList.add("selected");
    color = "#444";
    eraser.classList.remove("selected");
  }
});

eraser.addEventListener("click", () =>{
  if(!eraser.classList.contains("selected")){
    eraser.classList.add("selected");
    color = "white";
    pencil.classList.remove("selected");
  }
});
var size = 4;
var mousedown =false;
context.font = "20px Arial";
context.fillStyle="#444";
context.fillText("text;", 3, 20, 597);

canvas.addEventListener('mousedown',down);
canvas.addEventListener('mouseup',toggledraw);
canvas.addEventListener('mousemove',                            

function(evt){
var mousePos = getMousePos(canvas,evt);
var posx = mousePos.x;
var posy = mousePos.y;
draw(canvas,posx,posy);
});

function down(){
 mousedown = true;
}
  
function toggledraw(){
 mousedown = false;
}

function getMousePos(canvas,evt){
var rect = canvas.getBoundingClientRect();

return{
x:evt.clientX - rect.left,
y:evt.clientY - rect.top
      };
}
function draw(canvas,posx,posy){
if(mousedown){
context.fillStyle=color;
  if(color == "white"){
    size = 8;
  }else{
    size = 4;
  }
 context.fillRect(posx,posy,size,size);

}
}

function addCanvas(){
  imgArray.push(canvas.toDataURL());
  document.querySelector("#canvasHolder").innerHTML+="<img src = '"+canvas.toDataURL()+"' style = 'border:3px solid green;'><br><br>";
  context.fillStyle = "white";
  context.fillRect(0,0,canvas.width,canvas.height)
}


function submitData(){
  writeNewPost(firebase.auth().currentUser.email.split('.').join('_'), title.value, code.value, imgArray)
}


var reference = firebase.database().ref("/posts");
reference.on('value', function(snapshot) {
  snapshot.forEach(function(userSnapshot){
    let post = document.createElement("div");
    post.classList.add("post");

    let h1 = document.createElement('h1');
    h1.innerText = userSnapshot.val().title;
    h1.classList.add("postTitle");
    post.appendChild(h1);

    let p = document.createElement('p');
    p.innerText = "by "+userSnapshot.val().username
    p.classList.add("author");
    post.appendChild(p);

    let codeContainer = document.createElement("div");
    codeContainer.classList.add("codeContainer");
    
    let codeBody = document.createElement('textarea');
    codeBody.classList.add("codeBody");
    codeBody.innerText=userSnapshot.val().code;

    codeContainer.appendChild(codeBody);
    post.appendChild(codeContainer);

    let myTextArea = document.querySelector(".codeBody");
    var myCodeMirror = CodeMirror.fromTextArea(codeBody,{
      autoRefresh: true,
      readOnly: true,
      lineNumbers:true,
      theme: "xq-dark",
    });
    myCodeMirror.setSize("100%", "100%");


    for(let i = 0; i < userSnapshot.val().images.length; i++){
      let img = document.createElement('img');
      img.setAttribute("src",userSnapshot.val().images[i]);
      img.style = "border:1px solid black; display:block; margin:0 auto;";
      post.appendChild(img);

      postContainer.insertBefore(post, postContainer.firstChild);
    }
  })
})
let myTextArea = document.querySelector(".body");
var myCodeMirror = CodeMirror.fromTextArea(myTextArea,{
  lineNumbers:true,
  theme: "xq-dark",
});
myCodeMirror.setSize("100%", "100%");




