const mongoose = require('mongoose');
const fs = require('fs');
const ProductModel = require('./models/Product');

// Lee el archivo JSON que contiene los datos de los productos
const productsData = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

// Configura la conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Maneja eventos de conexión
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', async () => {
    console.log('Conexión exitosa a MongoDB');

    try {
        // Borra todos los productos existentes en la base de datos
        await ProductModel.deleteMany({});
        console.log('Productos existentes eliminados de la base de datos');

        // Inserta los nuevos productos desde el archivo JSON
        await ProductModel.insertMany(productsData);
        console.log('Productos insertados en la base de datos correctamente');
    } catch (error) {
        console.error('Error al insertar productos en la base de datos:', error.message);
    } finally {
        // Cierra la conexión a la base de datos al finalizar
        mongoose.disconnect();
        console.log('Conexión a MongoDB cerrada');
    }
});
