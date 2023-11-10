document.addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    document.querySelector("#load-iframe-map").innerHTML = `<iframe
  class="contact__iframe"
  frameborder="0"
  scrolling="no"
  marginheight="0"
  marginwidth="0"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106522.03309842512!2d-70.74011041640073!3d-33.4541642470788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5410425af2f%3A0x8475d53c400f0931!2sSantiago%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1698779619204!5m2!1ses!2scl"
></iframe>`;
  }, 500);
});
