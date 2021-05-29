//cenas={}

engineLink="https://dx3006.github.io/TextAdventureEngine/"

numeroCena=1

template=document.getElementById("template").getElementsByClassName("cenas")[0]
templateButton=document.getElementById("template").getElementsByClassName("buttonCont")[0]
bloco=document.getElementById("bloco")
cenas=document.getElementById("bloco").getElementsByClassName("cenas")
nomes=document.getElementById("bloco").getElementsByClassName("cena")
cenaDestino=document.getElementById("bloco").getElementsByClassName("cenaDestino")


cbI=bloco.getElementsByClassName("cb")



salvar=document.getElementById("salvar")
confimarSalvar=document.getElementById("confimarSalvar")

carregar=document.getElementById("carregar")
confimarCarregar=document.getElementById("confimarCarregar")


document.getElementById("exportar").addEventListener('click', confirmExport ,false);
document.getElementById("importar").addEventListener('click', confirmImport ,false);

document.getElementById("addCena").addEventListener('click', addTemplate ,false);
document.getElementById("novo").addEventListener ('click', confirmNovo ,false);
document.getElementById("botCarregar").addEventListener ('click', abrirCarregar ,false);
document.getElementById("botSalvar").addEventListener ('click', abrirSalvar ,false);
confimarSalvar.addEventListener ('click', confirmSalvar ,false); 
confimarCarregar.addEventListener ('click', confirmCarregar ,false);   
config=localStorage.getItem("config")
carregarLocal()

function carregarLocal(){
    if(config){
        config=JSON.parse(config)
        //console.log("config carregadas")
        //console.log(config)
        salvar.value=config.atual.nome
        if(config.atual.cena.inicio != undefined){
            importCenas(config.atual.cena)
        }
        carregarCenasSalvas()
        
    }else{
        console.log("criar config")
        salvar.value="Projeto 1"
        config={
            atual:{
                nome:"Projeto 1",
                cena:{}
            },
            salvas:{},
        }
        addTemplate()
    }
    
}
function salvarLocal(){
    console.log("salvou1")
    cena=exportCenas()
    config.atual.cena=cena
    JSON.stringify(config)
    localStorage.setItem("config",JSON.stringify(config))
    console.log("salvou2")
}

function confirmSalvar(){
    
    if(salvar.value==""||salvar.value==null){
        alert("Para salvar você precisa incerir um nome")
    }else{
        
        continuar=true;
        key=Object.keys(config.salvas)
        if(config.atual.nome!=salvar.value && key.includes(salvar.value)){
            continuar=confirm("já existe uma cena com este nome\n deseja subistituir?")
        }
                    
        if(continuar){
            salvarT=false
            salvar.classList.add("fechar")
            confimarSalvar.classList.add("fechar")

            config.atual.nome=salvar.value

            cenasExport=exportCenas()
            config.salvas[salvar.value]=cenasExport            
            localStorage.setItem("config",JSON.stringify(config))
            carregarCenasSalvas()
        }
    }
        
    
    

    
}

function carregarCenasSalvas(){
    key=Object.keys(config.salvas)

    //console.log(key);
    cenasListaOptions=''    
    for(c=0;key.length>c;c++){
        cenasListaOptions=cenasListaOptions+'<option value="'+key[c]+'">'+key[c]+'</option>'
        
    }
    carregar.innerHTML=cenasListaOptions
    //console.log(cenasListaOptions);

}

function confirmCarregar(){
    if(confirm("Ao carregar este Projeto todas as cenas atuais serão removidas\nQuer continuar?")){

        
        cenaCarregar=config.salvas[carregar.value]

        salvar.value=carregar.value
        config.atual.nome=carregar.value
        config.atual.cena=cenaCarregar

        limparCenas()
        importCenas(cenaCarregar)
        localStorage.setItem("config",JSON.stringify(config))
        carregarT=false
        carregar.classList.add("fechar")
        confimarCarregar.classList.add("fechar")
        
    }
    
}

function confirmNovo(){
    if(confirm("Você deseja redefinir todas as cenas?")){

        limparCenas()

        key=Object.keys(config.salvas)
        c=1
        while( key.includes("Projeto "+(key.length+c)) ){
            c++
        }
        salvar.value="Projeto "+(key.length+c)
        config.atual.nome="Projeto "+(key.length+c)
        addTemplate()
        
        localStorage.setItem("config",JSON.stringify(config))
        
    }
}

function confirmImport(){
    url=prompt("Insira o link que deseja importar");
    hash = decodeURI(url)
    //console.log(hash)
    var match = hash.match(/#cenas=([^]+)/);
    if (match) {
        console.log(match[1])
        cenasImport=JSON.parse(match[1])
        limparCenas()
        importCenas(cenasImport)
        salvarLocal()
    }
}

function confirmExport(){
    cenasExport=exportCenas(true)
    if(cenasExport){
        window.open(engineLink+"#cenas="+JSON.stringify(cenasExport));
    }
}

carregarT=false
function abrirCarregar(){
    if(carregarT){
        carregarT=false
        carregar.classList.add("fechar")
        confimarCarregar.classList.add("fechar")
    }else{
        carregarT=true
        carregar.classList.remove("fechar")
        confimarCarregar.classList.remove("fechar")
    }
}
salvarT=false
function abrirSalvar(){
    if(salvarT){
        salvarT=false
        salvar.classList.add("fechar")
        confimarSalvar.classList.add("fechar")
    }else{
        salvarT=true
        salvar.classList.remove("fechar")
        confimarSalvar.classList.remove("fechar")
    }
}

function addTemplate(){
    elem=template.cloneNode(true)

    elem.getElementsByClassName("cb")[0].addEventListener("change", salvarLocal, false);
    elem.getElementsByClassName("cena")[0].addEventListener("change", isRepite, false);
    elem.getElementsByClassName("color")[0].addEventListener("change", salvarLocal, false);
    elem.getElementsByClassName("title")[0].addEventListener("change", salvarLocal, false);
    elem.getElementsByClassName("text")[0].addEventListener("change", salvarLocal, false);  


    elem.getElementsByClassName("color")[0].addEventListener("input", changeBG, false);
    elem.getElementsByClassName("cena")[0].addEventListener("input", isBlack, false);
    elem.getElementsByClassName("cb")[0].addEventListener ('input', cenaInical ,false);
    elem.getElementsByClassName("remove")[0].addEventListener ('click', remove ,false);
    elem.getElementsByClassName("addButton")[0].addEventListener ('click', addButton ,false);
    
    nomeCenas=[]
    for(c=0;nomes.length>c;c++){
        nomeCenas.push(nomes[c].value)
    }
    c=1
    while(nomeCenas.includes("Cena "+(cenas.length+c))){
        c++
    }

    elem.getElementsByClassName("cena")[0].value="Cena "+(cenas.length+c)

    if(cenas.length==0){
        elem.getElementsByClassName("cb")[0].checked=true
        elem.style.borderColor= "white"
    }
    bloco.appendChild(elem)
    updateLista()
    salvarLocal()
}
/* 
jogo="{\"inicio\":\"Inicio\",\"cenas\":{\"Inicio\":{\"titulo\":\"Jogo Teste\",\"texto\":\"feito em live com sono e amor\",\"color\":\"#27401c\",\"opcoes\":[[\"Jogar\",\"dialogo01\"]]},\"dialogo01\":{\"titulo\":\"\",\"texto\":\"DX começou a live morrendo de sono.\",\"color\":\"#762e2e\",\"opcoes\":[[\"Fechar a live\",\"Dormir\"],[\"Tentar fazer a live\",\"Fazer live\"]]},\"Dormir\":{\"titulo\":\"\",\"texto\":\"Vc avisa o chat q esta morrendo de sono e vai mimi\",\"color\":\"#80a2b3\",\"opcoes\":[[\"Continuar\",\"Dormir 2\"]]},\"Fazer live\":{\"titulo\":\"\",\"texto\":\"Vc tenta achar um assunto, mas tudo que consegue é enrolar\",\"color\":\"#2e5e76\",\"opcoes\":[[\"Tentar jogar \",\"jogar\"],[\"Assistir algo\",\"assistir\"]]},\"Dormir 2\":{\"titulo\":\"\",\"texto\":\"Mas vc fica com consciência pesada de ter abandonado a live \",\"color\":\"#76732e\",\"opcoes\":[[\"Abrir a live denovo\",\"dialogo01\"],[\"Dormir de quaquer jeito\",\"Dormir 3\"]]},\"Dormir 3\":{\"titulo\":\"\",\"texto\":\"Vc vai para cama e dormi lindamente\",\"color\":\"#92acb9\",\"opcoes\":[[\"Jogar denovo\",\"Inicio\"]]},\"jogar\":{\"titulo\":\"\",\"texto\":\"vc esta cansado demais para jogar\",\"color\":\"#2e7630\",\"opcoes\":[[\"Fazer outra coisa\",\"Fazer live\"],[\"Deistir e ir domir\",\"Dormir\"]]},\"assistir\":{\"titulo\":\"\",\"texto\":\"vc tenta assistir algo mas caindo de sono\",\"color\":\"#522e76\",\"opcoes\":[[\"Deistir e ir domir\",\"Dormir\"]]}}}"
importCenas(JSON.parse(jogo))

salvarLocal()
 */
//console.log(JSON.stringify(exportCenas()))

function importCenas(cenas){
    key=Object.keys(cenas.cenas)

    for(c1=0;key.length>c1;c1++){
        elem=template.cloneNode(true)

        elem.getElementsByClassName("cb")[0].addEventListener("change", salvarLocal, false);
        elem.getElementsByClassName("cena")[0].addEventListener("change", isRepite, false);
        elem.getElementsByClassName("color")[0].addEventListener("change", salvarLocal, false);
        elem.getElementsByClassName("title")[0].addEventListener("change", salvarLocal, false);
        elem.getElementsByClassName("text")[0].addEventListener("change", salvarLocal, false);   



        elem.getElementsByClassName("color")[0].addEventListener("input", changeBG, false);
        elem.getElementsByClassName("cena")[0].addEventListener("input", isBlack, false);
        elem.getElementsByClassName("cb")[0].addEventListener ('input', cenaInical ,false);
        elem.getElementsByClassName("remove")[0].addEventListener ('click', remove ,false);
        elem.getElementsByClassName("addButton")[0].addEventListener ('click', addButton ,false);
        elem.getElementsByClassName("cena")[0].value=key[c1]
        elem.getElementsByClassName("color")[0].value=cenas.cenas[key[c1]].color
        elem.getElementsByClassName("title")[0].value=cenas.cenas[key[c1]].titulo
        elem.getElementsByClassName("text")[0].value=cenas.cenas[key[c1]].texto
        elem.style.backgroundColor=cenas.cenas[key[c1]].color
        if(key[c1]==cenas.inicio){
            elem.style.borderColor= "white"
            elem.getElementsByClassName("cb")[0].checked=true
        }

        cenasListaOptions='<option value="0"></option>'
        for(c2=0;key.length>c2;c2++){
            if(key[c2]!=key[c1]){
                cenasListaOptions=cenasListaOptions+'<option value="'+key[c2]+'">'+key[c2]+'</option>'
            }
        }
        for(c2=0;cenas.cenas[key[c1]].opcoes.length>c2;c2++){
            
            elemButton=templateButton.cloneNode(true)

            elemButton.getElementsByClassName("buttomTexto")[0].addEventListener("change", salvarLocal, false);
            elemButton.getElementsByClassName("cenaDestino")[0].addEventListener("change", salvarLocal, false);

            elemButton.getElementsByClassName("cenaDestino")[0].addEventListener("input", isBlackDestino, false);
            elemButton.getElementsByClassName("removeButton")[0].addEventListener ('click', removeButton ,false);


            elemButton.getElementsByClassName("buttomTexto")[0].value=cenas.cenas[key[c1]].opcoes[c2][0]
            elemDestino=elemButton.getElementsByClassName("cenaDestino")[0]

            sel=cenas.cenas[key[c1]].opcoes[c2][1]
            
            elemDestino.innerHTML=cenasListaOptions
            //console.log(elemDestino)
            
            achou=false
            for(c3=0;elemDestino.options.length>c3;c3++){
                if(sel == elemDestino.options[c3].value){
                    elemDestino.selectedIndex=c3
                    achou=true
                    break
                }
            }
            if(!achou){
                elemDestino.selectedIndex=0
                elemDestino.style.borderColor="#ff2525"
            }
            
            elem.appendChild(elemButton)
        }

        bloco.appendChild(elem)
    }
}

function limparCenas(){
    while(cenas.length>0){
        cenas[0].remove()
    }
}

function exportCenas(erro){
    cenasExport= {
        inicio:"",
        cenas: {}
    }
    cenasNome=[]
    for(c=0;cenas.length>c;c++){
        nome=cenas[c].getElementsByClassName("cena")[0].value
        color=cenas[c].getElementsByClassName("color")[0].value
        titulo=cenas[c].getElementsByClassName("title")[0].value
        texto=cenas[c].getElementsByClassName("text")[0].value

        nomeTemp=nome
        c2=2
        while(cenasNome.includes(nomeTemp)){
            nomeTemp=nome+" ("+c2+")"
            console.log(nomeTemp)
        }
        nome=nomeTemp
        cenasNome.push(nome)

        if(cenas[c].getElementsByClassName("cb")[0].checked){
            cenasExport.inicio=nome
        }

        if( (nome==""||nome==null) && erro ){
            alert("Não é possivel Exportar!!\nUma ou mais cenas tem um nome invalido")
            return false;
        }

        cenasExport.cenas[nome]={
            titulo:titulo,
            texto:texto,
            color:color,
            opcoes:[]
        }

        buttomTexto=cenas[c].getElementsByClassName("buttomTexto")
        cenaDestino=cenas[c].getElementsByClassName("cenaDestino")

        for(c2=0;buttomTexto.length>c2;c2++){
            if((cenaDestino[c2].value=="0")&&erro){
                alert("Não é possivel Exportar!!\nTodos os botões precisam ter destino")
                return false
            }
            cenasExport.cenas[nome].opcoes.push([buttomTexto[c2].value,cenaDestino[c2].value])
        }

    }
    if(cenasExport.inicio==""  && erro  ){
        alert("Não é possivel Exportar!!\né nescessario q exista uma cena inical")
        return false
    }
    return cenasExport
    
}

function addButton(e){
    elem=templateButton.cloneNode(true)

    elem.getElementsByClassName("buttomTexto")[0].addEventListener("change", salvarLocal, false);
    elem.getElementsByClassName("cenaDestino")[0].addEventListener("change", salvarLocal, false);


    elem.getElementsByClassName("cenaDestino")[0].addEventListener("input", isBlackDestino, false);
    elem.getElementsByClassName("removeButton")[0].addEventListener ('click', removeButton ,false);
    e.target.parentElement.parentElement.appendChild(elem)
    updateLista()
}
/* 
function updateLista(num){
    cenasLista='<option value="0"></option>'
    for(c=0;cenas.length>c;c++){
        nome=cenas[c].getElementsByClassName("cena")[0].value
        cenasLista=cenasLista+'<option value="'+nome+'">'+nome+'</option>'
    }
    for(c=0;cenaDestino.length>c;c++){
        sel=cenaDestino[c].value
        cenaDestino[c].innerHTML=cenasLista
        achou=false
        for(c2=0;cenaDestino[c].options.length>c2;c2++){
            if(sel == cenaDestino[c].options[c2].value){
                cenaDestino[c].selectedIndex=c2
                achou=true
                break
            }
        }
        if(!achou){
            cenaDestino[c].selectedIndex=0
            cenaDestino[c].style.borderColor="#ff2525"
        }
    }
}
 */

function updateLista(){
    cenasLista=[]
    for(c=0;cenas.length>c;c++){
        nome=cenas[c].getElementsByClassName("cena")[0].value
        cenasLista.push(nome)
    }
    //console.log(cenasLista)
    cenaDestino=document.getElementById("bloco").getElementsByClassName("cenaDestino")
    for(c=0;cenaDestino.length>c;c++){
        sel=cenaDestino[c].selectedIndex
        nome=cenaDestino[c].parentElement.parentElement.getElementsByClassName("cena")[0].value
        
        cenasListaOptions='<option value="0"></option>'
        for(c2=0;cenasLista.length>c2;c2++){
            if(cenasLista[c2]!=nome){
                cenasListaOptions=cenasListaOptions+'<option value="'+cenasLista[c2]+'">'+cenasLista[c2]+'</option>'
            }
        }
        sel=cenaDestino[c].value
        selI=cenaDestino[c].selectedIndex
        selL=cenaDestino[c].options.length
        cenaDestino[c].innerHTML=cenasListaOptions
        //console.log(cenaDestino[c])
        if(selL!=cenaDestino[c].options.length){
            achou=false
            for(c2=0;cenaDestino[c].options.length>c2;c2++){
                if(sel == cenaDestino[c].options[c2].value){
                    cenaDestino[c].selectedIndex=c2
                    achou=true
                }
            }
            if(!achou){
                cenaDestino[c].selectedIndex=0
                cenaDestino[c].style.borderColor="#ff2525"
            }
        }else{
            cenaDestino[c].selectedIndex=selI
        }
        
        
    }

}


async function remove(e){
   
    t=e.target.parentElement.getElementsByClassName("cb")[0].checked
    e.target.parentElement.classList.add("kill")
    await sleepTime(260)
    e.target.parentElement.remove()
    if(t&&cenas.length>0){
        cenas[0].style.borderColor= "white"
        cenas[0].getElementsByClassName("cb")[0].checked=true
    }
    salvarLocal()
    updateLista()
}
async function removeButton(e){
    e.target.parentElement.classList.add("killButton")
    await sleepTime(210)
    e.target.parentElement.remove()
    salvarLocal() 
}

function cenaInical(e){
    e.target.parentElement.parentElement.style.borderColor= "white"
    if(e.target.checked){
        for(c=0;cbI.length>c;c++){
            if(cbI[c]!=e.target){
                cbI[c].checked=false
                cbI[c].parentElement.parentElement.style.borderColor= ""
            }
        }
    }else{
        e.target.checked=true;
    }
    
}

function isBlackDestino(e){
    if(e.target.selectedIndex==0){
        e.target.style.borderColor="#ff2525"
    }else{
        e.target.style.borderColor=""
    }
}

function isBlack(e){
    updateLista()
    if(e.target.value==""|e.target.value==null){
        e.target.style.borderColor="#ff2525"
    }else{
        e.target.style.borderColor=""
    }
}

function isRepite(e){
    updateLista()
    igual=false
    for(c=0;nomes.length>c;c++){
        if( nomes[c]!=e.target && nomes[c].value==e.target.value ){
            igual=true
            break
        }
        
    }
    if(igual){
        e.target.style.borderColor="#ff2525"
    }else{
        e.target.style.borderColor=""
    }
    salvarLocal()
}


function changeBG(e){
    x = e.target.parentElement.style.backgroundColor=e.target.value
}

function sleepTime(timeS) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timeS)
    })
}
