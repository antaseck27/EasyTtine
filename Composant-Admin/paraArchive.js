 let personne =[
        {membre:"Selena Roy", DateDebut:"01/01/2022",},
        {membre:"Emma Watson", DateDebut:"01/01/2022",},
        {membre:"Jhan Robert", DateDebut:"01/01/2022",},
        {membre:"Anne Hathaway", DateDebut:"01/01/2022",},
        {membre:"Ravi Shankar", DateDebut:"01/01/2022",},
        {membre:"Emma Stone", DateDebut:"01/01/2022"}
    ]

    let tableBody = document.getElementById("tBody");

    personne.map((index) => {
        let creatElement = 
        `
             <tr>
                <td>${index.membre}</td>
                <td>${index.DateDebut}</td>
                <td class="d-flex gap-4">
                   <i class="bi bi-eye voire" ></i>
                   <i class="bi bi-archive archiver">
                </td>
             </tr>        
        `;
        tableBody.innerHTML += creatElement;
    })

    let voire = document.querySelectorAll(".voire");
    let archiver = document.querySelectorAll(".archiver");

    

    for(let v = 0; v < voire.length; v++){
        let icone = voire[v];
        icone.addEventListener("click", ()=> {
            let td = icone.parentNode;
            let tr = td.parentNode;
            alert(tr.textContent)
        })
    }

  