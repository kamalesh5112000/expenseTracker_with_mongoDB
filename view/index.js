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
    const res = await axios.post('http://52.70.68.204:5000/',myobj)
    console.log(res.status,res)
    if (res.status==202){
        emailcheck.innerHTML="Email Already Exits"
    }else{
        alert(res.data.message)
        window.location.replace("./login.html");
    }
    // console.log(myobj)
    // const res = await axios.get('http://52.70.68.204:5000/')
    // console.log(res)
    // if (res.data.length==0){
    //     const res = await axios.post('http://52.70.68.204:5000/',myobj)
    // }else{
    //     for(var i=0;i<res.data.length;i++){
    //         if(res.data[i].email==email.value){
    //             console.log("Email Already Exits")
    //             flag=true
    //         }
    //     }
    // }
    // if(flag==false){
    //     const res = await axios.post('http://52.70.68.204:5000/',myobj)

    // }else{
    //     emailcheck.innerHTML="Email Already Exits"
    // }

    //const res = await axios.post('http://52.70.68.204:5000/',myobj)

}

