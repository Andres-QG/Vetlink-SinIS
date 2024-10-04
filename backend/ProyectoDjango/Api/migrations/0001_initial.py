<<<<<<< HEAD
# Generated by Django 5.1.1 on 2024-10-01 03:12
=======
# Generated by Django 5.1.1 on 2024-09-30 03:33
>>>>>>> main

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AuthGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=150, null=True, unique=True)),
            ],
            options={
                'db_table': 'auth_group',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthGroupPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_group_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('codename', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'auth_permission',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(blank=True, max_length=128, null=True)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('is_superuser', models.BooleanField()),
                ('username', models.CharField(blank=True, max_length=150, null=True, unique=True)),
                ('first_name', models.CharField(blank=True, max_length=150, null=True)),
                ('last_name', models.CharField(blank=True, max_length=150, null=True)),
                ('email', models.CharField(blank=True, max_length=254, null=True)),
                ('is_staff', models.BooleanField()),
                ('is_active', models.BooleanField()),
                ('date_joined', models.DateTimeField()),
            ],
            options={
                'db_table': 'auth_user',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserGroups',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_groups',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='AuthUserUserPermissions',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'auth_user_user_permissions',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Citas',
            fields=[
                ('cita_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada cita. Este valor debe ser ·nico y permite distinguir cada cita de manera clara.', primary_key=True, serialize=False)),
                ('fecha', models.DateField(db_comment='Este campo almacena la fecha programada para la cita. Es importante para la gesti≤n de la agenda de la clφnica y para que los clientes recuerden su cita.')),
                ('hora', models.CharField(db_comment='Este campo almacena la hora programada para la cita. Permite especificar el momento exacto en que la mascota serß atendida.', max_length=20)),
                ('motivo', models.CharField(blank=True, db_comment='Este campo almacena el motivo de la cita (por ejemplo, "Consulta general", "Vacunaci≤n", "Chequeo"). Ayuda al veterinario a prepararse para la atenci≤n de la mascota.', max_length=200, null=True)),
                ('estado', models.CharField(blank=True, db_comment='Este campo almacena el estado de la cita (por ejemplo, "Programada", "Cancelada", "Completada"). Esto permite gestionar el seguimiento de las citas y su estado actual.', max_length=40, null=True)),
            ],
            options={
                'db_table': 'citas',
                'db_table_comment': 'La tabla CITAS almacena informaci≤n sobre las citas programadas en la clφnica veterinaria. Cada cita estß asociada con un cliente, un veterinario y una mascota especφfica, lo que permite gestionar de manera efectiva las atenciones programadas.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Clinicas',
            fields=[
                ('clinica_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada clφnica. Este valor debe ser ·nico y permite distinguir cada clφnica de manera clara.', primary_key=True, serialize=False)),
                ('nombre', models.CharField(db_comment='Este campo almacena el nombre de la clφnica (por ejemplo, "Veterinaria San Francisco"). Es fundamental para identificar la clφnica y facilitar su b·squeda.', max_length=50)),
                ('direccion', models.CharField(blank=True, db_comment='Este campo almacena la direcci≤n fφsica de la clφnica (por ejemplo, "Calle 123, San JosΘ"). Es importante para que los clientes puedan localizar la clφnica.', max_length=50, null=True)),
                ('telefono', models.CharField(blank=True, db_comment='Este campo almacena el n·mero de telΘfono de la clφnica. Permite a los clientes comunicarse con la clφnica para realizar consultas o agendar citas.', max_length=20, null=True)),
            ],
            options={
                'db_table': 'clinicas',
                'db_table_comment': 'La tabla CLINICAS almacena informaci≤n sobre las clφnicas veterinarias. Cada clφnica tiene un identificador ·nico y puede incluir detalles como el nombre, direcci≤n, telΘfono y el usuario que la administra.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ConsultaMascotas',
            fields=[
                ('consulta_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada consulta. Este valor debe ser ·nico y permite distinguir cada consulta de manera clara.', primary_key=True, serialize=False)),
                ('fecha', models.DateField(db_comment='Este campo almacena la fecha en que se realiz≤ la consulta. Es importante para el seguimiento del historial mΘdico de la mascota y para saber cußndo se realiz≤ la atenci≤n.')),
                ('diagnostico', models.CharField(blank=True, db_comment='Este campo proporciona el diagn≤stico obtenido durante la consulta. Es esencial para el registro mΘdico y permite documentar la salud de la mascota y cualquier tratamiento recomendado.', max_length=100, null=True)),
            ],
            options={
                'db_table': 'consulta_mascotas',
                'db_table_comment': 'La tabla CONSULTA_MASCOTAS almacena informaci≤n sobre las consultas realizadas a las mascotas en la clφnica veterinaria. Cada registro en esta tabla representa una consulta especφfica, incluyendo detalles sobre la mascota, la fecha de la consulta y el diagn≤stico proporcionado.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Sintomas',
            fields=[
                ('sintoma_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada sφntoma, lo que permite distinguir claramente entre diferentes sφntomas.', primary_key=True, serialize=False)),
                ('descripcion', models.CharField(blank=True, db_comment='Este campo proporciona una descripci≤n del sφntoma. Es importante para ayudar a los veterinarios y al personal a reconocer y evaluar adecuadamente los sφntomas que pueden presentar las mascotas.', max_length=100, null=True)),
                ('nombre', models.CharField(db_comment='Este campo almacena el nombre del sφntoma. Es fundamental para identificar rßpidamente el sφntoma en la base de datos y en las interacciones con los clientes.', max_length=30)),
            ],
            options={
                'db_table': 'sintomas',
                'db_table_comment': 'La tabla SINTOMAS almacena informaci≤n sobre los sφntomas que pueden presentar las mascotas. Cada registro representa un sφntoma especφfico, incluyendo su nombre y una descripci≤n que detalla las caracterφsticas del sφntoma.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Tratamientos',
            fields=[
                ('tratamiento_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada tratamiento. Este valor debe ser ·nico y permite distinguir cada tratamiento de manera clara.', primary_key=True, serialize=False)),
                ('descripcion', models.CharField(blank=True, db_comment='Este campo proporciona una descripci≤n detallada del tratamiento. Es importante para que los veterinarios y el personal de la clφnica comprendan el prop≤sito y la naturaleza del tratamiento.', max_length=100, null=True)),
                ('nombre', models.CharField(db_comment='Este campo almacena el nombre del tratamiento. Es fundamental para identificar rßpidamente el tratamiento en la base de datos y en las interacciones con los clientes.', max_length=30)),
            ],
            options={
                'db_table': 'tratamientos',
                'db_table_comment': 'La tabla TRATAMIENTOS almacena informaci≤n sobre los tratamientos que pueden ser administrados a las mascotas en la clφnica veterinaria. Cada registro representa un tratamiento especφfico, incluyendo su nombre y una descripci≤n detallada.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Vacunas',
            fields=[
                ('vacuna_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada vacuna, lo que permite distinguir claramente entre diferentes vacunas.', primary_key=True, serialize=False)),
                ('descripcion', models.CharField(blank=True, db_comment='Este campo proporciona una descripci≤n de la vacuna. Es importante para informar a los veterinarios y al personal sobre el prop≤sito de la vacuna y cualquier detalle relevante sobre su administraci≤n.', max_length=100, null=True)),
                ('nombre', models.CharField(db_comment='Este campo almacena el nombre de la vacuna. Es fundamental para identificar rßpidamente la vacuna en la base de datos y en las interacciones con los clientes.', max_length=30)),
            ],
            options={
                'db_table': 'vacunas',
                'db_table_comment': 'La tabla VACUNAS almacena informaci≤n sobre las vacunas disponibles para las mascotas en la clφnica veterinaria. Cada registro representa una vacuna especφfica, incluyendo su nombre y una descripci≤n que detalla su prop≤sito y uso.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DbtoolsExecutionHistory',
            fields=[
                ('id', models.FloatField(primary_key=True, serialize=False)),
                ('hash', models.TextField(blank=True, null=True)),
                ('created_by', models.CharField(blank=True, max_length=255, null=True)),
                ('created_on', models.TextField(blank=True, null=True)),
                ('updated_by', models.CharField(blank=True, max_length=255, null=True)),
                ('updated_on', models.TextField(blank=True, null=True)),
                ('statement', models.TextField(blank=True, null=True)),
                ('times', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'dbtools$execution_history',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoAdminLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_time', models.DateTimeField()),
                ('object_id', models.TextField(blank=True, null=True)),
                ('object_repr', models.CharField(blank=True, max_length=200, null=True)),
                ('action_flag', models.IntegerField()),
                ('change_message', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'django_admin_log',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoContentType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app_label', models.CharField(blank=True, max_length=100, null=True)),
                ('model', models.CharField(blank=True, max_length=100, null=True)),
            ],
            options={
                'db_table': 'django_content_type',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoMigrations',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('app', models.CharField(blank=True, max_length=255, null=True)),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('applied', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_migrations',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='DjangoSession',
            fields=[
                ('session_key', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('session_data', models.TextField(blank=True, null=True)),
                ('expire_date', models.DateTimeField()),
            ],
            options={
                'db_table': 'django_session',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Especialidades',
            fields=[
                ('especialidad_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada especialidad. Deberφa ser un valor ·nico que permite distinguir cada especialidad de manera clara.', primary_key=True, serialize=False)),
                ('nombre', models.CharField(db_comment='Este campo almacena el nombre de la especialidad (por ejemplo, "Dermatologφa", "Cirugφa", "Odontologφa"). Es un campo importante para identificar la especialidad de manera comprensible.', max_length=30)),
                ('descripcion', models.CharField(blank=True, db_comment='Este campo proporciona una descripci≤n detallada de la especialidad. Puede incluir informaci≤n sobre los servicios ofrecidos, condiciones tratadas o cualquier detalle relevante que ayude a entender mejor la especialidad.', max_length=50, null=True)),
            ],
            options={
                'db_table': 'especialidades',
                'db_table_comment': 'La tabla ESPECIALIDADES almacena informaci≤n sobre las especialidades disponibles en la clφnica veterinaria. Cada especialidad tiene un identificador ·nico y puede incluir un nombre y una descripci≤n que brindan mßs detalles sobre la especialidad.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Facturas',
            fields=[
                ('factura_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada factura. Este valor debe ser ·nico y permite distinguir cada factura de manera clara.', primary_key=True, serialize=False)),
                ('fecha', models.DateField(db_comment='Este campo almacena la fecha en que se gener≤ la factura. Es importante para el registro y seguimiento de las transacciones realizadas.')),
                ('monto_total', models.FloatField(db_comment='Este campo almacena el monto total a pagar en la factura. Representa el costo de los servicios prestados y debe ser calculado correctamente.')),
                ('estado', models.CharField(db_comment='Este campo almacena el estado de la factura (por ejemplo, "Pagada", "Pendiente", "Cancelada"). Esto permite gestionar el seguimiento de los pagos y el estado actual de cada factura.', max_length=30)),
            ],
            options={
                'db_table': 'facturas',
                'db_table_comment': 'La tabla FACTURAS almacena informaci≤n sobre las facturas generadas por los servicios prestados en la clφnica veterinaria. Cada factura estß asociada a una cita especφfica y contiene detalles relevantes sobre el monto y el estado de la factura.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Servicios',
            fields=[
                ('servicio_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada servicio. Este valor debe ser ·nico y permite distinguir cada servicio de manera clara.', primary_key=True, serialize=False)),
                ('nombre', models.CharField(db_comment='Este campo almacena el nombre del servicio (por ejemplo, "Consulta Veterinaria", "Vacunaci≤n"). Es importante para la identificaci≤n y presentaci≤n de los servicios a los clientes.', max_length=30)),
                ('descripcion', models.CharField(blank=True, db_comment='Este campo proporciona una descripci≤n detallada del servicio ofrecido. Ayuda a los clientes a entender mejor lo que incluye cada servicio y sus beneficios.', max_length=50, null=True)),
                ('costo', models.FloatField(db_comment='Este campo almacena el costo del servicio. Es esencial para el cßlculo de las facturas y para la gesti≤n financiera de la clφnica.')),
            ],
            options={
                'db_table': 'servicios',
                'db_table_comment': 'La tabla SERVICIOS almacena informaci≤n sobre los diferentes servicios que ofrece la clφnica veterinaria. Cada servicio tiene un identificador ·nico y se asocia con un costo especφfico, lo que permite a la clφnica gestionar su catßlogo de servicios de manera efectiva.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Mascotas',
            fields=[
                ('mascota_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada mascota. Este valor debe ser ·nico y permite distinguir cada mascota de manera clara.', primary_key=True, serialize=False)),
                ('nombre', models.CharField(blank=True, db_comment='Este campo es una llave forßnea que almacena el n·mero de cΘdula del cliente. Es ·til para identificar al cliente de manera oficial y asegurar que la mascota pertenece a Θl.', max_length=30, null=True)),
                ('fecha_nacimiento', models.DateField(blank=True, db_comment='Este campo almacena la fecha de nacimiento de la mascota. Es relevante para determinar la edad y estado de salud de la mascota, asφ como para el seguimiento de su cuidado.', null=True)),
                ('especie', models.CharField(db_comment='Este campo almacena la especie de la mascota (por ejemplo, "Perro", "Gato"). Ayuda a clasificar las mascotas y gestionar su atenci≤n de acuerdo a su especie.', max_length=30)),
                ('raza', models.CharField(blank=True, db_comment='Este campo almacena la raza de la mascota (por ejemplo, "Labrador", "Siames"). Proporciona informaci≤n adicional que puede ser importante para el cuidado y tratamiento especφfico de la mascota.', max_length=30, null=True)),
<<<<<<< HEAD
                ('sexo', models.CharField(blank=True, max_length=1, null=True)),
=======
                ('sexo', models.CharField(choices=[('M', 'Macho'), ('H', 'Hembra')], db_comment='Este campo almacena el sexo de la mascota, permitiendo registrar si es Macho (M) o Hembra (H).', max_length=1)),
>>>>>>> main
            ],
            options={
                'db_table': 'mascotas',
                'db_table_comment': 'La tabla MASCOTAS almacena informaci≤n sobre las mascotas de los clientes de la clφnica veterinaria. Cada mascota tiene un identificador ·nico y se asocia con un cliente, permitiendo llevar un registro de las mascotas que son atendidas en la clφnica.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='MetodosDePago',
            fields=[
                ('metodo_pago_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada mΘtodo de pago. Este valor debe ser ·nico y permite distinguir cada mΘtodo de manera clara.', primary_key=True, serialize=False)),
                ('tipo_pago', models.CharField(db_comment='Este campo almacena el tipo de pago (por ejemplo, "Tarjeta de crΘdito", "Tarjeta de dΘbito", "Transferencia bancaria"). Esto ayuda a clasificar los mΘtodos de pago disponibles.', max_length=20)),
                ('numero_tarjeta', models.CharField(db_comment='Este campo almacena el n·mero de la tarjeta de pago. Debe manejarse con cuidado y cumplir con las normativas de seguridad para proteger la informaci≤n sensible.', max_length=40)),
                ('nombre_titular', models.CharField(db_comment='Este campo almacena el nombre del titular de la tarjeta. Esto es importante para verificar que el mΘtodo de pago estΘ registrado correctamente a nombre del cliente.', max_length=40)),
                ('fecha_expiracion', models.DateField(db_comment='Este campo almacena la fecha de expiraci≤n de la tarjeta de pago. Es fundamental para asegurar que la tarjeta sea vßlida en el momento de realizar una transacci≤n.')),
                ('codigo_seguridad', models.CharField(db_comment='Este campo almacena el c≤digo de seguridad de la tarjeta (CVV). Es un elemento de seguridad adicional que se requiere al procesar pagos.', max_length=20)),
                ('estado', models.CharField(db_comment='Este campo almacena el estado del mΘtodo de pago (por ejemplo, "Activo", "Inactivo"). Esto permite gestionar quΘ mΘtodos de pago estßn disponibles para su uso.', max_length=20)),
            ],
            options={
                'db_table': 'metodos_de_pago',
                'db_table_comment': 'La tabla METODOS_DE_PAGO almacena informaci≤n sobre los diferentes mΘtodos de pago que los clientes pueden utilizar para realizar transacciones en la clφnica veterinaria. Cada mΘtodo de pago tiene un identificador ·nico y puede incluir detalles sobre el cliente y la tarjeta de pago.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Notificaciones',
            fields=[
                ('notificacion_id', models.FloatField(db_comment='Este campo es la llave primaria de la tabla. Almacena un identificador ·nico para cada notificaci≤n. Este valor debe ser ·nico y permite distinguir cada notificaci≤n de manera clara.', primary_key=True, serialize=False)),
                ('tipo', models.CharField(db_comment='Este campo almacena el tipo de notificaci≤n (por ejemplo, "Recordatorio de cita", "Promoci≤n", "Actualizaci≤n de servicios"). Esto ayuda a categorizar las notificaciones y permite al cliente identificar rßpidamente la naturaleza de cada una.', max_length=20)),
                ('fecha_envio', models.DateField(blank=True, db_comment='Este campo es una llave forßnea que hace referencia a la cedula del cliente.', null=True)),
            ],
            options={
                'db_table': 'notificaciones',
                'db_table_comment': 'La tabla NOTIFICACI╙N almacena informaci≤n sobre las notificaciones enviadas a los usuarios, generalmente clientes de la clφnica veterinaria. Cada notificaci≤n tiene un identificador ·nico y puede incluir detalles como el usuario receptor, el tipo de notificaci≤n y la fecha en que fue enviada.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='OsddmwDiagrams',
            fields=[
                ('id', models.FloatField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=70, null=True)),
                ('description', models.CharField(blank=True, max_length=4000, null=True)),
                ('last_update', models.DateTimeField(blank=True, null=True)),
                ('global_id', models.CharField(blank=True, max_length=70, null=True, unique=True)),
                ('design_id', models.CharField(blank=True, max_length=70, null=True)),
                ('design_name', models.CharField(blank=True, max_length=256, null=True)),
                ('model_id', models.CharField(blank=True, max_length=70, null=True)),
                ('model_name', models.CharField(blank=True, max_length=256, null=True)),
                ('subview_id', models.CharField(blank=True, max_length=70, null=True)),
                ('subview_name', models.CharField(blank=True, max_length=256, null=True)),
                ('parent_id', models.CharField(blank=True, max_length=70, null=True)),
                ('diagram_type', models.CharField(blank=True, max_length=10, null=True)),
                ('layout', models.BinaryField(blank=True, null=True)),
            ],
            options={
                'db_table': 'osddmw_diagrams',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Roles',
            fields=[
                ('rol_id', models.FloatField(db_comment='Este es el identificador ·nico del rol en la base de datos. Este campo es la clave primaria (PK) de la tabla, lo que significa que cada valor debe ser ·nico y no nulo.', primary_key=True, serialize=False)),
                ('nombre', models.CharField(db_comment='Este campo almacena el nombre completo del rol. Por ejemplo, "Administrador", "Veterinario", "Usuario". Este campo es obligatorio y debe contener informaci≤n clara sobre la funci≤n o prop≤sito del rol.', max_length=50)),
                ('abreviacion', models.CharField(db_comment='Este campo guarda una versi≤n abreviada o un acr≤nimo del nombre del rol. Por ejemplo, "ADM" para "Administrador" o "VET" para "Veterinario". TambiΘn es un campo obligatorio y proporciona una forma rßpida de referirse al rol en sistemas o interfaces donde el espacio es limitado.', max_length=20)),
                ('descripcion', models.CharField(blank=True, db_comment='Este campo almacena una descripci≤n detallada del rol, explicando sus responsabilidades y funciones dentro del sistema. Es ·til para proporcionar mßs contexto sobre cada rol. Puede ser opcional o requerido, dependiendo de las necesidades del sistema.', max_length=100, null=True)),
            ],
            options={
                'db_table': 'roles',
                'db_table_comment': 'La tabla ROLES se utiliza para almacenar informaci≤n sobre los diferentes roles que pueden asignarse a los usuarios en el sistema. Cada rol define un conjunto de permisos y responsabilidades, lo que permite gestionar el acceso y las acciones que los usuarios pueden realizar dentro de la aplicaci≤n.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Usuarios',
            fields=[
                ('usuario', models.CharField(db_comment='Este campo es la llave primaria y almacena el nombre de usuario ·nico para cada usuario en el sistema. Debe ser ·nico y se utiliza para iniciar sesi≤n.', max_length=40, primary_key=True, serialize=False)),
                ('cedula', models.CharField(db_comment='Este almacena el n·mero de cΘdula del usuario.', max_length=30)),
                ('nombre', models.CharField(db_comment='Este campo almacena el nombre completo del usuario. Es ·til para identificar al usuario dentro del sistema.', max_length=50)),
                ('telefono', models.CharField(blank=True, db_comment='Este campo almacena el n·mero de telΘfono del usuario, permitiendo el contacto directo si es necesario.', max_length=20, null=True)),
                ('correo', models.CharField(db_comment='Este campo almacena la direcci≤n de correo electr≤nico del usuario. Debe ser ·nico, ya que se puede usar para recuperar contrase±as o enviar notificaciones.', max_length=30, unique=True)),
<<<<<<< HEAD
                ('clave', models.CharField(db_comment='Este campo almacena la contrase±a del usuario, que se utiliza para la autenticaci≤n al iniciar sesi≤n en el sistema.', max_length=128)),
=======
                ('clave', models.CharField(db_comment='Este campo almacena la contrase±a del usuario, que se utiliza para la autenticaci≤n al iniciar sesi≤n en el sistema.', max_length=30)),
>>>>>>> main
            ],
            options={
                'db_table': 'usuarios',
                'db_table_comment': 'La tabla USUARIOS almacena informaci≤n sobre los usuarios del sistema, que pueden ser veterinarios, administradores o due±os de clφnicas. Cada usuario tiene un identificador ·nico y puede incluir detalles como cΘdula, nombre, telΘfono, correo electr≤nico, contrase±a, especialidad, clφnica y rol.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='CitaServicios',
            fields=[
                ('cita', models.OneToOneField(db_comment='Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador de la cita, haciendo referencia a la tabla CITAS. Permite vincular cada registro de servicio con la cita correspondiente.', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='Api.citas')),
            ],
            options={
                'db_table': 'cita_servicios',
                'db_table_comment': 'La tabla CITA_SERVICIOS almacena informaci≤n sobre los servicios especφficos que se prestan durante cada cita en la clφnica veterinaria. Esta tabla permite vincular citas con los servicios ofrecidos en esas citas, facilitando la gesti≤n y el seguimiento de la atenci≤n brindada.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ConsultaSintomas',
            fields=[
                ('sintoma', models.OneToOneField(db_comment='Este campo es una llave primaria y forßnea que almacena el identificador del sφntoma. Hace referencia a la tabla SINTOMAS, permitiendo identificar quΘ sφntoma se observ≤ o report≤ durante la consulta.', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='Api.sintomas')),
            ],
            options={
                'db_table': 'consulta_sintomas',
                'db_table_comment': 'La tabla CONSULTA_SINTOMAS almacena informaci≤n sobre los sφntomas observados o reportados durante una consulta veterinaria. Cada registro en esta tabla vincula un sφntoma especφfico a una consulta, lo que permite hacer un seguimiento detallado de los sφntomas asociados con cada mascota durante sus consultas.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ConsultaTratamientos',
            fields=[
                ('tratamiento', models.OneToOneField(db_comment='Este campo es una llave primaria y forßnea que almacena el identificador del tratamiento administrado. Hace referencia a la tabla TRATAMIENTOS, permitiendo identificar el tratamiento especφfico que se ha realizado durante la consulta.', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='Api.tratamientos')),
            ],
            options={
                'db_table': 'consulta_tratamientos',
                'db_table_comment': 'La tabla CONSULTA_TRATAMIENTOS almacena informaci≤n sobre los tratamientos administrados durante las consultas a las mascotas. Cada registro vincula un tratamiento especφfico a una consulta, permitiendo un seguimiento detallado de los tratamientos que se han realizado en cada consulta veterinaria.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ConsultaVacunas',
            fields=[
                ('vacuna', models.OneToOneField(db_comment='Este campo es una llave primaria y forßnea que almacena el identificador de la vacuna administrada. Hace referencia a la tabla VACUNAS, permitiendo identificar quΘ vacuna se administr≤ durante la consulta.', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='Api.vacunas')),
            ],
            options={
                'db_table': 'consulta_vacunas',
                'db_table_comment': 'La tabla CONSULTA_VACUNAS almacena informaci≤n sobre las vacunas que se administran durante las consultas veterinarias. Cada registro en esta tabla vincula una vacuna especφfica a una consulta, lo que permite hacer un seguimiento detallado de las vacunas que se han aplicado a las mascotas en diferentes consultas.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Pagos',
            fields=[
                ('factura', models.OneToOneField(db_comment='Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador de la factura asociada al pago, haciendo referencia a la tabla FACTURAS. Permite vincular cada pago con la factura correspondiente.', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='Api.facturas')),
                ('monto', models.FloatField(db_comment='Este campo almacena el monto que se pag≤. Es esencial para registrar la cantidad de dinero recibida por la clφnica y para el control financiero.')),
            ],
            options={
                'db_table': 'pagos',
                'db_table_comment': 'La tabla PAGOS almacena informaci≤n sobre los pagos realizados por los clientes en relaci≤n con las facturas emitidas por los servicios de la clφnica veterinaria. Esta tabla permite llevar un registro detallado de cada transacci≤n de pago, incluyendo el mΘtodo de pago utilizado y el monto pagado.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='HistorialServicios',
            fields=[
                ('servicio', models.OneToOneField(db_comment='Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador del servicio prestado, haciendo referencia a la tabla SERVICIOS. Permite vincular el historial de servicios con el servicio especφfico ofrecido.', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='Api.servicios')),
                ('fecha', models.DateField(db_comment='Este campo almacena la fecha en que se realiz≤ el servicio. Es importante para el seguimiento del historial de atenci≤n de la mascota y permite saber cußndo se brind≤ cada servicio.')),
                ('nombre', models.CharField(db_comment='Este campo almacena el nombre del servicio prestado en ese momento (por ejemplo, "Consulta Veterinaria"). Esto permite que el historial sea comprensible y claro para quienes lo revisen.', max_length=30)),
                ('descripcion', models.CharField(blank=True, db_comment='Este campo proporciona una descripci≤n detallada del servicio que se realiz≤. Ayuda a registrar informaci≤n especφfica sobre la atenci≤n que recibi≤ la mascota en cada ocasi≤n.', max_length=50, null=True)),
                ('costo', models.FloatField(db_comment='Este campo almacena el costo del servicio que se prest≤. Es ·til para el seguimiento financiero y para que el cliente tenga un registro de los gastos asociados a los servicios brindados.')),
            ],
            options={
                'db_table': 'historial_servicios',
                'db_table_comment': 'La tabla HISTORIAL_SERVICIOS almacena informaci≤n sobre los servicios que han sido prestados a las mascotas a lo largo del tiempo. Esta tabla permite llevar un registro detallado de cada servicio realizado, junto con la fecha y otros detalles relevantes.',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Pesos',
            fields=[
                ('mascota', models.OneToOneField(db_comment='Este campo es la llave primaria y forßnea de la tabla. Almacena el identificador de la mascota cuyo peso se registra, haciendo referencia a la tabla MASCOTAS. Permite vincular cada registro de peso con la mascota correspondiente.', on_delete=django.db.models.deletion.DO_NOTHING, primary_key=True, serialize=False, to='Api.mascotas')),
                ('fecha', models.DateField(db_comment='Este campo almacena la fecha en que se registr≤ el peso. Aunque tφpicamente se usarφa un tipo de dato DATE, aquφ se ha definido como VARCHAR. Es importante para rastrear cußndo se tomaron las mediciones de peso.')),
                ('peso', models.CharField(db_comment='Este campo almacena el peso de la mascota en la fecha especificada. Al ser un VARCHAR, es recomendable asegurarse de que los valores se ingresen en un formato consistente (por ejemplo, en kilogramos o libras).', max_length=20)),
            ],
            options={
                'db_table': 'pesos',
                'db_table_comment': 'La tabla PESOS almacena informaci≤n sobre el peso de las mascotas a lo largo del tiempo. Esta tabla permite llevar un registro del peso de cada mascota en diferentes fechas, lo cual es importante para el seguimiento de su salud y crecimiento.',
                'managed': False,
            },
        ),
    ]