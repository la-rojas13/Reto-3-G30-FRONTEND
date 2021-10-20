$(document).ready(function () {
    $("#btn-actualizar").hide();
})


function traerInformacion() {
    showSpinner()
    $.ajax({
        type: "GET",
        url: "http://129.151.119.110:8080/api/Client/all",
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
                <th>NAME</th>
                <th>EMAIL</th>
                <th>AGE</th>
              </tr>
              </thead>
              `;

    for (let i = 0; i < items.length; i++) {
        tabla += `<tr>
                             <td>${items[i].name}</td>
                             <td>${items[i].email}</td>
                             <td>${items[i].age}</td>    
                </tr>
        `;
    }

    tabla += `</table>`;

    $("#table-container").html(tabla);

}

// Agregar

function agregar() {
    var datos = {
        name: $("#name").val(),
        email: $("#email").val(),
        age: $("#age").val(),
        password:$("#password").val()
    }
    console.log(datos)
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://129.151.119.110:8080/api/Client/save",
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
    $("#password").val("");
    $("#name").val("");
    $("#email").val("");
    $("#age").val("");
}