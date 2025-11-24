

function Calcular(){
    let div = document.querySelector('div');
    let valorProd = parseFloat(prompt(`Digite uma distancia em metros(m)`));
    

    let km = Number(valorProd / 1000);
    let hm = Number(valorProd / 100);
    let dam = Number(valorProd / 10);
    let dm = Number(valorProd * 10);
    let cm = Number(valorProd * 100);
    let mm = Number(valorProd * 1000);
    
    const titulo = document.createElement('h1');
    const ul = document.createElement('ul');
    const li = document.createElement('li');


    titulo.textContent = `A distancia de ${valorProd} metros, corresponde a..`;
    div.innerHTML = '';
    div.append(titulo, ul);
    ul.appendChild(li);

    li.innerHTML = `<li>${km} quilômetros (Km)</li>
    <li>${hm} hectômetros (Hm)</li>
    <li>${dam} decâmetros (Dam)</li>
    <li>${dm} decímetros (dm)</li>
    <li>${cm} centímetros (cm)</li>
    <li>${mm} milímetros (mm)</li>`;
}