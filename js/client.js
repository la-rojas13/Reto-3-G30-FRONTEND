$(document).ready(function () {
    $("#btn-actualizar").hide();
})


function traerInformacion() {
    showSpinner()
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/Client/all",
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
                <th colspan="2">Acciones</th>
              </tr>
              </thead>
              `;

    for (let i = 0; i < items.length; i++) {
        tabla += `<tr>
                             <td>${items[i].name}</td>
                             <td>${items[i].email}</td>
                             <td>${items[i].age}</td>    
                             <td><button class="btn btn-primary" onclick="editarRegistro(${items[i].idClient})">Editar</td>
                             <td><button class="btn btn-danger" onclick="borrarConfirmacion(${items[i].idClient})">Borrar</td>      
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
        password: $("#password").val()
    }
    console.log(datos)
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://localhost:8080/api/Client/save",
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
function borrarConfirmacion(id) {
    swal({
        title: "Esta seguro?",
        text: "Los datos no podran ser recuperados",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                borrar(id)
                swal("El elemento fue eliminado", {
                    icon: "success",
                });
            } else {
                swal("El elemento no se borrara");
            }
        });
}



function borrar(numId) {
    var datos = {
        id: numId
    }

    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://localhost:8080/api/Client/" + numId,
        data: datosPeticion,
        type: 'DELETE',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Borrado");
            traerInformacion();
        },

        error: function (xhr, status) {
            console.log(status);
            swal("El elemento no puede ser eliminado, ya que tiene elementos asociados", {
                icon: "warning",
            });
        }
    });

}
// Editar

function editarRegistro(numId) {
    console.log(numId)
    $("#btn-actualizar").show();
    $("#btn-agregar").hide();
    $("#btn-listar").hide();
    $("#name").focus();
    $("#email").prop('disabled', true);
    var datos = {
        id: numId
    }

    $.ajax({
        url: "http://localhost:8080/api/Client/" + numId,
        type: 'GET',
        dataType: 'json',

        success: function (respuesta) {
            let items = respuesta;
            console.log(items.id)
            $("#id").val(items.idClient)
            $("#name").val(items.name),
                $("#email").val(items.email),
                $("#age").val(items.age),
                $("#password").val(items.password)
        },
        error: function (xhr, status) {
            console.log(status);
        }
    });

}

function actualizar() {
    var datos = {
        idClient: $("#id").val(),
        name: $("#name").val(),
        email: $("#email").val(),
        age: $("#age").val(),
        password: $("#password").val()
    }
    console.log($("#id").val())
    let datosPeticion = JSON.stringify(datos);
    console.log("datos actualizar:" + datosPeticion)

    $.ajax({
        url: "http://localhost:8080/api/Client/update",
        data: datosPeticion,
        type: 'PUT',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Actualizado");
            traerInformacion();
            swal("Operación exitosa", "Elemento actualizado", "success");
            limpiarCampos();
            $("#btn-actualizar").hide();
            $("#btn-agregar").show();
            $("#btn-listar").show();
            $("#email").prop('disabled', false);
        },

        error: function (xhr, status) {
            console.log(status);
            swal("Error", "No se pudo actualizar el elemento", "error");
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