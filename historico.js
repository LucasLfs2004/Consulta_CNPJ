function carregaHistorico() {
    const historico = JSON.parse(localStorage.getItem('consulta_cnpj_historico'))
    const areaHistorico = document.getElementById('area-historico')
    areaHistorico.innerHTML = ''

    if (historico?.length > 0) {
        historico.forEach(element => {
            cardHistorico(element.id, element.data.cnpj, areaHistorico)
        });

    }
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