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
      const fetchLocal = await fetch(`https://viacep.com.br/ws/${data.cep}/json/`);
      const localData = await fetchLocal.json();

      const objCnpj = saveCnpj(data, localData)
      displayResult(objCnpj);
    } catch (error) {
      displayError(error.message);
    }
  }

  function buildHistorico() {
    carregaHistorico()

    const buttonsView = document.querySelectorAll('.view-button');

    // Adiciona um event listener a cada botão
    buttonsView.forEach(button => addListenerOnButtonView(button));

    function addListenerOnButtonView(button) {
      button.addEventListener('click', () => {
        const idValue = button.getAttribute('value');
        const cnpj = getCnpjOnLocalStorage(idValue);
        if (cnpj) {
          displayResult(cnpj)
          showAlert(cnpj.data.cnpj, 'Sua consulta pode ser visualizada abaixo!')
        } else displayError()
      });
    }

    const buttonsDelete = document.querySelectorAll('.delete-button');

    // Adiciona um event listener a cada botão de deletar histórico
    buttonsDelete.forEach(button => addListenerOnButtonDelete(button));

    function addListenerOnButtonDelete(button) {
      button.addEventListener('click', () => {
        // Obtém o valor do atributo 'data-id-value' do botão clicado
        const idValue = button.getAttribute('value');
        const historico = JSON.parse(localStorage.getItem('consulta_cnpj_historico'));
        let historicoFiltrado = historico.filter(obj => obj.id != idValue)
        localStorage.setItem('consulta_cnpj_historico', JSON.stringify(historicoFiltrado));
        buildHistorico()
        showAlert('CNPJ excluído do histórico', '')

        const consultaArea = document.getElementById('area-cnpj')
        const cnpjDisplayed = consultaArea.getAttribute('idValue')
        if (historicoFiltrado.length === 0 || historicoFiltrado.findIndex(obj => obj.id == cnpjDisplayed) === -1) {
          hiddenConsultArea()
        }
      });
    }
  }

  function getCnpjOnLocalStorage(id) {
    const historico = JSON.parse(localStorage.getItem('consulta_cnpj_historico'))
    const cnpj = historico.find(obj => obj.id == id)
    return cnpj

  }

  function saveCnpj(data, localData) {
    const historico = JSON.parse(localStorage.getItem('consulta_cnpj_historico')) || []
    const objCnpj = { id: Date.now(), data: data, created_at: new Date(), localidade: localData }
    historico.push(objCnpj)
    localStorage.setItem('consulta_cnpj_historico', JSON.stringify(historico));
    return objCnpj
  }

  function displayResult(objCnpj) {
    buildHistorico();
    const consultaArea = document.getElementById('area-cnpj')
    consultaArea.setAttribute('idValue', objCnpj.id)
    consultaArea.innerHTML = `
      <div class="title-consulta" >
      <h1>CNPJ: <span>${maskCNPJ(objCnpj.data.cnpj)}</span></h1>
      <button type='button' class='button-blue' id='edit-btn' value='${objCnpj.id}'>Editar</button>
      </div>
      <div class="row" id="area-cnpj-row"></div>`;


    const consultaAreaRow = document.getElementById('area-cnpj-row')

    const principalInfos = build_left_infos(objCnpj.data, objCnpj.localidade)
    consultaAreaRow.appendChild(principalInfos)



    const sociosArea = build_card_socios(objCnpj.data.qsa)
    consultaAreaRow.appendChild(sociosArea)

    const cnaes = build_cnaes(objCnpj.data)
    consultaArea.appendChild(cnaes)

    const btnEdit = document.getElementById('edit-btn');
    btnEdit.addEventListener('click', () => {
      const idEdit = btnEdit.getAttribute('value')
      const cnpj = getCnpjOnLocalStorage(idEdit)
      buildForm(cnpj, displayResult)
    })

    consultaArea.style.display = 'flex'
    consultaArea.scrollIntoView({ behavior: 'smooth' });
  }

  function hiddenConsultArea() {
    const consultaArea = document.getElementById('area-cnpj')
    consultaArea.innerHTML = ``
  }

  function displayError(erro) {
    console.log(erro)
  }
});


function showAlert(title, message) {
  const alert = document.getElementById('alert-section')
  alert.innerHTML = `
    <div class="card-alert">
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `

  alert.style.top = 0

  setTimeout(() => { alert.style.top = '-64px'; }, 4000)
}