class Productos {
constructor(name, id, type, price, stock, description) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.price = price;
    this.stock = stock;
    this.description = description;
}

static createProduct(name, id, type, price, stock, description) {
    return new Productos(name, id, type, price, stock, description);
}
}

const productosbase = {};

function addProduct(name, id, type, price, stock, description) {
const product = Productos.createProduct(name, id, type, price, stock, description);
productosbase[id] = product;
}

addProduct("cuentos de mi planeta", "001", "Cuento para niños", 2000, 10, "200 paginas, dibujos, tapa dura");
addProduct("cuentos para joaquin", "002", "Cuento para adultos", 2500, 10, "250 paginas, dibujos, tapa dura");
addProduct("cuentos de la abuela mechi", "003", "Cuento para niños", 2000, 10, "200 paginas, dibujos, tapa dura");

const productos = JSON.parse(localStorage.getItem("productos")) || [];
let carrito = JSON.parse(localStorage.getItem("carritos")) || [];
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

const agregarProducto = ({ name, id, type, price, stock, description }) => {
if (productos.some((prod) => prod.id === id)) {
    console.warn("Ya existe un producto con ese id");
} else {
    const productoNuevo = new Productos(name, id, type, price, stock, description);
    productos.push(productoNuevo);
    localStorage.setItem("productos", JSON.stringify(productos));
}
};

const productosPreexistentes = () => {
if (productos.length === 0) {
    Object.values(productosbase).forEach((prod) => {
    let dato = JSON.parse(JSON.stringify(prod));
    agregarProducto(dato);
    });
}
};

const totalCarrito = ()=>{
    let total = carrito.reduce((acumulador, {price, quantity})=>{
        return acumulador + (price*quantity)
    }, 0)
    return total
}

const totalCarritoRender = () => {
    const carritoTotal = document.getElementById("carritoTotal");
    const totalPrice = totalCarrito(); 
    carritoTotal.innerHTML = `Precio total: $${totalPrice.toFixed(2)}`; 
};

const agregarCarrito = (objetoCarrito) => {
    carrito.push(objetoCarrito);
    totalCarritoRender(); // update the HTML display with the new total price
};
const renderizarCarrito = () => {
    const listaCarrito = document.getElementById("listaCarrito");
    listaCarrito.innerHTML = "";

    carrito.forEach((elemento) => {
        const elementoLista = crearElementoLista(elemento);
        listaCarrito.appendChild(elementoLista);
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));
};
const crearElementoLista = (elemento) => {
    const elementoLista = document.createElement("li");
    elementoLista.textContent = `Producto: ${elemento.name} -- P/u: ${elemento.price} -- Cant.: ${elemento.quantity}`;
    const botonBorrar = document.createElement("button");
    botonBorrar.textContent = "X";
    botonBorrar.addEventListener("click", () => {
    eliminarElementoCarrito(elemento.id);
    });
    elementoLista.appendChild(botonBorrar);
    return elementoLista;
};

const eliminarElementoCarrito = (id) => {
    carrito = carrito.filter((elemento) => elemento.id !== id);
    renderizarCarrito();
};


const borrarCarrito = () => {
carrito.length = 0;
let carritoString = JSON.stringify(carrito);
localStorage.setItem("carrito", carritoString);
renderizarCarrito();
};

const renderizarProductos = (arrayUtilizado) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    arrayUtilizado.forEach(({ name, id, type, price, stock, description }) => {
    const prodCard = document.createElement("div");
    prodCard.classList.add("col-xs", "card", "product-card");
    prodCard.style = "width: 270px;height: 725px; margin:3px";
    prodCard.id = `product-${id}`;
    prodCard.innerHTML = `
    <img src="./assets/${name + id}.png" class="card-img-top" alt="${name}" style="width: 250px; height: 400px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">
    <div class="card-body">
        <h5 class="card-title">${name}</h4>
        <h6 class="card-subtitle">${type}</h6>
        <p class="card-text">${description}</p>
        <div class="product-info">
        <span class="stock">Stock: ${stock}</span>
        <span class="price">$ ${price}</span>
        </div>
        <form id="form${id}">
        <div class="form-group">
            <label for="contador${id}">Cantidad</label>
            <input type="number" placeholder="0" id="contador${id}" class="form-control">
        </div>
        <button class="btn btn-primary" id="botonProd${id}">Agregar</button>
        </form>
    </div>
    `;

    contenedorProductos.appendChild(prodCard);
    const btn = document.getElementById(`botonProd${id}`);
    btn.addEventListener("click", (evento) => {
        evento.preventDefault();
        const contadorQuantity = parseInt(document.getElementById(`contador${id}`).value);
        if (contadorQuantity > 0) {
            agregarCarrito({ name, id, price, stock, description, quantity: contadorQuantity });
            renderizarCarrito();
            const form = document.getElementById(`form${id}`);
            form.reset();
        }
    });
    });

};


const finalizarCompra = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    const cliente = { ...data }
    const ticket = { ...cliente, total: totalCarrito(), id: pedidos.length, productos: carrito }
    pedidos.push(ticket)
    localStorage.setItem("pedidos", JSON.stringify(pedidos))
    carrito = []
    const mensaje = document.getElementById("carritoTotal")
    mensaje.textContent = "Muchas gracias por su compra, los esperamos pronto"
}
// DOM
const compraFinal = document.getElementById("formCompraFinal")
compraFinal.addEventListener("submit", (event)=>{
    event.preventDefault()
    if (carrito,length>0){
        finalizarCompra(event)
    }else{
        console.warn("canasta vacia")
    }
})

const selectorTipo = document.getElementById("tipoProducto")
selectorTipo.onchange=(evt)=>{
    const tipoSeleccionado = evt.target.value
    if (tipoSeleccionado ==="0"){
        renderizarProductos(productos)
    }else {
        renderizarProductos(productos.filter (prod=> prod.type ===tipoSeleccionado))
    }

}
// Testing
const app = ()=>{
    productosPreexistentes()
    renderizarProductos(productos)
    renderizarCarrito()
    totalCarritoRender()
}

//ejecuto mi aplicacion
app()