cena = {}

editorLink="https://dx3006.github.io/TextAdventureEngine/create/"

function init() {

}

title = document.getElementById("title")
text = document.getElementById("text")
buttons = document.getElementById("buttons")
bloco = document.getElementById("bloco")

function sleepTime(timeS) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, timeS)
    })
}
function removeHTMLentities(text){
    return text.replace(/[\u00A0-\u9999"'<>\&]/g, function(i) {
        return '&#'+i.charCodeAt(0)+';';
     });
}

async function setURL(cenaNome) {
    hash = decodeURI(document.location.hash)
    var match = hash.match(/&cena=([^&]+)/);
    if (match) {

        window.history.pushState("object or string", "Title", window.location.protocol + "//" + window.location.host + window.location.pathname + document.location.hash.replace(match[0], "&cena=" + cenaNome))

    } else {
        window.history.pushState("object or string", "Title", window.location.protocol + "//" + window.location.host + window.location.pathname + document.location.hash + "&cena=" + cenaNome)
    }

}

async function changeScene(cenaNome, ani) {
    if (cenaNome == undefined || cenas.cenas[cenaNome] == undefined) {
        k = Object.keys(cenas.cenas)
        cena = cenas.cenas[k[0]]
        localStorage.setItem("cena",k[0])
    } else {
        cena = cenas.cenas[cenaNome]
        localStorage.setItem("cena",cenaNome)
    }
    //console.log(cena)
    document.body.style.backgroundColor = cena.color
    bloco.style.opacity = 0
    if (ani) {
        await sleepTime(700);
    }

    if (cena.titulo != "") {
        text.style["font-size"] = "40px"
    } else {
        text.style["font-size"] = ""
    }
    title.innerHTML = removeHTMLentities(cena.titulo);
    text.innerHTML = removeHTMLentities(cena.texto);

    button = ""
    for (c = 0; cena.opcoes.length > c; c++) {
        button = button + "<button onclick='changeScene(\"" + removeHTMLentities(cena.opcoes[c][1].replace(/"/g,"\\\"").replace(/'/g,"\\\'")) + "\",true)' class=button >" + removeHTMLentities(cena.opcoes[c][0]) + "</button>"
    }
    buttons.innerHTML = button
    bloco.style.opacity = 1


}

hash = decodeURI(document.location.hash)
var match = hash.match(/#cenas=([^]+)/);
if (match) {
    if(match[1].indexOf("{")==-1){
        convert=LZString.decompressFromEncodedURIComponent(match[1])
    }else{
        convert=match[1]
    }
    cenas=JSON.parse(convert)
    changeScene(cenas.inicio)    
}else{
    window.location.href = editorLink;
}
