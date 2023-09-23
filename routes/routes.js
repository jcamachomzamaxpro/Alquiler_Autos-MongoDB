const { MongoClient, ObjectId } = require("mongodb");
const { Router } = require("express");

const router = Router();

const client = new MongoClient(process.env.DDBB256);

const dbName = "alquilerAutos";
const collections = {
  alquiler: "alquiler",
  automovil: "automovil",
  cliente: "cliente",
  empleado: "empleado",
  reserva: "reserva",
  sucursal: "sucursal",
  sucursal_automovil: "sucursal_automovil"
};

// Endpoint 2
router.get("/endpoint-2", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.cliente);
  const result = await collection.find().toArray();
  res.json(result);
  client.close();
});

// Endpoint 3
router.get("/endpoint-3", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.alquiler);
  const result = await collection.aggregate([
    {$lookup: {
      from: "automovil",
      localField: "ID_Automovil",
      foreignField: "_id",
      as: "automovil"
    }},
    {$project: {
      _id: 0,
      automovil: 1
    }}
  ]).toArray();
  res.json(result);
  client.close();
})

// Endpoint 4
// Listar todos los alquileres activos junto con los datos de los clientes relacionados
router.get('/endpoint-4', async (req,res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.alquiler);
  const result = await collection.aggregate([
    {$match: {Estado: 'Activo'}},
    {$lookup: {
      from: "cliente",
      localField: "ID_Cliente",
      foreignField: "_id",
      as: "clientesInfo"
    }}
  ]).toArray();
  res.json(result);
  client.close();
});

// Endpoint 5
// Mostrar todas las reservas pendientes con los datos del cliente y el automóvil reservado

router.get('/endpoint-5', async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.reserva);
  const result = await collection.aggregate([
    {$match: {Estado: 'Pendiente'}},
    {$lookup: {
      from: 'cliente',
      localField: 'ID_Cliente',
      foreignField: '_id',
      as: 'datosCliente'
    }},
    {$lookup: {
      from: 'automovil',
      localField: 'ID_Automovil',
      foreignField: '_id',
      as: 'datosAutomovil'
    }}
  ]).toArray();
  res.json(result);
  client.close()
});

// Endpoint 6
router.get("/endpoint-6/:id", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}

  const collection = db.collection(collections.alquiler);
  const result = await collection.find(query).toArray();
  res.json(result);
  client.close();
});

// Endpoint 7
router.get("/endpoint-7", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.empleado);
  const result = await collection.find({Cargo: 'Vendedor'}).toArray();
  res.json(result);
  client.close();
});


// Endpoint 8
router.get("/endpoint-8", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.sucursal_automovil);
  const result = await collection.aggregate([
    {$group: {
      _id: "$_id",
      Cantidad_Disponible: {
        $sum: '$Cantidad_Disponible'
      }
    }}
  ]).toArray();
  res.json(result);
  client.close();
});

// Endpoint 9
router.get("/endpoint-9/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}
  //
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.alquiler);
  const result = await collection.aggregate([
    {$match: query},
    {$project: {
      _id: 1,
      Costo_Total: 1
    }}
  ]).toArray();
  res.json(result);
  client.close();
});

// Endpoint 10
router.get("/endpoint-10/:dni", async (req, res) => {
  const dni = req.params.dni;
  //
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.cliente);
  const result = await collection.find({DNI: dni}).toArray();
  res.json(result);
  client.close();
});

// Endpoint 11
router.get("/endpoint-11", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.automovil);
  const result = await collection.find({Capacidad: {$gt: 5}}).toArray();
  res.json(result);
  client.close();
});

// Endpoint 12
router.get("/endpoint-12", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.alquiler);
  const result = await collection.find({Fecha_Inicio: '2023-07-05'}).toArray();
  res.json(result);
  client.close();
});

// Endpoint 13
router.get("/endpoint-13/:id", async (req, res) => {
  const id = req.params.id;
  const query = new ObjectId(id);
  //
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.reserva);
  const result = await collection.find({$and: [
    {ID_Cliente: query},
    {Estado: 'Pendiente'}
  ]}).toArray();
  res.json(result);
  client.close();
});

// Endpoint 14
router.get("/endpoint-14", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.empleado);
  const result = await collection.find({$or: [
    {Cargo: 'Gerente'},
    {Cargo: 'Asistente'}
  ]}).toArray();
  res.json(result);
  client.close();
});

// Endpoint 15
router.get("/endpoint-15", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.alquiler);
  const result = await collection.aggregate([
    {$lookup: {
      from: 'cliente',
      localField: 'ID_Cliente',
      foreignField: '_id',
      as: 'datosCliente'
    }},
    {$project: {
      _id: 0,
      datosCliente: 1
    }}
  ]).toArray();
  res.json(result);
  client.close();
});

// Endpoint 16
router.get("/endpoint-16", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.automovil);
  const result = await collection.aggregate([
    {$sort: {Marca: 1, Modelo: 1}},
  ]).toArray();
  res.json(result);
  client.close();
});

// Endpoint 17
router.get("/endpoint-17", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.sucursal_automovil);
  const result = await collection.aggregate([
    {$lookup: {
      from: 'sucursal',
      localField: 'ID_Sucursal',
      foreignField: '_id',
      as: 'datosSucursal'
    }},
    {$project: {
      _id: 0,
      datosSucursal: {
        Nombre: 1,
        Direccion: 1
      },
      Cantidad_Disponible: 1
    }}
  ]).toArray();
  res.json(result);
  client.close();
});

// Endpoint 18
router.get("/endpoint-18", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.alquiler);
  const result = await collection.countDocuments();
  res.json(
    {
      documentos: result
    }
  );
  client.close();
});

// Endpoint 19
router.get("/endpoint-19", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.automovil);
  const result = await collection.find({Capacidad: 5}).toArray();
  res.json(result);
  client.close();
});


// Endpoint 20


// Endpoint 21
router.get("/endpoint-21", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collections.alquiler);
  const result = await collection.find({$and: [
    {Fecha_Inicio: {$gte: '2023-07-05'}},
    {Fecha_Inicio: {$lte: '2023-07-10'}}
  ]}).toArray();
  res.json(result);
  client.close();
});







module.exports = router
