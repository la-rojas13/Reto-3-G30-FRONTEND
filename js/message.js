$(document).ready(function () {
    $("#btn-actualizar").hide();
})


function traerInformacion() {
    showSpinner()
    $.ajax({
        type: "GET",
        url: "http://129.151.119.110:8080/api/Message/all",
        dataType: "JSON",
        success: function (response) {
            console.log(response)
            listarRespuesta(response)
            hideSpinner();
        },
        error: function (xhr, status) {
            console.log(status);
        }
    });
}

function listarRespuesta(items) {
    var tabla = `<table class="table table-bordered">
    <thead class="thead-dark">
              <tr>
                <th>MESSAGE</th>
                <th>COMPUTER</th> 
                <th>CLIENT</th>             
                </tr>
              </thead>
              `;

    for (let i = 0; i < items.length; i++) {
        tabla += `<tr>
                             <td>${items[i].messageText}</td>
                             <td>${items[i].computer.name}</td>
                             <td>${items[i].client.name}</td>

                </tr>
        `;
    }

    tabla += `</table>`;

    $("#table-container").html(tabla);

}

// Agregar

function agregar() {
    var datos = {
        messageText: $("#message").val(),
        client: {idClient: $("#client").val()},
        computer: {id: $("#computer").val()}

    }
    console.log(datos)
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://129.151.119.110:8080/api/Message/save",
        data: datosPeticion,
        type: 'POST',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Insertado");
            traerInformacion();
            limpiarCampos()
            swal("Operación exitosa", "Elemento agregado", "success");
        },

        error: function (xhr, status) {
            console.log(status);
            swal("Error", "No se pudo agregar el elemento", "error");
        }
    });


}


// Function to hide the Spinner
function hideSpinner() {
    document.getElementById('spinner')
        .style.display = 'none';
}

function showSpinner() {
    document.getElementById('spinner')
        .style.display = 'block';
}

function limpiarCampos() {
    $("#message").val("");
    $("#client").val("");
    $("#computer").val("");
}