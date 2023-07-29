var form = document.getElementById('signupForm');
var loginform = document.getElementById('loginForm');
var nam = document.getElementById('name');
var email=document.getElementById('email');
var password=document.getElementById('password');
var emailcheck=document.getElementById('emailcheck');

form.addEventListener('submit',submitForm);
async function submitForm(e){
    e.preventDefault();
    var myobj={
        name : nam.value,
        email: email.value,
        password:password.value
    }
    const res = await axios.post('http://3.88.203.108:5000/',myobj)
    console.log(res.status,res)
    if (res.status==202){
        emailcheck.innerHTML="Email Already Exits"
    }else{
        alert(res.data.message)
        window.location.replace("./login/login.html");
    }
    

}

