// import { arrCnaes } from "./module.js";

function buildForm(cnpj, displayResult) {
    console.log(cnpj)
    document.body.style.overflow = 'hidden';
    const modal = document.getElementById('modal');
    modal.innerHTML = `
    <form id="edit-form" >
        <div class="top">
          <h1>Editar CNPJ: ${maskCNPJ(cnpj.data.cnpj)}</h1>
          <button type="button" value="${cnpj.id}" class="button-blue" id="close-modal">
            X
          </button>
        </div>
        <section class="area-inputs scroll">
          <div class="row">
            <div class="box-input">
              <label for="razao_social">Razão Social:</label>
              <input required type="text" id="razao_social" placeholder="Razão social" value="${cnpj.data.razao_social}">
            </div>
            <div class="box-input">
              <label for="nome_fantasia">Nome Fantasia:</label>
              <input type="text" id="nome_fantasia" placeholder="Nome fantasia" value="${cnpj.data.nome_fantasia}">
            </div>
          </div>
          <div class="row">
            <div class="box-input">
              <label for="situacao_cadastral">Situação Cadastral:</label>
              <select id="situacao_cadastral">
              ${arrSituacoesCadastrais.map((item) => `
                                <option value="${item.codigo}">
                  ${item.descricao}
                </option>
                `).join('')}
              </select>
            </div>
            <div class="box-input">
              <label for="data_abertura">Data Abertura:</label>
              <input required type="date" id="data_abertura" placeholder="Data abertura" value="${cnpj.data.data_inicio_atividade}">
            </div>
            </div>
          <div class="row">
            <div class="box-input">
              <label for="capital_social">Capital Social:</label>
              <input required type="number" id="capital_social" placeholder="Capital social" value="${cnpj.data.capital_social}">
            </div>
            <div class="box-input">
              <label for="porte">Porte:</label>
              <input required type="text" id="porte" placeholder="porte" value="${cnpj.data.porte}">
            </div>
          </div>
          <div class="row">
            <div class="box-input">
              <label for="optante_mei">Optante MEI:</label>
              <select required type="text" id="optante_mei" placeholder="Optante MEI">
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            <div class="box-input">
              <label for="optante_simples_nacional">Optante Simples Nacional:</label>
              <select required type="text" id="optante_simples_nacional" placeholder="Optante Simples Nacional">
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="box-input">
              <label for="email">E-mail:</label>
              <input required type="email" autocomplete="off" id="email" placeholder="E-mail" value="${cnpj.data.email}">
            </div>
            <div class="box-input">
              <label for="telefone">Telefone:</label>
              <input type="text" id="telefone" placeholder="Telefone" maxlength="15" value="${maskTel(cnpj.data.ddd_telefone_1)}">
            </div>
          </div>
          <div class="row">
            <div class="box-input">
              <label for="cep">CEP:</label>
              <input type="text" id="cep" placeholder="CEP" maxlength="9" value="${cnpj.localidade.cep}">
            </div>
            <div class="box-input">
              <label for="logradouro">Logradouro:</label>
              <input type="text" id="logradouro" placeholder="Logradouro" value="${cnpj.localidade.logradouro}">
            </div>
          </div>
          <div class="row">
            <div class="box-input">
              <label for="bairro">Bairro:</label>
              <input type="text" id="bairro" placeholder="Bairro" value="${cnpj.localidade.bairro}">
            </div>
            <div class="box-input">
              <label for="numero">Número:</label>
              <input type="text" id="numero" placeholder="Número" value="${cnpj.data.numero}">
            </div>
          </div>
          <div class="row">
            <div class="box-input">
              <label for="uf">UF:</label>
              <input type="text" id="uf" placeholder="UF" maxlength="2" value="${cnpj.localidade.uf}">
            </div>
            <div class="box-input">
              <label for="municipio">Município:</label>
              <input type="text" id="municipio" placeholder="Município" value="${cnpj.localidade.localidade}">
            </div>
          </div>
          <h3>CNAE Fiscal</h3>
          <div class="box-input">
            <label for="cnae_fiscal">CNAE Fiscal:</label>
            <select type="text" id="cnae_fiscal" placeholder="CNAE Fiscal">
                            ${arrCnaes.map((item) => `
                                <option value="${item.codigo}">
                  ${item.descricao}
                </option>
                `).join('')}
            </select>
          </div>
        </section>
        <div class="btn-area"> 
          <button type='submit' class='button-blue btn-submit'>Salvar</button>
        </div>
        </form>
    `

    document.getElementById("situacao_cadastral").value = cnpj.data.situacao_cadastral;
    document.getElementById("cnae_fiscal").value = cnpj.data.cnae_fiscal;
    document.getElementById("optante_mei").value = cnpj.data.opcao_pelo_mei ? 'true' : 'false';
    document.getElementById("optante_simples_nacional").value = cnpj.data.opcao_pelo_simples ? 'true' : 'false';

    const btnClose = document.getElementById('close-modal')
    btnClose.addEventListener('click', closeModal)


    document.getElementById('telefone').addEventListener("input", (event) => {
        let value = event.target.value;
        // Remove qualquer caractere que não seja dígito
        value = value.replace(/\D/g, "");

        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');

        if (value.length >= 14) {
            value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        } else {
            value = value.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
        }

        event.target.value = value;
    });
    document.getElementById('cep').addEventListener("input", async (event) => {
        let value = event.target.value;

        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');



        event.target.value = value;
        if (value.length >= 9) {
            const fetchLocal = await fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`);
            const localData = await fetchLocal.json();
            document.getElementById('logradouro').value = localData.logradouro;
            document.getElementById('bairro').value = localData.bairro;
            document.getElementById('municipio').value = localData.localidade;
            document.getElementById('uf').value = localData.uf;
        }
    });

    const form = document.getElementById('edit-form')
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        event.stopPropagation()

        let cnpjEdited = cnpj
        const razaoSocial = document.getElementById('razao_social').value;
        const nomeFantasia = document.getElementById('nome_fantasia').value;
        const porte = document.getElementById('porte').value;
        const selectSituacaoCadastral = document.getElementById("situacao_cadastral").value;
        const dataAbertura = document.getElementById('data_abertura').value;
        const capitalSocial = document.getElementById('capital_social').value;
        const selectMei = document.getElementById("optante_mei").value;
        const selectSimplesNacional = document.getElementById("optante_simples_nacional").value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const cep = document.getElementById('cep').value;
        const logradouro = document.getElementById('logradouro').value;
        const bairro = document.getElementById('bairro').value;
        const numero = document.getElementById('numero').value;
        const municipio = document.getElementById('municipio').value;
        const uf = document.getElementById('uf').value;
        const selectCnaeFiscal = document.getElementById("cnae_fiscal").value;
        console.log(dataAbertura);




        cnpjEdited.data.razao_social = razaoSocial;
        cnpjEdited.data.nome_fantasia = nomeFantasia;
        cnpjEdited.data.situacao_cadastral = parseInt(selectSituacaoCadastral);
        cnpjEdited.data.capital_social = parseFloat(capitalSocial);
        cnpjEdited.data.data_inicio_atividade = dataAbertura;
        cnpjEdited.data.opcao_pelo_mei = selectMei === 'true' ? true : null;
        cnpjEdited.data.opcao_pelo_simples = selectSimplesNacional === 'true' ? true : null;
        cnpjEdited.data.email = email;
        cnpjEdited.data.ddd_telefone_1 = telefone.replace(/\D/g, ''); // Certifique-se de que o telefone esteja no formato correto
        cnpjEdited.data.cep = cep.replace(/\D/g, '');
        cnpjEdited.data.logradouro = logradouro.toUpperCase();
        cnpjEdited.data.bairro = bairro;
        cnpjEdited.data.numero = numero;
        cnpjEdited.data.municipio = municipio.toUpperCase();
        cnpjEdited.data.uf = uf.toUpperCase();
        cnpjEdited.data.cnae_fiscal = parseInt(selectCnaeFiscal, 10);
        cnpjEdited.data.cnae_fiscal_descricao = arrCnaes.find(obj => obj.codigo == selectCnaeFiscal).descricao;
        cnpjEdited.data.porte = porte;

        // Atualiza a localidade se necessário
        cnpjEdited.localidade.cep = cep;
        cnpjEdited.localidade.logradouro = logradouro;
        cnpjEdited.localidade.bairro = bairro;
        cnpjEdited.localidade.localidade = municipio;
        cnpjEdited.localidade.uf = uf;

        console.log('CNPJ EDITADO COM SUCESSO: ', cnpjEdited)

        const historico = JSON.parse(localStorage.getItem('consulta_cnpj_historico'))

        const index = historico.findIndex(obj => obj.id == cnpjEdited.id)
        if (index !== -1) {
            historico[index] = cnpjEdited;
        }
        localStorage.setItem('consulta_cnpj_historico', JSON.stringify(historico))
        displayResult(cnpjEdited)
        showAlert('Sucesso!', 'CNPJ alterado.')
        closeModal()
    })

    modal.style.display = 'flex'

    function closeModal() {
        document.body.style.overflow = 'auto';
        modal.style.display = 'none';
    }
}


const arrSituacoesCadastrais = [
    { codigo: "1", descricao: "Nula", },
    { codigo: "2", descricao: "Ativa", },
    { codigo: "3", descricao: "Suspensa", },
    { codigo: "4", descricao: "Inapta", },
    { codigo: "8", descricao: "Baixada" }
]

const arrCnaes = [
    {
        "descricao": "Administração de obras",
        "codigo": "4399101"
    },
    {
        "descricao": "Agenciamento de espaços para publicidade exceto em veículos de comunicação",
        "codigo": "7312200"
    },
    {
        "descricao": "Agenciamento de profissionais para atividades esportivas, culturais e artísticas",
        "codigo": "7490105"
    },
    {
        "descricao": "Agente de propriedade industrial",
        "codigo": "6911703"
    },
    {
        "descricao": "Agentes de investimentos em aplicações financeiras",
        "codigo": "6612605"
    },
    {
        "descricao": "Agências de notícias",
        "codigo": "6391700"
    },
    {
        "descricao": "Agências de publicidade",
        "codigo": "7311400"
    },
    {
        "descricao": "Agências de viagens",
        "codigo": "7911200"
    },
    {
        "descricao": "Agências matrimoniais",
        "codigo": "9609202"
    },
    {
        "descricao": "Albergues, exceto assistenciais",
        "codigo": "5590601"
    },
    {
        "descricao": "Alojamento de animais domésticos",
        "codigo": "9609207"
    },
    {
        "descricao": "Aluguel de andaimes",
        "codigo": "7732202"
    },
    {
        "descricao": "Aluguel de aparelhos de jogos eletrônicos",
        "codigo": "7729201"
    },
    {
        "descricao": "Aluguel de equipamentos científicos, médicos e hospitalares, sem operador",
        "codigo": "7739002"
    },
    {
        "descricao": "Aluguel de equipamentos recreativos e esportivos",
        "codigo": "7721700"
    },
    {
        "descricao": "Aluguel de fitas de vídeo, DVDs e similares",
        "codigo": "7722500"
    },
    {
        "descricao": "Aluguel de material médico",
        "codigo": "7729203"
    },
    {
        "descricao": "Aluguel de máquinas e equipamentos agrícolas sem operador",
        "codigo": "7731400"
    },
    {
        "descricao": "Aluguel de máquinas e equipamentos para construção sem operador, exceto andaimes",
        "codigo": "7732201"
    },
    {
        "descricao": "Aluguel de máquinas e equipamentos para escritório",
        "codigo": "7733100"
    },
    {
        "descricao": "Aluguel de máquinas e equipamentos para extração de minérios e petróleo, sem operador",
        "codigo": "7739001"
    },
    {
        "descricao": "Aluguel de móveis, utensílios e aparelhos de uso doméstico e pessoal; instrumentos musicais",
        "codigo": "7729202"
    },
    {
        "descricao": "Aluguel de objetos do vestuário, jóias e acessórios",
        "codigo": "7723300"
    },
    {
        "descricao": "Aluguel de outras máquinas e equipamentos comerciais e industriais não especificados anteriormente, sem operador",
        "codigo": "7739099"
    },
    {
        "descricao": "Aluguel de outros objetos pessoais e domésticos não especificados anteriormente",
        "codigo": "7729299"
    },
    {
        "descricao": "Aluguel de palcos, coberturas e outras estruturas de uso temporário, exceto andaimes",
        "codigo": "7739003"
    },
    {
        "descricao": "Apart-hotéis",
        "codigo": "5510802"
    },
    {
        "descricao": "Artes cênicas, espetáculos e atividades complementares não especificadas anteriormente",
        "codigo": "9001999"
    },
    {
        "descricao": "Atividade médica ambulatorial com recursos para realização de exames complementares",
        "codigo": "8630502"
    },
    {
        "descricao": "Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos",
        "codigo": "8630501"
    },
    {
        "descricao": "Atividade médica ambulatorial restrita a consultas",
        "codigo": "8630503"
    },
    {
        "descricao": "Atividade odontológica",
        "codigo": "8630504"
    },
    {
        "descricao": "Atividades auxiliares da justiça",
        "codigo": "6911702"
    },
    {
        "descricao": "Atividades auxiliares dos seguros, da previdência complementar e dos planos de saúde não especificadas anteriormente",
        "codigo": "6629100"
    },
    {
        "descricao": "Atividades de Estética e outros serviços de cuidados com a beleza",
        "codigo": "9602502"
    },
    {
        "descricao": "Atividades de acupuntura",
        "codigo": "8690903"
    },
    {
        "descricao": "Atividades de apoio à aquicultura em água doce",
        "codigo": "322107"
    },
    {
        "descricao": "Atividades de apoio à educação, exceto caixas escolares",
        "codigo": "8550302"
    },
    {
        "descricao": "Atividades de apoio à gestão de saúde",
        "codigo": "8660700"
    },
    {
        "descricao": "Atividades de artistas plásticos, jornalistas independentes e escritores",
        "codigo": "9002701"
    },
    {
        "descricao": "Atividades de atendimento em pronto-socorro e unidades hospitalares para atendimento a urgências",
        "codigo": "8610102"
    },
    {
        "descricao": "Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências",
        "codigo": "8610101"
    },
    {
        "descricao": "Atividades de atenção ambulatorial não especificadas anteriormente",
        "codigo": "8630599"
    },
    {
        "descricao": "Atividades de banco de leite humano",
        "codigo": "8690902"
    },
    {
        "descricao": "Atividades de bibliotecas e arquivos",
        "codigo": "9101500"
    },
    {
        "descricao": "Atividades de cobrança e informações cadastrais",
        "codigo": "8291100"
    },
    {
        "descricao": "Atividades de condicionamento físico",
        "codigo": "9313100"
    },
    {
        "descricao": "Atividades de condicionamento físico",
        "codigo": "9313100"
    },
    {
        "descricao": "Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica",
        "codigo": "7020400"
    },
    {
        "descricao": "Atividades de contabilidade",
        "codigo": "6920601"
    },
    {
        "descricao": "Atividades de design não especificadas anteriormente",
        "codigo": "7410299"
    },
    {
        "descricao": "Atividades de enfermagem",
        "codigo": "8650001"
    },
    {
        "descricao": "Atividades de estudos geológicos",
        "codigo": "7119702"
    },
    {
        "descricao": "Atividades de exibição cinematográfica",
        "codigo": "5914600"
    },
    {
        "descricao": "Atividades de fisioterapia",
        "codigo": "8650004"
    },
    {
        "descricao": "Atividades de fisioterapia",
        "codigo": "8650004"
    },
    {
        "descricao": "Atividades de fonoaudiologia",
        "codigo": "8650006"
    },
    {
        "descricao": "Atividades de fornecimento de infra-estrutura de apoio e assistência a paciente no domicílio",
        "codigo": "8712300"
    },
    {
        "descricao": "Atividades de gravação de som e de edição de música",
        "codigo": "5920100"
    },
    {
        "descricao": "Atividades de intermediação e agenciamento de serviços e negócios em geral, exceto imobiliários",
        "codigo": "7490104"
    },
    {
        "descricao": "Atividades de investigação particular",
        "codigo": "8030700"
    },
    {
        "descricao": "Atividades de limpeza não especificadas anteriormente",
        "codigo": "8129000"
    },
    {
        "descricao": "Atividades de monitoramento de sistemas de segurança eletrônico",
        "codigo": "8020001"
    },
    {
        "descricao": "Atividades de museus e de exploração de lugares e prédios históricos e atrações similares",
        "codigo": "9102301"
    },
    {
        "descricao": "Atividades de podologia",
        "codigo": "8690904"
    },
    {
        "descricao": "Atividades de produção cinematográfica, de vídeos e de programas de televisão não especificadas anteriormente",
        "codigo": "5911199"
    },
    {
        "descricao": "Atividades de produção de fotografias aéreas e submarinas",
        "codigo": "7420002"
    },
    {
        "descricao": "Atividades de produção de fotografias, exceto aérea e submarina",
        "codigo": "7420001"
    },
    {
        "descricao": "Atividades de profissionais da nutrição",
        "codigo": "8650002"
    },
    {
        "descricao": "Atividades de profissionais da área de saúde não especificadas anteriormente",
        "codigo": "8650099"
    },
    {
        "descricao": "Atividades de práticas integrativas e complementares em saúde humana",
        "codigo": "8690901"
    },
    {
        "descricao": "Atividades de psicologia e psicanálise",
        "codigo": "8650003"
    },
    {
        "descricao": "Atividades de pós-produção cinematográfica, de vídeos e de programas de televisão não especificadas anteriormente",
        "codigo": "5912099"
    },
    {
        "descricao": "Atividades de reprodução humana assistida",
        "codigo": "8630507"
    },
    {
        "descricao": "Atividades de sauna e banhos",
        "codigo": "9609205"
    },
    {
        "descricao": "Atividades de serviços de complementação diagnóstica e terapêutica não especificadas anteriormente",
        "codigo": "8640299"
    },
    {
        "descricao": "Atividades de sonorização e de iluminação",
        "codigo": "9001906"
    },
    {
        "descricao": "Atividades de teleatendimento",
        "codigo": "8220200"
    },
    {
        "descricao": "Atividades de terapia de nutrição enteral e parenteral",
        "codigo": "8650007"
    },
    {
        "descricao": "Atividades de terapia ocupacional",
        "codigo": "8650005"
    },
    {
        "descricao": "Atividades paisagísticas",
        "codigo": "8130300"
    },
    {
        "descricao": "Atividades técnicas relacionadas à engenharia e arquitetura não especificadas anteriormente",
        "codigo": "7119799"
    },
    {
        "descricao": "Atividades veterinárias",
        "codigo": "7500100"
    },
    {
        "descricao": "Auditoria e consultoria atuarial",
        "codigo": "6621502"
    },
    {
        "descricao": "Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento",
        "codigo": "5611204"
    },
    {
        "descricao": "Cabeleireiros, manicure e pedicure",
        "codigo": "9602501"
    },
    {
        "descricao": "Campings",
        "codigo": "5590602"
    },
    {
        "descricao": "Cantinas – serviços de alimentação privativos",
        "codigo": "5620103"
    },
    {
        "descricao": "Casas de festas e eventos",
        "codigo": "8230002"
    },
    {
        "descricao": "Chaveiros",
        "codigo": "9529102"
    },
    {
        "descricao": "Clínicas e residências geriátricas",
        "codigo": "8711501"
    },
    {
        "descricao": "Comércio a varejo de automóveis, camionetas e utilitários novos",
        "codigo": "4511101"
    },
    {
        "descricao": "Comércio a varejo de motocicletas e motonetas novas",
        "codigo": "4541203"
    },
    {
        "descricao": "Comércio a varejo de motocicletas e motonetas usadas",
        "codigo": "4541204"
    },
    {
        "descricao": "Comércio a varejo de peças e acessórios novos para motocicletas e motonetas",
        "codigo": "4541206"
    },
    {
        "descricao": "Comércio a varejo de peças e acessórios novos para veículos automotores",
        "codigo": "4530703"
    },
    {
        "descricao": "Comércio a varejo de peças e acessórios usados para motocicletas e motonetas",
        "codigo": "4541207"
    },
    {
        "descricao": "Comércio a varejo de peças e acessórios usados para veículos automotores",
        "codigo": "4530704"
    },
    {
        "descricao": "Comércio a varejo de pneumáticos e câmaras-de-ar",
        "codigo": "4530705"
    },
    {
        "descricao": "Comércio por atacado de peças e acessórios novos para veículos automotores",
        "codigo": "4530701"
    },
    {
        "descricao": "Comércio por atacado de peças e acessórios para motocicletas e motonetas",
        "codigo": "4541202"
    },
    {
        "descricao": "Comércio por atacado de pneumáticos e câmaras-de-ar",
        "codigo": "4530702"
    },
    {
        "descricao": "Comércio varejista de antigüidades",
        "codigo": "4785701"
    },
    {
        "descricao": "Comércio varejista de armas e munições",
        "codigo": "4789009"
    },
    {
        "descricao": "Comércio varejista de artigos de armarinho",
        "codigo": "4755502"
    },
    {
        "descricao": "Comércio varejista de artigos de cama, mesa e banho",
        "codigo": "4755503"
    },
    {
        "descricao": "Comércio varejista de artigos de caça, pesca e camping",
        "codigo": "4763604"
    },
    {
        "descricao": "Comércio varejista de artigos de colchoaria",
        "codigo": "4754702"
    },
    {
        "descricao": "Comércio varejista de artigos de iluminação",
        "codigo": "4754703"
    },
    {
        "descricao": "Comércio varejista de artigos de papelaria",
        "codigo": "4761003"
    },
    {
        "descricao": "Comércio varejista de artigos de relojoaria",
        "codigo": "4783102"
    },
    {
        "descricao": "Comércio varejista de artigos de tapeçaria, cortinas e persianas",
        "codigo": "4759801"
    },
    {
        "descricao": "Comércio varejista de artigos de viagem",
        "codigo": "4782202"
    },
    {
        "descricao": "Comércio varejista de artigos de óptica",
        "codigo": "4774100"
    },
    {
        "descricao": "Comércio varejista de artigos do vestuário e acessórios",
        "codigo": "4781400"
    },
    {
        "descricao": "Comércio varejista de artigos esportivos",
        "codigo": "4763602"
    },
    {
        "descricao": "Comércio varejista de artigos fotográficos e para filmagem",
        "codigo": "4789008"
    },
    {
        "descricao": "Comércio varejista de artigos médicos e ortopédicos",
        "codigo": "4773300"
    },
    {
        "descricao": "Comércio varejista de bebidas",
        "codigo": "4723700"
    },
    {
        "descricao": "Comércio varejista de bicicletas e triciclos peças e acessórios",
        "codigo": "4763603"
    },
    {
        "descricao": "Comércio varejista de brinquedos e artigos recreativos",
        "codigo": "4763601"
    },
    {
        "descricao": "Comércio varejista de cal, areia, pedra britada, tijolos e telhas",
        "codigo": "4744004"
    },
    {
        "descricao": "Comércio varejista de calçados",
        "codigo": "4782201"
    },
    {
        "descricao": "Comércio varejista de cosméticos, produtos de perfumaria e de higiene pessoal",
        "codigo": "4772500"
    },
    {
        "descricao": "Comércio varejista de discos, CDs, DVDs e fitas",
        "codigo": "4762800"
    },
    {
        "descricao": "Comércio varejista de doces, balas, bombons e semelhantes",
        "codigo": "4721104"
    },
    {
        "descricao": "Comércio varejista de embarcações e outros veículos recreativos peças e acessórios",
        "codigo": "4763605"
    },
    {
        "descricao": "Comércio varejista de equipamentos para escritório",
        "codigo": "4789007"
    },
    {
        "descricao": "Comércio varejista de ferragens e ferramentas",
        "codigo": "4744001"
    },
    {
        "descricao": "Comércio varejista de fogos de artifício e artigos pirotécnicos",
        "codigo": "4789006"
    },
    {
        "descricao": "Comércio varejista de hortifrutigranjeiros",
        "codigo": "4724500"
    },
    {
        "descricao": "Comércio varejista de jornais e revistas",
        "codigo": "4761002"
    },
    {
        "descricao": "Comércio varejista de laticínios e frios",
        "codigo": "4721103"
    },
    {
        "descricao": "Comércio varejista de livros",
        "codigo": "4761001"
    },
    {
        "descricao": "Comércio varejista de madeira e artefatos",
        "codigo": "4744002"
    },
    {
        "descricao": "Comércio varejista de materiais de construção em geral",
        "codigo": "4744099"
    },
    {
        "descricao": "Comércio varejista de materiais de construção não especificados anteriormente",
        "codigo": "4744005"
    },
    {
        "descricao": "Comércio varejista de materiais hidráulicos",
        "codigo": "4744003"
    },
    {
        "descricao": "Comércio varejista de material elétrico",
        "codigo": "4742300"
    },
    {
        "descricao": "Comércio varejista de medicamentos veterinários",
        "codigo": "4771704"
    },
    {
        "descricao": "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios – hipermercados",
        "codigo": "4711301"
    },
    {
        "descricao": "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios – minimercados, mercearias e armazéns",
        "codigo": "4712100"
    },
    {
        "descricao": "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios – supermercados",
        "codigo": "4711302"
    },
    {
        "descricao": "Comércio varejista de mercadorias em lojas de conveniência",
        "codigo": "4729602"
    },
    {
        "descricao": "Comércio varejista de móveis",
        "codigo": "4754701"
    },
    {
        "descricao": "Comércio varejista de objetos de arte",
        "codigo": "4789003"
    },
    {
        "descricao": "Comércio varejista de outros artigos de uso doméstico não especificados anteriormente",
        "codigo": "4759899"
    },
    {
        "descricao": "Comércio varejista de outros artigos usados",
        "codigo": "4785799"
    },
    {
        "descricao": "Comércio varejista de outros produtos não especificados anteriormente",
        "codigo": "4789099"
    },
    {
        "descricao": "Comércio varejista de pedras para revestimento",
        "codigo": "4744006"
    },
    {
        "descricao": "Comércio varejista de plantas e flores naturais",
        "codigo": "4789002"
    },
    {
        "descricao": "Comércio varejista de produtos alimentícios em geral ou especializado em produtos alimentícios não especificados anteriormente",
        "codigo": "4729699"
    },
    {
        "descricao": "Comércio varejista de produtos saneantes domissanitários",
        "codigo": "4789005"
    },
    {
        "descricao": "Comércio varejista de suvenires, bijuterias e artesanatos",
        "codigo": "4789001"
    },
    {
        "descricao": "Comércio varejista de tecidos",
        "codigo": "4755501"
    },
    {
        "descricao": "Comércio varejista de tintas e materiais para pintura",
        "codigo": "4741500"
    },
    {
        "descricao": "Comércio varejista de vidros",
        "codigo": "4743100"
    },
    {
        "descricao": "Comércio varejista especializado de eletrodomésticos e equipamentos de áudio e vídeo",
        "codigo": "4753900"
    },
    {
        "descricao": "Comércio varejista especializado de equipamentos de telefonia e comunicação",
        "codigo": "4752100"
    },
    {
        "descricao": "Comércio varejista especializado de equipamentos e suprimentos de informática",
        "codigo": "4751201"
    },
    {
        "descricao": "Comércio varejista especializado de instrumentos musicais e acessórios",
        "codigo": "4756300"
    },
    {
        "descricao": "Comércio varejista especializado de peças e acessórios para aparelhos eletroeletrônicos para uso doméstico, exceto informática e comunicação",
        "codigo": "4757100"
    },
    {
        "descricao": "Consultoria em publicidade",
        "codigo": "7319004"
    },
    {
        "descricao": "Consultoria em tecnologia da informação",
        "codigo": "6204000"
    },
    {
        "descricao": "Correspondentes de instituições financeiras",
        "codigo": "6619302"
    },
    {
        "descricao": "Corretagem na compra e venda e avaliação de imóveis",
        "codigo": "6821801"
    },
    {
        "descricao": "Corretagem no aluguel de imóveis",
        "codigo": "6821802"
    },
    {
        "descricao": "Corretores e agentes de seguros, de planos de previdência complementar e de saúde",
        "codigo": "6622300"
    },
    {
        "descricao": "Criação de estandes para feiras e exposições",
        "codigo": "7319001"
    },
    {
        "descricao": "Cursos de pilotagem",
        "codigo": "8599602"
    },
    {
        "descricao": "Cursos preparatórios para concursos",
        "codigo": "8599605"
    },
    {
        "descricao": "Desenvolvimento de programas de computador sob encomenda",
        "codigo": "6201501"
    },
    {
        "descricao": "Desenvolvimento de programas de computador sob encomenda",
        "codigo": "6201501"
    },
    {
        "descricao": "Desenvolvimento e licenciamento de programas de computador customizáveis",
        "codigo": "6202300"
    },
    {
        "descricao": "Desenvolvimento e licenciamento de programas de computador customizáveis",
        "codigo": "6202300"
    },
    {
        "descricao": "Desenvolvimento e licenciamento de programas de computador não-customizáveis",
        "codigo": "6203100"
    },
    {
        "descricao": "Desenvolvimento e licenciamento de programas de computador não-customizáveis",
        "codigo": "6203100"
    },
    {
        "descricao": "Design de interiores",
        "codigo": "7410202"
    },
    {
        "descricao": "Design de interiores",
        "codigo": "7410202"
    },
    {
        "descricao": "Design de produto",
        "codigo": "7410203"
    },
    {
        "descricao": "Distribuição cinematográfica, de vídeo e de programas de televisão",
        "codigo": "5913800"
    },
    {
        "descricao": "Edição de cadastros, listas e outros produtos gráficos",
        "codigo": "5819100"
    },
    {
        "descricao": "Edição de jornais diários",
        "codigo": "5812301"
    },
    {
        "descricao": "Edição de jornais não diários",
        "codigo": "5812302"
    },
    {
        "descricao": "Edição de livros",
        "codigo": "5811500"
    },
    {
        "descricao": "Edição de revistas",
        "codigo": "5813100"
    },
    {
        "descricao": "Educação infantil – creche",
        "codigo": "8511200"
    },
    {
        "descricao": "Educação infantil – pré-escola",
        "codigo": "8512100"
    },
    {
        "descricao": "Educação profissional de nível tecnológico",
        "codigo": "8542200"
    },
    {
        "descricao": "Educação profissional de nível técnico",
        "codigo": "8541400"
    },
    {
        "descricao": "Educação superior – graduação",
        "codigo": "8531700"
    },
    {
        "descricao": "Educação superior – graduação e pós-graduação",
        "codigo": "8532500"
    },
    {
        "descricao": "Educação superior – pós-graduação e extensão",
        "codigo": "8533300"
    },
    {
        "descricao": "Ensino de arte e cultura não especificado anteriormente",
        "codigo": "8592999"
    },
    {
        "descricao": "Ensino de artes cênicas, exceto dança",
        "codigo": "8592902"
    },
    {
        "descricao": "Ensino de dança",
        "codigo": "8592901"
    },
    {
        "descricao": "Ensino de dança",
        "codigo": "8592901"
    },
    {
        "descricao": "Ensino de esportes",
        "codigo": "8591100"
    },
    {
        "descricao": "Ensino de esportes",
        "codigo": "8591100"
    },
    {
        "descricao": "Ensino de idiomas",
        "codigo": "8593700"
    },
    {
        "descricao": "Ensino de música",
        "codigo": "8592903"
    },
    {
        "descricao": "Ensino fundamental",
        "codigo": "8513900"
    },
    {
        "descricao": "Ensino médio",
        "codigo": "8520100"
    },
    {
        "descricao": "Escafandria e mergulho",
        "codigo": "7490102"
    },
    {
        "descricao": "Estúdios cinematográficos",
        "codigo": "5911101"
    },
    {
        "descricao": "Exploração de boliches",
        "codigo": "9329802"
    },
    {
        "descricao": "Exploração de jogos de sinuca, bilhar e similares",
        "codigo": "9329803"
    },
    {
        "descricao": "Exploração de jogos eletrônicos recreativos",
        "codigo": "9329804"
    },
    {
        "descricao": "Fabricação de gelo comum",
        "codigo": "1099604"
    },
    {
        "descricao": "Filmagem de festas e eventos",
        "codigo": "7420004"
    },
    {
        "descricao": "Formação de condutores",
        "codigo": "8599601"
    },
    {
        "descricao": "Fornecimento de alimentos preparados preponderantemente para consumo domiciliar",
        "codigo": "5620104"
    },
    {
        "descricao": "Fornecimento de alimentos preparados preponderantemente para empresas",
        "codigo": "5620101"
    },
    {
        "descricao": "Fotocópias",
        "codigo": "8219901"
    },
    {
        "descricao": "Gestão de ativos intangíveis não-financeiros",
        "codigo": "7740300"
    },
    {
        "descricao": "Gestão de espaços para artes cênicas, espetáculos e outras atividades artísticas",
        "codigo": "9003500"
    },
    {
        "descricao": "Gestão de instalações de esportes",
        "codigo": "9311500"
    },
    {
        "descricao": "Gestão e administração da propriedade imobiliária",
        "codigo": "6822600"
    },
    {
        "descricao": "Gestão e administração da propriedade imobiliária",
        "codigo": "6822600"
    },
    {
        "descricao": "Guarda-móveis",
        "codigo": "5211702"
    },
    {
        "descricao": "Higiene e embelezamento de animais domésticos",
        "codigo": "9609208"
    },
    {
        "descricao": "Hotéis",
        "codigo": "5510801"
    },
    {
        "descricao": "Imunização e controle de pragas urbanas",
        "codigo": "8122200"
    },
    {
        "descricao": "Instalação de equipamentos para orientação à navegação marítima, fluvial e lacustre",
        "codigo": "4329102"
    },
    {
        "descricao": "Instalação de máquinas e equipamentos industriais",
        "codigo": "3321000"
    },
    {
        "descricao": "Instalação de painéis publicitários",
        "codigo": "4329101"
    },
    {
        "descricao": "Instalação e manutenção de sistemas centrais de ar condicionado, de ventilação e refrigeração",
        "codigo": "4322302"
    },
    {
        "descricao": "Instalação e manutenção elétrica",
        "codigo": "4321500"
    },
    {
        "descricao": "Instalação, manutenção e reparação de elevadores, escadas e esteiras rolantes",
        "codigo": "4329103"
    },
    {
        "descricao": "Instalações de sistema de prevenção contra incêndio",
        "codigo": "4322303"
    },
    {
        "descricao": "Instalações hidráulicas, sanitárias e de gás",
        "codigo": "4322301"
    },
    {
        "descricao": "Instituições de longa permanência para idosos",
        "codigo": "8711502"
    },
    {
        "descricao": "Laboratórios clínicos",
        "codigo": "8640202"
    },
    {
        "descricao": "Laboratórios clínicos",
        "codigo": "8640202"
    },
    {
        "descricao": "Laboratórios de anatomia patológica e citológica",
        "codigo": "8640201"
    },
    {
        "descricao": "Laboratórios de anatomia patológica e citológica",
        "codigo": "8640201"
    },
    {
        "descricao": "Laboratórios fotográficos",
        "codigo": "7420003"
    },
    {
        "descricao": "Lanchonetes, casas de chá, de sucos e similares",
        "codigo": "5611203"
    },
    {
        "descricao": "Lavanderias",
        "codigo": "9601701"
    },
    {
        "descricao": "Limpeza em prédios e em domicílios",
        "codigo": "8121400"
    },
    {
        "descricao": "Locação de automóveis sem condutor",
        "codigo": "7711000"
    },
    {
        "descricao": "Lojas de departamentos ou magazines, exceto lojas francas (Duty free)",
        "codigo": "4713004"
    },
    {
        "descricao": "Lojas de variedades, exceto lojas de departamentos ou magazines",
        "codigo": "4713002"
    },
    {
        "descricao": "Manutenção de aeronaves na pista",
        "codigo": "3316302"
    },
    {
        "descricao": "Manutenção de estações e redes de telecomunicações",
        "codigo": "4221905"
    },
    {
        "descricao": "Manutenção de redes de distribuição de energia elétrica",
        "codigo": "4221903"
    },
    {
        "descricao": "Manutenção e reparação de aeronaves, exceto a manutenção na pista",
        "codigo": "3316301"
    },
    {
        "descricao": "Manutenção e reparação de aparelhos e instrumentos de medida, teste e controle",
        "codigo": "3312102"
    },
    {
        "descricao": "Manutenção e reparação de aparelhos eletromédicos e eletroterapêuticos e equipamentos de irradiação",
        "codigo": "3312103"
    },
    {
        "descricao": "Manutenção e reparação de baterias e acumuladores elétricos, exceto para veículos",
        "codigo": "3313902"
    },
    {
        "descricao": "Manutenção e reparação de compressores",
        "codigo": "3314704"
    },
    {
        "descricao": "Manutenção e reparação de embarcações e estruturas flutuantes",
        "codigo": "3317101"
    },
    {
        "descricao": "Manutenção e reparação de embarcações para esporte e lazer",
        "codigo": "3317102"
    },
    {
        "descricao": "Manutenção e reparação de equipamentos de transmissão para fins industriais",
        "codigo": "3314705"
    },
    {
        "descricao": "Manutenção e reparação de equipamentos e instrumentos ópticos",
        "codigo": "3312104"
    },
    {
        "descricao": "Manutenção e reparação de equipamentos e produtos não especificados anteriormente",
        "codigo": "3319800"
    },
    {
        "descricao": "Manutenção e reparação de equipamentos hidráulicos e pneumáticos, exceto válvulas",
        "codigo": "3314702"
    },
    {
        "descricao": "Manutenção e reparação de geradores, transformadores e motores elétricos",
        "codigo": "3313901"
    },
    {
        "descricao": "Manutenção e reparação de motocicletas e motonetas",
        "codigo": "4543900"
    },
    {
        "descricao": "Manutenção e reparação de máquinas de escrever, calcular e de outros equipamentos não-eletrônicos para escritório",
        "codigo": "3314709"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e aparelhos de refrigeração e ventilação para uso industrial e comercial",
        "codigo": "3314707"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e aparelhos para a indústria de celulose, papel e papelão e artefatos",
        "codigo": "3314721"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e aparelhos para a indústria do plástico",
        "codigo": "3314722"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e equipamentos de terraplenagem, pavimentação e construção, exceto tratores",
        "codigo": "3314717"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e equipamentos para a indústria têxtil, do vestuário, do couro e calçados",
        "codigo": "3314720"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e equipamentos para a prospecção e extração de petróleo",
        "codigo": "3314714"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e equipamentos para agricultura e pecuária",
        "codigo": "3314711"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e equipamentos para as indústrias de alimentos, bebidas e fumo",
        "codigo": "3314719"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e equipamentos para uso geral não especificados anteriormente",
        "codigo": "3314710"
    },
    {
        "descricao": "Manutenção e reparação de máquinas e equipamentos para uso na extração mineral, exceto na extração de petróleo",
        "codigo": "3314715"
    },
    {
        "descricao": "Manutenção e reparação de máquinas motrizes não-elétricas",
        "codigo": "3314701"
    },
    {
        "descricao": "Manutenção e reparação de máquinas para a indústria metalúrgica, exceto máquinas-ferramenta",
        "codigo": "3314718"
    },
    {
        "descricao": "Manutenção e reparação de máquinas, aparelhos e equipamentos para instalações térmicas",
        "codigo": "3314706"
    },
    {
        "descricao": "Manutenção e reparação de máquinas, aparelhos e materiais elétricos não especificados anteriormente",
        "codigo": "3313999"
    },
    {
        "descricao": "Manutenção e reparação de máquinas, equipamentos e aparelhos para transporte e elevação de cargas",
        "codigo": "3314708"
    },
    {
        "descricao": "Manutenção e reparação de máquinas-ferramenta",
        "codigo": "3314713"
    },
    {
        "descricao": "Manutenção e reparação de outras máquinas e equipamentos para usos industriais não especificados anteriormente",
        "codigo": "3314799"
    },
    {
        "descricao": "Manutenção e reparação de tratores agrícolas",
        "codigo": "3314712"
    },
    {
        "descricao": "Manutenção e reparação de tratores, exceto agrícolas",
        "codigo": "3314716"
    },
    {
        "descricao": "Manutenção e reparação de veículos ferroviários",
        "codigo": "3315500"
    },
    {
        "descricao": "Manutenção e reparação de válvulas industriais",
        "codigo": "3314703"
    },
    {
        "descricao": "Marketing direto",
        "codigo": "7319003"
    },
    {
        "descricao": "Medição de consumo de energia elétrica, gás e água",
        "codigo": "8299701"
    },
    {
        "descricao": "Montagem e desmontagem de andaimes e outras estruturas temporárias",
        "codigo": "4399102"
    },
    {
        "descricao": "Montagem e instalação de sistemas e equipamentos de iluminação e sinalização em vias públicas, portos e aeroportos",
        "codigo": "4329104"
    },
    {
        "descricao": "Motéis",
        "codigo": "5510803"
    },
    {
        "descricao": "Obras de terraplenagem",
        "codigo": "4313400"
    },
    {
        "descricao": "Operadores turísticos",
        "codigo": "7912100"
    },
    {
        "descricao": "Outras atividades de atenção à saúde humana não especificadas anteriormente",
        "codigo": "8690999"
    },
    {
        "descricao": "Outras atividades de ensino não especificadas anteriormente",
        "codigo": "8599699"
    },
    {
        "descricao": "Outras atividades de prestação de serviços de informação não especificadas anteriormente",
        "codigo": "6399200"
    },
    {
        "descricao": "Outras atividades de publicidade não especificadas anteriormente",
        "codigo": "7319099"
    },
    {
        "descricao": "Outras atividades de recreação e lazer não especificadas anteriormente",
        "codigo": "9329899"
    },
    {
        "descricao": "Outras atividades de serviços pessoais não especificadas anteriormente",
        "codigo": "9609299"
    },
    {
        "descricao": "Outras atividades de serviços prestados principalmente às empresas não especificadas anteriormente",
        "codigo": "8299799"
    },
    {
        "descricao": "Outras atividades de serviços prestados principalmente às empresas não especificadas anteriormente",
        "codigo": "8299799"
    },
    {
        "descricao": "Outras atividades esportivas não especificadas anteriormente",
        "codigo": "9319199"
    },
    {
        "descricao": "Outras atividades profissionais, científicas e técnicas não especificadas anteriormente",
        "codigo": "7490199"
    },
    {
        "descricao": "Outros alojamentos não especificados anteriormente",
        "codigo": "5590699"
    },
    {
        "descricao": "Outros representantes comerciais e agentes do comércio especializado em produtos não especificados anteriormente",
        "codigo": "4618499"
    },
    {
        "descricao": "Padaria e confeitaria com predominância de revenda",
        "codigo": "4721102"
    },
    {
        "descricao": "Peixaria",
        "codigo": "4722902"
    },
    {
        "descricao": "Pensões (alojamento)",
        "codigo": "5590603"
    },
    {
        "descricao": "Peritos e avaliadores de seguros",
        "codigo": "6621501"
    },
    {
        "descricao": "Pesquisa e desenvolvimento experimental em ciências físicas e naturais",
        "codigo": "7210000"
    },
    {
        "descricao": "Pesquisa e desenvolvimento experimental em ciências sociais e humanas",
        "codigo": "7220700"
    },
    {
        "descricao": "Pesquisas de mercado e de opinião pública",
        "codigo": "7320300"
    },
    {
        "descricao": "Pintura para sinalização em pistas rodoviárias e aeroportos",
        "codigo": "4211102"
    },
    {
        "descricao": "Portais, provedores de conteúdo e outros serviços de informação na internet",
        "codigo": "6319400"
    },
    {
        "descricao": "Portais, provedores de conteúdo e outros serviços de informação na internet",
        "codigo": "6319400"
    },
    {
        "descricao": "Preparação de documentos e serviços especializados de apoio administrativo não especificados anteriormente",
        "codigo": "8219999"
    },
    {
        "descricao": "Produção de espetáculos circenses, de marionetes e similares",
        "codigo": "9001904"
    },
    {
        "descricao": "Produção de espetáculos de dança",
        "codigo": "9001903"
    },
    {
        "descricao": "Produção de espetáculos de rodeios, vaquejadas e similares",
        "codigo": "9001905"
    },
    {
        "descricao": "Produção de filmes para publicidade",
        "codigo": "5911102"
    },
    {
        "descricao": "Produção e promoção de eventos esportivos",
        "codigo": "9319101"
    },
    {
        "descricao": "Produção musical",
        "codigo": "9001902"
    },
    {
        "descricao": "Produção teatral",
        "codigo": "9001901"
    },
    {
        "descricao": "Promoção de vendas",
        "codigo": "7319002"
    },
    {
        "descricao": "Recarga de cartuchos para equipamentos de informática",
        "codigo": "4751202"
    },
    {
        "descricao": "Reparação de artigos do mobiliário",
        "codigo": "9529105"
    },
    {
        "descricao": "Reparação de bicicletas, triciclos e outros veículos não-motorizados",
        "codigo": "9529104"
    },
    {
        "descricao": "Reparação de calçados, bolsas e artigos de viagem",
        "codigo": "9529101"
    },
    {
        "descricao": "Reparação de jóias",
        "codigo": "9529106"
    },
    {
        "descricao": "Reparação de relógios",
        "codigo": "9529103"
    },
    {
        "descricao": "Reparação e manutenção de computadores e de equipamentos periféricos",
        "codigo": "9511800"
    },
    {
        "descricao": "Reparação e manutenção de equipamentos de comunicação",
        "codigo": "9512600"
    },
    {
        "descricao": "Reparação e manutenção de equipamentos eletroeletrônicos de uso pessoal e doméstico",
        "codigo": "9521500"
    },
    {
        "descricao": "Reparação e manutenção de outros objetos e equipamentos pessoais e domésticos não especificados anteriormente",
        "codigo": "9529199"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de combustíveis, minerais, produtos siderúrgicos e químicos",
        "codigo": "4612500"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de eletrodomésticos, móveis e artigos de uso doméstico",
        "codigo": "4615000"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de instrumentos e materiais odonto-médico-hospitalares",
        "codigo": "4618402"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de jornais, revistas e outras publicações",
        "codigo": "4618403"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de madeira, material de construção e ferragens",
        "codigo": "4613300"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de matérias-primas agrícolas e animais vivos",
        "codigo": "4611700"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de medicamentos, cosméticos e produtos de perfumaria",
        "codigo": "4618401"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de mercadorias em geral não especializado",
        "codigo": "4619200"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de motocicletas e motonetas, peças e acessórios",
        "codigo": "4542101"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de máquinas, equipamentos, embarcações e aeronaves",
        "codigo": "4614100"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de peças e acessórios novos e usados para veículos automotores",
        "codigo": "4530706"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de produtos alimentícios, bebidas e fumo",
        "codigo": "4617600"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de têxteis, vestuário, calçados e artigos de viagem",
        "codigo": "4616800"
    },
    {
        "descricao": "Representantes comerciais e agentes do comércio de veículos automotores",
        "codigo": "4512901"
    },
    {
        "descricao": "Restaurantes e similares",
        "codigo": "5611201"
    },
    {
        "descricao": "Restauração de obras de arte",
        "codigo": "9002702"
    },
    {
        "descricao": "Restauração e conservação de lugares e prédios históricos",
        "codigo": "9102302"
    },
    {
        "descricao": "Salas de acesso à internet",
        "codigo": "8299707"
    },
    {
        "descricao": "Serviço de laboratório óptico",
        "codigo": "3250709"
    },
    {
        "descricao": "Serviço de laboratório óptico",
        "codigo": "3250709"
    },
    {
        "descricao": "Serviço de manejo de animais",
        "codigo": "162803"
    },
    {
        "descricao": "Serviço de preparação de terreno, cultivo e colheita",
        "codigo": "161003"
    },
    {
        "descricao": "Serviços advocatícios",
        "codigo": "6911701"
    },
    {
        "descricao": "Serviços combinados de escritório e apoio administrativo",
        "codigo": "8211300"
    },
    {
        "descricao": "Serviços de adestramento de cães de guarda",
        "codigo": "8011102"
    },
    {
        "descricao": "Serviços de agronomia e de consultoria às atividades agrícolas e pecuárias",
        "codigo": "7490103"
    },
    {
        "descricao": "Serviços de alimentação para eventos e recepções – bufê",
        "codigo": "5620102"
    },
    {
        "descricao": "Serviços de alimentação para eventos e recepções – bufê",
        "codigo": "5620102"
    },
    {
        "descricao": "Serviços de alinhamento e balanceamento de veículos automotores",
        "codigo": "4520004"
    },
    {
        "descricao": "Serviços de arquitetura",
        "codigo": "7111100"
    },
    {
        "descricao": "Serviços de bancos de células e tecidos humanos",
        "codigo": "8640214"
    },
    {
        "descricao": "Serviços de borracharia para veículos automotores",
        "codigo": "4520006"
    },
    {
        "descricao": "Serviços de capotaria",
        "codigo": "4520008"
    },
    {
        "descricao": "Serviços de cartografia, topografia e geodésia",
        "codigo": "7119701"
    },
    {
        "descricao": "Serviços de desenho técnico relacionados à arquitetura e engenharia",
        "codigo": "7119703"
    },
    {
        "descricao": "Serviços de diagnóstico por imagem com uso de radiação ionizante, exceto tomografia",
        "codigo": "8640205"
    },
    {
        "descricao": "Serviços de diagnóstico por imagem com uso de radiação ionizante, exceto tomografia",
        "codigo": "8640205"
    },
    {
        "descricao": "Serviços de diagnóstico por imagem sem uso de radiação ionizante, exceto ressonância magnética",
        "codigo": "8640207"
    },
    {
        "descricao": "Serviços de diagnóstico por imagem sem uso de radiação ionizante, exceto ressonância magnética",
        "codigo": "8640207"
    },
    {
        "descricao": "Serviços de diagnóstico por métodos ópticos – endoscopia e outros exames análogos",
        "codigo": "8640209"
    },
    {
        "descricao": "Serviços de diagnóstico por métodos ópticos – endoscopia e outros exames análogos",
        "codigo": "8640209"
    },
    {
        "descricao": "Serviços de diagnóstico por registro gráfico – ECG, EEG e outros exames análogos",
        "codigo": "8640208"
    },
    {
        "descricao": "Serviços de diagnóstico por registro gráfico – ECG, EEG e outros exames análogos",
        "codigo": "8640208"
    },
    {
        "descricao": "Serviços de diálise e nefrologia",
        "codigo": "8640203"
    },
    {
        "descricao": "Serviços de dublagem",
        "codigo": "5912001"
    },
    {
        "descricao": "Serviços de engenharia",
        "codigo": "7112000"
    },
    {
        "descricao": "Serviços de entrega rápida",
        "codigo": "5320202"
    },
    {
        "descricao": "Serviços de gravação de carimbos, exceto confecção",
        "codigo": "8299703"
    },
    {
        "descricao": "Serviços de hemoterapia",
        "codigo": "8640212"
    },
    {
        "descricao": "Serviços de instalação, manutenção e reparação de acessórios para veículos automotores",
        "codigo": "4520007"
    },
    {
        "descricao": "Serviços de lanternagem ou funilaria e pintura de veículos automotores",
        "codigo": "4520002"
    },
    {
        "descricao": "Serviços de lavagem, lubrificação e polimento de veículos automotores",
        "codigo": "4520005"
    },
    {
        "descricao": "Serviços de litotripsia",
        "codigo": "8640213"
    },
    {
        "descricao": "Serviços de malote não realizados pelo Correio Nacional",
        "codigo": "5320201"
    },
    {
        "descricao": "Serviços de manutenção e reparação elétrica de veículos automotores",
        "codigo": "4520003"
    },
    {
        "descricao": "Serviços de manutenção e reparação mecânica de veículos automotores",
        "codigo": "4520001"
    },
    {
        "descricao": "Serviços de microfilmagem",
        "codigo": "7420005"
    },
    {
        "descricao": "Serviços de mixagem sonora em produção audiovisual",
        "codigo": "5912002"
    },
    {
        "descricao": "Serviços de organização de feiras, congressos, exposições e festas",
        "codigo": "8230001"
    },
    {
        "descricao": "Serviços de perícia técnica relacionados à segurança do trabalho",
        "codigo": "7119704"
    },
    {
        "descricao": "Serviços de prótese dentária",
        "codigo": "3250706"
    },
    {
        "descricao": "Serviços de prótese dentária",
        "codigo": "3250706"
    },
    {
        "descricao": "Serviços de quimioterapia",
        "codigo": "8640210"
    },
    {
        "descricao": "Serviços de radioterapia",
        "codigo": "8640211"
    },
    {
        "descricao": "Serviços de remoção de pacientes, exceto os serviços móveis de atendimento a urgências",
        "codigo": "8622400"
    },
    {
        "descricao": "Serviços de reservas e outros serviços de turismo não especificados anteriormente",
        "codigo": "7990200"
    },
    {
        "descricao": "Serviços de ressonância magnética",
        "codigo": "8640206"
    },
    {
        "descricao": "Serviços de ressonância magnética",
        "codigo": "8640206"
    },
    {
        "descricao": "Serviços de tatuagem e colocação de piercing",
        "codigo": "9609206"
    },
    {
        "descricao": "Serviços de tomografia",
        "codigo": "8640204"
    },
    {
        "descricao": "Serviços de tomografia",
        "codigo": "8640204"
    },
    {
        "descricao": "Serviços de tradução, interpretação e similares",
        "codigo": "7490101"
    },
    {
        "descricao": "Serviços de vacinação e imunização humana",
        "codigo": "8630506"
    },
    {
        "descricao": "Serviços móveis de atendimento a urgências, exceto por UTI móvel",
        "codigo": "8621602"
    },
    {
        "descricao": "Suporte técnico, manutenção e outros serviços em tecnologia da informação",
        "codigo": "6209100"
    },
    {
        "descricao": "Suporte técnico, manutenção e outros serviços em tecnologia da informação",
        "codigo": "6209100"
    },
    {
        "descricao": "Tabacaria",
        "codigo": "4729601"
    },
    {
        "descricao": "Testes e análises técnicas",
        "codigo": "7120100"
    },
    {
        "descricao": "Tinturarias",
        "codigo": "9601702"
    },
    {
        "descricao": "Toalheiros",
        "codigo": "9601703"
    },
    {
        "descricao": "Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet",
        "codigo": "6311900"
    },
    {
        "descricao": "Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet",
        "codigo": "6311900"
    },
    {
        "descricao": "Tratamentos térmicos, acústicos ou de vibração",
        "codigo": "4329105"
    },
    {
        "descricao": "Treinamento em desenvolvimento profissional e gerencial",
        "codigo": "8599604"
    },
    {
        "descricao": "Treinamento em informática",
        "codigo": "8599603"
    },
    {
        "descricao": "UTI móvel",
        "codigo": "8621601"
    },
    {
        "descricao": "Web design",
        "codigo": "6201502"
    },
    {
        "descricao": "Web design",
        "codigo": "6201502"
    }
]