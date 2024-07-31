document.addEventListener("DOMContentLoaded", function () {
  const cnpjInput = document.getElementById("cnpj");
  const form = document.getElementById("form-cnpj");

  buildHistorico()

  cnpjInput.addEventListener("input", function (event) {
    let value = event.target.value;
    // Remove qualquer caractere que não seja dígito
    value = value.replace(/\D/g, "");

    // Aplica a máscara CNPJ: 99.999.999/9999-99
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    }
    if (value.length > 8) {
      value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4");
    }
    if (value.length > 12) {
      value = value.replace(
        /^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/,
        "$1.$2.$3/$4-$5"
      );
    }

    event.target.value = value;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log('submit aconteceu')
    const cnpj = cnpjInput.value.replace(/\D/g, "");
    searchCnpj(cnpj);
  });

  async function searchCnpj(cnpj) {
    try {
      const fetchCnpj = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
      );
      if (!fetchCnpj.ok) {
        throw new Error("CNPJ não encontrado");
      }
      const data = await fetchCnpj.json();
      console.log(data)
      const fetchLocal = await fetch(`https://viacep.com.br/ws/${data.cep}/json/`);
      const localData = await fetchLocal.json();

      console.log(localData)
      saveCnpj(data, localData)
      displayResult(data, localData);
    } catch (error) {
      displayError(error.message);
    }
  }

  function buildHistorico() {
    carregaHistorico()

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
        buildHistorico()
      });
    });
  }

  function getCnpjOnLocalStorage(id) {
    const historico = JSON.parse(localStorage.getItem('consulta_cnpj_historico'))
    console.log(historico)
    const cnpj = historico.find(obj => obj.id == id)
    console.log('cnpj da busca', cnpj)
    if (cnpj) {
      displayResult(cnpj.data, cnpj.localidade)
    } else displayError()
  }

  function saveCnpj(data, localData) {
    const historico = JSON.parse(localStorage.getItem('consulta_cnpj_historico')) || []
    historico.push({ id: Date.now(), data: data, created_at: new Date(), localidade: localData })
    localStorage.setItem('consulta_cnpj_historico', JSON.stringify(historico));
    console.log('historico', historico)
  }

  // function verificaHistorico(historico) {

  //   historico.forEach(element => {
  //     if (element.cnpj === data.cnpj) {
  //       return true
  //     }
  //   });
  // }

  function displayResult(data, localidade) {
    console.log(data);
    buildHistorico();
    const consultaArea = document.getElementById('area-cnpj')
    consultaArea.innerHTML = `
      <div class="title-consulta" >
      </ >
      <div class="row" id="area-cnpj-row"></div>`;


    const consultaAreaRow = document.getElementById('area-cnpj-row')

    const principalInfos = build_left_infos(data, localidade)
    consultaAreaRow.appendChild(principalInfos)


    if (data.qsa.length > 0) {
      const sociosArea = build_card_socios(data.qsa)
      consultaAreaRow.appendChild(sociosArea)
    }

    const cnaes = build_cnaes(data)
    consultaArea.appendChild(cnaes)
  }

  function displayError(erro) {
    console.log(erro)
  }
});
