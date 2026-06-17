document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("meuFormulario");
    const inputAnexo = document.getElementById("arquivo-anexo");
    const textoAnexo = document.getElementById("texto-anexo");
    const inputLinkOculto = document.getElementById("link_do_anexo");
    const btnEnviar = document.getElementById("btnEnviar");
    const msgSucesso = document.getElementById("mensagemSucesso");

    // Garantir que o script só corre se o formulário existir na página
    if (!formulario) return;

    // LÓGICA 1: Monitorizar o ficheiro e fazer upload via tmpfiles.org (Livre de CORS local)
    inputAnexo.addEventListener("change", async (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        textoAnexo.textContent = "PROCESSANDO ARQUIVO...";
        textoAnexo.style.color = "#00ffff"; 

        const formDataAnexo = new FormData();
        formDataAnexo.append("file", arquivo);

        try {
            // Faz o upload para uma API que não bloqueia o teu Live Server local
            const respostaUpload = await fetch("https://tmpfiles.org/api/v1/upload", {
                method: "POST",
                body: formDataAnexo
            });
            
            if (!respostaUpload.ok) throw new Error();
            
            const resultado = await respostaUpload.json();

            // Guarda o link web do arquivo gerado no input invisible
            if (resultado.data && resultado.data.url) {
                inputLinkOculto.value = resultado.data.url;
                textoAnexo.textContent = `✔ ${arquivo.name} PRONTO!`;
                textoAnexo.style.color = "#22c55e"; // Verde de sucesso
            } else {
                throw new Error();
            }
        } catch (erro) {
            console.error("Erro no upload:", erro);
            textoAnexo.textContent = "Erro ao processar anexo. Tente outro.";
            textoAnexo.style.color = "#ef4444";
            inputAnexo.value = ""; 
            inputLinkOculto.value = "";
        }
    });

    // LÓGICA 2: Envio para o Formspree e Destruição imediata dos dados locais
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        // Armazenamento estrito em variáveis voláteis (temporárias) na memória
        const nomeTemp = document.getElementById("nome").value;
        const emailTemp = document.getElementById("email").value;
        const msgTemp = document.getElementById("mensagem").value;
        const linkAnexoTemp = inputLinkOculto.value;

        // Proteção: Desabilita o botão usando o ID correto para evitar o erro de 'properties of null'
        if (btnEnviar) {
            btnEnviar.disabled = true;
            btnEnviar.textContent = "TRANSMITINDO DADOS...";
        }

        const dadosFormspree = new FormData(formulario);

        try {
            const respostaFormspree = await fetch(formulario.action, {
                method: formulario.method,
                body: dadosFormspree,
                headers: { 'Accept': 'application/json' }
            });

            if (respostaFormspree.ok) {
                // SUCESSO: Apaga tudo instantaneamente para evitar acúmulo de dados na página
                formulario.reset();
                if (inputLinkOculto) inputLinkOculto.value = "";
                if (textoAnexo) {
                    textoAnexo.textContent = "Anexar imagem ou arquivo";
                    textoAnexo.style.color = "#ff77ff";
                }

                // Alerta HUD de sucesso na tela
                if (msgSucesso) {
                    msgSucesso.style.display = "block";
                    setTimeout(() => { msgSucesso.style.display = "none"; }, 6000);
                }
            } else {
                alert("Falha no Formspree. Certifica-te que adicionaste o teu ID no 'action' do HTML.");
            }
        } catch (erro) {
            alert("Erro de rede. Verifica a tua ligação.");
        } finally {
            if (btnEnviar) {
                btnEnviar.disabled = false;
                btnEnviar.textContent = "ENVIAR TRANSMISSÃO";
            }
        }
    });
});