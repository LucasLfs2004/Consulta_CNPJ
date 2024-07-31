function carregaHistorico() {
    const historico = JSON.parse(localStorage.getItem('consulta_cnpj_historico'))
    const areaHistorico = document.getElementById('area-historico')
    areaHistorico.innerHTML = '<h1>Histórico</h1 > '


    if (historico?.length > 0) {
        historico.forEach(element => {
            cardHistorico(element.id, element.data.cnpj, areaHistorico)
        });

    }

    const buttonsView = document.querySelectorAll('.view-button');

    // Adiciona um event listener a cada botão
    buttonsView.forEach(button => {
        button.addEventListener('click', () => {
            // Obtém o valor do atributo 'data-id-value' do botão clicado
            const idValue = button.getAttribute('value');
            // Chama a função com o valor do atributo
            console.log('value do button: ', idValue);
            getCnpjOnLocalStorage(idValue);
        });
    });

    const buttonsDelete = document.querySelectorAll('.delete-button');

    // Adiciona um event listener a cada botão de deletar histórico
    buttonsDelete.forEach(button => {
        button.addEventListener('click', () => {
            // Obtém o valor do atributo 'data-id-value' do botão clicado
            const idValue = button.getAttribute('value');
            console.log(idValue)
            const historico = JSON.parse(localStorage.getItem('consulta_cnpj_historico'));
            console.log(historico)
            let historicoFiltrado = historico.filter(obj => obj.id != idValue)
            console.log(historicoFiltrado)
            localStorage.setItem('consulta_cnpj_historico', JSON.stringify(historicoFiltrado));
            carregaHistorico()
        });
    });
}


function cardHistorico(id, value, area) {
    const cardHistorico = document.createElement('div');
    cardHistorico.className = 'card-historico';
    cardHistorico.innerHTML = `
    <p>${maskCNPJ(value)}</p>
    <button id="view-button" class="view-button" type="button" value="${id}">
        <img src="assets/eye.png" class="eye-img">
    </button>
    <button id="delete-button" class="delete-button" type="button" value="${id}">
        <img src="assets/trash.png">
    </button>`;
    area.appendChild(cardHistorico);
}


function maskCNPJ(cnpj) {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/\D/g, '');

    // Aplica a máscara
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
    return cnpj;
}