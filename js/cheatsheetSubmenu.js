// SUBMENU STICKY
const submenu = document.querySelector('.submenu-sticky');

// Si existe el submenú, ya que hay páginas que no lo tendrán
if(submenu){
  // Añadimos un eventListener del scroll
  addEventListener("scroll", () => {

    // Obtenermos la posición Y de la ventana que se ha salido de la ventana
    const currentScroll = window.pageYOffset;

    // Añadimos un estilo que añadirá una sombra al submenú.
    if(currentScroll > 170){
      submenu.classList.add("scrolled");
    }else{
      submenu.classList.remove("scrolled");
    }
  })
}