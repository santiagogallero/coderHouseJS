class Productos {
    constructor(name, id, type, price, stock, description) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.price = price;
        this.stock = stock;
        this.description = description;
    }
}

// OR lógico para cargar local storage
const productos = JSON.parse(localStorage.getItem("productos")) || [];
let carrito = JSON.parse(localStorage.getItem("carritos")) || [];
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

const agregarProducto = ({ name, id, type, price, stock, description }) => {
    //Destuctura un objeto para recibir los datos
    if (productos.some((prod) => prod.id === producto.id)) {
        console.warn('Ya existe un producto con ese id');
    } else {
        const productoNuevo = new Producto(name, id, type, price, stock, description)
        productos.push(productoNuevo)
        //guarda el nuevo array de productos
        localStorage.setItem('productos', JSON.stringify(productos))
    }
};


const totalCarrito = () => {
    return carrito.reduce((acumulador, { price, quantity }) => acumulador + (price * quantity), 0);
};
// se encarga de calcular el total del carrito
const totalCarritoRender = () => {
    const carritoTotal = document.getElementById("carritoTotal");
    carritoTotal.innerHTML = `Precio total: $ ${totalCarrito()}`;
};

const actualizarCarritoEnLocalStorage = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const agregarCarrito = (objetoCarrito) => {
    // agrega productos al carrito
    const productoExistente = carrito.find(producto => producto.id === objetoCarrito.id);

    if (productoExistente) {
        // Si existe, sumar la cantidad
        productoExistente.quantity += objetoCarrito.quantity;
    } else {
        // Si no existe, agregar el nuevo producto
        carrito.push(objetoCarrito);
    }

    // Actualizar el carrito en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar la visualización del carrito
    renderizarCarrito();
    totalCarritoRender();
};

const renderizarCarrito = () => {
    // borra el cotenido de carrito y renderiza carrito en una lista
    const listaCarrito = document.getElementById("listaCarrito");
    // borramos para evitar clones viejos
    listaCarrito.innerHTML = "";

    carrito.forEach(({name, price,quantity,id})=>{
        let elementoLista = document.createElement("li")
        elementoLista.innerHTML=`Producto:${name} -- P/u: ${price} -- Cant.: ${quantity} <button id="eliminarCarrito${id}">X</button>`
        listaCarrito.appendChild(elementoLista);

        //boton de borrar 
        const botonBorrar = document.getElementById(`eliminarCarrito${id}`)
        botonBorrar.addEventListener("click",()=>{
            // creo un array sin el elemento a borrar y lo igualo a carrito
            carrito = carrito.filter((elemento)=>{
                if(elemento.id !== id){
                    return elemento
                }
            })
            let carritoString = JSON.stringify(carrito)
            localStorage.setItem("carrito", carritoString)
            renderizarCarrito()
            actualizarCarritoEnLocalStorage();
            Swal.fire({
                icon: 'warning',
                title: `Removio el o los productos ${name} del carrito`,
                showConfirmButton: true,
                timer: 2500
            })
        })
        
        let carritoString = JSON.stringify(carrito)
        localStorage.setItem("carrito", carritoString)
    })
};
const borrarCarrito = () => {
    carrito.length = 0;
    let carritoString = JSON.stringify(carrito);
    localStorage.setItem("carrito", carritoString);
    renderizarCarrito();
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





const renderizarProductos = (arrayUtilizado) => {
    // renderiza productos en el DOM
    const contenedorProductos = document.getElementById("contenedorProductos");
    // borramos para no duplicar
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
                            <span>Stock: ${stock}</span>
                            <span>$ ${price}</span>
                        </div>
                        <form id="form${id}">
                            <div class="form-group">
                                <label for="contador${id}">Cantidad</label>
                                <input type="number" placeholder="0" id="contador${id}" class="form-control">
                            </div>
                            <button class="btn btn-primary" id="botonProd${id}">Agregar</button>
                        </form>
                    </div>`;
        contenedorProductos.appendChild(prodCard);
        const btn = document.getElementById(`botonProd${id}`);
        // Funcionalidad al boton de agregar para agregar prods al carrito
        btn.addEventListener("click", (e) => {
            e.preventDefault()
            const contadorQuantity = Number(document.getElementById(`contador${id}`).value);
            if (contadorQuantity > 0) {
                if(carrito.some(producto=> producto.id ===id)){
                    carrito = carrito.map(element=> {
                        if (element.id===id){
                            element.quantity+=contadorQuantity
                        }
                        return element
                    })
                }else {
                    agregarCarrito({name, id, type, price, stock, description, quantity:contadorQuantity})
                }
                renderizarCarrito()
                const form = document.getElementById(`form${id}`)
                form.reset()
                Swal.fire({
                    icon: 'success',
                    title: `Agrego ${contadorQuantity} ${name} al carrito`,
                    showConfirmButton: true,
                    timer: 2500
                })
            }else {
                    Swal.fire({
                        icon: 'error',
                        title: `Solo se pueden agregar al carrito cantidades de productos superiores a 0`,
                        showConfirmButton: true,
                        timer: 2500
                    })
                }
        })
    })

};
const productosPreexistentes = async () => {
    try {
        const response = await fetch('./productos.json');
        const productosBase = await response.json();
        productosBase.forEach((prod) => {
        agregarProducto(prod);
    });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    } finally {
        renderizarProductos(productos);
    }
};


const finalizarCompra = (event)=>{
    // como conseguir todos los datos de un form
    // conseguimos la data de la form
    const data = new FormData(event.target)
    // creamos un objeto que sea {nombreInput: valorInput,...}
    const cliente = Object.fromEntries(data)
    // Creamos un "ticket"
    const idTicket = pedidos.length
    const ticket = {cliente: cliente, total:totalCarrito(),id:idTicket, productos:carrito, fecha: new Date}
    pedidos.push(ticket)
    // Guardamos el ticket en nuestra "base de datos"
    localStorage.setItem("pedidos", JSON.stringify(pedidos))
    // Borra el array y le da un mensaje al usuario
    borrarCarrito()
    Swal.fire({
        icon: 'success',
        title: `Muchas gracias por su compra. Su ticket de seguimiento es ${idTicket} los esperamos pronto`,
        showConfirmButton: true,
        
    })
    let mensaje = document.getElementById("carritoTotal")
    mensaje.innerHTML = ""
}
// DOM
const compraFinal = document.getElementById("formCompraFinal")

compraFinal.addEventListener("submit", (event)=>{
    // evitamos el reset
    event.preventDefault()
    if (carrito.length>0){
        finalizarCompra(event)
    }else{
        console.warn("canasta vacia")
    }
});
// barra para seleccionar el tipo de producto
const selectorTipo = document.getElementById("tipoProducto")
selectorTipo.onchange=(evt)=>{
    const tipoSeleccionado = evt.target.value
    if (tipoSeleccionado ==="0"){
        renderizarProductos(productos)
    }else {
        renderizarProductos(productos.filter (prod=> prod.type ===tipoSeleccionado))
    }

};

document.getElementById("botonBorrarCarrito").addEventListener("click", () => {
    carrito = []; // Vaciar el carrito
    localStorage.setItem("carrito", JSON.stringify(carrito)); // Actualizar el localStorage
    document.getElementById("listaCarrito").innerHTML = ""; // Limpiar la lista visualmente
    document.getElementById("carritoTotal").innerHTML = ""; // Limpiar el total visualmente
    swal.fire({
        icon: 'warning',
        title: `Se removio el o los productos del carrito`,
        showConfirmButton: true,
        timer: 2500
    });
})
// Testing
const app = ()=>{
    productosPreexistentes()
    renderizarProductos(productos)
    renderizarCarrito()
    
};

//ejecuto mi aplicacion
app()