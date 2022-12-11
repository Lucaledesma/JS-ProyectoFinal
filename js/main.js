// Hacer en el contenedor de carritos (contenedor.innerHTML == "") para que a no se muestre el contenedor

const carritoBoton = document.querySelector("#boton-carrito");
const carritoMain = document.querySelector("#main-carrito");
const cerrarCarritoBoton = document.querySelector("#cerrar-carrito");

const botonesCategorias = document.querySelectorAll(".cat");
const tituloPrincipal = document.querySelector("#titulo-principal");

const contenedorProductos = document.querySelector("#main-productos");
const cantidad = document.querySelector("#cantidad-productos");
let botonesAgregar = document.querySelectorAll(".producto-agregar");

const carritoProductos = document.querySelector("#carrito-productos");
const botonVaciar = document.querySelector("#vaciar-carrito");

const contenedorTotal = document.querySelector("#total");

/* Cargar Productos del JSON*/
/*fetch("./js/productos.json")
    .then ( response => response.json())
    .then ( data => {
        mostrarProductos(data);
    })
    .catch (err => {
        console.log(err);
    });*/

const pedirProductos = async () => {
    const resp = await fetch ("./js/productos.json");
    let productos = await resp.json();
    return productos;
}

let productos = pedirProductos();

productos
.then( productos => {
    mostrarProductos(productos);
    cargarBotonesCategorias(productos);
});

let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-carrito");

if (productosEnCarritoLS){
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarCantidad();
    mostrarProductosCarrito(productosEnCarrito);
} else{
    productosEnCarrito = [];
}

function cargarBotonesCategorias(productos) {
    botonesCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {
    
            botonesCategorias.forEach(boton => boton.classList.remove("active"));
            e.currentTarget.classList.add("active");
    
            if (e.currentTarget.id != "todos") {
                const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
                tituloPrincipal.textContent = productoCategoria.categoria.nombre;
                const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
                mostrarProductos(productosBoton);
            } else {
                tituloPrincipal.textContent = "Todos los productos";
                mostrarProductos(productos);
            }
    
        })
    });
}

/* Abrir y Cerrar Carrito */
carritoBoton.addEventListener("click", abrirCarrito);
cerrarCarritoBoton.addEventListener("click", cerrarCarrito);

function abrirCarrito () {
    carritoBoton.classList.add("disabled");
    carritoMain.classList.remove("disabled");

    confirmarFaltaDeProductos();
}
    
function cerrarCarrito () {
    carritoBoton.classList.remove("disabled");
    carritoMain.classList.add("disabled");
}

function mostrarProductos (productos) {

    contenedorProductos.innerHTML = "";

    productos.forEach( producto => {

        const div = document.createElement("div");

        div.classList.add("producto");
        div.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.titulo}">
          <div class="producto-descripcion">
              <p><b>${producto.titulo}</b></p>
              <p>$${producto.precio}</p>
              <button class="producto-agregar" id="${producto.id}">AGREGAR</button>
          </div>
        `;

        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}

function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProductoCarrito);
    });
}

function agregarProductoCarrito(e){
        
    const idBoton = e.currentTarget.id;

    let productos = pedirProductos();
    productos
    .then( productos => {
        const productoAgregar = productos.find(producto => producto.id == idBoton);

        if (productosEnCarrito.some(producto => producto.id == idBoton)){
            const indexProducto = productosEnCarrito.findIndex(producto => producto.id == idBoton);
            productosEnCarrito[indexProducto].cantidad += 1;
        } else{
            productoAgregar.cantidad = 1;
            productosEnCarrito.push(productoAgregar);
        }

        actualizarCantidad();

        localStorage.setItem("productos-carrito", JSON.stringify(productosEnCarrito));

        productosEnCarritoLS = localStorage.getItem("productos-carrito");
        productosEnCarrito = JSON.parse(productosEnCarritoLS);

        mostrarProductosCarrito(productosEnCarrito);

    });

    Toastify({
        text: "Producto Agregado",
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#27292b",
          color: "#fee801",
          fontSize: ".7rem",
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

function actualizarCantidad(){
    let num = productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad , 0);
    cantidad.innerText = num;
}

function mostrarProductosCarrito(productos) {

    carritoProductos.innerHTML = "";

    productos.forEach( producto => {

        const div = document.createElement("div");

        div.classList.add("producto-agregado");
        div.innerHTML = `
          <div class="producto-img"><img src="${producto.imagen}" alt="${producto.titulo}"></div>
          <div class="producto-nombre">${producto.titulo}</div>
          <div class="producto-cantidad">${producto.cantidad}</div>
          <div class="producto-precio">$${producto.precio}</div>
          <div class="producto-borrar" id="${producto.id}"><i class="bi bi-trash-fill"></i></div>
        `;

        carritoProductos.append(div);
    });

    actualizarBotonesEliminar();
    actualizarTotal();
}

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".producto-borrar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    mostrarProductosCarrito(productosEnCarrito);

    localStorage.setItem("productos-carrito", JSON.stringify(productosEnCarrito));

    confirmarFaltaDeProductos();
    actualizarCantidad();

    Toastify({
        text: "Producto Eliminado",
        duration: 1500,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#27292b",
          color: "#fee801",
          fontSize: ".7rem",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    
}

botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {

    if(cantidad.innerText != 0){
        swal.fire({
            title: '¿Deseas vaciar el carrito?',
            text: `Tenés ${cantidad.innerText} ${cantidad.innerText > 1 ? "productos" : "producto"} en el carrito.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            background: '#fee801',
            confirmButtonColor: '#27292b',
            color: '#27292b', 
            iconColor: 'red',
            reverseButtons: true,
        }).then(result => {
            if(result.isConfirmed){
                Swal.fire({
                    text: `Carrito vacio! Se eliminaron ${cantidad.innerText} producto/s.`,
                    icon: 'success',
                    background: '#fee801',
                    color: '#27292b',
                    iconColor: 'green',
                    confirmButtonColor: '#27292b',
                })
    
                productosEnCarrito.length = 0;
                localStorage.setItem("productos-carrito", JSON.stringify(productosEnCarrito));
                mostrarProductosCarrito(productosEnCarrito);
    
                confirmarFaltaDeProductos();
                actualizarCantidad();
            }
        })
    } else {
        swal.fire({
            text: `No tenes productos en el carrito`,
            icon: 'error',
            confirmButtonText: 'Ok',
            background: '#fee801',
            confirmButtonColor: '#27292b',
            color: '#27292b', 
            iconColor: 'red',
        });
    }

}

function actualizarTotal(){
    const totalCalculado =  productosEnCarrito.reduce((acumulador, producto) => acumulador + (producto.precio * producto.cantidad), 0);
    contenedorTotal.textContent = `$${totalCalculado}`;
}

function confirmarFaltaDeProductos(){
    if(carritoProductos.innerHTML == "" || carritoProductos.innerHTML == null) {
        const p = document.createElement("p");
        p.textContent = "No hay Productos";
        carritoProductos.append(p); 
    }
};