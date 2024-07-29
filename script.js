document.addEventListener("DOMContentLoaded", function () {
  const cnpjInput = document.getElementById("cnpj");
  const form = document.getElementById("form-cnpj");

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
      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
      );
      if (!response.ok) {
        throw new Error("CNPJ não encontrado");
      }
      const data = await response.json();
      displayResult(data);
    } catch (error) {
      displayError(error.message);
    }
  }


  function displayResult(data) {
    console.log(data);
    const main = document.getElementById('main')
    const content = document.createElement('div', {id: 'content-cnpj'})


    if (data.qsa.length > 0) {
        data.qsa.array.forEach(element => {
            build_card_socio(element)
        });
    }
  }

  function displayError(erro) {
    console.log(erro)
  }
});
