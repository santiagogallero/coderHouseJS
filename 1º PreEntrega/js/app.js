//FUNCIONES
const creditos =[
    {tipo: "personal", tasaInteres: 0.05 },
    {tipo: "hipotecario", tasaInteres: 0.03 },
    {tipo:"automotriz", tasaInteres: 0.04 }

];
function obtenerDatosUsuario(){
    let montoCredit;
    let tipoCredit;
    let plazoDeseado;

    
    // Verificar monto de credito
    while (true) {
        montoCredit = parseFloat(prompt("Ingrese el monto del crédito: "));
        if (montoCredit === null) break; // Si presionó Cancelar, salir del bucle
        if (montoCredit > 0) break; // Si el monto es válido, salir del bucle
        alert("El monto del crédito debe ser un número positivo");
    }



    // Verificar tipo credito
    while (true) {
        tipoCredit = prompt("Ingrese el tipo de crédito (Personal, Hipotecario, Automotriz): ");
        if (tipoCredit === null) return null; // Si presionó Cancelar, devolver null
        if (creditos.some((credito) => credito.tipo === tipoCredit)) break;
        alert("Tipo de crédito no válido. Intente nuevamente.");
    }

    // Verificar plazo deseado
    while (true) {
        plazoDeseado = parseFloat(prompt("Ingrese el plazo deseado (en meses): "));
        if (plazoDeseado === null) return null; // Si presionó Cancelar, devolver null
        if (plazoDeseado > 0) break;
        alert("El plazo deseado debe ser un número positivo");
    }


    return { montoCredit, tipoCredit, plazoDeseado };

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