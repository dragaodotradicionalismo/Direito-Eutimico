const USUARIO = "dragaodotradicionalismo";
const REPOSITORIO = "Direito-Eutimico";

const RAIZ = "Direito Eutímico";

async function consultarGitHub(caminho) {
    const url =
        `https://api.github.com/repos/${USUARIO}/${REPOSITORIO}/contents/${encodeURIComponent(caminho)}`;

    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro do GitHub: ${resposta.status}`);
    }

    return await resposta.json();
}

async function mostrarPasta(caminho, titulo) {
    const conteudo = document.getElementById("conteudo");

    conteudo.innerHTML = "<p>Carregando...</p>";

    try {
        const itens = await consultarGitHub(caminho);

        itens.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === "dir" ? -1 : 1;
            }

            return a.name.localeCompare(b.name, "pt-BR", {
                numeric: true
            });
        });

        conteudo.innerHTML = "";

        const tituloElemento = document.createElement("h2");
        tituloElemento.textContent = titulo;
        conteudo.appendChild(tituloElemento);

        for (const item of itens) {

            const div = document.createElement("div");
            div.className = "item";

            const link = document.createElement("a");
            link.href = "#";
            link.textContent = item.name;

            if (item.type === "dir") {

                link.className = "pasta";

                link.onclick = function () {
                    mostrarPasta(item.path, item.name);
                };

            } else {

                link.onclick = function () {
                    window.open(item.html_url, "_blank");
                };
            }

            div.appendChild(link);
            conteudo.appendChild(div);
        }

    } catch (erro) {

        conteudo.innerHTML =
            "<p>Não foi possível carregar o acervo.</p>";

        console.error(erro);
    }
}

function mostrarInicio() {
    mostrarPasta(RAIZ, "Direito Eutímico");
}

mostrarInicio();