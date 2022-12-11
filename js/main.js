const carritoBoton = document.querySelector("#boton-carrito");
const carritoMain = document.querySelector("#main-carrito");
const cerrarCarritoBoton = document.querySelector("#cerrar-carrito");

const contenedorProductos = document.querySelector("#main-productos");
const cantidad = document.querySelector("#cantidad-productos");
let botonesAgregar = document.querySelectorAll(".producto-agregar");

const carritoProductos = document.querySelector("#carrito-productos");

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

if (cantidad.outerText === "0") {
    const p = document.createElement("p");
    p.textContent = "No hay productos";
    carritoProductos.append(p);

} 

/* Abrir y Cerrar Carrito */
carritoBoton.addEventListener("click", abrirCarrito);
cerrarCarritoBoton.addEventListener("click", cerrarCarrito);

function abrirCarrito () {
    carritoBoton.classList.add("disabled");
    carritoMain.classList.remove("disabled");
}
    
function cerrarCarrito () {
    carritoBoton.classList.remove("disabled");
    carritoMain.classList.add("disabled");
}

function mostrarProductos (productos) {

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
    console.log(idBoton);

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

}


/*const productos = [
    {
        id: 1,
        nombre: "Battlefield 2042",
        precio: 1100,
        img: "./img/productos/01.jpg"
    },
    {
        id: 2,
        nombre: "DOOM Eternal",
        precio: 1200,
        img: "./img/productos/02.jpg"
    },
    {
        id: 3,
        nombre: "RDR 2",
        precio: 1300,
        img: "./img/productos/03.jpg"
    },
    {
        id: 4,
        nombre: "Fifa 23",
        precio: 1400,
        img: "./img/productos/04.jpg"
    },
    {
        id: 5,
        nombre: "GOW Ragnarok",
        precio: 1500,
        img: "./img/productos/05.jpg"
    },
    {
        id: 6,
        nombre: "COD MW2",
        precio: 1600,
        img: "./img/productos/06.jpg"
    },
    {
        id: 7,
        nombre: "A Way Out",
        precio: 1700,
        img: "./img/productos/07.jpg"
    },
    {
        id: 8,
        nombre: "Elder Ring",
        precio: 1800,
        img: "./img/productos/08.jpg"
    },
]

const carritoProductos = document.querySelector("#productos");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const cantidad = document.querySelector("#cantidad-productos");

cargarProductos(productos);*/

/***** FUNCIONES *****/
/*function cargarProductos(productos) {

    carritoProductos.innerHTML = "";

    productos.forEach( producto => {

        const item = document.createElement("div");
        item.classList.add("item-carrito");
        item.innerHTML += `
            <img src="${producto.img}" alt="${producto.nombre}">
            <div class="descripcion">
            <p><b>${producto.nombre}</b></p>
            <p>$${producto.precio}</p>
            <button class="producto-agregar" id="${producto.id}">AGREGAR</button>
            </div>`;

        carritoProductos.append(item);

    });

    actualizarBotonesAgregar();

}

let productosEnCarrito;
const productosEnCarritoLS = localStorage.getItem("productos-carrito");

if (productosEnCarritoLS){
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarCantidad();
} else{
    productosEnCarrito = [];
}

function agregarProductoCarrito(e){
        
    const idBoton = e.currentTarget.id;
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
}

function actualizarCantidad(){
    let num = productosEnCarrito.reduce((acumulador, producto) => acumulador + producto.cantidad , 0);
    cantidad.innerText = num;
}

function actualizarBotonesAgregar(){

    botonesAgregar = document.querySelectorAll(".producto-agregar");
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarProductoCarrito);
    });

}*/