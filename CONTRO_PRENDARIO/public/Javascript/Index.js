// Codigo JS para el Sidebar---------------------------------------------------------------------------
$(document).ready(function() {
    // Agrega o elimina la clase 'active' al hacer clic en un elemento 'li'
    $(".menu > ul > li ").on("click", function(e) {
        // agrega la clase al elemento seleccionado
        $(this).toggleClass("active");
        // quita la clase a los elementos hermanos
        $(this).siblings().removeClass("active");
        // abre los sub-menu existentes
        $(this).find("ul").slideToggle();
        // remueve la clase active cuando se seleccione un sub-menu
        $(this).siblings.find("ul").find(li).removeClass("active");
       
    });
});


// Seleccionamos el elemento al que queremos agregar la clase
const sidebar = document.querySelector('.sidebar');

// Función que verifica el tamaño de la pantalla
function verificarPantalla() {
    if (window.matchMedia("(max-width: 700px)").matches) {
        // Si la pantalla es menor a 550px, agregamos la clase
        sidebar.classList.add('noactive');
        console.log('Clase pantalla-pequena agregada'); // Para depuración
    } else {
        // Si la pantalla es mayor a 550px, removemos la clase
        sidebar.classList.remove('noactive');
        console.log('Clase pantalla-pequena removida'); // Para depuración
    }
}

// Ejecutamos la función al cargar la página
verificarPantalla();

// Escuchamos los cambios en el tamaño de la ventana
window.addEventListener('resize', verificarPantalla);

$(document).ready(function() {
    // Agrega o elimina la clase 'active' al hacer clic en un elemento 'li'
    $(".list-icon").on("click", function(e) {
        // agrega la clase al elemento seleccionado
        $(sidebar).toggleClass("noactive");

        // remueve la clase active cuando se seleccione un sub-menu
        $(this).siblings.find("ul").find(li).removeClass("active");
       
    });
});





