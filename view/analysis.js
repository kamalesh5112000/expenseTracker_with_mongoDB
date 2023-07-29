var tbarea=document.getElementById('Yearly')
var downloadbtn=document.getElementById('downloadbtn')
var fdarea=document.getElementById('filesdownloaded')

async function display(){

    const token = localStorage.getItem('token');
    const res = await axios.get('http://3.88.203.108:5000/analysis',{headers:{"Authorization":token}});
    const fres= await axios.get('http://3.88.203.108:5000/filesdownloaded',{headers:{"Authorization":token}});
    
    console.log(res.data)
    tableCreate(res.data)
    console.log(fres.data)
    filestableCreate(fres.data)

    
    

}
display();

function tableCreate(obj) {
    var tbl = document.createElement('table');
    tbl.className="table table-bordered";
    tbl.style.backgroundColor='white'
    // tbl.style.width = '100%';
    // tbl.setAttribute('border', '1');
    if(obj.length<=0){
        console.log("No data Present")
        tbl.innerHTML='No data Present';
    }else{
        tbl.innerHTML =`<thead class="thead-dark">
            <tr>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Amount</th>
            </tr>
        </thead>`;
        var totalamount=0;


        var tbdy = document.createElement('tbody');
        for (var i = 0; i < obj.length; i++) {
        var tr = document.createElement('tr');
        for (let j in obj[i]) {
        
            var td = document.createElement('td');
            td.style.textAlign="center"
            td.appendChild(document.createTextNode(obj[i][j]))
            tr.appendChild(td)
            if(j=='amount'){
                totalamount=totalamount+Number(obj[i][j])
            }
            
        }
        
        tbdy.appendChild(tr);
        }
        var tlr = document.createElement('tr');
        tlr.innerHTML=`
        <td style="text-align: center;"colspan="3">Total Expense</td>
        <td style="text-align: center;">${totalamount}</td>`;
        tbdy.appendChild(tlr);
        tbl.appendChild(tbdy);
        tbarea.appendChild(tbl)

    }
    
}
function filestableCreate(obj) {
    var tbl = document.createElement('table');
    tbl.style.backgroundColor='grey'
    tbl.className="table table-bordered";
    // tbl.style.width = '100%';
    // tbl.setAttribute('border', '1');
    if(obj.length<=0){
        console.log("No files Downloaded Previously")
        tbl.innerHTML='No files Downloaded Previously';
    }else{
        tbl.innerHTML =`<thead class="thead-dark">
            <tr>
                <th scope="col">Date</th>
                <th scope="col">Filename</th>
                <th scope="col">Files</th>
            </tr>
        </thead>`;
        var totalamount=0;


        var tbdy = document.createElement('tbody');
        for (var i = 0; i < obj.length; i++) {
        var tr = document.createElement('tr');
        for (let j in obj[i]) {
            
            var td = document.createElement('td');
            td.style.textAlign="center"
            if(j=="fileUrl"){
                td.innerHTML=`<a href="${obj[i][j]}" ><input type="button" value="Download"></a>`

            }else{
                td.appendChild(document.createTextNode(obj[i][j]))
            }
            
            tr.appendChild(td)

            
        
            
            
            
        }
        
        tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy);
        tbarea.appendChild(tbl)

    }
    
}
 
downloadbtn.addEventListener('click',downloadfile);

async function downloadfile(){
    const token = localStorage.getItem('token');
    const res = await axios.get('http://3.88.203.108:5000/download',{headers:{"Authorization":token}});
    var a= document.createElement("a");
    a.href=res.data.fileURL;
    a.download='myexpense.csv';
    a.click();
}