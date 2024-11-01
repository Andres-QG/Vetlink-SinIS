# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "auth_group"


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey("AuthPermission", models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "auth_group_permissions"
        unique_together = (("group", "permission"),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    content_type = models.ForeignKey("DjangoContentType", models.DO_NOTHING)
    codename = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "auth_permission"
        unique_together = (("content_type", "codename"),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128, blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.CharField(max_length=254, blank=True, null=True)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "auth_user"


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "auth_user_groups"
        unique_together = (("user", "group"),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "auth_user_user_permissions"
        unique_together = (("user", "permission"),)


class CitaServicios(models.Model):
    cita = models.OneToOneField(
        "Citas",
        models.DO_NOTHING,
        primary_key=True,
        db_comment="Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador de la cita, haciendo referencia a la tabla CITAS. Permite vincular cada registro de servicio con la cita correspondiente.",
    )  # The composite primary key (cita_id, servicio_id) found, that is not supported. The first column is selected.
    servicio = models.ForeignKey(
        "Servicios",
        models.DO_NOTHING,
        db_comment="Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador del servicio prestado, haciendo referencia a la tabla SERVICIOS. Esto permite asociar los servicios especÝficos que se ofrecen en cada cita.",
    )

    class Meta:
        managed = False
        db_table = "cita_servicios"
        unique_together = (("cita", "servicio"),)
        db_table_comment = "La tabla CITA_SERVICIOS almacena informaci¾n sobre los servicios especÝficos que se prestan durante cada cita en la clÝnica veterinaria. Esta tabla permite vincular citas con los servicios ofrecidos en esas citas, facilitando la gesti¾n y el seguimiento de la atenci¾n brindada."


class Citas(models.Model):
    cita_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada cita. Este valor debe ser ·nico y permite distinguir cada cita de manera clara.",
    )
    usuario_cliente = models.ForeignKey(
        "Usuarios",
        models.DO_NOTHING,
        db_column="usuario_cliente",
        db_comment="Este campo es una llave forßnea que hace referencia al usuario cliente que program¾ la cita. Permite vincular la cita con el cliente correspondiente en el sistema.",
    )
    usuario_veterinario = models.ForeignKey(
        "Usuarios",
        models.DO_NOTHING,
        db_column="usuario_veterinario",
        related_name="citas_usuario_veterinario_set",
        db_comment="Este campo es una llave forßnea que hace referencia al veterinario que atenderß la cita. Permite vincular la cita con el veterinario correspondiente en el sistema.",
    )
    mascota = models.ForeignKey(
        "Mascotas",
        models.DO_NOTHING,
        db_comment="Este campo es una llave forßnea que hace referencia a la mascota que serß atendida en la cita. Permite vincular la cita con la mascota correspondiente.",
    )
    fecha = models.DateField(
        db_comment="Este campo almacena la fecha programada para la cita. Es importante para la gesti¾n de la agenda de la clÝnica y para que los clientes recuerden su cita."
    )
    hora = models.CharField(
        max_length=20,
        db_comment="Este campo almacena la hora programada para la cita. Permite especificar el momento exacto en que la mascota serß atendida.",
    )
    motivo = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        db_comment='Este campo almacena el motivo de la cita (por ejemplo, "Consulta general", "Vacunaci¾n", "Chequeo"). Ayuda al veterinario a prepararse para la atenci¾n de la mascota.',
    )
    estado = models.CharField(
        max_length=40,
        blank=True,
        null=True,
        db_comment='Este campo almacena el estado de la cita (por ejemplo, "Programada", "Cancelada", "Completada"). Esto permite gestionar el seguimiento de las citas y su estado actual.',
    )

    class Meta:
        managed = False
        db_table = "citas"
        db_table_comment = "La tabla CITAS almacena informaci¾n sobre las citas programadas en la clÝnica veterinaria. Cada cita estß asociada con un cliente, un veterinario y una mascota especÝfica, lo que permite gestionar de manera efectiva las atenciones programadas."


class Clinicas(models.Model):
    clinica_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada clÝnica. Este valor debe ser ·nico y permite distinguir cada clÝnica de manera clara.",
    )
    nombre = models.CharField(
        max_length=50,
        db_comment='Este campo almacena el nombre de la clÝnica (por ejemplo, "Veterinaria San Francisco"). Es fundamental para identificar la clÝnica y facilitar su b·squeda.',
    )
    direccion = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        db_comment='Este campo almacena la direcci¾n fÝsica de la clÝnica (por ejemplo, "Calle 123, San JosÚ"). Es importante para que los clientes puedan localizar la clÝnica.',
    )
    telefono = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        db_comment="Este campo almacena el n·mero de telÚfono de la clÝnica. Permite a los clientes comunicarse con la clÝnica para realizar consultas o agendar citas.",
    )
    usuario_propietario = models.ForeignKey(
        "Usuarios",
        models.DO_NOTHING,
        db_column="usuario_propietario",
        db_comment="Este campo es una llave forßnea que hace referencia al usuario que es due±o o administrador de la clÝnica. Ayuda a relacionar la clÝnica con su propietario o administrador en el sistema.",
    )
    activo = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "clinicas"
        db_table_comment = "La tabla CLINICAS almacena informaci¾n sobre las clÝnicas veterinarias. Cada clÝnica tiene un identificador ·nico y puede incluir detalles como el nombre, direcci¾n, telÚfono y el usuario que la administra."


class ConsultaMascotas(models.Model):
    consulta_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada consulta. Este valor debe ser ·nico y permite distinguir cada consulta de manera clara.",
    )
    mascota = models.ForeignKey(
        "Mascotas",
        models.DO_NOTHING,
        db_comment="Este campo es una llave forßnea que hace referencia a la mascota que fue consultada, vinculßndose a la tabla MASCOTAS. Permite identificar a quÚ mascota pertenece cada consulta.",
    )
    fecha = models.DateField(
        db_comment="Este campo almacena la fecha en que se realiz¾ la consulta. Es importante para el seguimiento del historial mÚdico de la mascota y para saber cußndo se realiz¾ la atenci¾n."
    )
    diagnostico = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Este campo proporciona el diagn¾stico obtenido durante la consulta. Es esencial para el registro mÚdico y permite documentar la salud de la mascota y cualquier tratamiento recomendado.",
    )

    class Meta:
        managed = False
        db_table = "consulta_mascotas"
        db_table_comment = "La tabla CONSULTA_MASCOTAS almacena informaci¾n sobre las consultas realizadas a las mascotas en la clÝnica veterinaria. Cada registro en esta tabla representa una consulta especÝfica, incluyendo detalles sobre la mascota, la fecha de la consulta y el diagn¾stico proporcionado."


class ConsultaSintomas(models.Model):
    sintoma = models.OneToOneField(
        "Sintomas",
        models.DO_NOTHING,
        primary_key=True,
        db_comment="Este campo es una llave primaria y forßnea que almacena el identificador del sÝntoma. Hace referencia a la tabla SINTOMAS, permitiendo identificar quÚ sÝntoma se observ¾ o report¾ durante la consulta.",
    )  # The composite primary key (sintoma_id, consulta_id) found, that is not supported. The first column is selected.
    consulta = models.ForeignKey(
        ConsultaMascotas,
        models.DO_NOTHING,
        db_comment="Este campo es una llave primaria y forßnea que almacena el identificador de la consulta donde se observ¾ el sÝntoma. Hace referencia a la tabla CONSULTA_MASCOTAS, asociando cada sÝntoma observado con su consulta correspondiente.",
    )

    class Meta:
        managed = False
        db_table = "consulta_sintomas"
        unique_together = (("sintoma", "consulta"),)
        db_table_comment = "La tabla CONSULTA_SINTOMAS almacena informaci¾n sobre los sÝntomas observados o reportados durante una consulta veterinaria. Cada registro en esta tabla vincula un sÝntoma especÝfico a una consulta, lo que permite hacer un seguimiento detallado de los sÝntomas asociados con cada mascota durante sus consultas."


class ConsultaTratamientos(models.Model):
    tratamiento = models.OneToOneField(
        "Tratamientos",
        models.DO_NOTHING,
        primary_key=True,
        db_comment="Este campo es una llave primaria y forßnea que almacena el identificador del tratamiento administrado. Hace referencia a la tabla TRATAMIENTOS, permitiendo identificar el tratamiento especÝfico que se ha realizado durante la consulta.",
    )  # The composite primary key (tratamiento_id, consulta_id) found, that is not supported. The first column is selected.
    consulta = models.ForeignKey(
        ConsultaMascotas,
        models.DO_NOTHING,
        db_comment="Este campo es una llave primaria y forßnea que almacena el identificador de la consulta a la que se asocia el tratamiento. Hace referencia a la tabla CONSULTA_MASCOTAS, permitiendo vincular cada tratamiento a la consulta correspondiente.",
    )

    class Meta:
        managed = False
        db_table = "consulta_tratamientos"
        unique_together = (("tratamiento", "consulta"),)
        db_table_comment = "La tabla CONSULTA_TRATAMIENTOS almacena informaci¾n sobre los tratamientos administrados durante las consultas a las mascotas. Cada registro vincula un tratamiento especÝfico a una consulta, permitiendo un seguimiento detallado de los tratamientos que se han realizado en cada consulta veterinaria."


class ConsultaVacunas(models.Model):
    vacuna = models.OneToOneField(
        "Vacunas",
        models.DO_NOTHING,
        primary_key=True,
        db_comment="Este campo es una llave primaria y forßnea que almacena el identificador de la vacuna administrada. Hace referencia a la tabla VACUNAS, permitiendo identificar quÚ vacuna se administr¾ durante la consulta.",
    )  # The composite primary key (vacuna_id, consulta_id) found, that is not supported. The first column is selected.
    consulta = models.ForeignKey(
        ConsultaMascotas,
        models.DO_NOTHING,
        db_comment="Este campo es una llave primaria y forßnea que almacena el identificador de la consulta en la que se aplic¾ la vacuna. Hace referencia a la tabla CONSULTA_MASCOTAS, asociando cada vacuna aplicada con su consulta correspondiente.",
    )

    class Meta:
        managed = False
        db_table = "consulta_vacunas"
        unique_together = (("vacuna", "consulta"),)
        db_table_comment = "La tabla CONSULTA_VACUNAS almacena informaci¾n sobre las vacunas que se administran durante las consultas veterinarias. Cada registro en esta tabla vincula una vacuna especÝfica a una consulta, lo que permite hacer un seguimiento detallado de las vacunas que se han aplicado a las mascotas en diferentes consultas."


class DbtoolsExecutionHistory(models.Model):
    id = models.FloatField(primary_key=True)
    hash = models.TextField(blank=True, null=True)
    created_by = models.CharField(max_length=255, blank=True, null=True)
    created_on = models.TextField(blank=True, null=True)  # This field type is a guess.
    updated_by = models.CharField(max_length=255, blank=True, null=True)
    updated_on = models.TextField(blank=True, null=True)  # This field type is a guess.
    statement = models.TextField(blank=True, null=True)
    times = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "dbtools$execution_history"


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200, blank=True, null=True)
    action_flag = models.IntegerField()
    change_message = models.TextField(blank=True, null=True)
    content_type = models.ForeignKey(
        "DjangoContentType", models.DO_NOTHING, blank=True, null=True
    )
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "django_admin_log"


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100, blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "django_content_type"
        unique_together = (("app_label", "model"),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "django_migrations"


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField(blank=True, null=True)
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "django_session"


class Especialidades(models.Model):
    especialidad_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada especialidad. DeberÝa ser un valor ·nico que permite distinguir cada especialidad de manera clara.",
    )
    nombre = models.CharField(
        max_length=30,
        db_comment='Este campo almacena el nombre de la especialidad (por ejemplo, "DermatologÝa", "CirugÝa", "OdontologÝa"). Es un campo importante para identificar la especialidad de manera comprensible.',
    )
    descripcion = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        db_comment="Este campo proporciona una descripci¾n detallada de la especialidad. Puede incluir informaci¾n sobre los servicios ofrecidos, condiciones tratadas o cualquier detalle relevante que ayude a entender mejor la especialidad.",
    )
    activo = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "especialidades"
        db_table_comment = "La tabla ESPECIALIDADES almacena informaci¾n sobre las especialidades disponibles en la clÝnica veterinaria. Cada especialidad tiene un identificador ·nico y puede incluir un nombre y una descripci¾n que brindan mßs detalles sobre la especialidad."


class Facturas(models.Model):
    factura_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada factura. Este valor debe ser ·nico y permite distinguir cada factura de manera clara.",
    )
    fecha = models.DateField(
        db_comment="Este campo almacena la fecha en que se gener¾ la factura. Es importante para el registro y seguimiento de las transacciones realizadas."
    )
    monto_total = models.FloatField(
        db_comment="Este campo almacena el monto total a pagar en la factura. Representa el costo de los servicios prestados y debe ser calculado correctamente."
    )
    estado = models.CharField(
        max_length=30,
        db_comment='Este campo almacena el estado de la factura (por ejemplo, "Pagada", "Pendiente", "Cancelada"). Esto permite gestionar el seguimiento de los pagos y el estado actual de cada factura.',
    )
    cita = models.ForeignKey(
        Citas,
        models.DO_NOTHING,
        db_comment="Este campo es una llave forßnea que hace referencia a la cita asociada con la factura. Permite vincular la factura con la cita correspondiente.",
    )
    usuario_cliente = models.ForeignKey(
        "Usuarios",
        models.DO_NOTHING,
        db_column="usuario_cliente",
        db_comment="Este campo es una llave forßnea que hace referencia al usuario cliente al que se le emite la factura. Permite vincular la factura con el cliente correspondiente en el sistema.",
    )

    class Meta:
        managed = False
        db_table = "facturas"
        db_table_comment = "La tabla FACTURAS almacena informaci¾n sobre las facturas generadas por los servicios prestados en la clÝnica veterinaria. Cada factura estß asociada a una cita especÝfica y contiene detalles relevantes sobre el monto y el estado de la factura."


class HistorialServicios(models.Model):
    servicio = models.OneToOneField(
        "Servicios",
        models.DO_NOTHING,
        primary_key=True,
        db_comment="Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador del servicio prestado, haciendo referencia a la tabla SERVICIOS. Permite vincular el historial de servicios con el servicio especÝfico ofrecido.",
    )  # The composite primary key (servicio_id, fecha) found, that is not supported. The first column is selected.
    fecha = models.DateField(
        db_comment="Este campo almacena la fecha en que se realiz¾ el servicio. Es importante para el seguimiento del historial de atenci¾n de la mascota y permite saber cußndo se brind¾ cada servicio."
    )
    nombre = models.CharField(
        max_length=30,
        db_comment='Este campo almacena el nombre del servicio prestado en ese momento (por ejemplo, "Consulta Veterinaria"). Esto permite que el historial sea comprensible y claro para quienes lo revisen.',
    )
    descripcion = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        db_comment="Este campo proporciona una descripci¾n detallada del servicio que se realiz¾. Ayuda a registrar informaci¾n especÝfica sobre la atenci¾n que recibi¾ la mascota en cada ocasi¾n.",
    )
    costo = models.FloatField(
        db_comment="Este campo almacena el costo del servicio que se prest¾. Es ·til para el seguimiento financiero y para que el cliente tenga un registro de los gastos asociados a los servicios brindados."
    )

    class Meta:
        managed = False
        db_table = "historial_servicios"
        unique_together = (("servicio", "fecha"),)
        db_table_comment = "La tabla HISTORIAL_SERVICIOS almacena informaci¾n sobre los servicios que han sido prestados a las mascotas a lo largo del tiempo. Esta tabla permite llevar un registro detallado de cada servicio realizado, junto con la fecha y otros detalles relevantes."


class HorariosVeterinarios(models.Model):
    horario_id = models.FloatField(primary_key=True)
    usuario_veterinario = models.ForeignKey(
        "Usuarios", models.DO_NOTHING, db_column="usuario_veterinario"
    )
    dia = models.CharField(max_length=20)
    hora_inicio = models.DateField()
    hora_fin = models.DateField()
    activo = models.FloatField()
    clinica = models.ForeignKey(Clinicas, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "horarios_veterinarios"


class Mascotas(models.Model):
    mascota_id = models.AutoField(primary_key=True, db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada mascota. Este valor debe ser ·nico y permite distinguir cada mascota de manera clara.')
    usuario_cliente = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='usuario_cliente', db_comment='Este campo es una llave forßnea que hace referencia al usuario cliente que posee la mascota. Permite vincular la mascota con el cliente correspondiente en el sistema.')
    nombre = models.CharField(max_length=30, blank=True, null=True, db_comment='Este campo es una llave forßnea que almacena el n·mero de cÚdula del cliente. Es ·til para identificar al cliente de manera oficial y asegurar que la mascota pertenece a Úl.')
    fecha_nacimiento = models.DateField(blank=True, null=True, db_comment='Este campo almacena la fecha de nacimiento de la mascota. Es relevante para determinar la edad y estado de salud de la mascota, asÝ como para el seguimiento de su cuidado.')
    especie = models.CharField(max_length=30, db_comment='Este campo almacena la especie de la mascota (por ejemplo, "Perro", "Gato"). Ayuda a clasificar las mascotas y gestionar su atenci¾n de acuerdo a su especie.')
    raza = models.CharField(max_length=30, blank=True, null=True, db_comment='Este campo almacena la raza de la mascota (por ejemplo, "Labrador", "Siames"). Proporciona informaci¾n adicional que puede ser importante para el cuidado y tratamiento especÝfico de la mascota.')
    sexo = models.CharField(max_length=1, blank=True, null=True)
    activo = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mascotas'
        db_table_comment = 'La tabla MASCOTAS almacena informaci¾n sobre las mascotas de los clientes de la clÝnica veterinaria. Cada mascota tiene un identificador ·nico y se asocia con un cliente, permitiendo llevar un registro de las mascotas que son atendidas en la clÝnica.'


class MetodosDePago(models.Model):
    metodo_pago_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada mÚtodo de pago. Este valor debe ser ·nico y permite distinguir cada mÚtodo de manera clara.",
    )
    usuario_cliente = models.ForeignKey(
        "Usuarios",
        models.DO_NOTHING,
        db_column="usuario_cliente",
        db_comment="Este campo es una llave forßnea que hace referencia al usuario cliente que posee el mÚtodo de pago. Permite vincular el mÚtodo de pago con el cliente correspondiente en el sistema.",
    )
    tipo_pago = models.CharField(
        max_length=20,
        db_comment='Este campo almacena el tipo de pago (por ejemplo, "Tarjeta de crÚdito", "Tarjeta de dÚbito", "Transferencia bancaria"). Esto ayuda a clasificar los mÚtodos de pago disponibles.',
    )
    numero_tarjeta = models.CharField(
        max_length=40,
        db_comment="Este campo almacena el n·mero de la tarjeta de pago. Debe manejarse con cuidado y cumplir con las normativas de seguridad para proteger la informaci¾n sensible.",
    )
    nombre_titular = models.CharField(
        max_length=40,
        db_comment="Este campo almacena el nombre del titular de la tarjeta. Esto es importante para verificar que el mÚtodo de pago estÚ registrado correctamente a nombre del cliente.",
    )
    fecha_expiracion = models.DateField(
        db_comment="Este campo almacena la fecha de expiraci¾n de la tarjeta de pago. Es fundamental para asegurar que la tarjeta sea vßlida en el momento de realizar una transacci¾n."
    )
    codigo_seguridad = models.CharField(
        max_length=20,
        db_comment="Este campo almacena el c¾digo de seguridad de la tarjeta (CVV). Es un elemento de seguridad adicional que se requiere al procesar pagos.",
    )
    estado = models.CharField(
        max_length=20,
        db_comment='Este campo almacena el estado del mÚtodo de pago (por ejemplo, "Activo", "Inactivo"). Esto permite gestionar quÚ mÚtodos de pago estßn disponibles para su uso.',
    )

    class Meta:
        managed = False
        db_table = "metodos_de_pago"
        db_table_comment = "La tabla METODOS_DE_PAGO almacena informaci¾n sobre los diferentes mÚtodos de pago que los clientes pueden utilizar para realizar transacciones en la clÝnica veterinaria. Cada mÚtodo de pago tiene un identificador ·nico y puede incluir detalles sobre el cliente y la tarjeta de pago."


class Notificaciones(models.Model):
    notificacion_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada notificaci¾n. Este valor debe ser ·nico y permite distinguir cada notificaci¾n de manera clara.",
    )
    usuario_cliente = models.ForeignKey(
        "Usuarios",
        models.DO_NOTHING,
        db_column="usuario_cliente",
        db_comment="Este campo es una llave forßnea que hace referencia al usuario cliente que recibe la notificaci¾n. Permite vincular la notificaci¾n con el cliente correspondiente en el sistema.",
    )
    tipo = models.CharField(
        max_length=20,
        db_comment='Este campo almacena el tipo de notificaci¾n (por ejemplo, "Recordatorio de cita", "Promoci¾n", "Actualizaci¾n de servicios"). Esto ayuda a categorizar las notificaciones y permite al cliente identificar rßpidamente la naturaleza de cada una.',
    )
    fecha_envio = models.DateField(
        blank=True,
        null=True,
        db_comment="Este campo es una llave forßnea que hace referencia a la cedula del cliente.",
    )

    class Meta:
        managed = False
        db_table = "notificaciones"
        db_table_comment = "La tabla NOTIFICACIËN almacena informaci¾n sobre las notificaciones enviadas a los usuarios, generalmente clientes de la clÝnica veterinaria. Cada notificaci¾n tiene un identificador ·nico y puede incluir detalles como el usuario receptor, el tipo de notificaci¾n y la fecha en que fue enviada."


class OsddmwDiagrams(models.Model):
    id = models.FloatField(primary_key=True)
    name = models.CharField(max_length=70, blank=True, null=True)
    description = models.CharField(max_length=4000, blank=True, null=True)
    last_update = models.DateTimeField(blank=True, null=True)
    global_id = models.CharField(unique=True, max_length=70, blank=True, null=True)
    design_id = models.CharField(max_length=70, blank=True, null=True)
    design_name = models.CharField(max_length=256, blank=True, null=True)
    model_id = models.CharField(max_length=70, blank=True, null=True)
    model_name = models.CharField(max_length=256, blank=True, null=True)
    subview_id = models.CharField(max_length=70, blank=True, null=True)
    subview_name = models.CharField(max_length=256, blank=True, null=True)
    parent_id = models.CharField(max_length=70, blank=True, null=True)
    diagram_type = models.CharField(max_length=10, blank=True, null=True)
    layout = models.BinaryField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "osddmw_diagrams"
        unique_together = (("design_id", "model_id", "subview_id"),)


class Pagos(models.Model):
    factura = models.OneToOneField(
        Facturas,
        models.DO_NOTHING,
        primary_key=True,
        db_comment="Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador de la factura asociada al pago, haciendo referencia a la tabla FACTURAS. Permite vincular cada pago con la factura correspondiente.",
    )  # The composite primary key (factura_id, metodo_pago_id) found, that is not supported. The first column is selected.
    metodo_pago = models.ForeignKey(
        MetodosDePago,
        models.DO_NOTHING,
        db_comment="Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador del mÚtodo de pago utilizado, haciendo referencia a la tabla METODOS_DE_PAGO. Esto permite identificar c¾mo se realiz¾ cada pago (por ejemplo, tarjeta de crÚdito, efectivo).",
    )
    monto = models.FloatField(
        db_comment="Este campo almacena el monto que se pag¾. Es esencial para registrar la cantidad de dinero recibida por la clÝnica y para el control financiero."
    )

    class Meta:
        managed = False
        db_table = "pagos"
        unique_together = (("factura", "metodo_pago"),)
        db_table_comment = "La tabla PAGOS almacena informaci¾n sobre los pagos realizados por los clientes en relaci¾n con las facturas emitidas por los servicios de la clÝnica veterinaria. Esta tabla permite llevar un registro detallado de cada transacci¾n de pago, incluyendo el mÚtodo de pago utilizado y el monto pagado."


class Pesos(models.Model):
    mascota = models.OneToOneField(
        Mascotas,
        models.DO_NOTHING,
        primary_key=True,
        db_comment="Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador de la mascota cuyo peso se registra, haciendo referencia a la tabla MASCOTAS. Permite vincular cada registro de peso con la mascota correspondiente.",
    )  # The composite primary key (mascota_id, fecha) found, that is not supported. The first column is selected.
    fecha = models.DateField(
        db_comment="Este campo almacena la fecha en que se registr¾ el peso. Aunque tÝpicamente se usarÝa un tipo de dato DATE, aquÝ se ha definido como VARCHAR. Es importante para rastrear cußndo se tomaron las mediciones de peso."
    )
    peso = models.CharField(
        max_length=20,
        db_comment="Este campo almacena el peso de la mascota en la fecha especificada. Al ser un VARCHAR, es recomendable asegurarse de que los valores se ingresen en un formato consistente (por ejemplo, en kilogramos o libras).",
    )

    class Meta:
        managed = False
        db_table = "pesos"
        unique_together = (("mascota", "fecha"),)
        db_table_comment = "La tabla PESOS almacena informaci¾n sobre el peso de las mascotas a lo largo del tiempo. Esta tabla permite llevar un registro del peso de cada mascota en diferentes fechas, lo cual es importante para el seguimiento de su salud y crecimiento."


class Roles(models.Model):
    rol_id = models.FloatField(
        primary_key=True,
        db_comment="Este es el identificador ·nico del rol en la base de datos. Este campo es la clave primaria (PK) de la tabla, lo que significa que cada valor debe ser ·nico y no nulo.",
    )
    nombre = models.CharField(
        max_length=50,
        db_comment='Este campo almacena el nombre completo del rol. Por ejemplo, "Administrador", "Veterinario", "Usuario". Este campo es obligatorio y debe contener informaci¾n clara sobre la funci¾n o prop¾sito del rol.',
    )
    abreviacion = models.CharField(
        max_length=20,
        db_comment='Este campo guarda una versi¾n abreviada o un acr¾nimo del nombre del rol. Por ejemplo, "ADM" para "Administrador" o "VET" para "Veterinario". TambiÚn es un campo obligatorio y proporciona una forma rßpida de referirse al rol en sistemas o interfaces donde el espacio es limitado.',
    )
    descripcion = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Este campo almacena una descripci¾n detallada del rol, explicando sus responsabilidades y funciones dentro del sistema. Es ·til para proporcionar mßs contexto sobre cada rol. Puede ser opcional o requerido, dependiendo de las necesidades del sistema.",
    )

    class Meta:
        managed = False
        db_table = "roles"
        db_table_comment = "La tabla ROLES se utiliza para almacenar informaci¾n sobre los diferentes roles que pueden asignarse a los usuarios en el sistema. Cada rol define un conjunto de permisos y responsabilidades, lo que permite gestionar el acceso y las acciones que los usuarios pueden realizar dentro de la aplicaci¾n."


class Servicios(models.Model):
    servicio_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada servicio. Este valor debe ser ·nico y permite distinguir cada servicio de manera clara.",
    )
    nombre = models.CharField(
        max_length=255,
        db_comment='Este campo almacena el nombre del servicio (por ejemplo, "Consulta Veterinaria", "Vacunaci¾n"). Es importante para la identificaci¾n y presentaci¾n de los servicios a los clientes.',
    )
    descripcion = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_comment="Este campo proporciona una descripci¾n detallada del servicio ofrecido. Ayuda a los clientes a entender mejor lo que incluye cada servicio y sus beneficios.",
    )
    costo = models.FloatField(
        db_comment="Este campo almacena el costo del servicio. Es esencial para el cßlculo de las facturas y para la gesti¾n financiera de la clÝnica."
    )
    activo = models.BooleanField(
        blank=True,
        null=True,
        db_comment="Este campo almacena el valor booleano de si el servicio se encuentra activo, true para sÝ, esto se utiliza para la l¾gica de solicitar citas de para los usuarios clientes",
    )
    minutos_sesion = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        db_comment="Este campo almacena el tiempo en minutos que dura cada sesi¾n",
    )
    numero_sesiones = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        db_comment="Este campo almacena el n·mero de sesiones necesarias para completar un tratamiento, es 1 por defecto lo que significa que en una sola sesi¾n se completa",
    )
    dir_imagen = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_comment="Este campo almacena la direcci¾n en la que se encuentra la imagen en el directorio del servidor, es nulo por defecto, lo que significa que no tiene una imagen asociada",
    )

    class Meta:
        managed = False
        db_table = "servicios"
        db_table_comment = "La tabla SERVICIOS almacena informaci¾n sobre los diferentes servicios que ofrece la clÝnica veterinaria. Cada servicio tiene un identificador ·nico y se asocia con un costo especÝfico, lo que permite a la clÝnica gestionar su catßlogo de servicios de manera efectiva."


class Sintomas(models.Model):
    sintoma_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada sÝntoma, lo que permite distinguir claramente entre diferentes sÝntomas.",
    )
    descripcion = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Este campo proporciona una descripci¾n del sÝntoma. Es importante para ayudar a los veterinarios y al personal a reconocer y evaluar adecuadamente los sÝntomas que pueden presentar las mascotas.",
    )
    nombre = models.CharField(
        max_length=30,
        db_comment="Este campo almacena el nombre del sÝntoma. Es fundamental para identificar rßpidamente el sÝntoma en la base de datos y en las interacciones con los clientes.",
    )

    class Meta:
        managed = False
        db_table = "sintomas"
        db_table_comment = "La tabla SINTOMAS almacena informaci¾n sobre los sÝntomas que pueden presentar las mascotas. Cada registro representa un sÝntoma especÝfico, incluyendo su nombre y una descripci¾n que detalla las caracterÝsticas del sÝntoma."


class Tratamientos(models.Model):
    tratamiento_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada tratamiento. Este valor debe ser ·nico y permite distinguir cada tratamiento de manera clara.",
    )
    descripcion = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Este campo proporciona una descripci¾n detallada del tratamiento. Es importante para que los veterinarios y el personal de la clÝnica comprendan el prop¾sito y la naturaleza del tratamiento.",
    )
    nombre = models.CharField(
        max_length=30,
        db_comment="Este campo almacena el nombre del tratamiento. Es fundamental para identificar rßpidamente el tratamiento en la base de datos y en las interacciones con los clientes.",
    )

    class Meta:
        managed = False
        db_table = "tratamientos"
        db_table_comment = "La tabla TRATAMIENTOS almacena informaci¾n sobre los tratamientos que pueden ser administrados a las mascotas en la clÝnica veterinaria. Cada registro representa un tratamiento especÝfico, incluyendo su nombre y una descripci¾n detallada."


class Usuarios(models.Model):
    usuario = models.CharField(
        primary_key=True,
        max_length=40,
        db_comment="Este campo es la llave primaria y almacena el nombre de usuario ·nico para cada usuario en el sistema. Debe ser ·nico y se utiliza para iniciar sesi¾n.",
    )
    cedula = models.CharField(
        max_length=30, db_comment="Este almacena el n·mero de cÚdula del usuario."
    )
    nombre = models.CharField(
        max_length=50,
        db_comment="Este campo almacena el nombre del usuario. Es ·til para identificar al usuario dentro del sistema.",
    )
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.CharField(
        unique=True,
        max_length=30,
        db_comment="Este campo almacena la direcci¾n de correo electr¾nico del usuario. Debe ser ·nico, ya que se puede usar para recuperar contrase±as o enviar notificaciones.",
    )
    clave = models.CharField(
        max_length=128,
        db_comment="Este campo almacena la contrase±a del usuario, que se utiliza para la autenticaci¾n al iniciar sesi¾n en el sistema.",
    )
    especialidad = models.ForeignKey(
        Especialidades,
        models.DO_NOTHING,
        blank=True,
        null=True,
        db_comment="Este campo es una llave forßnea que hace referencia a la especialidad del usuario, si aplica. Permite vincular al usuario con una especialidad especÝfica en la clÝnica.",
    )
    clinica = models.ForeignKey(
        Clinicas,
        models.DO_NOTHING,
        blank=True,
        null=True,
        db_comment="Este campo es una llave forßnea que hace referencia a la clÝnica en la que trabaja el usuario. Ayuda a identificar la relaci¾n del usuario con una clÝnica especÝfica.",
    )
    rol = models.ForeignKey(
        Roles,
        models.DO_NOTHING,
        blank=True,
        null=True,
        db_comment="Este campo almacena el apellido 1 del usuario. Es ·til para identificar al usuario dentro del sistema.",
    )
    apellido2 = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        db_comment="Este campo almacena el apellido 1 del usuario. Es ·til para identificar al usuario dentro del sistema.",
    )
    apellido1 = models.CharField(
        max_length=50,
        db_comment="Este campo almacena el apellido 1 del usuario. Es ·til para identificar al usuario dentro del sistema.",
    )
    activo = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "usuarios"
        db_table_comment = "La tabla USUARIOS almacena informaci¾n sobre los usuarios del sistema, que pueden ser veterinarios, administradores o due±os de clÝnicas. Cada usuario tiene un identificador ·nico y puede incluir detalles como cÚdula, nombre, telÚfono, correo electr¾nico, contrase±a, especialidad, clÝnica y rol."


class Vacunas(models.Model):
    vacuna_id = models.FloatField(
        primary_key=True,
        db_comment="Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada vacuna, lo que permite distinguir claramente entre diferentes vacunas.",
    )
    descripcion = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment="Este campo proporciona una descripci¾n de la vacuna. Es importante para informar a los veterinarios y al personal sobre el prop¾sito de la vacuna y cualquier detalle relevante sobre su administraci¾n.",
    )
    nombre = models.CharField(
        max_length=30,
        db_comment="Este campo almacena el nombre de la vacuna. Es fundamental para identificar rßpidamente la vacuna en la base de datos y en las interacciones con los clientes.",
    )

    class Meta:
        managed = False
        db_table = "vacunas"
        db_table_comment = "La tabla VACUNAS almacena informaci¾n sobre las vacunas disponibles para las mascotas en la clÝnica veterinaria. Cada registro representa una vacuna especÝfica, incluyendo su nombre y una descripci¾n que detalla su prop¾sito y uso."
