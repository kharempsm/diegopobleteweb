document.addEventListener("DOMContentLoaded", (event) => {
  let button = document.querySelector(".layout__menu-toggle");
  let icon_bars = document.querySelector(".layout__menu-toggle .fa-bars");
  let icon_xmark = document.querySelector(".layout__menu-toggle .fa-xmark");
  let aside = document.querySelector(".layout__aside");

  button.addEventListener("click", (event) => {
    let visible = document.querySelector(".layout__aside--visible");
    if (!visible) {
      aside.classList.add("layout__aside--visible");
      icon_bars.style.opacity = 0;
      icon_xmark.style.opacity = 1;
    } else {
      aside.classList.remove("layout__aside--visible");
      icon_bars.style.opacity = 1;
      icon_xmark.style.opacity = 0;
    }
  });

  window.addEventListener("resize", () => {
    let size = parseInt(document.body.clientWidth);

    if (size <= 1060) {
      aside.classList.remove("layout__aside--visible");
      icon_bars.style.opacity = 1;
      icon_xmark.style.opacity = 0;
    }
  });
});

const messages = [
  `<div>
    <p>Hey there 👋</p>
    <br>
    <p>I'm here to help you with any questions or concerns you may have.😊</p>
  </div>`,
  
  `<div>
    <p>¡Hola! tienes alguna consulta?</p>
    <br>
    <p>¿Cómo puedo ayudarte? 😊</p>
  </div>`,

  `<div>
    <p>مرحبًا 👋</p>
    <br>
    <p>أنا هنا للمساعدة في أي أسئلة أو استفسارات قد تكون لديك.😊</p>
  </div>`,

  `<div>
    <p>안녕하세요 👋</p>
    <br>
    <p>궁금한 점이나 걱정되는 부분이 있으면 도와드리겠습니다.😊</p>
  </div>`,
];

let currentMessageIndex = 0;

// Función para actualizar el mensaje
function updateMessage() {
  const messageElement = document.querySelector(
    ".ChatLayout__MessageContent-sc-ub8sor-7 .ChatLayout__Text-sc-ub8sor-8"
  );

  // Verificar si el mensaje ya existe
  if (messageElement) {
    const currentText = messageElement.innerHTML.trim();

    // Solo actualizamos si el mensaje actual es diferente
    if (currentText !== messages[currentMessageIndex]) {
      messageElement.innerHTML = messages[currentMessageIndex];
      currentMessageIndex = (currentMessageIndex + 1) % messages.length; // Cambia al siguiente mensaje
    }
  } else {
    // Si no existe el mensaje, lo creamos
    const chatContainer = document.querySelector(".ChatLayout__MessageContainer-sc-ub8sor-4");
    if (chatContainer) {
      const newMessageElement = document.createElement("div");
      newMessageElement.classList.add("ChatLayout__MessageContent-sc-ub8sor-7", "qVqIO");
      newMessageElement.innerHTML = `<div class="ChatLayout__MessageGroup-sc-ub8sor-10 bAgvJV">
                                       <div class="ChatLayout__Text-sc-ub8sor-8 izDmXy">
                                         ${messages[currentMessageIndex]}
                                       </div>
                                     </div>`;
      chatContainer.appendChild(newMessageElement);
      currentMessageIndex = (currentMessageIndex + 1) % messages.length; // Cambia al siguiente mensaje
    }
  }
}

// Cambia el mensaje cada 4 segundos
setInterval(updateMessage, 4000);

// Inicializa con el primer mensaje
updateMessage();


//IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      const delay = index * 0.2; // Ajusta el valor para controlar el delay
      setTimeout(() => {
        entry.target.classList.add('show');
      }, delay * 800);
    } else {
      entry.target.classList.remove('show');
    }
  });
});


const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));