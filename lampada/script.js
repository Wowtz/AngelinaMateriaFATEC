const lamp      = document.getElementById('lamp');
const bulb      = document.getElementById('bulb');
const filamento = document.getElementById('filamento');
const glowEl    = document.getElementById('glowEl');
const statusEl  = document.getElementById('status');

let piscarInterval = null;
let efeitoTimeout  = null;

function setStatus(msg) {
  statusEl.textContent = msg;
}

function setLuz(on) {
  bulb.setAttribute('fill',   on ? '#ffe066' : '#3a3a3a');
  bulb.setAttribute('stroke', on ? '#f5a800' : '#555');
  filamento.setAttribute('stroke', on ? '#fff' : '#666');
  glowEl.setAttribute('opacity', on ? '1' : '0');
}

function clearPiscar() {
  if (piscarInterval) { clearInterval(piscarInterval); piscarInterval = null; }
}

function clearEfeito() {
  if (efeitoTimeout) { clearTimeout(efeitoTimeout); efeitoTimeout = null; }
  lamp.style.transform = 'scale(1)';
  lamp.style.filter = 'none';
}

function aparecer() {
  clearPiscar(); clearEfeito();
  lamp.style.transition = 'opacity 0.6s, transform 0.6s';
  lamp.style.opacity = '1';
  lamp.style.transform = 'scale(1)';
  setStatus('A lâmpada apareceu.');
}

function sumir() {
  clearPiscar(); clearEfeito();
  setLuz(false);
  lamp.style.transition = 'opacity 0.5s, transform 0.5s';
  lamp.style.opacity = '0';
  lamp.style.transform = 'scale(0.4)';
  setStatus('A lâmpada sumiu.');
}

function apagar() {
  clearPiscar(); clearEfeito();
  setLuz(false);
  setStatus('Lâmpada apagada.');
}

function acender() {
  clearPiscar(); clearEfeito();
  lamp.style.transition = 'opacity 0.4s, transform 0.4s';
  lamp.style.opacity = '1';
  lamp.style.transform = 'scale(1)';
  setLuz(true);
  setStatus('Lâmpada acesa!');
}

function piscar() {
  clearPiscar(); clearEfeito();
  lamp.style.opacity = '1';
  lamp.style.transform = 'scale(1)';
  let estado = true;
  setLuz(true);
  piscarInterval = setInterval(() => {
    estado = !estado;
    setLuz(estado);
  }, 400);
  setStatus('Piscando...');
}

function pararPiscar() {
  clearPiscar();
  setLuz(true);
  setStatus('Parou de piscar. Lâmpada acesa.');
}

function efeito() {
  clearPiscar(); clearEfeito();
  lamp.style.transition = 'none';
  lamp.style.opacity = '1';
  lamp.style.transform = 'scale(1)';
  setStatus('✦ Efeito especial!');

  const cores = ['#ffe066', '#ff6b6b', '#6bcbff', '#a8ff78', '#f9a8d4', '#c084fc', '#ffe066'];
  let i = 0;

  function ciclo() {
    const cor = cores[i % cores.length];
    bulb.setAttribute('fill', cor);
    bulb.setAttribute('stroke', cor);
    filamento.setAttribute('stroke', '#fff');
    glowEl.setAttribute('opacity', '1');

    const angulo = i % 2 === 0 ? '5deg' : '-5deg';
    const escala = 1 + (i % 3 === 0 ? 0.08 : 0.04);
    lamp.style.transform = `scale(${escala}) rotate(${angulo})`;

    i++;
    efeitoTimeout = setTimeout(() => {
      if (i < 21) {
        ciclo();
      } else {
        lamp.style.transform = 'scale(1)';
        setLuz(true);
        setStatus('Que show! ✦');
      }
    }, 110);
  }

  ciclo();
}

// começa escondida
lamp.style.opacity = '0';
lamp.style.transform = 'scale(0.4)';
