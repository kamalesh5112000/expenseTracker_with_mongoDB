var form = document.getElementById('addForm');
var newitem = document.getElementById('items');
var amount=document.getElementById('amount');
var desc=document.getElementById('desc');
var cat=document.getElementById('categories');
var iid=0;
var expense=[]
var premiumbtn =document.getElementById('rzp-button1');
var premiumtxt=document.getElementById('premiumtxt');
var leaderbtn=document.getElementById('leaderboard');
var leaderitems=document.getElementById('leaderitems');
var showanalysis=document.getElementById('showanalysis')
var paginationarea=document.getElementById('paginationarea');
var pagelimitelement=document.getElementById('expensecount');

document.getElementById('changelimit').addEventListener('click',setpagelimit);

function setpagelimit(e){
    e.preventDefault();
    
    console.log(pagelimitelement.value)
    localStorage.setItem("pagelimit",pagelimitelement.value)
    display()
}

document.getElementById('rzp-button1').onclick=async function buyPremium(e){
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res=await axios.get('http://52.70.68.204:5000/purchase/premium',{headers:{"Authorization":token}});
    console.log(res)
    var options={
        "key":res.data.key_id,
        "order_id":res.data.order.id,
        "handler":async function(response){
            await axios.post('http://52.70.68.204:5000/purchase/updatetransaction',{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id
            },{headers:{"Authorization":token}})

            alert('You are Premium User Now')
            display();
        }
    };
    const rzpl = new Razorpay(options);
    rzpl.open();
    e.preventDefault();
    rzpl.on('payment.failed',function(response){
        console.log(response)
        alert('something went worng')
    })

};

form.addEventListener('submit',submitForm);


newitem.addEventListener('click',delitem)
async function submitForm(e){
    e.preventDefault();

    
    
    var myobj={
        amount : amount.value,
        description: desc.value,
        catecgory:cat.value
    }
    const token = localStorage.getItem('token');
    const res = await axios.post('http://52.70.68.204:5000/addexpense',myobj,{headers:{"Authorization":token}});
    //const res = await axios.post('http://52.70.68.204:5000/expense',myobj)
    
    display();
    if(document.getElementById('leaderboarditems')){
        showLeaderBoardapi();
    }
    
    

    
    

}
async function display(){
    newitem.innerHTML='';
    const page =1;
    
    const token = localStorage.getItem('token');
    const pagelimit= localStorage.getItem('pagelimit')
    pagelimitelement.value=pagelimit
    const res = await axios.post(`http://52.70.68.204:5000/expense?page=${page}`,{pagelimit:pagelimit},{headers:{"Authorization":token}});
    console.log(res.data)
    if(res.data.userdata){
        premiumbtn.style.display="none";
        premiumtxt.innerText="You are a Premium User Now"
        leaderbtn.disabled = false;
        showanalysis.disabled=false;
        
    }else{
        leaderbtn.disabled = true;
        showanalysis.disabled=true;

    }
    if(res.data.data.length<=0){
        console.log("No data Present")
        newitem.innerHTML='No data Present';
    }else{
        showData(res.data.data)
        showpagination(res.data.pag)
        // for(var i=0;i<res.data.data.length;i++){
        //     showData(res.data.data[i])

            
            
        // }

    }

}
display();

function showpagination(obj){
    paginationarea.innerHTML=""
    console.log(obj)
    if(obj.hasprevpage){
        const prevbtn=document.createElement('button');
        prevbtn.style.marginRight='5px'
        prevbtn.innerHTML=obj.prevpage
        prevbtn.addEventListener('click',()=>getexpense(obj.prevpage))
        paginationarea.appendChild(prevbtn)
    }
    const curbtn=document.createElement('button');
    curbtn.style.marginRight='5px'
    curbtn.style.backgroundColor='blue'

    curbtn.innerHTML=obj.currpage
    curbtn.addEventListener('click',()=>getexpense(obj.currpage))
    paginationarea.appendChild(curbtn)
    if(obj.hasnextpage){
        const nextbtn=document.createElement('button');
        nextbtn.style.marginRight='5px'
        nextbtn.innerHTML=obj.nextpage
        nextbtn.addEventListener('click',()=>getexpense(obj.nextpage))
        paginationarea.appendChild(nextbtn)
    }
    
}
async function getexpense(page){
    const token = localStorage.getItem('token');
    const pagelimit= localStorage.getItem('pagelimit')
    const res = await axios.post(`http://52.70.68.204:5000/expense?page=${page}`,{pagelimit:pagelimit},{headers:{"Authorization":token}});
    showpagination(res.data.pag)
    showData(res.data.data)
    // for(var i=0;i<res.data.data.length;i++){
    //     showData(res.data.data[i])

        
    // }

}
function showData(obj){
    newitem.innerHTML=""
    for(var i=0;i<obj.length;i++){
        iid=obj[i].id
        
        var li=document.createElement('li');
        li.className='list-group-item';
        li.appendChild(document.createTextNode("Amount: "));
        li.appendChild(document.createTextNode(obj[i].amount));
        li.appendChild(document.createTextNode(" - Descrption :"));
        li.appendChild(document.createTextNode(obj[i].description));
        li.appendChild(document.createTextNode(" - Catecgory :"));
        li.appendChild(document.createTextNode(obj[i].catecgory));
        var id=document.createElement('input')
        id.setAttribute("type", "hidden");
        id.appendChild(document.createTextNode(iid))
        //delete Btn
        var del=document.createElement('button');
        del.className='btn btn-danger btn-sm float-right delete';
        del.appendChild(document.createTextNode('X'));

        //Edit btn
        
        li.appendChild(id)
        li.appendChild(del)
        newitem.appendChild(li);

    }
    
    // leaderboarditems.appendChild(li)
    
    
    amount.value=""
    desc.value=""
    cat.value=""
}

leaderbtn.addEventListener('click',showleaderboard);

function showleaderboard(e){
    if(!document.getElementById('leaderboarditems')){
        var ulleader=document.createElement('ul');
        ulleader.id="leaderboarditems";
        ulleader.className="list-group-item"
        leaderitems.appendChild(ulleader)
        showLeaderBoardapi();
        
    }
}
async function showLeaderBoardapi(){

    var ulleader=document.getElementById('leaderboarditems');
    ulleader.innerText="";

    const token = localStorage.getItem('token');
        const res = await axios.get('http://52.70.68.204:5000/showLeaderBoard',{headers:{"Authorization":token}});
        console.log(res)
        for(var i=0;i<res.data.leaderboard.length;i++){
            if(!res.data.leaderboard[i].total_cost){
                res.data.leaderboard[i].total_cost=0
            }
            displayleader(res.data.leaderboard[i],res.data.userId)
            
        }
        console.log("leader Board",res)

}
function displayleader(obj,userId){
    var leaderboarditems=document.getElementById('leaderboarditems');
    iid=obj.id
    var li=document.createElement('ul');
    if(obj.id===userId){
        li.className='list-group-item active';

    }else{
        li.className='list-group-item ';
    }
    
    li.appendChild(document.createTextNode("Name: "));
    li.appendChild(document.createTextNode(obj.name));
    li.appendChild(document.createTextNode(" - Total Amount :"));
    li.appendChild(document.createTextNode(obj.totalcost));

    
    leaderboarditems.appendChild(li)
    


}

function delitem(e){
    var li=e.target.parentElement;
    var itemaount=li.childNodes[1].textContent;
    var itemdes=li.childNodes[3].textContent;
    var itemcat=li.childNodes[5].textContent;
    iid=li.childNodes[6].textContent;
    
    if(e.target.classList.contains('delete')){
        if(confirm("Are you Sure, You want to Delete it?")){
            
            newitem.removeChild(li)
            console.log(itemaount,itemcat,itemdes,iid)
            const token = localStorage.getItem('token');
            axios.delete(`http://52.70.68.204:5000/expense/${iid}`,{headers:{"Authorization":token}})
            .then(()=>{
                newitem.innerHTML='';
                display();
            }).catch(err=>console.log(err))

            
        }
    }
    if(e.target.classList.contains('edit')){
        if(confirm("Are you Sure, You want to Edit it?")){
            var li=e.target.parentElement;
            var edititem=li.childNodes[3].textContent;
            amount.value=li.childNodes[1].textContent;
            desc.value=li.childNodes[3].textContent;
            cat.value=li.childNodes[5].textContent;
            newitem.removeChild(li)
            localStorage.removeItem(edititem)
            
        }
    }
}

showanalysis.addEventListener('click',showAnalysisData);

function showAnalysisData(e){
    e.preventDefault();
    window.location.href="./analysis.html";
}