function build_left_infos(cnpj, localidade) {
  const divSide = document.createElement('div')
  divSide.className = 'side-col';
  console.log(localidade)

  divSide.innerHTML = `
<div class="cartao-cnpj table-padrao">
            <div class="top-content">
              <h3>Cartão CNPJ</h3>
            </div>
            <div class="content">
              <div class="row-content">
                <div class="column">
                  <p>Razão Social: </p><span>${cnpj.razao_social}</span>
                </div>
                <div class="column">
                ${cnpj.nome_fantasia ? `<p>Nome Fantasia: </p><span>${cnpj.nome_fantasia}</span>` : ''}
                </div>
              </div>
              <div class="row-content">
                <div class="column">
                  <p>Situação Cadastral: </p><span>${situacoesCadastrais[cnpj.situacao_cadastral]}</span>
                </div>
                <div class="column">
                  <p>Data de Abertura: </p><span>${formatDate(cnpj.data_inicio_atividade)}</span>
                </div>
              </div>
              <div class="row-content">
                <div class="column">
                  <p>Natureza Jurídica: </p><span>${cnpj.natureza_juridica}</span>
                </div>
                <div class="column">
                  <p>Capital Social: </p><span>${cnpj.capital_social.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })}</span>
                </div>
              </div>
              <div class="row-content">
                <div class="column">
                  <p>Optante MEI: </p><span>${cnpj.opcao_pelo_mei ? 'Sim' : 'Não'}</span>
                </div>
                <div class="column">
                  <p>Optante Simples Nacional: </p><span>${cnpj.opcao_pelo_simples ? 'Sim' : 'Não'}</span>
                </div>
              </div>
              <div class="row-content">
                <div class="column">
                  <p>Email: </p><span>${cnpj.email}</span>
                </div>
                <div class="column">
                  <p>Telefone: </p><span>${maskTel(cnpj.ddd_telefone_1)}</span>
                </div>
              </div>

            </div>
          </div>
          <div class="endereco table-padrao">
            <div class="top-content">
              <h3>Endereço</h3>
            </div>
            <div class="content">
              <div class="row-content">
                <div class="column">
                  <p>Logradouro: </p><span>${localidade.logradouro}</span>
                </div>
                <div class="column">
                  <p>Número: </p><span>${cnpj.numero}</span>
                </div>
              </div>
              <div class="row-content">
                <div class="column">
                  <p>Bairro: </p><span>${localidade.bairro}</span>
                </div>
                <div class="column">
                  <p>CEP: </p><span>${localidade.cep}</span>
                </div>
              </div>
              <div class="row-content">
                <div class="column">
                <p>UF: </p><span>${localidade.uf}</span>
                </div>
                <div class="column">
                <p>Município: </p><span>${localidade.localidade}</span>
                </div>
              </div>

            </div>
          </div>
          </div>
`

  return divSide
}

function build_card_socios(socios) {
  const areaSocios = document.createElement('div')
  areaSocios.className = 'quadro-societario'
  const Title = document.createElement('h3')
  Title.textContent = 'Quadro Societário'
  areaSocios.appendChild(Title)
  const scrollSocios = document.createElement('div')
  scrollSocios.className = 'scroll-socios'

  socios.forEach(socio => {
    //   const cardSocio = build_card_socio(element);
    //   console.log(cardSocio)
    //   if (cardSocio)
    //     quadroSocietario.appendChild(cardSocio)

    console.log(socio)
    const cardSocio = document.createElement('div')
    cardSocio.className = 'card-socio';
    cardSocio.innerHTML = `
        <div class="card__border"></div>
        <div class="row">
          <div class="card_title__container">
            <span class="card_title">${socio.nome_socio.toLowerCase()}</span>
            <p class="card_paragraph">${socio.qualificacao_socio}</p>
          </div>
          <button class="button">Editar</button>
        </div>
        <hr class="line" />
        <ul class="card__list">
          <li class="card__list_item">
            <p class="topic">Data de Entrada:</p>
            <span class="list_text">${formatDate(socio.data_entrada_sociedade)}</span>
          </li>
          <li class="card__list_item">
            <p class="topic">Faixa Etária: </p>
            <span class="list_text">${socio.faixa_etaria}</span>
          </li>
          <li class="card__list_item">
            <p class="topic">Qualificação Sócio: </p>
            <span class="list_text">${socio.qualificacao_socio}</span>
          </li>
        </ul>
    `
    scrollSocios.appendChild(cardSocio)

  });
  areaSocios.appendChild(scrollSocios)

  return areaSocios
}

function build_cnaes(cnpj) {
  const divCnaes = document.createElement('div')
  divCnaes.className = 'cnaes table-padrao'
  divCnaes.innerHTML = `
      <div class="top-content">
          <h3>CNAE Fiscal</h3>
        </div>
        <div class="content">
          <div class="row-content">
            <div class="column">
              <span>${cnpj.cnae_fiscal_descricao}</span>
            </div>
            <div class="column">
              <p>Código: </p><span>${cnpj.cnae_fiscal}</span>
            </div>
          </div>
          ${cnpj.cnaes_secundarios.length > 0 && cnpj.cnaes_secundarios[0].codigo != 0 ?
      `
            <div class="top-content">
              <h3>CNAEs Secundários</h3>
            </div>
          ${cnpj.cnaes_secundarios.map((cnae) => (
        `<div class="row-content">
              <div class="column">
                <span>${cnae.descricao}</span>
              </div>
              <div class="column">
                <p>Código: </p><span>${cnae.codigo}</span>
              </div>
            </div>`
      )).join('')}
              
          ` : ''
    }
        </div>
      </div>
  `

  return divCnaes
}


const situacoesCadastrais = {
  "1": "Nula",
  "2": "Ativa",
  "3": "Suspensa",
  "4": "Inapta",
  "8": "Baixada"
}

function maskTel(telefone) {
  const telefoneString = telefone.toString();

  // Verifica se o telefone tem 10 ou 11 dígitos
  if (telefoneString.length === 10) {
    // Formato (XX) XXXX-XXXX
    return telefoneString.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (telefoneString.length === 11) {
    // Formato (XX) XXXXX-XXXX
    return telefoneString.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else {
    return telefone;
  }
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}