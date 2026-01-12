function renderizarGrafico() {
    const registros = JSON.parse(localStorage.getItem('pontos_estudo')) || [];
    const ctx = document.getElementById('studyChart').getContext('2d');
    
    // Agrupar horas por data (últimos 7 dias)
    const dadosAgrupados = {};
    registros.forEach(reg => {
        const horasStr = reg.total.split(':');
        const totalHoras = parseInt(horasStr[0]) + (parseInt(horasStr[1]) / 60);
        dadosAgrupados[reg.data] = (dadosAgrupados[reg.data] || 0) + totalHoras;
    });

    const labels = Object.keys(dadosAgrupados).slice(-7);
    const valores = Object.values(dadosAgrupados).slice(-7);

    if (window.meuGrafico) window.meuGrafico.destroy();

    window.meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Horas Estudadas',
                data: valores,
                backgroundColor: '#8338EC',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });
}

// Chama o gráfico sempre que a página carregar ou salvar novo registro
document.addEventListener('DOMContentLoaded', renderizarGrafico);
// Adicione 'renderizarGrafico()' dentro da sua função salvarRegistro() no script.js