// variables

const carrito = document.querySelector('#carrito');
      contenedorCarrito = document.querySelector('#lista-carrito tbody');
      vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
      listaCursos = document.querySelector('#lista-cursos');

let articulosCarrito = [];


cargarEventListeners();

function cargarEventListeners(){
    
    // cuando agregas un curso al agregar al carrito
    listaCursos.addEventListener('click',agregarCurso);

    //elimina cursos del carrito
    carrito.addEventListener('click',eliminarCurso)

    // cargar los cursos del local storage
    document.addEventListener('DOMContentLoaded',() => {
        articulosCarrito=JSON.parse(localStorage.getItem('carrito') || '[]');
        carritoHTML()
    })
    

    // vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        limpiarHTML();
    })

}


// funciones
function agregarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado)
    }
}

function leerDatosCurso(curso){

    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad:1
    }

    // revisar si ya existe
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if( existe ) {
        // actualizamos cantidad
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad ++;
                
                // actualiza el precio
                const moneda = infoCurso.precio.slice(0,1);
                const precio = infoCurso.precio.slice(1,3);

                curso.precio = precio * curso.cantidad;
                curso.precio += moneda;
                curso.precio = curso.precio.split('');
                curso.precio.unshift(moneda);
                curso.precio.pop();
                curso.precio = curso.precio.join('');
                
                return curso; // devuelve objeto actualizado
            } else {
                return curso; // retorna los demas objetos
            }
        })

        articulosCarrito = [...cursos];
    }else {

        articulosCarrito = [...articulosCarrito,infoCurso];
        
    }


    carritoHTML();
   
}

// elimina un curso del carrito
function eliminarCurso (e) {
    
   
    if( e.target.classList.contains('borrar-curso') ) {
        const cursoId = e.target.getAttribute('data-id');

        // elimina del arreglo de articulosCarrito por el data-id

        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);

        carritoHTML()
    }

}


// Muestra el carrito de compras en el html
function carritoHTML(){

    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el gtml
    articulosCarrito.forEach( (curso) => {
        const row = document.createElement('tr');
        const {imagen,titulo, precio, cantidad, id} = curso;
        row.innerHTML = `

            <td>
                <img src="${imagen}" width="100">
            </td>

            <td>
                ${titulo}
            </td>

            <td>
                ${precio}
            </td>

            <td>
                ${cantidad}
            </td>

            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>



        `;

        // Agregar el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    })
    sincronizarStorage();
}


// localstorage
function sincronizarStorage(){
    localStorage.setItem('carrito',JSON.stringify(articulosCarrito));
}

// elimina los cursos del tbody

function limpiarHTML(){
    // contenedorCarrito.innerHTML = '';

    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}