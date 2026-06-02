document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("meuFormulario");
    const inputAnexo = document.getElementById("arquivo-anexo");
    const textoAnexo = document.getElementById("texto-anexo");
    const inputLinkOculto = document.getElementById("link_do_anexo");
    const btnEnviar = document.getElementById("btnEnviar");
    const msgSucesso = document.getElementById("mensagemSucesso");

    // LÓGICA 1: Monitorar o arquivo e fazer upload em segundo plano assim que selecionado
    inputAnexo.addEventListener("change", async (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        textoAnexo.textContent = "PROCESSANDO ARQUIVO...";
        textoAnexo.style.color = "#00ffff"; // Cor Aqua de processamento

        // Criando os dados para enviar ao servidor temporário gratuito (file.io)
        const formDataAnexo = new FormData();
        formDataAnexo.append("file", arquivo);

        try {
            // Faz o upload anônimo e super rápido do arquivo
            const respostaUpload = await fetch("https://file.io/?expires=1w", {
                method: "POST",
                body: formDataAnexo
            });
            
            const resultado = await respostaUpload.json();

            if (resultado.success) {
                // Guarda o link gerado no nosso input oculto do formulário
                inputLinkOculto.value = resultado.link;
                textoAnexo.textContent = `✔ ${arquivo.name} PRONTO!`;
                textoAnexo.style.color = "#22c55e"; // Verde de sucesso
            } else {
                throw new Error();
            }
        } catch (erro) {
            textoAnexo.textContent = "Erro ao processar anexo. Tente outro.";
            textoAnexo.style.color = "#ef4444";
            inputAnexo.value = ""; // Limpa o campo
        }
    });

    // LÓGICA 2: Interceptar o envio do Formspree, exibir sucesso e apagar dados locais
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        // Variáveis temporárias na memória volátil (Serão limpas logo em seguida)
        const nomeTemp = document.getElementById("nome").value;
        const emailTemp = document.getElementById("email").value;
        const msgTemp = document.getElementById("mensagem").value;
        const linkAnexoTemp = inputLinkOculto.value;

        btnEnviar.disabled = true;
        btnEnviar.textContent = "TRANSMITINDO DADOS...";

        const dadosFormspree = new FormData(formulario);

        try {
            const respostaFormspree = await fetch(formulario.action, {
                method: formulario.method,
                body: dadosFormspree,
                headers: { 'Accept': 'application/json' }
            });

            if (respostaFormspree.ok) {
                // LIMPEZA ABSOLUTA DE DADOS: Apaga tudo do site para não acumular memória
                formulario.reset();
                inputLinkOculto.value = "";
                textoAnexo.textContent = "Anexar imagem ou arquivo";
                textoAnexo.style.color = "#ff77ff";

                // Exibe feedback visual
                msgSucesso.style.display = "block";
                setTimeout(() => { msgSucesso.style.display = "none"; }, 6000);
            } else {
                alert("Falha na transmissão do Formspree. Verifique o ID do formulário.");
            }
        } catch (erro) {
            alert("Erro de rede. Verifique sua conexão.");
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = "ENVIAR TRANSMISSÃO";
        }
    });
});