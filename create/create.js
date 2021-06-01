
// engineLink="http://127.0.0.1:5500/index.html"
engineLink="https://dx3006.github.io/TextAdventureEngine/"

language={}

template=document.getElementById("template").getElementsByClassName("cenas")[0]
templateButton=document.getElementById("template").getElementsByClassName("buttonCont")[0]
bloco=document.getElementById("bloco")
cenas=document.getElementById("bloco").getElementsByClassName("cenas")
nomes=document.getElementById("bloco").getElementsByClassName("cena")
cenaDestino=document.getElementById("bloco").getElementsByClassName("cenaDestino")


cbI=bloco.getElementsByClassName("cb")



salvar=document.getElementById("salvar")
confimarSalvar=document.getElementById("confirmSave")

carregar=document.getElementById("carregar")
confimarCarregar=document.getElementById("confirmLoad")


document.getElementById("buttonExport").addEventListener('click', confirmExport ,false);
document.getElementById("buttonImport").addEventListener('click', confirmImport ,false);

document.getElementById("addScene").addEventListener('click', confirmAddScene ,false);
document.getElementById("buttonNew").addEventListener ('click', confirmNovo ,false);
document.getElementById("buttonLoad").addEventListener ('click', abrirCarregar ,false);
document.getElementById("buttonSave").addEventListener ('click', abrirSalvar ,false);
confimarSalvar.addEventListener ('click', confirmSalvar ,false); 
confimarCarregar.addEventListener ('click', confirmCarregar ,false);   
config=localStorage.getItem("config")
init()

async function init(){
    await changeLanguage(navigator.language) //navigator.language
    carregarLocal()
}

function importFromUrl(url,menssage){
    hash = decodeURI(url)
    var match = hash.match(/#cenas=([^]+)/);
    if (match) {
        if(menssage==undefined||confirm(menssage)){
            if(match[1].indexOf("{")==-1){
                convert=LZString.decompressFromEncodedURIComponent(match[1])
            }else{
                convert=match[1]
            }
            cenasImport=JSON.parse(convert)
            config.salvas[config.atual.nome+" "+language.info.lastSession]=config.atual.cena;
            salvar.value=language.info.importedProject;
            limparCenas()
            importCenas(cenasImport)
            salvarLocal()
            carregarCenasSalvas()
        }   
        return true     
    }
    return false

}


function carregarLocal(){
    if(config){
        config=JSON.parse(config)
        salvar.value=config.atual.nome
        importCenas(config.atual.cena)
        carregarCenasSalvas()
    }else{
        console.log("criar config")
        salvar.value=language.info.project+" 1"
        config={
            atual:{
                nome:language.info.project+" 1",
                cena:{}
            },
            salvas:{},
        }
        addScene()
    }
    if(importFromUrl()){//document.location.hash,language.pronpt.import.fromUrl
        window.history.pushState(language.info.importedProject, language.info.importedProject ,window.location.protocol+"//"+window.location.host+window.location.pathname)
    }
    

    
}
function salvarLocal(){
    console.log("salvou")
    cena=exportCenas()
    config.atual.cena=cena
    JSON.stringify(config)
    localStorage.setItem("config",JSON.stringify(config))
}

function confirmSalvar(){
    
    if(salvar.value==""||salvar.value==null){
        alert(language.pronpt.save.enterName)
    }else{
        
        continuar=true;
        key=Object.keys(config.salvas)
        if(config.atual.nome!=salvar.value && key.includes(salvar.value)){
            continuar=confirm(language.pronpt.save.duplicateProject)
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
    if(confirm(language.pronpt.load.replaceScenes)){

        
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
    if(confirm(language.pronpt.new.reset)){

        limparCenas()

        key=Object.keys(config.salvas)
        c=1
        while( key.includes(language.info.project+" "+(key.length+c)) ){
            c++
        }
        salvar.value=language.info.project+" "+(key.length+c)
        config.atual.nome=language.info.project+" "+(key.length+c)
        addScene()
        
        localStorage.setItem("config",JSON.stringify(config))
        
    }
}

function confirmImport(){
    url=prompt(language.pronpt.import.insertLink);
    importFromUrl(url)
}

function confirmExport(){
    cenasExport=exportCenas(true)
    if(cenasExport){
        stt=JSON.stringify(cenasExport)
        comp= LZString.compressToEncodedURIComponent(stt)
        console.log("a compreção diminuiu de "+stt.length+" para "+comp.length+" redução para "+Math.round(comp.length/stt.length*10000)/100+ "%")
        // console.log(engineLink+"#cenas="+comp)
        window.open(engineLink+"#cenas="+comp);//JSON.stringify(cenasExport)
    }else{
        markError()
    }
}
function confirmAddScene(){
    elem=addScene()
    elem.scrollIntoView()
    //elem.classList.add("blink")
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

function addSceneEvents(elemCreate){

    elemCreate.getElementsByClassName("cb")[0].addEventListener("change", salvarLocal, false);
    elemCreate.getElementsByClassName("cena")[0].addEventListener("change", isRepite, false);
    elemCreate.getElementsByClassName("color")[0].addEventListener("change", salvarLocal, false);
    elemCreate.getElementsByClassName("title")[0].addEventListener("change", salvarLocal, false);
    elemCreate.getElementsByClassName("text")[0].addEventListener("change", salvarLocal, false);  


    elemCreate.getElementsByClassName("color")[0].addEventListener("input", changeBG, false);
    elemCreate.getElementsByClassName("cena")[0].addEventListener("input", isBlack, false);
    elemCreate.getElementsByClassName("cb")[0].addEventListener ('input', cenaInical ,false);
    elemCreate.getElementsByClassName("remove")[0].addEventListener ('click', remove ,false);
    elemCreate.getElementsByClassName("addButton")[0].addEventListener ('click', addButton ,false);
    
    return elemCreate;
}
function addButtonEvents(elemCreate){
    elemCreate.getElementsByClassName("buttomTexto")[0].addEventListener("change", salvarLocal, false);
    elemCreate.getElementsByClassName("cenaDestino")[0].addEventListener("change", salvarLocal, false);


    elemCreate.getElementsByClassName("cenaDestino")[0].addEventListener("input", isBlackDestino, false);
    elemCreate.getElementsByClassName("removeButton")[0].addEventListener ('click', removeButton ,false);

}  

function addScene(){
    elem=template.cloneNode(true)

    addSceneEvents(elem)
    
    nomeCenas=[]
    for(c=0;nomes.length>c;c++){
        nomeCenas.push(nomes[c].value)
    }
    c=1
    while(nomeCenas.includes(language.info.scene+" "+(cenas.length+c))){
        c++
    }

    elem.getElementsByClassName("cena")[0].value=language.info.scene+" "+(cenas.length+c)

    if(cenas.length==0){
        elem.getElementsByClassName("cb")[0].checked=true
        elem.style.borderColor= "white"
    }
    bloco.appendChild(elem)
    updateLista()
    salvarLocal()
    return elem
    
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
        addSceneEvents(elem)
        elem.getElementsByClassName("cena")[0].value=key[c1]
        elem.getElementsByClassName("color")[0].value=cenas.cenas[key[c1]].color
        elem.getElementsByClassName("title")[0].value=cenas.cenas[key[c1]].titulo
        elem.getElementsByClassName("text")[0].value=cenas.cenas[key[c1]].texto
        elem.style.backgroundColor=cenas.cenas[key[c1]].color
        if(key[c1]==cenas.inicio){
            elem.style.borderColor= "white"
            elem.getElementsByClassName("cb")[0].checked=true
        }else{
            elem.getElementsByClassName("cb")[0].checked=false
        }

        cenasListaOptions='<option value="0">'+language.info.selectDestination+'</option>'
        for(c2=0;key.length>c2;c2++){
            if(key[c2]!=key[c1]){
                cenasListaOptions=cenasListaOptions+'<option value="'+removeHTMLentities(key[c2])+'">'+removeHTMLentities(key[c2])+'</option>'
            }
        }
        for(c2=0;cenas.cenas[key[c1]].opcoes.length>c2;c2++){
            
            elemButton=templateButton.cloneNode(true)
            addButtonEvents(elemButton)
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
    markError()
}

function removeHTMLentities(text){
    return text.replace(/[\u00A0-\u9999"'<>\&]/g, function(i) {
        return '&#'+i.charCodeAt(0)+';';
     });
}

function limparCenas(){
    while(cenas.length>0){
        cenas[0].remove()
    }
}

function exportCenas(erro){
    cenasExport= {
        version:1,
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
            alert(language.pronpt.export.invalidName)
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
                alert(language.pronpt.export.noDestinationButton)
                return false
            }
            cenasExport.cenas[nome].opcoes.push([buttomTexto[c2].value,cenaDestino[c2].value])
        }

    }
    if(cenasExport.inicio==""  && erro  ){
        alert(language.pronpt.export.noInitialScene)
        return false
    }
    return cenasExport
    
}

function addButton(e){
    elem=templateButton.cloneNode(true)
    addButtonEvents(elem)
    e.target.parentElement.parentElement.appendChild(elem)
    updateLista()
    salvarLocal()
}

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
        
        cenasListaOptions='<option value="0">'+language.info.selectDestination+'</option>'
        for(c2=0;cenasLista.length>c2;c2++){
            if(cenasLista[c2]!=nome){
                cenasListaOptions=cenasListaOptions+'<option value="'+removeHTMLentities(cenasLista[c2])+'">'+removeHTMLentities(cenasLista[c2])+'</option>'
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

function markError(){
    //console.log(nomes.length)
    for(cc=0;nomes.length>cc;cc++){
        isBlack(nomes[cc])
    }
    for(cc=0;cenaDestino.length>cc;cc++){
        isBlackDestino(cenaDestino[cc])
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
    if(e.target){
        e=e.target
    }
    
    if(e.selectedIndex==0){
        e.style.borderColor="#ff2525"
    }else{
        e.style.borderColor=""
    }
}

function isBlack(e){
    if(e.target){
        e=e.target
    }
    if(e.value==""||e.value==null){
        e.style.borderColor="#ff2525"
    }else{
        e.style.borderColor=""
    }
}

function isRepite(e){
    if(e.target){
        e=e.target
    }
    cenasNome=[]
    for(c=0;nomes.length>c;c++){
        if( nomes[c]!=e){
            cenasNome.push(nomes[c].value)
        }        
    }
    if(cenasNome.includes(e.value)){
        e.style.borderColor=""
        nomeTemp=e.value
        c2=2
        while(cenasNome.includes(nomeTemp)){
            nomeTemp=e.value+" ("+c2+")"
            console.log(nomeTemp)
        }
        e.value=nomeTemp
    }
    
    
    updateLista()
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

async function changeLanguage(lang){
    allLanguage = await fetch('language.json').then(function (response) {
        return response.json();
    })  
    if(allLanguage[lang]==undefined){
        lang="en-US"
    }
    language=allLanguage[lang]
    changeLang=["menu","scene","button"]
    for(c1=0;changeLang.length>c1;c1++){
        //console.log(language[changeLang[c1]])
        key=Object.keys(language[changeLang[c1]])
        for(c2=0;key.length>c2;c2++){
            if(document.getElementById(key[c2])){
                document.getElementById(key[c2]).innerHTML=language[changeLang[c1]][key[c2]]
            }
        }
    }
    document.getElementsByClassName("cena")[0].placeholder=language.info.scenesPlaceholder
}
