var forgotform = document.getElementById('forgotForm');
var email=document.getElementById('email');

forgotform.addEventListener('submit',submitForm);

async function submitForm(e){
    e.preventDefault();
    console.log(email.value)
    const res = await axios.post('http://52.70.68.204:5000/password/forgotpassword',{email:email.value})
    if(res.status==202){
        email.style.display='none'
        document.getElementById('submitbtn').style.display='none'
        document.getElementById('emailcheck').innerText="Reset Password Link has been Send to your Email"
    }
}