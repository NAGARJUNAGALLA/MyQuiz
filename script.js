// ----- USERS -----
const users = [
  {username:"JCV001", passwordHash:"e7cf3ef4f17c3999a94f2c6f612e8a888e5e38e5e76d8a6f20b04f98e0e2f5d7"}, // Pass@123
  {username:"JCV002", passwordHash:"ae2b1fca515949e5d54fb22b8ed95575d5fa2e285a0b2d2a414d8d60a1b13d68"}  // Pass@456
];

// ----- SHA-256 HASH -----
async function hashPassword(password){
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('');
}

// ----- LOGIN -----
async function login(){
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const error = document.getElementById("login-error");
  if(!u || !p){ error.textContent = "Enter username and password!"; return; }
  
  const pHash = await hashPassword(p);
  const user = users.find(x=>x.username===u && x.passwordHash===pHash);
  
  if(user){
    document.getElementById("login-form").style.display="none";
    document.getElementById("quiz-area").style.display="block";
    startQuiz();
  } else {
    error.textContent = "Invalid username or password!";
  }
}

// ----- QUIZ -----
const questions = [
  {q:"She got right to the top, choose synonym of 'hectic'", options:["curious","sensation","fault","busy"], answerId:3},
  {q:"Brave antonym?", options:["Courageous","Coward","Fearless","Bold"], answerId:1},
  {q:"Clause that cannot form sentence alone?", options:["Compound","Dependent","Independent","Complex"], answerId:1}
];

let current=0, answers=Array(questions.length).fill(null), submitted=false;

function startQuiz(){
  renderQuestion();
}

function renderQuestion(){
  const q = questions[current];
  const area = document.getElementById("quiz-area");
  let html = `<h3>Question ${current+1}/${questions.length}</h3><p>${q.q}</p>`;
  q.options.forEach((o,i)=>{
    html += `<label><input type="radio" name="opt" value="${i}" ${answers[current]===i?'checked':''} onchange="selectOpt(${i})"> ${o}</label><br>`;
  });
  html += `<br><button onclick="prevQuestion()">Previous</button> <button onclick="nextQuestion()">Next</button> <button onclick="submitQuiz()">Submit</button>`;
  html += `<div id="result-section" class="hidden"></div>`;
  area.innerHTML = html;
}

function selectOpt(i){ answers[current]=i; }

function nextQuestion(){ if(current<questions.length-1){ current++; renderQuestion(); } }
function prevQuestion(){ if(current>0){ current--; renderQuestion(); } }

function submitQuiz(){
  if(submitted) return;
  submitted = true;
  let correct = 0;
  questions.forEach((q,i)=>{ if(answers[i]===q.answerId) correct++; });
  const html = `<h3>Result</h3><p>Score: ${correct}/${questions.length}</p>`;
  document.getElementById("result-section").classList.remove("hidden");
  document.getElementById("result-section").innerHTML = html;
}
