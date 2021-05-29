cenasR = {
    inicio:"start",
    cenas: {
        start: {
            titulo: "Jogo da Vida",
            texto: "por: Sapato Voador",
            color: "#1d575a",
            opcoes: [
                ["Jogar", "inicio"]
            ]
        },
        inicio: {
            titulo: "",
            texto: "Você é um fazendeiro.\nA época de colheita se aproxima, você não sabe se a colheita será suficiente para pagar os impostos.",
            color: "",
            opcoes: [
                ["Ir morar na cidade", "cidade"],
                ["Apostar na fazenda", "campo"]
            ]
        },
        campo: {
            titulo: "",
            texto: "A colheita e feita.\nAparecem dois compradores, Jorge oferece 1.500 para a colheita e Mike, 800 a vista e 800 em um prazo de uma semana.",
            color: "#203929",
            opcoes: [
                ["Vender a Jorge", "jorge"],
                ["Vender a Mike", "mike"]
            ]
        },
        jorge: {
            titulo: "",
            texto: "O dinheiro de Jorge não é suficiente para pagar o imposto.\nO cobrador leva sua casa como pagamento, só resta morar na cidade",
            color: "#555527",
            opcoes: [
                ["Ir morar na cidade", "cidade"]
            ]
        },
        mike: {
            titulo: "",
            texto: "Mike te passa a perna.\nO cobrador leva sua casa como pagamento e você e obrigado a ir morar na cidade",
            color: "#3f2622",
            opcoes: [
                ["Ir morar na cidade", "cidade"]
            ]
        },
        cidade: {
            titulo: "",
            texto: "A historia da cidade ainda não existe",
            color: "#383539",
            opcoes: [
                ["Jogar denovo", "start"]
            ]
        }
    }

}