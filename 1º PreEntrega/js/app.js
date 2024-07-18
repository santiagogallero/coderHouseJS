//FUNCIONES
const creditos =[
    {tipo: "personal", tasaInteres: 0.05 },
    {tipo: "hipotecario", tasaInteres: 0.03 },
    {tipo:"automotriz", tasaInteres: 0.04 }

];
function obtenerDatosUsuario() {
    const campos = [
        { nombre: "montoCredit", mensaje: "Ingrese el monto del crédito: " },
        { nombre: "tipoCredit", mensaje: "Ingrese el tipo de crédito (Personal, Hipotecario, Automotriz): " },
        { nombre: "plazoDeseado", mensaje: "Ingrese el plazo deseado (en meses): " }
        ];
    
    const datos = {};
    
    for (const campo of campos) {
        let isValid = false;
        while (!isValid) {
            const valor = prompt(campo.mensaje);
          if (valor === null) return null; // Si presionó Cancelar, devolver null
            if (campo.nombre === "montoCredit" || campo.nombre === "plazoDeseado") {
            if (parseFloat(valor) > 0) {
                datos[campo.nombre] = parseFloat(valor);
                isValid = true;
            } else {
                alert(`El ${campo.nombre} debe ser un número positivo`);
            }
            } else if (campo.nombre === "tipoCredit") {
            if (creditos.some((credito) => credito.tipo === valor)) {
                datos[campo.nombre] = valor;
                isValid = true;
            } else {
                alert(`El tipo de crédito "${valor}" no es válido. Intente nuevamente.`);
            }
            }
        }
    }
    
        return datos;
}

function simularCredito(){
    const datosUsuario = obtenerDatosUsuario();
    if (datosUsuario === null) return;
    
    const {montoCredit,tipoCredit,plazoDeseado}= datosUsuario;

    const creditoSeleccionado = creditos.find((credito)=> credito.tipo === tipoCredit);
    if (creditoSeleccionado){
        const tasaInteres = creditoSeleccionado.tasaInteres;
        const cuotaMensual = calcularCuotaMensual(montoCredit,plazoDeseado, tasaInteres);
        const totalApagar = cuotaMensual * plazoDeseado;

        document.getElementById("cuota-mensual").innerText = cuotaMensual.toFixed(2);
        document.getElementById("total-apagar").innerText = totalApagar.toFixed(2);
    }else{
        alert("Tipo de credito no vlaido");
    }
}

function calcularCuotaMensual(monto,plazo,tasaInteres){
    const cuotaMensual=monto * (tasaInteres/12)*(1+tasaInteres/12)**plazo;
    return cuotaMensual;
}