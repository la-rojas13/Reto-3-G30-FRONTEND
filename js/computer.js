$(document).ready(function () {
    $("#btn-actualizar").hide();
})


function traerInformacion() {
    showSpinner()
    $.ajax({
        type: "GET",
        url: "http://129.151.119.110:8080/api/Computer/all",
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
                <th>BRAND</th>
                <th>YEAR</th>
                <th>CATEGORY</th>
                <th>NAME</th>
                <th>DESCRIPTION</th>
              </tr>
              </thead>
              `;

    for (let i = 0; i < items.length; i++) {
        tabla += `<tr>
                             <td>${items[i].brand}</td>
                             <td>${items[i].year}</td>
                             <td>${items[i].category.name}</td>
                             <td>${items[i].name}</td>
                             <td>${items[i].description}</td>    
                </tr>
        `;
    }

    tabla += `</table>`;

    $("#table-container").html(tabla);

}

// Agregar

function agregar() {
    var datos = {
        brand: $("#brand").val(),
        year: $("#year").val(),
        category: {id: $("#category").val()},
        name: $("#name").val(),
        description: $("#description").val()
    }
    console.log(datos)
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://129.151.119.110:8080/api/Computer/save",
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

// Borrar elemento

// modal confirmacion

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
    $("#brand").val("");
    $("#year").val("");
    $("#category").val("");
    $("#name").val("");
    $("#description").val("");
}